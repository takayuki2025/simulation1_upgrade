import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath } from "url";

// ★★★ 最終的な Nuxt 設定 ★★★
const currentDir = fileURLToPath(new URL("./", import.meta.url));

export default defineNuxtConfig({
  // ★★★ 必須修正: SSRを完全に無効化し、CSRモードで実行
  ssr: false,

  // アプリケーション全体の設定
  devtools: { enabled: true },

  css: [
    // Viteのパス解決を強制するため、Nuxtの標準エイリアス (~) に戻す
    "~/assets/css/main.css",
  ],

  // モジュール設定
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],

  // 修正: プラグインの明示的な登録
  plugins: [
    "~/plugins/00.firebase-service.client.ts",
    "~/plugins/10.api-interceptor.client.ts",
    "~/plugins/11.auth-state-resolver.client.ts",
    "~/plugins/error-logout.ts",
  ],

  // Pinia 設定
  pinia: {
    storesDirs: ["~/stores"],
  },

  // エイリアス設定
  alias: {
    "@": currentDir,
    "~": currentDir,
    "~/": currentDir,
  },

  // 実行時設定 (クライアントとサーバーで利用可能)
  runtimeConfig: {
    public: {
      // ★★★ API Base URLを環境変数から取得し、デフォルト値も設定 ★★★
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "https://laravel.test:4430/api",
      assetBaseUrl:
        process.env.NUXT_PUBLIC_ASSET_BASE_URL || "https://laravel.test:4430",

      // Firebase 設定
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    },
  },

  // Vite設定
  vite: {
    optimizeDeps: {
      include: ["/app/assets/css/main.css"],
    },
    plugins: [
      {
        name: "force-css-resolve",
        enforce: "pre",
        transform(code, id) {
          if (id.endsWith(".mjs") && code.includes("~/assets/css/main.css")) {
            return code.replace(
              "~/assets/css/main.css",
              "/app/assets/css/main.css"
            );
          }
          return null;
        },
      },
    ],
    resolve: {
      alias: {
        "@": currentDir,
      },
    },
    server: {
      // 🔹 HTTPSをオフにする（CaddyがSSLを担当する）
      https: false,
      // 🔹 Nuxt開発サーバを外部（Caddy）から到達可能にする
      host: "0.0.0.0",
      port: 3000,
      cors: true,
      watch: {
        usePolling: true,
      },
    },
  },

  devServer: {
    // 🔹 念のためこちらも指定（Viteと重複してもOK）
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
      interval: 100,
      followSymlinks: true,
      depth: 3,
    },
  },
});