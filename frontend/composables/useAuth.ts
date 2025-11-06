import { ref, computed } from "vue";

// グローバルでシングルトンとして使用するためのカスタムComposable
export const useAuth = () => {
  // トークンをローカルストレージから取得し、リアクティブな参照として保持します
  // Piniaストアの initAuth() よりも前に実行される可能性があるため、初期値設定を慎重に行う
  const initialToken =
    (typeof window !== "undefined"
      ? localStorage.getItem("sanctum_token")
      : null) || null;
  const token = ref<string | null>(initialToken);

  // 認証済みかどうかを計算プロパティで提供
  const isAuthenticated = computed(() => !!token.value);

  /**
   * ログイン成功時にトークンを保存します。
   * @param newToken Laravelから受け取ったSanctum Plain Text Token
   */
  const setToken = (newToken: string) => {
    token.value = newToken;
    if (typeof window !== "undefined") {
      localStorage.setItem("sanctum_token", newToken);
    }
    console.log("[Auth] Sanctum Token set successfully.");
  };

  /**
   * ログアウト時にトークンをクリアします。
   */
  const clearToken = () => {
    token.value = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("sanctum_token");
    }
    console.log("[Auth] Sanctum Token cleared.");
  };

  return {
    token, // リアクティブな参照を返す
    isAuthenticated,
    setToken,
    clearToken,
  };
};
