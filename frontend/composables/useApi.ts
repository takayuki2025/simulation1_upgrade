import { useNuxtApp, navigateTo } from "#app";
import { useAuthStore } from "@/stores/auth"; // @/stores/auth を直接インポート

/**
 * カスタムAPIリクエストを行うためのコンポーザブル。
 * 認証済みエンドポイント向けに、CSRFトークンの取得と認証エラー(401)のハンドリングを一元化します。
 */
export const useApi = () => {
  // カスタムAPIクライアント($api)と認証ストアの取得
  const { $api } = useNuxtApp();
  const authStore = useAuthStore();

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
    // 1. CSRFトークンを強制取得し、セッションを確立
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
      // トークン取得に失敗した場合も、401として扱いthrowする
      throw {
        status: 401,
        message: "セッションが切れました。再度ログインが必要です。",
      };
    }

    try {
      // 2. 実際のAPIリクエスト実行
      const response = await $api(url, options);
      return response;
    } catch (error: any) {
      console.error(`[useApi] APIリクエスト失敗 (${url}):`, error);

      if (error.response && error.response.status === 401) {
        // 401 Unauthorized エラーの場合、ログインページへリダイレクト
        console.log("[useApi] 401エラーを検知。ログインページへリダイレクト。");
        await authStore.logout();
        await navigateTo("/login");

        // 呼び出し元には処理を停止させるためのPromise.rejectを返す
        return Promise.reject({
          status: 401,
          message: "認証セッションが切れました。",
        });
      }

      // 422バリデーションエラーやその他のエラーはそのままスローして呼び出し元で処理させる
      throw error;
    }
  };

  return {
    authenticatedFetch,
  };
};
