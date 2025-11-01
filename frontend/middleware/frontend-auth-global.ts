import { useAuthStore } from "#imports";
import { navigateTo } from "#app";

// 💡 ファイル名が ".global.ts" で終わるため、すべてのルート変更時に自動的に実行されます。
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // 認証ページ (認証済みユーザーがアクセスをブロックされるページ)
  // 💡 実際に作成済みの /login と /register のみを含めます。
  const GUEST_PAGES = ["/login", "/register"];

  // ===========================================
  // 1. 認証済みユーザーのゲストページアクセスをブロック
  // ===========================================
  if (isAuthenticated && GUEST_PAGES.includes(to.path)) {
    console.log(
      `[Global Guard 1] Authenticated user blocked from ${to.path}. Redirecting to /.`
    );
    return navigateTo("/");
  }

  // ===========================================
  // 2. 保護ルートへの未認証アクセスをブロック (標準ガード)
  // ===========================================
  // 💡 トップページ '/' とメール確認ページを保護対象から除外する
  const isProtectedRoute =
    !GUEST_PAGES.includes(to.path) &&
    to.path !== "/email/verify" &&
    to.path !== "/";

  if (!isAuthenticated && isProtectedRoute) {
    // 未認証ユーザーが保護されたルートにアクセスしようとした場合
    console.log(
      `[Global Guard 2] Access denied for route: ${to.fullPath}. Redirecting to /login.`
    );
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  // ===========================================
  // 3. メール未認証ユーザーの保護ルートアクセスを制御 (メール認証ガード)
  // ===========================================

  const isUnverified =
    isAuthenticated &&
    authStore.user &&
    authStore.user.email_verified_at === null;

  if (isUnverified) {
    // /email/verify 以外の認証済みルートへのアクセスをブロック
    if (to.path !== "/email/verify") {
      console.log(
        `[Global Guard 3] Unverified user blocked from ${to.fullPath}. Forcing redirect to /email/verify.`
      );
      return navigateTo("/email/verify");
    }
    // /email/verify にアクセスしている場合は許可
    return;
  }
});
