import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    css: false,
    // Bound worker creation so tests stay reliable on constrained CI runners
    // and Docker Desktop bind mounts.
    maxWorkers: 4,
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
      ],
      exclude: [
        "app/**/opengraph-image.tsx",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
      ],
      // Raised once the redesigned templates and the app/ route modules were
      // covered (from 63/61/57/64). Each sits a few points under the measured
      // value, so an ordinary change has room but a wholesale drop fails.
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 78,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
