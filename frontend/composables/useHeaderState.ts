import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
// ★ Piniaストアをインポート
import { useAuthStore } from "@/stores/auth";
// ★ onMounted, useAuth, checkAuthStatus の定義は削除

export const useHeaderState = () => {
  const router = useRouter();
  const route = useRoute();

  // ★ Piniaストアから状態とアクションを取得
  const authStore = useAuthStore();

  // ★ 認証状態はPiniaストアのゲッターから取得 (toRefsやstoreToRefsは不要)
  // computedを使用して、Piniaのリアクティブな状態を公開します
  const isLoggedIn = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => !authStore.isAuthResolved); // isLoadingはinitAuthが完了していない状態

  // 検索クエリ
  const searchQuery = ref(route.query.all_item_search || "");

  /**
   * 現在のページが認証関連のページ（/login, /register, /verify-email）かを判定する
   */
  const isAuthPage = computed(() => {
    const path = route.path;
    return ["/login", "/register", "/verify-email"].includes(path);
  });

  /**
   * ログアウト処理
   */
  const handleLogout = async () => {
    try {
      // ★ Piniaのlogoutアクションを呼び出す
      await authStore.logout();
      // ログアウト処理完了後、ログイン画面へ強制的にリダイレクト
      router.push("/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  /**
   * 検索処理
   */
  const handleSearch = () => {
    router.push({
      path: "/",
      query: {
        tab: route.query.tab || "all",
        all_item_search: searchQuery.value || undefined,
      },
    });
  };

  return {
    isLoggedIn,
    isLoading,
    searchQuery,
    isAuthPage,
    handleLogout,
    handleSearch,
  };
};
