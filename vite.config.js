import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local development, requests to /api are proxied to the C# Azure
// Function running on port 7071 (started with `func start`). In production,
// Azure Static Web Apps routes /api/* to the linked Function App automatically.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:7071",
        changeOrigin: true,
      },
    },
  },
});
