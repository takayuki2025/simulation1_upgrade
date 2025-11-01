import { defineNuxtPlugin } from '#app';
import { useAuthStore } from "@/stores/auth";

/**
 * アプリケーション起動時に認証ストアを初期化し、認証状態を確定させます。
 * これにより、ヘッダーなどのコンポーネントが描画される前に
 * ログイン状態（isLoggedIn/isLoading）が確定します。
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  // process.clientチェックは必須ではありませんが、ストアの動作保証のために含めます
  if (process.client) {
    const authStore = useAuthStore();

    // initAuthをawaitし、認証データのフェッチとisLoading状態の解決を待ちます
    await authStore.initAuth();

    // ★★★ ログ出力を修正 ★★★
    console.log(
      "[Auth State Resolver] Authentication state successfully initialized and resolved."
    );
  }
});