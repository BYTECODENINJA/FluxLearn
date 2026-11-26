import { nextConfig } from "@fluxlearn/eslint-config/next";

export default [
  {
    // Config files live outside tsconfig.json's `include` glob, so the typed
    // ESLint projectService can't resolve them. Skip them rather than widening
    // the project - they're plain config files and don't need typed linting.
    ignores: [
      ".next/**",
      "next.config.ts",
      "postcss.config.js",
      "eslint.config.js",
      "playwright.config.ts",
      "vitest.config.ts",
    ],
  },
  ...nextConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // React Three Fiber intrinsics (mesh, geometry, lights) are lowercase tags
    // with props the DOM rule does not know. Turn the rule off here instead of
    // a file-level eslint-disable: pre-commit lints from the repo root, and
    // that config does not load eslint-plugin-react, so naming the rule there
    // is itself an error.
    files: ["src/components/marketing/hero-scene.tsx"],
    rules: {
      "react/no-unknown-property": "off",
    },
  },
];
