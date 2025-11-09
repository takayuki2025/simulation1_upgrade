import { useNuxtApp, navigateTo, useRuntimeConfig } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useAuth } from "~/composables/useAuth";

/**
 * カスタムAPIリクエストを行うためのコンポーザブル。
 * 認証済みエンドポイント向けに、認証エラー(401)のハンドリングとBearerトークンの付与を一元化します。
 */
export const useApi = () => {
  const { $api } = useNuxtApp();
  const authStore = useAuthStore();
  const { token: localToken } = useAuth(); // Bearerトークンを取得

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
    // 1. APIベースURLを強制的に結合して絶対URLを生成
    const apiPath = `${apiBaseUrl}${url.startsWith("/") ? url : "/" + url}`;

    console.log(`[useApi] 最終リクエストURLを構築: ${apiPath}`); // デバッグログ

    // 2. Bearerトークンをヘッダーに明示的に付与
    if (localToken.value) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${localToken.value}`,
      };
      console.log(`[useApi] Authorization Bearer Token set. (Bearer Token Auth Mode)`);
    } else {
        console.warn(`[useApi] Bearer Token is missing for ${apiPath}. Proceeding without token.`);
    }

    try {
      // 3. 実際のAPIリクエスト実行
      const response = await $api(apiPath, options);
      return response;
    } catch (error: any) {
      console.error(`[useApi] APIリクエスト失敗 (${apiPath}):`, error);

      if (error.response && error.response.status === 401) {
        // 401 Unauthorized エラーの場合、ログインページへリダイレクト
        console.log("[useApi] 401エラーを検知。ログインページへリダイレクト。");
        await authStore.logout();
        await navigateTo("/login");

        // Promise.rejectでチェーンを中断
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