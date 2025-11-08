import { defineStore } from "pinia";
import { useCookie, useRuntimeConfig, useNuxtApp } from "#app";
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

// 1. interface User を Firebase と MySQL のデータ構造に合わせて定義
interface User {
  id: number; // MySQL ID
  name: string;
  email: string;
  uid: string; // Firebase UID
  email_verified_at: string | null;
  // ★ データベースに合わせて、必要な他のプロパティを追加
  post_number: string | null; // 追加: 郵便番号
  address: string | null; // 追加: 住所
  building: string | null; // 追加: 建物名・アパート名
  user_image: string | null; // 追加: ユーザー画像URL
}

interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean; // 認証状態の解決が完了するまでtrue (isAuthResolvedの逆)
  isLoggingOut: boolean;
  _authUnsubscribe: Unsubscribe | null;
  _sessionKeeperInterval: number | null;
}

// 登録フォームのデータ構造を定義（型安全性を高めるため）
interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ★ 追加: プロフィール更新フォームのデータ構造を定義
interface ProfileUpdateForm {
  name?: string;
  post_number?: string | null;
  address?: string | null;
  building?: string | null;
  user_image?: string | null;
}

// $fetch の型を定義
declare const $fetch: typeof globalThis.fetch;

// ★★★ 認証解決を待機するためのグローバルなPromise (ストア外に維持) ★★★
let authPromise: Promise<void> | null = null;
let resolveAuthPromise: (() => void) | null = null;

/**
 * 【最終版】Firebase Auth インスタンスを安全に取得するヘルパー関数
 */
const getFirebaseAuth = (): Auth | null => {
  const nuxtApp = useNuxtApp() as any;
  const $firebaseAuth = nuxtApp.$firebaseAuth as Auth | null | undefined;
  if ($firebaseAuth && $firebaseAuth !== null) {
    return $firebaseAuth;
  }
  if (process.server) {
    // サーバーサイドでは警告のみ
    return null;
  }
  console.error(
    "CRITICAL: Firebase Authインスタンスが利用できません。プラグインの初期化設定を確認してください。"
  );
  return null;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    user: null,
    isInitialized: false,
    isLoading: true,
    isLoggingOut: false,
    _authUnsubscribe: null,
    _sessionKeeperInterval: null,
  }),

  getters: {
    // 認証状態の確認を useAuth() のトークンに依存させる
    isAuthenticated: (state) => {
      const { isAuthenticated } = useAuth();
      // userデータも確実に存在することを確認
      return isAuthenticated.value && !!state.user;
    },
    // 認証状態の解決が完了しているか（画面描画の準備完了）
    isAuthResolved: (state) => !state.isLoading, // ★★★ isAuthResolved は isLoading の逆 ★★★
    // メール認証が完了しているかどうかをチェックするゲッター
    isEmailVerified: (state) => !!state.user && !!state.user.email_verified_at,
  },

  actions: {
    // useAuth Composableのインスタンスを取得
    _getAuthManager() {
      return useAuth();
    },

    // ----------------------------------------------------
    // APIのbaseURLを動的に取得する
    // ----------------------------------------------------
    getApiBaseUrl(): string {
      const config = useRuntimeConfig();

      const originalBaseUrl = config.public.apiBaseUrl;

      // Nuxtのサーバーサイド（Dockerコンテナ内）で実行されている場合
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
    },

    // ----------------------------------------------------
    // Sanctum CSRF クッキーを取得するアクション
    // ----------------------------------------------------
    async getSanctumCsrfToken() {
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
    },

    // ----------------------------------------------------
    // 認証状態の解決を待機するアクション
    // ----------------------------------------------------
    async waitForAuthResolution() {
      if (!authPromise) {
        if (this.isAuthResolved) {
          return;
        }
        await this.initAuth();
      }

      if (authPromise) {
        await authPromise;
      }
    },

    // ----------------------------------------------------
    // セッションキーパー関連
    // ----------------------------------------------------
    async startSessionKeeper() {
      if (this._sessionKeeperInterval) {
        return;
      }

      const INTERVAL_TIME_MS = 5 * 60 * 1000;
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = this.getApiBaseUrl();
      const $firebaseAuth = getFirebaseAuth();

      if (!$firebaseAuth) {
        console.error(
          "[Keeper] Firebase Auth is not available. Cannot start session keeper."
        );
        return;
      }

      const keepSessionAlive = async () => {
        // isLoadingのチェックを追加。解決前は実行しない
        if (this.isLoading || !this.isAuthenticated || !this.isEmailVerified) {
          this.stopSessionKeeper();
          return;
        }

        try {
          const currentUser = $firebaseAuth.currentUser;
          if (!currentUser) {
            this.stopSessionKeeper();
            return;
          }

          // ★ サーバーへのIDトークン送信でセッションを維持
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
          // エラーが発生した場合は、確実にログアウト処理を走らせる
          this.logout();
        }
      };

      // 最初のセッション維持を実行してからインターバル開始
      await keepSessionAlive();
      this._sessionKeeperInterval = window.setInterval(
        keepSessionAlive,
        INTERVAL_TIME_MS
      ) as unknown as number;
    },

    stopSessionKeeper() {
      if (this._sessionKeeperInterval) {
        window.clearInterval(this._sessionKeeperInterval);
        this._sessionKeeperInterval = null;
        console.log("[Keeper] Session keeper stopped.");
      }
    },

    // ----------------------------------------------------
    // Sanctumセッション再確立
    // ----------------------------------------------------
    async reEstablishSanctumSession(
      firebaseUser: FirebaseAuthUser
    ): Promise<boolean> {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = this.getApiBaseUrl();
      const { setToken, clearToken } = this._getAuthManager();

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

        console.log(
          "[ReEstablish] Sanctum session re-established successfully."
        );

        this.token = response.token;
        this.user = response.user as User;
        setToken(response.token);

        // セッション確立の完了を待ってからCSRFトークンを取得
        await this.getSanctumCsrfToken();

        return true;
      } catch (error: any) {
        console.warn(
          "[ReEstablish] Failed to re-establish Sanctum session. Error:",
          error
        );

        this.token = null;
        this.user = null;
        clearToken();
        this.stopSessionKeeper();
        return false;
      }
    },

    // ----------------------------------------------------
    // 認証状態の初期化ロジック (onAuthStateChangedのリスナー設定)
    // ----------------------------------------------------
    async initAuth() {
      if (this.isInitialized && !this.isLoading) {
        return;
      }

      if (!authPromise) {
        authPromise = new Promise<void>((resolve) => {
          resolveAuthPromise = resolve;
        });
      }

      if (this.isLoading && this.isInitialized) {
        await authPromise;
        return;
      }

      this.isInitialized = true;
      this.isLoading = true;
      console.log("[initAuth] Starting authentication state resolution...");

      const $firebaseAuth = getFirebaseAuth();

      if (!$firebaseAuth) {
        console.warn(
          "[initAuth] Firebase Authインスタンスがnullのため、認証待機をスキップします。"
        );
        this.isLoading = false;
        if (resolveAuthPromise) resolveAuthPromise();
        return;
      }

      // onAuthStateChangedのリスナー設定
      this._authUnsubscribe = onAuthStateChanged(
        $firebaseAuth,
        async (user: FirebaseAuthUser | null) => {
          const wasLoadingInitially = resolveAuthPromise !== null; // 初期解決中かどうか

          // 初期解決中でない場合でも、状態変化を処理するためにisLoadingを一時的にtrueにする
          if (!wasLoadingInitially) {
            this.isLoading = true;
          }

          const { token, clearToken } = this._getAuthManager();

          try {
            if (user) {
              let sanctumSuccess = true;

              if (!token.value || !this.user) {
                // トークンがない、またはユーザー情報がストアにない場合
                sanctumSuccess = await this.reEstablishSanctumSession(user);
              } else {
                this.token = token.value;
                // ★ 修正点1: トークンがあるがユーザー情報が不完全な場合に備え、
                //           /user APIから最新の完全な情報を取得する
                await this.fetchUser();
              }

              if (sanctumSuccess) {
                // Sanctumセッションが成功し、userデータがセットされた後
                if (this.isAuthenticated && this.isEmailVerified) {
                  this.startSessionKeeper();
                } else {
                  this.stopSessionKeeper();
                }
              } else {
                // Sanctumセッション再確立に失敗した場合は、強制ログアウト状態にする
                this.token = null;
                this.user = null;
                clearToken();
                this.stopSessionKeeper();
              }
            } else {
              // Firebaseユーザーがいない（ログアウト状態）
              this.token = null;
              this.user = null;
              clearToken();
              this.stopSessionKeeper();
            }
          } catch (e) {
            console.warn(
              "[onAuthStateChanged] Unexpected error during session check, clearing state.",
              e
            );
            this.token = null;
            this.user = null;
            clearToken();
            this.stopSessionKeeper();
          } finally {
            // ★★★ 修正ポイント: 初期解決時のみresolvePromiseを呼び出すことを保証 ★★★
            if (wasLoadingInitially && resolveAuthPromise) {
              this.isLoading = false;

              console.log(
                "✅ [AuthStore:Resolved] Initial finished. isAuthenticated:",
                this.isAuthenticated,
                "User ID:",
                this.user?.id
              );

              resolveAuthPromise();
              resolveAuthPromise = null;
              authPromise = null;
            } else if (!wasLoadingInitially) {
              // 後発イベントの場合は、isLoadingをfalseに戻す
              this.isLoading = false;
            }
          }
        }
      );

      // onAuthStateChangedが最初に実行され、resolveAuthPromiseが呼ばれるのを待つ
      await authPromise;

      console.log("[initAuth] Initial wait finished.");
    },

    // ----------------------------------------------------
    // ログイン処理
    // ----------------------------------------------------
    async login(credentials: any) {
      this.isLoading = true; // ログイン処理中はローディングを表示

      try {
        const $firebaseAuth = getFirebaseAuth();
        if (!$firebaseAuth)
          throw new Error("Firebase Auth service is unavailable for login.");

        const fetcher = globalThis.$fetch as typeof globalThis.fetch;
        const baseUrl = this.getApiBaseUrl();
        const { setToken } = this._getAuthManager();

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
          body: {
            id_token: idToken,
          },
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        this.token = response.token;
        this.user = response.user as User;
        setToken(response.token);

        await this.getSanctumCsrfToken();

        // ⚠️ 修正: 登録/ログインAPIがユーザー情報を返しているため、
        // 連続で fetchUser を呼び出すのをやめ、401エラーを回避します。
        // await this.fetchUser(true);

        if (this.isEmailVerified) {
          this.startSessionKeeper();
        } else {
          this.stopSessionKeeper();
        }

        // ログイン成功後、isLoadingをfalseにする
        this.isLoading = false;
      } catch (error: any) {
        this.isLoading = false;
        this.stopSessionKeeper();
        console.error("Login Error Catch:", error);
        throw error;
      }
    },

    // ----------------------------------------------------
    // 新規登録処理
    // ----------------------------------------------------
    async register(data: RegisterForm) {
      this.isLoading = true;

      try {
        const $firebaseAuth = getFirebaseAuth();
        if (!$firebaseAuth)
          throw new Error(
            "Firebase Auth service is unavailable for registration."
          );

        const fetcher = globalThis.$fetch as typeof globalThis.fetch;
        const baseUrl = this.getApiBaseUrl();
        const { setToken } = this._getAuthManager();

        console.log("[REGISTER] Starting Firebase user creation...");
        const userCredential = await createUserWithEmailAndPassword(
          $firebaseAuth,
          data.email,
          data.password
        );
        let firebaseUser = userCredential.user;

        // ★★★ 修正ポイント 1: Firebaseユーザーの表示名 (displayName) を更新 ★★★
        console.log(
          `[REGISTER] Updating Firebase profile with name: ${data.name}`
        );
        // FirebaseのプロフィールはLaravel側の登録APIに任せるか、
        // この後のIDトークンリフレッシュで自動的に反映されるのを期待する
        await updateProfile(firebaseUser, {
          displayName: data.name,
        });

        // データベースに渡す前に、最新の情報（displayNameを含む）を反映させるため、
        // IDトークンを強制的にリフレッシュします。
        // これにより、IDトークンのクレームに 'name' が含まれるようになります。
        const idToken = await firebaseUser.getIdToken(true); // trueを渡して強制リフレッシュ

        console.log("[REGISTER] ID Token retrieved. Sending to Laravel...");

        const response: any = await fetcher("/firebase/register", {
          baseURL: baseUrl,
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          body: {
            id_token: idToken,
            name: data.name, // 登録時に入力された名前もLaravelに明示的に送る
            email: data.email,
          },
        });

        if (!response || !response.token || !response.user) {
          throw new Error(
            "Registration succeeded but failed to receive user authentication data from backend."
          );
        }

        this.token = response.token;
        this.user = response.user as User;
        setToken(response.token);

        await this.getSanctumCsrfToken();

        // ⚠️ 修正: 登録/ログインAPIがユーザー情報を返しているため、
        // 連続で fetchUser を呼び出すのをやめ、401エラーを回避します。
        // await this.fetchUser(true);

        this.stopSessionKeeper();

        // 登録成功後、isLoadingをfalseにする
        this.isLoading = false;
      } catch (error: any) {
        this.isLoading = false;
        this.stopSessionKeeper();
        console.error("Register Error Catch (Final):", error);
        throw error;
      }
    },

    // ----------------------------------------------------
    // ★★★ プロフィール更新処理 (修正) ★★★
    // ----------------------------------------------------
    async updateUserProfile(data: ProfileUpdateForm): Promise<User> {
      if (!this.isAuthenticated || !this.user) {
        throw new Error("User must be authenticated to update profile.");
      }

      this.isLoading = true;

      try {
        const localToken = this._getAuthManager().token; // Sanctumトークンを取得

        const $firebaseAuth = getFirebaseAuth();
        if (!$firebaseAuth || !$firebaseAuth.currentUser) {
          throw new Error(
            "Firebase Auth service or current user is unavailable."
          );
        }

        // $fetch は Nuxt の useFetch/globalThis.$fetch に相当
        const fetcher = globalThis.$fetch as typeof globalThis.fetch;
        const baseUrl = this.getApiBaseUrl();
        const firebaseUser = $firebaseAuth.currentUser;

        // 1. Firebase側の更新 (名前/ユーザー画像の変更のみFirebase Authで扱う)
        const profileUpdates: {
          displayName?: string;
          photoURL?: string | null;
        } = {};

        if (data.name && data.name !== firebaseUser.displayName) {
          profileUpdates.displayName = data.name;
        }

        // ... (user_imageのFirebase PhotoURL更新ロジックは省略)

        if (Object.keys(profileUpdates).length > 0) {
          console.log(`[PROFILE_UPDATE] Updating Firebase profile...`);
          await updateProfile(firebaseUser, profileUpdates);

          // IDトークンを強制リフレッシュして、新しいクレームを次回のAPIコールに含める
          await firebaseUser.getIdToken(true);
        }

        // 2. Laravel側の更新 (全てのフィールドを更新)
        const apiPath = "/mypage/profile_update";

        const requestBody = {
          ...data,
          _method: "PATCH", // LaravelにPATCHとして解釈させる魔法のフィールド
        };

        console.log(
          `[PROFILE_UPDATE] Calling Laravel API: POST ${apiPath} with _method=PATCH`
        );

        // ★★★ 修正ポイント: Nuxtの $fetch は非200レスポンス時に自動でエラーを投げるが、
        // ここではレスポンスが200でもHTMLが返ってきた場合のハンドリングを強化する

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

        // 3. 成功した場合、ストアのユーザーデータを更新
        if (response && response.user) {
          this.user = response.user as User;
        } else if (
          typeof response === "string" &&
          response.startsWith("<!DOCTYPE html>")
        ) {
          // APIコールが成功ステータス(200 OK)を返したが、コンテンツがHTMLだった場合
          console.error(
            "⛔️ [FATAL ERROR] APIレスポンスが予期せずHTMLです。Laravel側のルーティング（認証またはCSRFミドルウェア）を確認してください。"
          );
          // HTMLレスポンスをそのまま処理させないためにエラーを投げる
          throw new Error(
            "API call returned HTML instead of JSON. Check Laravel routing/middleware."
          );
        } else {
          // レスポンスにuserオブジェクトがない場合、送信したデータでローカルを更新
          this.user = {
            ...(this.user as User),
            ...data,
          } as User;
        }

        console.log(
          "✅ [DEBUG] プロフィール更新APIコールが成功しました。ストアを更新します。"
        );

        this.isLoading = false;
        return this.user;
      } catch (error: any) {
        this.isLoading = false;
        console.error("Profile Update Error (Catch):", error);
        // Laravelからエラーレスポンス（422など）が返ってきた場合、詳細なメッセージをログに出力
        if (error.response?.data?.errors) {
          console.error(
            "Laravel Validation Errors:",
            error.response.data.errors
          );
        }
        throw error;
      }
    }, // ★★★ updateUserProfile 終わり ★★★

    // ----------------------------------------------------
    // メール認証処理
    // ----------------------------------------------------
    async verifyEmail(url: string) {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = this.getApiBaseUrl();

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
          this.user = verificationResponse.user as User;

          const $firebaseAuth = getFirebaseAuth();
          if (!$firebaseAuth || !$firebaseAuth.currentUser) {
            console.warn(
              "[VERIFY] Current Firebase user is null. Skipping session refresh."
            );
            return true;
          }

          const success = await this.reEstablishSanctumSession(
            $firebaseAuth.currentUser
          );

          if (success) {
            this.startSessionKeeper();
            return true;
          }
        }

        return false;
      } catch (error: any) {
        console.error("[VERIFY ERROR] Email verification failed:", error);

        if (error.statusCode === 403) {
          throw new Error(
            "メール認証リンクの有効期限が切れているか、無効です。"
          );
        }

        throw error;
      }
    },

    // ----------------------------------------------------
    // ログアウト処理 (Firebase/Sanctum連携を考慮して修正)
    // ----------------------------------------------------
    async logout() {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const config = useRuntimeConfig();
      const { clearToken } = this._getAuthManager();

      const itemStore = useItemStore();

      // 1. フラグをtrueに設定
      this.isLoggingOut = true;
      this.isLoading = true;
      this.stopSessionKeeper();

      // 2. UIの即時更新とデータのクリアを最優先
      itemStore.$reset();

      this.token = null;
      this.user = null;
      clearToken();

      // ★★★ 修正ポイント 1: クッキーをアグレッシブに削除 ★★★
      if (process.client) {
        const cookies = ["laravel_session", "XSRF-TOKEN", "auth_token"];

        cookies.forEach((name) => {
          const cookieRef = useCookie(name);
          if (cookieRef.value) {
            cookieRef.value = null;
            // path: '/' を付けて削除を強制
            // @ts-ignore
            useCookie(name, { path: "/", maxAge: 0, sameSite: "Lax" });
          }

          // 低レベルなdocument.cookieでの強制削除（より確実性が高い）
          // 複数のパスで試行
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

      // ★★★ 修正ポイント 2: ログアウト完了後、ページをリロードして強制的に非認証リクエストを発行させる ★★★
      // これは最も確実な方法です。
      if (process.client) {
        window.location.reload();
      }

      // 5. すべての非同期処理が完了後、フラグをfalseに戻す (reloadで到達しない可能性が高いが、念のため)
      this.isLoading = false;
      this.isLoggingOut = false;
      console.log(
        "[Logout] Complete. State cleared and isLoading/isLoggingOut set to false."
      );
    },

    // ----------------------------------------------------
    // 認証済みの前提でユーザー情報を強制的に再読み込みするアクション
    // ----------------------------------------------------
    async forceFetchUser() {
      if (!this.isAuthenticated) {
        console.warn("[ForceFetch] Not authenticated. Aborting force fetch.");
        return;
      }
      await this.fetchUser(true);
    },

    // ----------------------------------------------------
    // ユーザー情報の読み込み
    // ----------------------------------------------------
    async fetchUser(isForce: boolean = false) {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const { token: localToken, clearToken } = this._getAuthManager();
      const config = useRuntimeConfig();

      if (!localToken.value) {
        this.user = null;
        this.token = null;
        return;
      }

      this.token = localToken.value;
      const baseUrl = this.getApiBaseUrl();

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

        // ★★★ 修正ポイント: HTMLレスポンスのチェック
        if (
          typeof response === "string" &&
          response.startsWith("<!DOCTYPE html>")
        ) {
          console.error(
            "⛔️ [FATAL ERROR] /user APIレスポンスが予期せずHTMLです。Laravel側のルーティング/ミドルウェアを確認してください。"
          );
          throw new Error("/user API call returned HTML instead of JSON.");
        }

        const user: User = response.user || response;
        this.user = user;
      } catch (e: any) {
        // ... (エラー処理は省略せず、前のコードを保持)
        const status = e.response?.status;
        const shouldClear = status === 401;
        const shouldMaintain = status === 403;

        if (shouldClear) {
          console.warn(
            `[FetchUser] Received 401 Unauthorized. Clearing local state to force full re-auth.`
          );
          this.token = null;
          this.user = null;
          clearToken();
          this.stopSessionKeeper();
        } else if (shouldMaintain) {
          console.warn(
            `[FetchUser] Received 403 Forbidden (Likely unverified email). Maintaining local state to show prompt.`
          );
        } else {
          console.error(
            "[FetchUser] Failed to fetch user with unexpected error.",
            e
          );
          this.token = null;
          this.user = null;
          clearToken();
          this.stopSessionKeeper();
        }
        return;
      }
    },
  },
});