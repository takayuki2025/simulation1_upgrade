import { useNuxtApp, navigateTo } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useAuth } from "~/composables/useAuth"; // useAuthをインポート

/**
 * カスタムAPIリクエストを行うためのコンポーザブル。
 * 認証済みエンドポイント向けに、CSRFトークンの取得と認証エラー(401)のハンドリングを一元化します。
 */
export const useApi = () => {
  // カスタムAPIクライアント($api)と認証ストアの取得
  const { $api } = useNuxtApp();
  const authStore = useAuthStore();
  const { token: localToken } = useAuth(); // ★ 修正: useAuthからローカルトークンを取得

  if (typeof $api !== "function") {
    console.error(
      "CRITICAL: $api instance is missing. Check plugins/api-interceptor.ts."
    );
    throw new Error("API instance not available.");
  }

  /**
   * 認証が必要なAPIエンドポイントにリクエストを送信します。
   * リクエスト前にCSRFトークンを取得し、401エラーが発生した場合はログインページにリダイレクトします。
   * @param url APIエンドポイント
   * @param options useFetch/Nuxt $apiのオプション
   * @returns APIレスポンスデータ
   */
  const authenticatedFetch = async (url: string, options: any = {}) => {
    // 1. CSRFトークンを強制取得し、セッションを確立 (Sanctumセッション維持のため)
    try {
      console.log(
        `[useApi] セッション確立確認のためCSRFトークンを取得します (${url})`
      );
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

    // 2. ★★★ 修正: Bearerトークンをヘッダーに明示的に付与 ★★★
    // これにより、Laravelの公開ルートでも Auth::guard('sanctum') が機能します。
    if (localToken.value) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${localToken.value}`,
      };
      console.log(`[useApi] Authorization Bearer Token set for ${url}.`);
    }

    try {
      // 3. 実際のAPIリクエスト実行
      const response = await $api(url, options);
      return response;
    } catch (error: any) {
      console.error(`[useApi] APIリクエスト失敗 (${url}):`, error);

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
