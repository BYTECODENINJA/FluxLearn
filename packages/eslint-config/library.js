import globals from "globals";
import tseslint from "typescript-eslint";
import { baseConfig } from "./base.js";

export const libraryConfig = tseslint.config(...baseConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    },
  },
});

export default libraryConfig;
