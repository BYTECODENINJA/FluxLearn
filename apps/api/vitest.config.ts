import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["src/**/*.test.ts", "src/**/__tests__/**/*.test.ts"],
    // mongodb-memory-server downloads ~66 MB on first run; the default
    // 10 s hook timeout is too tight for a cold cache, especially in CI.
    hookTimeout: 120_000,
    testTimeout: 30_000,
    // Run integration test files serially: they each spin up their own
    // mongodb-memory-server, and the in-process rate limiters / mongoose
    // index sync are not isolated well enough across parallel workers.
    fileParallelism: false,
    coverage: {
      provider: "v8",
      include: ["src/modules/**", "src/services/**", "src/utils/**"],
    },
  },
});
