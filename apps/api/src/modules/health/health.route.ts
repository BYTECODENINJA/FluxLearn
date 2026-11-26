import { Router } from "express";
import { ok } from "../../utils/envelope.js";

export const healthRouter: Router = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json(
    ok({
      ok: true,
      service: "fluxlearn-api",
      version: process.env.npm_package_version ?? "0.0.0",
      timestamp: new Date().toISOString(),
    })
  );
});
