import { useNuxtApp, navigateTo, useRuntimeConfig } from "#app"; // useRuntimeConfigをインポート
import { useAuthStore } from "@/stores/auth";
import { useAuth } from "~/composables/useAuth";

/**
 * カスタムAPIリクエストを行うためのコンポーザブル。
 * 認証済みエンドポイント向けに、CSRFトークンの取得と認証エラー(401)のハンドリングを一元化します。
 */
export const useApi = () => {
  const { $api } = useNuxtApp();
  const authStore = useAuthStore();
  const { token: localToken } = useAuth();

  // ★ 修正: runtimeConfigからAPIベースURLを取得
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  if (typeof $api !== "function") {
    console.error(
      "CRITICAL: $api instance is missing. Check plugins/api-interceptor.client.ts."
    );
    throw new Error("API instance not available.");
  }

  /**
   * 認証が必要なAPIエンドポイントにリクエストを送信します。
   * @param url APIエンドポイント（例: '/mypage/profile_update'）
   * @param options useFetch/Nuxt $apiのオプション
   * @returns APIレスポンスデータ
   */
  const authenticatedFetch = async (url: string, options: any = {}) => {
    // ★★★ 核心の修正: APIベースURLを強制的に結合して絶対URLを生成 ★★★
    // 例: https://laravel.test:4430/api + /mypage/profile_update
    // urlの先頭スラッシュを安全に処理
    const apiPath = `${apiBaseUrl}${url.startsWith("/") ? url : "/" + url}`;

    console.log(`[useApi] 最終リクエストURLを構築: ${apiPath}`); // デバッグログ

    // 1. CSRFトークンを強制取得し、セッションを確立 (Sanctumセッション維持のため)
    try {
      console.log(`[useApi] セッション確立確認のためCSRFトークンを取得します`);
      // CSRFトークン取得処理 (ベースURLは設定により自動でSanctumのルートに飛びます)
      await authStore.getSanctumCsrfToken();
    } catch (e) {
      console.error(
        "[useApi] CSRFトークン取得に失敗。セッション切れの可能性。",
        e
      );
      throw {
        status: 401,
        message: "セッションが切れました。再度ログインが必要です。",
      };
    }

    // 2. Bearerトークンをヘッダーに明示的に付与
    if (localToken.value) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${localToken.value}`,
      };
      console.log(`[useApi] Authorization Bearer Token set.`);
    }

    try {
      // 3. 実際のAPIリクエスト実行
      // ここで、絶対URL (apiPath) を渡すことで、Nuxtの誤ったホスト解決を防ぎます。
      const response = await $api(apiPath, options);
      return response;
    } catch (error: any) {
      console.error(`[useApi] APIリクエスト失敗 (${apiPath}):`, error);

      if (error.response && error.response.status === 401) {
        // 401 Unauthorized エラーの場合、ログインページへリダイレクト
        console.log("[useApi] 401エラーを検知。ログインページへリダイレクト。");
        await authStore.logout();
        await navigateTo("/login");

        return Promise.reject({
          status: 401,
          message: "認証セッションが切れました。",
        });
      }

      throw error;
    }
  };

  return {
    authenticatedFetch,
  };
};
