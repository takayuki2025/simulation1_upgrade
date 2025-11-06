import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

/**
 * ヘッダー表示に必要な認証状態、検索クエリ、アクションを提供するコンポーザブル
 */
export const useHeaderState = () => {
  const authStore = useAuthStore();
  const route = useRoute();

  // 認証状態の解決が完了していないかどうか
  // (isLoadingがtrueの間、認証状態が確定していない)
  const isLoading = computed(() => authStore.isLoading);

  // ログイン済みかどうか
  const isLoggedIn = computed(() => authStore.isAuthenticated);

  // 現在のルートがログイン、登録、またはメール認証関連ページかどうか
  const isAuthPage = computed(() =>
    ["/login", "/register", "/verify"].some((path) =>
      route.path.startsWith(path)
    )
  );

  // 検索フォーム用のローカルな状態
  const searchQuery = ref(route.query.all_item_search || "");

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await authStore.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // エラー時でもUIの状態は更新されるため、特に処理は不要
    }
  };

  // 検索処理 (NuxtLinkの代わりに直接ルーターを使用)
  const router = useRouter();
  const handleSearch = () => {
    // 現在のタブを保持しつつ、検索クエリを更新して/indexにリダイレクト
    const currentTab = route.query.tab || "all";
    router.push({
      path: "/",
      query: {
        tab: currentTab,
        all_item_search: searchQuery.value || undefined, // 空文字の場合はクエリを削除
      },
    });
  };

  return {
    isLoggedIn,
    isLoading,
    searchQuery,
    isAuthPage, // ★ 新たに追加/修正
    handleLogout,
    handleSearch,
  };
};
