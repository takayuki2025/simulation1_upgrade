import { defineStore } from "pinia";
import { useCookie, useRuntimeConfig, useNuxtApp } from "#app";
import { ref, computed } from "vue";

// 新しいトークン管理Composableをインポート
import { useAuth } from "~/composables/useAuth";

// itemStoreの適切なパスを仮定してインポート
import { useItemStore } from "./item";

// Firebaseのインポート
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  Auth,
  onAuthStateChanged,
  Unsubscribe,
  User as FirebaseAuthUser,
  updateProfile,
} from "firebase/auth";

// ----------------------------------------------------
// 1. インターフェース定義
// ----------------------------------------------------
interface User {
  id: number; // MySQL ID
  name: string;
  email: string;
  uid: string; // Firebase UID
  email_verified_at: string | null;
  post_number: string | null;
  address: string | null;
  building: string | null;
  user_image: string | null;
}

// ストアで使用する認証済みユーザー情報
export interface AuthUser extends Partial<User> {
  uid: string;
  email: string | null;
}

// フォームのデータ構造
interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
interface ProfileUpdateForm {
  name?: string;
  post_number?: string | null;
  address?: string | null;
  building?: string | null;
  user_image?: string | null;
}

declare const $fetch: typeof globalThis.fetch;

// ----------------------------------------------------
// 3. ヘルパー関数
// ----------------------------------------------------
/**
 * Firebase Auth インスタンスを安全に取得するヘルパー関数
 */
const getFirebaseAuth = (): Auth | null => {
  const nuxtApp = useNuxtApp() as any;
  const $firebaseAuth = nuxtApp.$firebaseAuth as Auth | null | undefined;
  if ($firebaseAuth && $firebaseAuth !== null) {
    return $firebaseAuth;
  }
  if (process.server) {
    return null;
  }
  console.error(
    "CRITICAL: Firebase Authインスタンスが利用できません。プラグインの初期化設定を確認してください。"
  );
  return null;
};

// ----------------------------------------------------
// 4. Pinia ストア定義 (Composition API Style)
// ----------------------------------------------------
export const useAuthStore = defineStore("auth", () => {
  // --- STATE (Ref) ---
  const token = ref<string | null>(null);
  const user = ref<AuthUser | null>(null);
  const isAuthReady = ref(false); // 認証状態の初期ロードが完了したか
  const isLoading = ref(false); // 認証処理中かどうか
  const isLoggingOut = ref(false);

  // 内部状態 (initAuthのPromise管理 - ハングアップ対策)
  const _authUnsubscribe = ref<Unsubscribe | null>(null);
  const _sessionKeeperInterval = ref<number | null>(null);
  const _authInitPromise = ref<Promise<void> | null>(null);
  let _resolveAuthInitPromise: (() => void) | null = null; // リゾルバを保持するための変数

  // --- GETTERS (Computed) ---
  const _getAuthManager = () => useAuth();

  const isLoggedIn = computed(() => {
    const { isAuthenticated } = _getAuthManager();
    return isAuthenticated.value && !!user.value;
  });

  const isAuthenticated = isLoggedIn;
  const isAuthResolved = computed(() => isAuthReady.value);

  const isEmailVerified = computed(() => {
    const userData = user.value as User | null;
    return !!userData && !!userData.email_verified_at;
  });

  // --- ACTIONS (Functions) ---

  // ----------------------------------------------------
  // $resetの実装 (Piniaセットアップストアで必須かつクリーンアップ集約)
  // ----------------------------------------------------
  const $reset = () => {
    console.log("🔄 [AuthStore:RESET] Local state reset initiated.");

    // 1. STATEを初期値に戻す
    token.value = null;
    user.value = null;
    isAuthReady.value = false;
    isLoading.value = false;
    isLoggingOut.value = false;

    // 2. 内部的なPromiseと購読の状態をリセット
    if (_authUnsubscribe.value) {
      _authUnsubscribe.value();
      _authUnsubscribe.value = null;
    }

    // Session Keeperの停止
    stopSessionKeeper();

    // 3. 認証Promiseをリセット (ハングアップ対策の最重要部分)
    // 実行中であれば解決し、次の initAuth が新しい Promise を作成できるようにする
    if (_resolveAuthInitPromise) {
      console.log("🛠️ [AuthStore:RESET] Resolving pending auth init promise.");
      _resolveAuthInitPromise();
      _resolveAuthInitPromise = null;
    }
    _authInitPromise.value = null;
  };

  // ----------------------------------------------------
  // APIのbaseURLを動的に取得する
  // ----------------------------------------------------
  const getApiBaseUrl = (): string => {
    const config = useRuntimeConfig();

    const originalBaseUrl = config.public.apiBaseUrl;

    if (process.server) {
      try {
        const url = new URL(originalBaseUrl);
        const phpBaseUrl = originalBaseUrl.replace(
          url.host.split(":")[0],
          "php"
        );
        const finalPhpBaseUrl = phpBaseUrl.replace(/:(\d+)/, ":9000");
        return finalPhpBaseUrl;
      } catch (e) {
        console.error(
          "[API Base] Failed to parse API Base URL for SSR. Using original.",
          e
        );
        return originalBaseUrl.replace(/\/api$/, "") + ":9000/api";
      }
    }

    return originalBaseUrl;
  };

  // ----------------------------------------------------
  // Sanctum CSRF クッキーを取得するアクション
  // ----------------------------------------------------
  const getSanctumCsrfToken = async () => {
    const config = useRuntimeConfig();
    const fetcher = globalThis.$fetch as typeof globalThis.fetch;

    if (!config.public.apiBaseUrl) {
      console.warn(
        "[Sanctum CSRF] apiBaseUrl is not set. Skipping CSRF token fetch."
      );
      return;
    }

    const baseUrlForSanctum = config.public.apiBaseUrl.replace(/\/api$/, "");

    try {
      await fetcher("/sanctum/csrf-cookie", {
        baseURL: baseUrlForSanctum,
        method: "GET",
        credentials: "include",
      });

      console.log("[Sanctum CSRF] CSRF cookie fetched successfully.");
    } catch (error) {
      console.error("[Sanctum CSRF] Failed to fetch CSRF cookie:", error);
      throw new Error(
        "Failed to communicate with the backend to establish session."
      );
    }
  };

  // ----------------------------------------------------
  // 認証状態の解決を待機するアクション
  // ----------------------------------------------------
  const waitForAuthResolution = async () => {
    if (isAuthResolved.value) {
      return;
    }

    if (!_authInitPromise.value) {
      await initAuth();
    }

    if (_authInitPromise.value) {
      await _authInitPromise.value;
    }
  };

  // ----------------------------------------------------
  // セッションキーパー関連
  // ----------------------------------------------------
  const stopSessionKeeper = () => {
    if (_sessionKeeperInterval.value) {
      window.clearInterval(_sessionKeeperInterval.value);
      _sessionKeeperInterval.value = null;
      console.log("[Keeper] Session keeper stopped.");
    }
  };

  const startSessionKeeper = async () => {
    if (_sessionKeeperInterval.value) {
      return;
    }

    const INTERVAL_TIME_MS = 5 * 60 * 1000;
    const fetcher = globalThis.$fetch as typeof globalThis.fetch;
    const baseUrl = getApiBaseUrl();
    const $firebaseAuth = getFirebaseAuth();

    if (!$firebaseAuth) {
      console.error(
        "[Keeper] Firebase Auth is not available. Cannot start session keeper."
      );
      return;
    }

    const keepSessionAlive = async () => {
      if (isLoading.value || !isAuthenticated.value || !isEmailVerified.value) {
        stopSessionKeeper();
        return;
      }

      try {
        const currentUser = $firebaseAuth.currentUser;
        if (!currentUser) {
          stopSessionKeeper();
          return;
        }

        const newIdToken = await currentUser.getIdToken(true);

        await fetcher("/firebase/login", {
          baseURL: baseUrl,
          method: "POST",
          body: {
            id_token: newIdToken,
          },
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });
      } catch (error: any) {
        console.warn(
          "[Keeper] Session refresh failed (likely 401/403). Forcing local logout.",
          error
        );
        await logout();
      }
    };

    await keepSessionAlive();
    _sessionKeeperInterval.value = window.setInterval(
      keepSessionAlive,
      INTERVAL_TIME_MS
    ) as unknown as number;
  };

  // ----------------------------------------------------
  // Sanctumセッション再確立
  // ----------------------------------------------------
  const reEstablishSanctumSession = async (
    firebaseUser: FirebaseAuthUser
  ): Promise<boolean> => {
    const fetcher = globalThis.$fetch as typeof globalThis.fetch;
    const baseUrl = getApiBaseUrl();
    const { setToken, clearToken } = _getAuthManager();

    try {
      const idToken = await firebaseUser.getIdToken(true);

      const response: any = await fetcher("/firebase/login", {
        baseURL: baseUrl,
        method: "POST",
        body: {
          id_token: idToken,
        },
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("[ReEstablish] Sanctum session re-established successfully.");

      token.value = response.token;
      user.value = response.user as User;
      setToken(response.token);

      await getSanctumCsrfToken();

      return true;
    } catch (error: any) {
      console.warn(
        "[ReEstablish] Failed to re-establish Sanctum session. Error:",
        error
      );

      $reset();
      clearToken();
      return false;
    }
  };

  // ----------------------------------------------------
  // ユーザー情報の読み込み (独立した関数)
  // ----------------------------------------------------
  const fetchUser = async (isForce: boolean = false) => {
    const fetcher = globalThis.$fetch as typeof globalThis.fetch;
    const { token: localToken, clearToken } = _getAuthManager();

    if (!localToken.value) {
      user.value = null;
      token.value = null;
      return;
    }

    token.value = localToken.value;
    const baseUrl = getApiBaseUrl();

    try {
      const response: any = await fetcher("/user", {
        baseURL: baseUrl,
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localToken.value}`,
          Accept: "application/json",
        },
        context: {
          skipAutoLogout: true,
        },
      });

      if (
        typeof response === "string" &&
        response.startsWith("<!DOCTYPE html>")
      ) {
        console.error(
          "⛔️ [FATAL ERROR] /user APIレスポンスが予期せずHTMLです。Laravel側のルーティング/ミドルウェアを確認してください。"
        );
        throw new Error("/user API call returned HTML instead of JSON.");
      }

      const userData: User = response.user || response;
      user.value = userData;
    } catch (e: any) {
      const status = e.response?.status;
      const shouldClear = status === 401;
      const shouldMaintain = status === 403;

      if (shouldClear) {
        console.warn(
          `[FetchUser] Received 401 Unauthorized. Clearing local state to force full re-auth.`
        );
        $reset(); // 401の場合も $reset でクリーンアップ
        clearToken();
      } else if (shouldMaintain) {
        console.warn(
          `[FetchUser] Received 403 Forbidden (Likely unverified email). Maintaining local state to show prompt.`
        );
      } else {
        console.error(
          "[FetchUser] Failed to fetch user with unexpected error.",
          e
        );
        $reset(); // その他の予期せぬエラーも $reset でクリーンアップ
        clearToken();
      }
      return;
    }
  };

  const forceFetchUser = async () => {
    if (!isAuthenticated.value) {
      console.warn("[ForceFetch] Not authenticated. Aborting force fetch.");
      return;
    }
    await fetchUser(true);
  };

  // ----------------------------------------------------
  // 認証状態の初期化ロジック (ハングアップ対策を強化)
  // ----------------------------------------------------
  const initAuth = async () => {
    // 1. 解決済みか、既に実行中であれば、実行中のPromiseを待機して終了
    if (isAuthReady.value) {
      return;
    }
    if (isLoading.value && _authInitPromise.value) {
      await _authInitPromise.value;
      return;
    }

    // 2. Promiseの作成
    if (!_authInitPromise.value) {
      _authInitPromise.value = new Promise<void>((resolve) => {
        _resolveAuthInitPromise = resolve;
      });
    }

    isLoading.value = true;
    console.log("[initAuth] Starting authentication state resolution...");

    const $firebaseAuth = getFirebaseAuth();

    if (!$firebaseAuth) {
      console.warn(
        "[initAuth] Firebase Authインスタンスがnullのため、認証待機をスキップします。"
      );
      isLoading.value = false;
      // Firebaseが利用できない場合も、待機していたPromiseを解決し、アプリの描画を続行させる
      if (_resolveAuthInitPromise) _resolveAuthInitPromise();
      return;
    }

    // 3. onAuthStateChangedのリスナー設定
    if (_authUnsubscribe.value) {
      _authUnsubscribe.value();
    }

    _authUnsubscribe.value = onAuthStateChanged(
      $firebaseAuth,
      async (firebaseUser: FirebaseAuthUser | null) => {
        // onAuthStateChangedが最初に実行されたかどうかの判定を保持
        const isInitialRun = _resolveAuthInitPromise !== null;

        if (!isInitialRun) {
          isLoading.value = true;
        }

        const { token: localToken, clearToken } = _getAuthManager();

        try {
          if (firebaseUser) {
            let sanctumSuccess = true;

            // ローカルトークンやユーザー情報がない場合、Sanctumセッションの再確立を試みる
            if (!localToken.value || !user.value) {
              sanctumSuccess = await reEstablishSanctumSession(firebaseUser);
            } else {
              token.value = localToken.value;
              await fetchUser();
            }

            if (sanctumSuccess) {
              if (isAuthenticated.value && isEmailVerified.value) {
                await startSessionKeeper();
              } else {
                stopSessionKeeper();
              }
            } else {
              $reset();
              clearToken();
            }
          } else {
            // Firebaseユーザーがいない（ログアウト状態、またはセッション切れ）
            $reset();
            clearToken();
          }
        } catch (e) {
          console.warn(
            "[onAuthStateChanged] Unexpected error during session check, clearing state.",
            e
          );
          $reset();
          clearToken();
        } finally {
          // 初回実行時のみ、待機していた Promise を解決し、フラグを更新
          if (isInitialRun && _resolveAuthInitPromise) {
            isLoading.value = false;
            isAuthReady.value = true;

            console.log(
              "✅ [AuthStore:Resolved] Initial finished. isAuthenticated:",
              isAuthenticated.value,
              "User ID:",
              user.value?.id
            );

            _resolveAuthInitPromise();
            _resolveAuthInitPromise = null;
            _authInitPromise.value = null; // Promiseをnullに戻す
          } else if (!isInitialRun) {
            // 後発イベントの場合は、isLoadingをfalseに戻す
            isLoading.value = false;
          }
        }
      }
    );

    // 4. onAuthStateChangedの初回実行によるPromise解決を待つ
    await _authInitPromise.value;

    console.log("[initAuth] Initial wait finished.");
  };

  // ----------------------------------------------------
  // ログイン処理 (変更なし)
  // ----------------------------------------------------
  const login = async (credentials: any) => {
    isLoading.value = true;
    try {
      const $firebaseAuth = getFirebaseAuth();
      if (!$firebaseAuth)
        throw new Error("Firebase Auth service is unavailable for login.");
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = getApiBaseUrl();
      const { setToken } = _getAuthManager();

      const userCredential = await signInWithEmailAndPassword(
        $firebaseAuth,
        credentials.email,
        credentials.password
      );
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      const response: any = await fetcher("/firebase/login", {
        baseURL: baseUrl,
        method: "POST",
        body: { id_token: idToken },
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      token.value = response.token;
      user.value = response.user as User;
      setToken(response.token);

      await getSanctumCsrfToken();

      if (isEmailVerified.value) {
        await startSessionKeeper();
      } else {
        stopSessionKeeper();
      }
      isLoading.value = false;
    } catch (error: any) {
      isLoading.value = false;
      stopSessionKeeper();
      console.error("Login Error Catch:", error);
      throw error;
    }
  };

  // ----------------------------------------------------
  // 新規登録処理 (変更なし)
  // ----------------------------------------------------
  const register = async (data: RegisterForm) => {
    isLoading.value = true;
    try {
      const $firebaseAuth = getFirebaseAuth();
      if (!$firebaseAuth)
        throw new Error(
          "Firebase Auth service is unavailable for registration."
        );
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = getApiBaseUrl();
      const { setToken } = _getAuthManager();

      console.log("[REGISTER] Starting Firebase user creation...");
      const userCredential = await createUserWithEmailAndPassword(
        $firebaseAuth,
        data.email,
        data.password
      );
      let firebaseUser = userCredential.user;

      console.log(
        `[REGISTER] Updating Firebase profile with name: ${data.name}`
      );
      await updateProfile(firebaseUser, { displayName: data.name });

      const idToken = await firebaseUser.getIdToken(true);
      console.log("[REGISTER] ID Token retrieved. Sending to Laravel...");

      const response: any = await fetcher("/firebase/register", {
        baseURL: baseUrl,
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        body: { id_token: idToken, name: data.name, email: data.email },
      });

      if (!response || !response.token || !response.user) {
        throw new Error(
          "Registration succeeded but failed to receive user authentication data from backend."
        );
      }

      token.value = response.token;
      user.value = response.user as User;
      setToken(response.token);

      await getSanctumCsrfToken();
      stopSessionKeeper();
      isLoading.value = false;
    } catch (error: any) {
      isLoading.value = false;
      stopSessionKeeper();
      console.error("Register Error Catch (Final):", error);
      throw error;
    }
  };

  // ----------------------------------------------------
  // プロフィール更新処理 (変更なし)
  // ----------------------------------------------------
  const updateUserProfile = async (
    data: ProfileUpdateForm
  ): Promise<AuthUser> => {
    if (!isAuthenticated.value || !user.value) {
      throw new Error("User must be authenticated to update profile.");
    }
    isLoading.value = true;
    try {
      const localToken = _getAuthManager().token;
      const $firebaseAuth = getFirebaseAuth();
      if (!$firebaseAuth || !$firebaseAuth.currentUser) {
        throw new Error(
          "Firebase Auth service or current user is unavailable."
        );
      }
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = getApiBaseUrl();
      const firebaseUser = $firebaseAuth.currentUser;

      const profileUpdates: {
        displayName?: string;
        photoURL?: string | null;
      } = {};

      if (data.name && data.name !== firebaseUser.displayName) {
        profileUpdates.displayName = data.name;
      }

      if (Object.keys(profileUpdates).length > 0) {
        console.log(`[PROFILE_UPDATE] Updating Firebase profile...`);
        await updateProfile(firebaseUser, profileUpdates);
        await firebaseUser.getIdToken(true);
      }

      const apiPath = "/mypage/profile_update";
      const requestBody = { ...data, _method: "PATCH" };

      const response: any = await fetcher(apiPath, {
        baseURL: baseUrl,
        method: "POST",
        body: requestBody,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${localToken.value}`,
        },
      });

      if (response && response.user) {
        user.value = response.user as User;
      } else if (
        typeof response === "string" &&
        response.startsWith("<!DOCTYPE html>")
      ) {
        console.error(
          "⛔️ [FATAL ERROR] APIレスポンスが予期せずHTMLです。Laravel側のルーティング（認証またはCSRFミドルウェア）を確認してください。"
        );
        throw new Error(
          "API call returned HTML instead of JSON. Check Laravel routing/middleware."
        );
      } else {
        user.value = { ...(user.value as User), ...data } as User;
      }

      console.log(
        "✅ [DEBUG] プロフィール更新APIコールが成功しました。ストアを更新します。"
      );
      isLoading.value = false;
      return user.value;
    } catch (error: any) {
      isLoading.value = false;
      console.error("Profile Update Error (Catch):", error);
      if (error.response?.data?.errors) {
        console.error("Laravel Validation Errors:", error.response.data.errors);
      }
      throw error;
    }
  };

  // ----------------------------------------------------
  // メール認証処理 (変更なし)
  // ----------------------------------------------------
  const verifyEmail = async (url: string) => {
    const fetcher = globalThis.$fetch as typeof globalThis.fetch;
    const baseUrl = getApiBaseUrl();

    const urlObj = new URL(url, "http://dummy.com");
    const queryParams = urlObj.search;

    try {
      const verificationResponse: any = await fetcher(
        `/email/verify${queryParams}`,
        {
          baseURL: baseUrl,
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      if (verificationResponse && verificationResponse.user) {
        user.value = verificationResponse.user as User;

        const $firebaseAuth = getFirebaseAuth();
        if (!$firebaseAuth || !$firebaseAuth.currentUser) {
          console.warn(
            "[VERIFY] Current Firebase user is null. Skipping session refresh."
          );
          return true;
        }

        const success = await reEstablishSanctumSession(
          $firebaseAuth.currentUser
        );

        if (success) {
          await startSessionKeeper();
          return true;
        }
      }
      return false;
    } catch (error: any) {
      console.error("[VERIFY ERROR] Email verification failed:", error);
      if (error.statusCode === 403) {
        throw new Error("メール認証リンクの有効期限が切れているか、無効です。");
      }
      throw error;
    }
  };

  // ----------------------------------------------------
  // ログアウト処理
  // ----------------------------------------------------
  const logout = async () => {
    const fetcher = globalThis.$fetch as typeof globalThis.fetch;
    const config = useRuntimeConfig();
    const { clearToken } = _getAuthManager();
    const itemStore = useItemStore();

    // 1. フラグをtrueに設定
    isLoggingOut.value = true;
    isLoading.value = true;

    // 2. UIの即時更新とデータのクリア
    $reset();

    if (typeof itemStore.clearData === "function") {
      itemStore.clearData();
      console.log("[LOGOUT] itemStore.clearData() called.");
    } else {
      console.warn(
        "🍍: itemStore.clearData() is not defined. Item store data may persist."
      );
    }

    // トークンのクッキー/ストレージをクリア
    clearToken();

    if (process.client) {
      const cookies = ["laravel_session", "XSRF-TOKEN", "auth_token"];

      cookies.forEach((name) => {
        const cookieRef = useCookie(name);
        if (cookieRef.value) {
          cookieRef.value = null;
          useCookie(name, { path: "/", maxAge: 0, sameSite: "Lax" });
        }
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        document.cookie = `${name}=; Path=/api; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        document.cookie = `${name}=; Path=/sanctum; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      });

      console.log("[LOGOUT] Client-side cookies forcefully deleted.");
    } else {
      useCookie("laravel_session").value = null;
      useCookie("XSRF-TOKEN").value = null;
      useCookie("auth_token").value = null;
    }

    // 3. バックエンドのログアウトAPIを呼び出し (非同期)
    if (typeof fetcher === "function") {
      try {
        await fetcher("/logout", {
          baseURL: config.public.apiBaseUrl,
          method: "POST",
          credentials: "include",
        });
        console.log("[LOGOUT] Backend /logout API call successful.");
      } catch (e: any) {
        const status = e.response?.status;
        if (status === 401 || status === 403 || status === 500) {
          console.warn(
            `[LOGOUT] Backend API failed with status ${status}. (Expected if session already invalid). Continuing local clear.`
          );
        } else {
          console.error("Logout API failed with unexpected error.", e);
        }
      }
    }

    // 4. Firebaseからのサインアウト (非同期)
    try {
      const $firebaseAuth = getFirebaseAuth();
      if ($firebaseAuth) {
        await signOut($firebaseAuth);
        console.log("[LOGOUT] Firebase SignOut successful.");
      }
    } catch (e: any) {
      if (
        !e.message.includes("Firebase Auth service is not available") &&
        !e.message.includes("on the server")
      ) {
        console.error("Firebase SignOut failed:", e);
      }
    }

    // 5. ログアウト完了後、ページをリロードして強制的に非認証リクエストを発行させる
    if (process.client) {
      // 🚨 修正: window.location.reload()の直前にフラグを解除することで、フリーズ状態を解消します
      isLoading.value = false;
      isLoggingOut.value = false;

      console.log("🚀 [LOGOUT] Forcing window reload to ensure clean state.");
      window.location.reload();

      // 以前のコードのこの行は、リロードが実行されたため到達しません
      // isLoading.value = false;
      // isLoggingOut.value = false;
    }
  };

  // ----------------------------------------------------
  // 公開する状態、ゲッター、アクションを返す
  // ----------------------------------------------------
  return {
    // State
    token,
    user,
    isLoading,
    isLoggingOut,
    isAuthReady,

    // Getters
    isLoggedIn,
    isAuthenticated,
    isAuthResolved,
    isEmailVerified,

    // Actions
    getApiBaseUrl,
    getSanctumCsrfToken,
    waitForAuthResolution,
    initAuth,
    login,
    register,
    updateUserProfile,
    verifyEmail,
    logout,
    fetchUser,
    forceFetchUser,
    $reset, // カスタム実装した $reset を公開
    stopSessionKeeper,
    startSessionKeeper,
  };
});
