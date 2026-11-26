import { z } from "zod";

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("fluxlearn"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default("http://localhost:4000/api/v1"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("en"),
  NEXT_PUBLIC_OG_IMAGE: z.string().default("/opengraph-image"),
  NEXT_PUBLIC_TWITTER_HANDLE: z.string().default("@fluxlearn"),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
  // Google AdSense publisher ID ("ca-pub-" + 16 digits). Blank = no ads.
  NEXT_PUBLIC_ADSENSE_CLIENT: z
    .union([
      z
        .string()
        .regex(/^ca-pub-\d{16}$/, "must look like ca-pub-0000000000000000"),
      z.literal(""),
    ])
    .optional(),
  // Firebase Web SDK config. All four must be set to enable Google sign-in
  // in the browser; the UI hides the button when any of these is missing.
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
});

export type ClientEnv = z.infer<typeof ClientEnvSchema>;

export function loadClientEnv(
  source: Record<string, string | undefined>
): ClientEnv {
  return ClientEnvSchema.parse(source);
}
