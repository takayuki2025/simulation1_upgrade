import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

/**
 * 認証状態の初期化と、Sanctum CSRFトークンの取得を行うプラグイン。
 * クライアントサイドでのみ実行され、設定に応じてNuxtの起動をブロックして認証解決を待機します。
 */

// 外部から設定を注入することを想定
const SHOULD_BLOCK_NUXT_START = true; // 認証完了までUIをブロックするかどうか

export default defineNuxtPlugin(async (nuxtApp) => {
  // サーバーサイドでの実行を回避
  if (process.server) {
    return;
  }

  const authStore = useAuthStore();

  // Firebase Auth の依存関係のチェックは、ストア内の getFirebaseAuth() に任せる
  // ここではストアの初期化だけを実行します。

  // 1. 認証リスナーの設定（非ブロッキングで開始）
  console.log("[Auth Plugin] Firebase認証リスナーを設定 (initAuth) します。");
  // initAuthは、Promiseを返すように修正されているため、awaitは不要
  authStore.initAuth();

  // ----------------------------------------------------
  // 2. ブロック動作の選択 (AuthResolverのロジック)
  // ----------------------------------------------------
  if (SHOULD_BLOCK_NUXT_START) {
    // AuthResolverの動作: 起動をブロックして認証解決を待機
    console.log("[Auth Plugin] 設定に基づき、認証状態の解決を待機します...");

    // ★修正: ストア側で定義した正しいメソッド名に修正
    await authStore.waitForAuthResolution();
    console.log("✅ [Auth Plugin] 認証の初期化と解決が完了しました。");

    // Sanctum CSRFトークンの取得 (AuthResolverのロジック)
    // 認証解決後に、SanctumのCSRFトークンを取得
    try {
      await authStore.getSanctumCsrfToken();
      console.log("✅ [Auth Plugin] Sanctum CSRF Tokenを取得しました。");
    } catch (e) {
      console.warn(
        "[Auth Plugin] Sanctum CSRF Tokenの取得に失敗しました。認証が必要なAPIリクエストは失敗する可能性があります。",
        e
      );
    }
  } else {
    // Auth Initializerの動作: 起動をブロックせず、バックグラウンドで処理を続行
    console.log(
      "✅ [Auth Plugin] 非ブロッキングモードで起動します。認証はバックグラウンドで進行中です。"
    );
    // このモードの場合、CSRFトークン取得や認証状態の確認は各コンポーネントで個別に行う必要がありますが、
    // Sanctumの仕様上、ほとんどの操作でブロックが必要です。
  }
});
