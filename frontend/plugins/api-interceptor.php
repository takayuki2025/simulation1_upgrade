import { useAuth } from "~/composables/useAuth";
import { useRuntimeConfig, navigateTo } from "#app"; // Nuxt 3 の navigateTo をインポート

export default defineNuxtPlugin((nuxtApp) => {
  const { token, clearToken } = useAuth(); // トークン管理機能を取得
  const config = useRuntimeConfig();

  // 🌟 $api カスタムインスタンスを定義
  const customFetch = $fetch.create({
    // baseURL を Nuxt の Public Runtime Config から取得
    baseURL: config.public.apiBaseUrl,

    // --- 1. リクエストインターセプター: Authorizationヘッダーの付与とフラグ設定 ---
    onRequest({ options }) {
      const currentToken = token.value;

      if (currentToken) {
        // Sanctum トークンを Bearer スキームで Authorization ヘッダーに追加
        options.headers = options.headers || {};
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${currentToken}`,
        };
        // トークンの付与を確認するためのログ
        console.log(
          `[API Interceptor] Authorization Header added: Bearer ...${currentToken?.slice(
            -5
          )}`
        );
      }

      // ★ 修正点: 自動ログアウトをスキップするフラグをリクエストオプションに追加 ★
      // fetchUser の呼び出し元でこのフラグが設定されることを想定します。
      if (options.context?.skipAutoLogout) {
        options.headers = options.headers || {};
        options.headers["X-Skip-Auto-Logout"] = "true"; // デバッグ用
        console.log(
          `[API Interceptor] Auto-logout skipped for: ${options.url}`
        );
      }
    },

    // --- 2. レスポンスエラーインターセプター: 401 Unauthorized の捕捉 ---
    onResponseError({ response, options }) {
      // 401 Unauthorized エラーを捕捉
      if (response && response.status === 401) {
        // ★ 修正点: 自動ログアウトをスキップするための条件を強化 ★
        // 1. 認証エンドポイント (Firebase/Login/Register) はスキップ
        const isAuthEndpoint = response.url.includes("/firebase/");
        // 2. リクエストオプションに skipAutoLogout フラグがある場合はスキップ
        const isSkipAutoLogout =
          options.context?.skipAutoLogout ||
          options.headers?.["X-Skip-Auto-Logout"] === "true";

        if (isAuthEndpoint || isSkipAutoLogout) {
          console.warn(
            `⚠️ [GLOBAL 401 INTERCEPTOR] 401エラーを捕捉したが、自動ログアウトをスキップ (Auth/Skip Flag): ${response.url}`
          );
          return; // 自動ログアウト処理をスキップ
        }

        console.error(
          `🚨 [GLOBAL 401 INTERCEPTOR] 401エラーを捕捉: ${response.url}。強制ログアウト処理を実行します。`
        );

        // クライアント側のトークンを削除
        clearToken();

        // ログインページへリダイレクト
        if (process.client) {
          // Nuxt 3 の navigateTo を使用し、強制的にリダイレクト
          return navigateTo("/login", { replace: true });
        }
      }
    },
  });

  // カスタム $fetch インスタンスを Nuxt App のヘルパーとして提供
  nuxtApp.provide("api", customFetch);
});
