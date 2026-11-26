import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import { pinoHttp } from "pino-http";
import { type ServerEnv } from "@fluxlearn/config/server";

import { logger } from "./utils/logger.js";
import { requestId } from "./middleware/request_id.js";
import { errorHandler } from "./middleware/error_handler.js";
import { notFound } from "./middleware/not_found.js";
import { generalRateLimit } from "./middleware/rate_limit.js";

import { healthRouter } from "./modules/health/health.route.js";

export function buildApp(env: ServerEnv): Application {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());

  // CORS - cross-origin in dev (web localhost:3000, api localhost:8000) and
  // same-origin in prod (web rewrites /api/* to INTERNAL_API_URL on the same
  // host). Explicit allowed/exposed headers so the
  // x-csrf-token double-submit and x-request-id round-trip cleanly.
  const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        // Same-origin requests (no Origin header) and tools like curl are allowed.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS: origin ${origin} is not allowed`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Accept",
        "Authorization",
        "Content-Type",
        "Origin",
        "X-Requested-With",
        "x-csrf-token",
        "x-request-id",
      ],
      exposedHeaders: ["x-request-id"],
      optionsSuccessStatus: 204,
      maxAge: 86_400,
    })
  );

  app.use(compression());
  // Stripe signs the raw body. This route must run before express.json.
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  app.use(requestId());
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res, err) => {
        if (err ?? res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
    })
  );

  app.use("/api/v1/health", healthRouter);
  // Phase 2 - tenant academic + people surfaces.
  // Phase 3 - attendance, exams, grades, remarks.
  // Phase 4 - finance.
  // Phase 5 - reports, notifications, audit log, dashboard.
  // modules.

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
