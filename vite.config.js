import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
});
