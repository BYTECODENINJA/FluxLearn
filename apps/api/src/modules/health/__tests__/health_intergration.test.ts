import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../../../app.js";
import { loadServerEnv } from "@fluxlearn/config/server";

describe("GET /api/v1/health", () => {
  it("returns ok envelope", async () => {
    const env = loadServerEnv({ ...process.env, NODE_ENV: "test" });
    const app = buildApp(env);
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ok).toBe(true);
    expect(res.body.data.service).toBe("fluxlearn-api");
    expect(typeof res.body.data.timestamp).toBe("string");
    expect(res.headers["x-request-id"]).toBeTruthy();
  });
});
