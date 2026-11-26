// STAGED - the database connect, role seeding and index sync arrive in the next parts.
import "./load-env.js"; // must stay first: loads env files before other modules read them

import { loadServerEnv } from "@fluxlearn/config/server";
import { buildApp } from "./app.js";
import { logger } from "./utils/logger.js";

async function main(): Promise<void> {
  const env = loadServerEnv();

  const app = buildApp(env);
  const server = app.listen(env.API_PORT, () => {
    logger.info(
      { port: env.API_PORT, env: env.NODE_ENV },
      "Schola API listening"
    );
  });
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      logger.fatal(
        `Port ${env.API_PORT} is already in use - another API (or \`pnpm dev\`) is still running. Stop it, or find it with: lsof -nP -iTCP:${env.API_PORT} -sTCP:LISTEN`
      );
    } else {
      logger.fatal({ err }, "API server error");
    }
    process.exit(1);
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    logger.info({ signal }, "shutting down");
    server.close((err) => {
      if (err) {
        logger.error({ err }, "error during shutdown");
        process.exit(1);
      }

      process.exit(0);
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

main().catch((err: unknown) => {
  logger.fatal({ err }, "failed to start");
  process.exit(1);
});
