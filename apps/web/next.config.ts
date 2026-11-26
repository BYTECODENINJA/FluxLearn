import type { NextConfig } from "next";

// `||` (not `??`): env files leave unset keys as "" - treat blank as unset.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://reactbd.com";
// In production the API mounts at /api/v1 on the same host.
// In dev it runs on localhost:8000; we proxy /api/* through Next so the
// browser sees the API as same-origin. That makes session cookies
// first-party (no SameSite/cross-port headaches) and removes the CORS path
// entirely. INTERNAL_API_URL lets ops override the target in prod.
const INTERNAL_API_URL =
  process.env.INTERNAL_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${INTERNAL_API_URL}/api/:path*` },
    ];
  },
  // Shared workspace packages use NodeNext-style `.js` import extensions
  // on TypeScript sources so the API can ESM-resolve them via tsx / tsc.
  // Next.js bundles them through its own TS pipeline when listed here.
  //
  // We run on webpack (see scripts) because Turbopack does not honor
  // `experimental.extensionAlias` yet, so the `.js` -> `.ts` rewrite below
  // is needed for transpiled workspace sources.
  transpilePackages: ["@fluxlearn/types", "@fluxlearn/ui", "@fluxlearn/config"],
  typedRoutes: true,
  experimental: {
    extensionAlias: {
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  env: { NEXT_PUBLIC_APP_URL: APP_URL },
};

export default nextConfig;
