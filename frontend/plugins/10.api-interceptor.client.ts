import { useAuth } from "~/composables/useAuth"; // 💡 clearTokenのインポートを削除
import { useRuntimeConfig, navigateTo, useCookie } from "#app";
import type { NuxtApp } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  // 💡 clearToken は useAuth() の実行結果から取得するため、ここではインポートしない

  const customFetch = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBase,
    credentials: "include",

    // --- 1. リクエストインターセプター: X-XSRF-TOKENヘッダーの付与 ---
    onRequest({ options }) {
      // headersがない場合に備えて初期化を確実に行う
      options.headers = options.headers || new Headers();

      // Acceptヘッダーが指定されていない場合にデフォルトでJSONを設定
      if (!(options.headers.Accept || options.headers.get("Accept"))) {
        options.headers.set("Accept", "application/json");
      }

      // 💡 修正: CookieからXSRF-TOKENを読み取り、ヘッダーに設定する
      if (process.client) {
        // useCookie()はクライアント側でのみ動作
        const xsrfCookie = useCookie("XSRF-TOKEN");
        const tokenValue = xsrfCookie.value;

        if (tokenValue) {
          // XSRF-TOKEN Cookieの値を、X-XSRF-TOKEN ヘッダーとして送信
          options.headers.set("X-XSRF-TOKEN", tokenValue);
          console.log(
            `[CSRF] X-XSRF-TOKEN set: ${tokenValue.substring(0, 10)}...`
          );
        } else {
          console.warn("[CSRF] XSRF-TOKEN cookie not found.");
        }
      }
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

        // 💡 修正: useAuth() を呼び出し、clearToken 関数を取得して実行
        const { clearToken } = useAuth();
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
