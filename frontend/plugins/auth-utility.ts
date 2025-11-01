import { useAuthStore } from "@/stores/auth";

/**
 * 認証ストアの初期化処理を行うNuxtプラグイン。
 * アプリケーション起動時に一度だけ認証状態を解決する役割を持つ。
 * これにより、stores/auth.ts の isLoading が false になり、「認証確認中」状態が解除される。
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  // Piniaストアインスタンスを取得
  const authStore = useAuthStore();

  // isLoadingが既にfalse（解決済み）であればスキップ
  if (!authStore.isLoading) {
    console.log("[Plugin] Auth already resolved, skipping initAuth.");
    return;
  }

  // initAuthアクションを呼び出し、認証状態を解決するのを待つ
  // この処理が完了すると、authStore.isLoading は false になる
  await authStore.initAuth();

  console.log("[Plugin] Authentication check completed and state resolved.");
});
