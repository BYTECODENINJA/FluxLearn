// server-side env loader. The api and any server only code
import { z } from "zod";

export const envBoolean = z
  .union([z.boolean(), z.string().trim().toLowerCase()])
  .transform((value, ctx) => {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1") return true;
    if (value === "false" || value === "0") return false;
    ctx.addIssue({
      code: "custom",
      message: "must be true, false, 1 or 0",
    });
    return z.NEVER;
  });

const ServerEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug"])
    .default("info"),

  APP_NAME: z.string().default("fluxlearn"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  APP_SHORT_DESCRIPTION: z
    .string()
    .default("Multi tenant school management platform"),

  API_PORT: z.coerce.number().int().positive().default(8080),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  MONGODB_URI: z.string().min(1).default("mongodb://localhost:3000"),
  DATABASE_URL: z.string().url().optional(),
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_OAUTH_CLIENT_ID: z.string().optional(),
  FACEBOOK_OAUTH_CLIENT_SECRET: z.string().optional(),

  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  CSRF_SECRET: z.string().min(32).optional(),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  COOKIE_DOMAIN: z.string().default("localhost"),

  ARGON2_MEMORY_COST: z.coerce.number().int().positive().default(19_456),
  ARGON2_TIME_COST: z.coerce.number().int().positive().default(2),
  ARGON2_PARALLELISM: z.coerce.number().int().positive().default(1),

  LOGIN_LOCKOUT_THRESHOLD: z.coerce.number().int().positive().default(5),
  LOGIN_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),
  PASSWORD_RESET_TTL_MIN: z.coerce.number().int().positive().default(60),
  EMAIL_VERIFICATION_TTL_HOURS: z.coerce.number().int().positive().default(72),
  ADMIN_TRANSFER_TTL_HOURS: z.coerce.number().int().positive().default(24),

  ENCRYPTION_MASTER_KEY: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("fluxlearn <noreply@fluxlearn.reactbd.com>"),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: envBoolean.default(false),

  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),

  // Stripe Checkout. Blank until a secret key is pasted into test.env.
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Firebase Admin SDK - all three must be set together to enable Google
  // sign-in on the server. The PEM's `\n` escapes are normalized to real
  // newlines in the loader below so the JSON-formatted private_key can be
  // pasted verbatim into .env.
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

let cached: ServerEnv | null = null;

export function loadServerEnv(
  source: NodeJS.ProcessEnv = process.env
): ServerEnv {
  if (cached) return cached;
  // The committed `.env` is a template - optional secrets are present but
  // blank. dotenv reads them as empty strings, which Zod's `.optional()`
  // rejects (it only accepts `undefined`). Normalize empty strings to
  // undefined here so the documented template style works without surprises.
  const normalized: NodeJS.ProcessEnv = {};
  for (const [k, v] of Object.entries(source)) {
    normalized[k] = v === "" ? undefined : v;
  }
  if (typeof normalized.FIREBASE_PRIVATE_KEY === "string") {
    normalized.FIREBASE_PRIVATE_KEY = normalized.FIREBASE_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    );
  }
  const parsed = ServerEnvSchema.safeParse(normalized);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid server environment:\n${issues}`);
  }
  cached = parsed.data;

  if (cached.NODE_ENV === "production") {
    const missing: string[] = [];
    // These have localhost defaults for development. In production a blank
    // value would silently point at localhost (no database, broken cookies,
    // wrong links in emails), so they must be set explicitly.
    for (const key of ["MONGODB_URI", "APP_URL", "COOKIE_DOMAIN"] as const) {
      if (normalized[key] === undefined) missing.push(key);
    }
    if (!cached.JWT_ACCESS_SECRET) missing.push("JWT_ACCESS_SECRET");
    if (!cached.JWT_REFRESH_SECRET) missing.push("JWT_REFRESH_SECRET");
    if (!cached.CSRF_SECRET) missing.push("CSRF_SECRET");
    if (!cached.ENCRYPTION_MASTER_KEY) missing.push("ENCRYPTION_MASTER_KEY");
    if (!cached.RESEND_API_KEY) missing.push("RESEND_API_KEY");
    if (!cached.IMAGEKIT_PUBLIC_KEY) missing.push("IMAGEKIT_PUBLIC_KEY");
    if (!cached.IMAGEKIT_PRIVATE_KEY) missing.push("IMAGEKIT_PRIVATE_KEY");
    if (!cached.IMAGEKIT_URL_ENDPOINT) missing.push("IMAGEKIT_URL_ENDPOINT");
    if (missing.length > 0) {
      throw new Error(
        `Production env missing required values: ${missing.join(", ")}`
      );
    }
  }
  return cached;
}
