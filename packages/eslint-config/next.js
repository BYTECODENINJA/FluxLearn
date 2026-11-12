import { fixupPluginRules } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import { baseConfig } from "./base.js";

export const nextConfig = tseslint.config(...baseConfig, {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    // eslint-plugin-react still calls context APIs that ESLint 10 removed;
    // @eslint/compat restores them until the plugin supports ESLint 10.
    react: fixupPluginRules(reactPlugin),
    "react-hooks": fixupPluginRules(reactHooks),
    "@next/next": fixupPluginRules(nextPlugin),
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
});

export default nextConfig;
