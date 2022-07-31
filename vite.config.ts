import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig(env => ({
  base: env.mode === "development" ? "/" : "/qr_scanner/",
  resolve: {
    alias: [{ find: "~", replacement: path.resolve(__dirname, "src") }],
  },
  plugins: [react()],
}));
