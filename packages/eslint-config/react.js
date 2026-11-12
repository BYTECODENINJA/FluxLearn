import { fixupPluginRules } from "@eslint/compat";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import { baseConfig } from "./base.js";

export const reactConfig = tseslint.config(...baseConfig, {
  languageOptions: {
    globals: {
      ...globals.browser,
    },
  },
  plugins: {
    react: fixupPluginRules(reactPlugin),
    "react-hooks": fixupPluginRules(reactHooks),
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
});

export default reactConfig;
