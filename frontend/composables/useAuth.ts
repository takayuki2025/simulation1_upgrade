import { ref, onMounted, computed } from "vue";
import { useAuthProvider } from "~/services/authProvider"; // ★ 変更: services/authProvider.ts からインポート
import { navigateTo } from "#app";
import type { LoginForm, RegisterForm } from "~/schemas/authSchema"; // 型をインポート

// ユーザー情報の型定義 (email_verified_at は必須ではないが、存在することを期待)
interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
}

// 認証プロバイダーのインスタンスを取得
const provider = useAuthProvider();

// グローバルでリアクティブな認証状態 (シングルトンとして機能)
const user = ref<User | null>(null);
const isLoading = ref(true);

/**
 * Nuxtアプリケーション全体で認証状態を管理するための Composable
 */
export const useAuth = () => {
  /**
   * ユーザー情報のロード
   */
  const loadUser = async () => {
    isLoading.value = true;
    try {
      // ユーザー情報取得 (email_verified_at を含む)
      const fetchedUser = (await provider.fetchUser()) as User | null;
      user.value = fetchedUser;
    } catch (e) {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * ログイン処理
   * @param credentials ログイン情報
   */
  const login = async (credentials: LoginForm) => {
    try {
      await provider.login(credentials);
      await loadUser();

      if (user.value) {
        // email_verified_at が null または空文字列なら未認証と見なす
        if (!user.value.email_verified_at) {
          await navigateTo("/verify-email");
        } else {
          await navigateTo("/");
        }
      }
    } catch (e: any) {
      throw e; // 発生したエラー（バリデーションやネットワークエラー）を上に投げる
    }
  };

  /**
   * ★ 新規登録処理を追加
   * @param userData 登録情報
   */
  const register = async (userData: RegisterForm) => {
    try {
      // APIプロバイダーに新規登録処理を委譲
      await provider.register(userData);

      // 登録成功後、自動的にログイン状態になることを想定し、ユーザー情報をロード
      // Fortify/Sanctumのデフォルトでは登録後すぐに認証される
      await loadUser();

      // 登録・ログイン成功後のリダイレクト先: 通常はメール認証ページ
      await navigateTo("/verify-email");
    } catch (e: any) {
      throw e; // 発生したエラー（バリデーションエラーなど）を上に投げる
    }
  };

  /**
   * ログアウト処理
   */
  const logout = async () => {
    try {
      await provider.logout();
      user.value = null;
      await navigateTo("/login");
    } catch (e) {
      console.error("Logout failed:", e);
      user.value = null;
      await navigateTo("/login");
    }
  };

  onMounted(() => {
    if (process.client && !user.value && isLoading.value) {
      loadUser();
    }
  });

  return {
    user,
    isLoading,
    isLoggedIn: computed(() => !!user.value),
    isEmailVerified: computed(() => !!user.value?.email_verified_at),
    login,
    register, // ★ register メソッドを追加
    logout,
    loadUser,
    authProvider: provider,
  };
};
