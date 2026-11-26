// Loads environment files before anything else reads process.env. Import it
// first, as a side effect: `import "./load-env.js";` — ES modules evaluate
// imports before the importing file's own code, so calling dotenv inline in
// the entry file would run after every other module had already loaded.
//
// dotenv never overwrites a key that is already set, so the first file that
// defines a key wins, and variables set by the host (Render, Railway, CI)
// beat every file.
//
//   production  apps/api/.env.production.local  (gitignored: real secrets)
//               apps/api/.env.production        (committed: API keys, blank secrets)
//   development test.env                        (gitignored: local secrets)
//               .env                            (committed: full template)
//
// Paths resolve from this file, so it works from src/ (tsx) and dist/ (node).

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(APP_ROOT, "../..");

const files =
  process.env.NODE_ENV === "production"
    ? [
        resolve(APP_ROOT, ".env.production.local"),
        resolve(APP_ROOT, ".env.production"),
      ]
    : [resolve(REPO_ROOT, "test.env"), resolve(REPO_ROOT, ".env")];

for (const path of files) config({ path, quiet: true });
