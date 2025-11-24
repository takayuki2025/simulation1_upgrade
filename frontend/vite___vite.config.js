import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.jsx"],
      refresh: true,
      // ★ CRITICAL FIX: hotファイルを明示的に設定
      // frontendコンテナ内の /app/public/hot を指す
      hotFile: "/app/public/hot",
    }),
    react({
      jsxRuntime: "automatic",
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["laravel.test"],
    hmr: {
      host: "laravel.test",
      port: 5173,
      protocol: "wss",
    },
    https: {
      // 証明書パスの設定 (frontendコンテナ内の絶対パス /certs に修正)
      key: "/certs/laravel.test.key",
      cert: "/certs/laravel.test.crt",
    },
  },
  resolve: {
    alias: {},
  },
});
