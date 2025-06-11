/// <reference types="vitest" />

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const httpsConfig = (() => {
  const keyPath = path.resolve(__dirname, "certs/localhost-key.pem");
  const certPath = path.resolve(__dirname, "certs/localhost.pem");

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }

  return undefined;
})();

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 3000,
    https: httpsConfig,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@app": path.resolve(fileURLToPath(new URL(".", import.meta.url)), "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
        "**/*.test.*",
        "**/*.spec.*",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
