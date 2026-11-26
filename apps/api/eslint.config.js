import { nodeConfig } from "@fluxlearn/eslint-config/node";

export default [
  {
    // Config files live outside tsconfig.json's `include` glob, so the typed
    // ESLint projectService can't resolve them. Skip them rather than widening
    // the project - they're plain config files and don't need typed linting.
    ignores: [
      "dist/**",
      "eslint.config.js",
      "vitest.config.ts",
      // Build script (plain Node) and the Vercel bundle it writes.
      "scripts/**",
      "index.mjs",
      "src/vercel-assets.cjs",
      "src/vercel-assets.d.cts",
    ],
  },
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
