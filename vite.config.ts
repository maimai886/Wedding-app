/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// relative base + hash routing: the build runs from any static host, sub-paths included
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["src/test/setup.ts"] },
});
