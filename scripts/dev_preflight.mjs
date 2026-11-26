#!/usr/bin/env node
// Runs before `pnpm dev`. Checks that the ports the three apps need are free,
// and names whatever already holds one - usually an earlier `pnpm dev` that
// is still running in another terminal. Without this, the second copy of an
// app dies on start-up and Turborepo shuts the other apps down with it.
//
//   web  (apps/web)  -> 3000
//   api  (apps/api)  -> API_PORT, default 8000
//   docs (apps/docs) -> 3002
//
// Set SKIP_PORT_CHECK=1 to skip it.

import { execFileSync } from "node:child_process";
import net from "node:net";

if (process.env.SKIP_PORT_CHECK === "1") process.exit(0);

const PORTS = [
    { port: 3000, app: "web (apps/web)" },
    { port: Number(process.env.API_PORT) || 8000, app: "api (apps/api)" },
    { port: 3002, app: "docs (apps/docs)" },
];

/** True when something accepts connections on the port (IPv4 or IPv6 loopback). */
function inUse(port) {
    const probe = (host) =>
        new Promise((resolve) => {
            const socket = net.connect({ port, host });
            socket.setTimeout(600);
            socket.once("connect", () => {
                socket.destroy();
                resolve(true);
            });
            socket.once("timeout", () => {
                socket.destroy();
                resolve(false);
            });
            socket.once("error", () => resolve(false));
        });
    return Promise.all([probe("127.0.0.1"), probe("::1")]).then((r) => r.some(Boolean));
}

/** `node (pid 123): next-server …` via lsof, where available. */
function holder(port) {
    try {
        const pids = execFileSync("lsof", ["-t", `-iTCP:${port}`, "-sTCP:LISTEN"], { encoding: "utf8" })
            .trim()
            .split("\n")
            .filter(Boolean);
        return pids.map((pid) => {
            let cmd = "";
            try {
                cmd = execFileSync("ps", ["-o", "command=", "-p", pid], { encoding: "utf8" }).trim();
            } catch {
                /* process gone */
            }
            return { pid, cmd: cmd.length > 110 ? `${cmd.slice(0, 107)}…` : cmd };
        });
    } catch {
        return [];
    }
}

const busy = [];
for (const entry of PORTS) {
    if (await inUse(entry.port)) busy.push({ ...entry, procs: holder(entry.port) });
}

if (busy.length > 0) {
    const lines = [
        "",
        "  pnpm dev can't start - these ports are already in use:",
        "",
        ...busy.flatMap(({ port, app, procs }) => [
            `    ${port}  needed by ${app}`,
            ...(procs.length
                ? procs.map((p) => `          held by pid ${p.pid}${p.cmd ? `: ${p.cmd}` : ""}`)
                : ["          (could not tell which process - try: lsof -nP -iTCP:" + port + " -sTCP:LISTEN)"]),
        ]),
        "",
        "  Usually an earlier `pnpm dev` is still running in another terminal - stop it",
        "  with Ctrl+C there, or end the process above (kill <pid>), then run pnpm dev again.",
        "  To start a single app instead: pnpm --filter @fluxlearn/web dev (or @fluxlearn/api, @fluxlearn/docs).",
        "",
    ];
    console.error(lines.join("\n"));
    process.exit(1);
}
