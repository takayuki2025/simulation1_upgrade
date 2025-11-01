import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

/**
 * アプリケーションの起動時に、メインスレッドをブロックしない方法で
 * Firebase認証状態の監視を開始し、その解決を待ちます。
 * * ★ initAuthをawaitせず、waitForAuthResolvedをawaitすることがデッドロック回避の肝です。
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  // SSR (process.server) の場合は、クライアントサイドでのみ実行されるよう処理をスキップします。
  if (process.server) {
    return;
  }

  const authStore = useAuthStore();

  // 1. リスナーを設定（awaitをつけないことでメインスレッドのブロックを回避）
  //    -> onAuthStateChangedがバックグラウンドで動き始める
  console.log("Firebase認証リスナーを設定します (非ブロッキング)。");
  authStore.initAuth();

  // 2. 認証状態の解決が完了するのを待機（ポーリングを利用した安全な待機）
  //    -> Piniaの状態が更新されるのをイベントループを止めずに待つ
  console.log("認証状態の解決を安全に待機します...");
  await authStore.waitForAuthResolved();
  console.log("Firebase認証の初期化と解決が完了しました。");

  // 3. 認証が解決された後、Sanctum CSRFトークンを取得
  try {
    await authStore.getSanctumCsrfToken();
  } catch (e) {
    console.warn("CSRF Token取得に失敗しましたが、処理を続行します。", e);
  }
});
