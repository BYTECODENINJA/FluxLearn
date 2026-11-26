import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// In-memory v1. Dev gets a more generous limit so a tight Fast
// Refresh / Strict Mode loop doesn't 429 the silent /auth/refresh during
// debugging. Prod stays strict.
const IS_PROD = process.env.NODE_ENV === "production";

export const authRateLimit = rateLimit({
  windowMs: 60_000,
  limit: IS_PROD ? 10 : 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many auth requests." },
  },
});

export const generalRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Signed-in users are limited per account; others per IP (IPv6 addresses
  // grouped by subnet via ipKeyGenerator, as express-rate-limit 8 requires).
  keyGenerator: (req) =>
    req.ctx?.userId.toString() ?? ipKeyGenerator(req.ip ?? "anonymous"),
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many requests." },
  },
});

export const superAdminRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) =>
    req.ctx?.userId.toString() ?? ipKeyGenerator(req.ip ?? "anonymous"),
});
