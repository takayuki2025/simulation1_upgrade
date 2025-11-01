import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth"; // authストアのパスが正しいことを前提

// クライアントサイドでのみ実行されるプラグイン
export default defineNuxtPlugin(async (nuxtApp) => {
  // Piniaストアが利用可能かチェック
  if (process.client) {
    const authStore = useAuthStore();

    console.log("--- [Sanctum Plugin] Starting CSRF Token Check ---");

    try {
      // authストアで定義されているCSRFトークン取得メソッドを呼び出す
      await authStore.getSanctumCsrfToken();
      console.log(
        "--- [Sanctum Plugin] CSRF cookie successfully obtained. ---"
      );
    } catch (error) {
      // エラーが発生した場合（例: Nginxとの通信不可）
      console.error(
        "--- [Sanctum Plugin] FATAL ERROR: Could not fetch CSRF cookie. Authentication will likely fail. ---",
        error
      );
    }
  }
});
