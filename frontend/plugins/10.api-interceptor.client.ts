import { useAuth } from "~/composables/useAuth";
import { useRuntimeConfig, navigateTo } from "#app"; // Nuxt 3 の navigateTo をインポート

export default defineNuxtPlugin((nuxtApp) => {
  const { token, clearToken } = useAuth();
  const config = useRuntimeConfig();

  // 🌟 $api カスタムインスタンスを定義
  const customFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,

    // ★★★ 修正(1): 認証情報 (Cookie) を必ず含めるように設定する ★★★
    credentials: "include",

    // --- 1. リクエストインターセプター: Authorizationヘッダーの付与とフラグ設定 ---
    onRequest({ options }) {
      // const currentToken = token.value; // Pinia/LocalStorageのトークンはCookie認証では不要

      // if (currentToken) {
      //   // ★★★ 修正(2): Bearerトークン付与を削除（またはコメントアウト）★★★
      //   options.headers = options.headers || {};
      //   options.headers = {
      //     ...options.headers,
      //     Authorization: `Bearer ${currentToken}`,
      //   };
      // }

      // Acceptヘッダーが指定されていない場合にデフォルトでJSONを設定
      if (!options.headers.Accept && !options.headers["accept"]) {
        options.headers.Accept = "application/json";
      }

      // CSRFトークンヘッダーは、credentials: 'include' があれば $fetch が自動的に処理します。
    },

    // --- 2. レスポンスエラーインターセプター: 401 Unauthorized の捕捉 ---
    onResponseError({ response, options }) {
      if (response && response.status === 401) {
        const url = response.url;

        // 認証エンドポイント (Firebase/Login/Register) はスキップ
        const isAuthEndpoint = url.includes("/firebase/");

        // Piniaのチェック用など、スキップフラグがある場合はスキップ
        const isSkipAutoLogoutFlag =
          options.context?.skipAutoLogout ||
          options.headers?.["X-Skip-Auto-Logout"] === "true";

        if (isAuthEndpoint || isSkipAutoLogoutFlag) {
          console.warn(
            `⚠️ [GLOBAL 401 INTERCEPTOR] 401エラーを捕捉したが、自動ログアウトをスキップ (Auth Endpoint or Skip Flag): ${url}`
          );
          return;
        }

        console.error(
          `🚨 [GLOBAL 401 INTERCEPTOR] 401エラーを捕捉: ${url}。強制ログアウト処理を実行します。`
        );

        // クライアント側のトークンを削除 (Pinia/LocalStorageのクリーンアップ)
        clearToken();

        // ログインページへリダイレクト
        if (process.client) {
          return navigateTo("/login", { replace: true });
        }
      }
    },
  });

  // カスタム $fetch インスタンスを Nuxt App のヘルパーとして提供
  nuxtApp.provide("api", customFetch);
});
