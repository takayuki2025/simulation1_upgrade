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
    "~/plugins/firebase.ts", // ← Firebase プラグインを明示的に登録
  ],

  // Pinia 設定
  pinia: {
    // Nuxtのエイリアス (~) を使ってストアの場所を明示的に指定
    storesDirs: ["~/stores"],
  },

  // エイリアス設定
  alias: {
    // '@' を現在のディレクトリ（プロジェクトルート）に設定
    "@": currentDir,
    // '~' のパス解決を Nuxt のルートディレクトリに強制
    "~": currentDir,
    "~/": currentDir,
  },

  // 実行時設定 (クライアントとサーバーで利用可能)
  runtimeConfig: {
    public: {
      // 確認: API Base URLを環境変数から取得。
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,

      // ★★★ 画像参照用のベースURL: 'http://localhost:8000' を使用 ★★★
      assetBaseUrl: process.env.NUXT_PUBLIC_ASSET_BASE_URL,

      // Firebase 設定を環境変数から取得
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
    // エイリアス解決をViteに強制するプラグインを維持
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
    // ↓↓↓ 【重要】Viteがエイリアスを正しく解決できるように明示的に設定 ↓↓↓
    resolve: {
      alias: {
        "@": currentDir,
      },
    },
    // ★★★ 修正箇所: プロキシ設定を復元 ★★★
    server: {
      proxy: {
        // /api から始まるリクエストを NUXT_PUBLIC_API_BASE_URL に転送
        "/api": {
          target: process.env.NUXT_PUBLIC_API_BASE_URL,
          changeOrigin: true,
        },
        // Sanctum CSRF Cookie の取得パスも転送
        "/sanctum/csrf-cookie": {
          target: process.env.NUXT_PUBLIC_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  },

  // 開発サーバーの設定
  devServer: {
    port: 3000,
    host: "0.0.0.0", // Docker環境で外部からアクセス可能にする
    watch: {
      usePolling: true,
      interval: 100,
      followSymlinks: true,
      depth: 3,
    },
  },
});
