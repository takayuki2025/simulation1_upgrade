import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

// Piniaストアの初期化は、アプリが完全に準備された後に行うのが最も安全です。
export default defineNuxtPlugin((nuxtApp) => {
  // `$firebaseAuth`が存在しない場合（例: plugins/firebase.tsで失敗した場合）は、
  // initAuthを呼び出さず、エラーを回避します。
  if (!nuxtApp.$firebaseAuth) {
    console.warn(
      "[Auth Initializer] $firebaseAuth is not available. Skipping store initialization."
    );
    return;
  }

  // Nuxtの全てのプラグインが実行を終えた後、非同期にinitAuthを呼び出します。
  // Piniaストアの初期化はクライアント側で非同期に行っても問題ありません。
  const authStore = useAuthStore();

  console.log(
    "[Auth Initializer] $firebaseAuth found. Triggering authStore.initAuth()..."
  );

  // 非同期に実行し、メインスレッドをブロックしないようにします
  authStore.initAuth().catch((e) => {
    console.error("Failed to run initial auth check:", e);
  });
});
