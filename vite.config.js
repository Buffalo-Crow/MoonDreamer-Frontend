import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    hmr: {
      port: 5173,
      host: 'localhost'
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001", // backend
        changeOrigin: true,
      },
    },
  },
});