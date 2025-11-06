import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

/**
 * アプリケーションの起動時に、認証状態の解決を待ち、
 * その後、Sanctum CSRFトークンを取得するプラグイン。
 * * このプラグインが完了するまでNuxtの起動はブロックされ、
 * Piniaストアの isLoading が false になることが保証されます。
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  // クライアントサイドでのみ実行
  if (process.server) {
    return;
  }

  const authStore = useAuthStore();

  // 1. 認証リスナーを設定
  // initAuthのPromiseを await しないことで、デッドロックを回避しながらリスナーを設定
  // initAuth内で onAuthStateChanged が起動し、isLoading が true のまま待機状態に入る
  console.log("[AuthResolver] Firebase認証リスナーを設定 (非ブロッキング)。");
  authStore.initAuth();

  // 2. 認証状態の解決が完了するのを待機
  // waitForAuthResolvedは、initAuth内で onAuthStateChanged が初回実行され、
  // isLoading が false になるまで待機します。
  console.log("[AuthResolver] 認証状態の解決を安全に待機します...");
  await authStore.waitForAuthResolved();
  console.log(
    "[AuthResolver] 認証の初期化と解決が完了しました。isLoading = false。"
  );

  // 3. 認証が解決された後、Sanctum CSRFトークンを取得
  try {
    await authStore.getSanctumCsrfToken();
    console.log("[AuthResolver] CSRF Token取得完了。");
  } catch (e) {
    console.warn(
      "[AuthResolver] CSRF Token取得に失敗しましたが、処理を続行します。",
      e
    );
  }
});
