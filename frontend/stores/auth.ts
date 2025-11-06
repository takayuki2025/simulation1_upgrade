import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCookie, useRuntimeConfig, useNuxtApp } from "#app";
// 新しいトークン管理Composableをインポート
import { useAuth } from "~/composables/useAuth";

// ★★★ 追記: 商品データを管理するストアをインポートしてください ★★★
// 実際のファイルパスに合わせて修正が必要です
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
} from "firebase/auth";

// 1. interface User を Firebase と MySQL のデータ構造に合わせて定義
interface User {
  id: number; // MySQL ID
  name: string;
  email: string;
  uid: string; // Firebase UID
  email_verified_at: string | null;
  // ★ データベースに合わせて、必要な他のプロパティを追加
}

interface AuthState {
  // Piniaストアでは、Composablesから取得するトークンを使用するため、ここではnullのまま
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
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

// $fetch の型を定義 (グローバルな型定義に依存しないために、ここでanyを使用)
declare const $fetch: typeof globalThis.fetch;

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
    console.warn(
      "Attempted to access Firebase Auth on the server. Returning null."
    );
    return null;
  }
  console.error(
    "CRITICAL: Firebase Authインスタンスが利用できません。nuxtApp.$firebaseAuth が null です。プラグイン（plugins/firebase.ts）の初期化設定を確認してください。"
  );
  return null;
};

// 認証解決を待機するためのグローバルなPromise
let authPromise: Promise<void> | null = null;
let resolveAuthPromise: (() => void) | null = null;

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null, // useAuth()からリアクティブに取得するため、ここではnullを維持
    user: null,
    isInitialized: false,
    isLoading: true, // 認証状態の解決が完了するまでtrue
    _authUnsubscribe: null, // 初期値はnull
    _sessionKeeperInterval: null, // 初期値はnull
  }),

  getters: {
    // 認証状態の確認を useAuth() のトークンに依存させる
    isAuthenticated: (state) => {
      const { isAuthenticated } = useAuth();
      return isAuthenticated.value && !!state.user;
    },
    // 認証状態の解決が完了しているか（画面描画の準備完了）
    isAuthResolved: (state) => !state.isLoading,
    // メール認証が完了しているかどうかをチェックするゲッター
    isEmailVerified: (state) => !!state.user && !!state.user.email_verified_at,
  },

  actions: {
    // useAuth Composableのインスタンスを取得
    _getAuthManager() {
      return useAuth();
    },

    // ----------------------------------------------------
    // APIのbaseURLを動的に取得する（変更なし）
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
          // console.log(`[API Base] SSR (to PHP-FPM): ${finalPhpBaseUrl}`);
          return finalPhpBaseUrl;
        } catch (e) {
          console.error(
            "[API Base] Failed to parse API Base URL for SSR. Using original.",
            e
          );
          return originalBaseUrl.replace(/\/api$/, "") + ":9000/api";
        }
      }

      // console.log(`[API Base] Client (to Nginx): ${originalBaseUrl}`);
      return originalBaseUrl;
    },

    // ----------------------------------------------------
    // Sanctum CSRF クッキーを取得するアクション（変更なし）
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

      console.log(
        `[Sanctum CSRF] Fetching cookie from: ${baseUrlForSanctum}/sanctum/csrf-cookie`
      );

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
    // 認証状態の解決を待機するアクション（変更なし）
    // ----------------------------------------------------
    async waitForAuthResolution() {
      if (!this.isInitialized) {
        // initAuthがまだ呼ばれていない場合は、最初に呼び出す
        await this.initAuth();
      }

      if (this.isAuthResolved) {
        return;
      }

      // isLoading が false になるまで待機
      await new Promise<void>((resolve) => {
        const checkResolution = () => {
          if (!this.isLoading) {
            resolve();
          } else {
            setTimeout(checkResolution, 50); // 50msごとにチェック
          }
        };
        checkResolution();
      });
    },

    // ----------------------------------------------------
    // セッションキーパー（Sanctumセッションの維持）ロジック
    // ----------------------------------------------------
    async startSessionKeeper() {
      // 既に動いている場合は何もしない
      if (this._sessionKeeperInterval) {
        return;
      }

      const INTERVAL_TIME_MS = 5 * 60 * 1000; // 5分ごと (Sanctumのセッション期限が切れる前にリフレッシュする)
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
        // 認証済みかつメール認証済みであるかを確認
        if (!this.isAuthenticated || !this.isEmailVerified) {
          // ログアウト状態や未認証状態ならインターバルを停止
          this.stopSessionKeeper();
          return;
        }

        try {
          const currentUser = $firebaseAuth.currentUser;
          if (!currentUser) {
            this.stopSessionKeeper();
            return;
          }

          // Firebase IDトークンを強制リフレッシュする
          const newIdToken = await currentUser.getIdToken(true);

          // Laravelのログインエンドポイントを叩いてSanctumセッションを延長
          // APIパスを '/api/firebase/login' に変更
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

          // console.log("[Keeper] Sanctum session successfully refreshed.");
        } catch (error: any) {
          console.warn(
            "[Keeper] Session refresh failed (likely 401/403). Forcing local logout.",
            error
          );
          // セッション維持に失敗した場合は、強制ログアウトさせる
          this.logout();
        }
      };

      // 初回はすぐに実行し、その後インターバルを設定
      await keepSessionAlive();
      this._sessionKeeperInterval = window.setInterval(
        keepSessionAlive,
        INTERVAL_TIME_MS
      ) as unknown as number;
      console.log(
        `[Keeper] Session keeper started, refreshing every ${
          INTERVAL_TIME_MS / 60000
        } minutes.`
      );
    },

    stopSessionKeeper() {
      if (this._sessionKeeperInterval) {
        window.clearInterval(this._sessionKeeperInterval);
        this._sessionKeeperInterval = null;
        console.log("[Keeper] Session keeper stopped.");
      }
    },

    // ----------------------------------------------------
    // Sanctumセッション再確立（IDトークンからSanctumクッキーを再取得）
    // ----------------------------------------------------
    async reEstablishSanctumSession(
      firebaseUser: FirebaseAuthUser
    ): Promise<boolean> {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = this.getApiBaseUrl();
      const { setToken, clearToken } = this._getAuthManager();

      try {
        // IDトークンを強制リフレッシュして取得
        const idToken = await firebaseUser.getIdToken(true);

        console.log(
          "[ReEstablish] Attempting to re-establish Sanctum session via /api/firebase/login..."
        );

        // Laravelのログインエンドポイントを叩いてSanctumセッションを再確立
        // APIパスを '/api/firebase/login' に変更
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

        // 成功した場合、Sanctumクッキーがセットされ、レスポンスが返る
        console.log(
          "[ReEstablish] Sanctum session re-established successfully."
        );

        // 🌟 Pinia state (Sanctum Token)とuserを更新
        this.token = response.token;
        this.user = response.user as User;
        setToken(response.token); // useAuth()を通じてLocalStorageに保存

        // 🌟 トークン設定直後にCSRFクッキーを強制的に再取得し、トークンが確実に適用されるためのワンクッションとする
        await this.getSanctumCsrfToken();

        // fetchUser() の呼び出しを削除します。（ログインAPIがユーザーデータを返却するため）

        return true;
      } catch (error: any) {
        // 500 Internal Server Error など、ログイン失敗として扱う
        console.warn(
          "[ReEstablish] Failed to re-establish Sanctum session. Error:",
          error
        );

        // 失敗した場合、セッションが完全に切れているか、サーバー側で問題が発生している
        this.token = null;
        this.user = null;
        clearToken(); // useAuth()を通じてLocalStorageとPinia Stateをクリア
        this.stopSessionKeeper();
        return false;
      }
    },

    // ----------------------------------------------------
    // 認証状態の初期化ロジック
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
        console.log("[initAuth] Already initializing. Awaiting resolution...");
        await authPromise;
        return;
      }

      this.isInitialized = true;
      this.isLoading = true;
      console.log("[initAuth] Starting authentication state resolution...");

      try {
        const $firebaseAuth = getFirebaseAuth();

        if (!$firebaseAuth) {
          console.warn(
            "[initAuth] Firebase Authインスタンスがnullのため、認証待機をスキップします。"
          );
          return;
        }

        this._authUnsubscribe = onAuthStateChanged(
          $firebaseAuth,
          async (user: FirebaseAuthUser | null) => {
            const { token, clearToken } = this._getAuthManager();

            const wasLoading = this.isLoading;
            try {
              if (user) {
                // Firebaseユーザーがいる

                // Piniaのtoken stateをuseAuthから取得した値で同期
                this.token = token.value;

                // SanctumトークンがLocalStorageに存在しない、またはPinia stateのユーザー情報がない場合のみ再確立を試みる
                if (!token.value || !this.user) {
                  console.log(
                    "[initAuth] Sanctum token or user state missing. Attempting session re-establishment..."
                  );

                  const success = await this.reEstablishSanctumSession(user);
                  if (!success) {
                    // reEstablishSanctumSession内部で状態クリアが行われる
                    return;
                  }
                }

                // 状態が設定された後、メール認証状態を確認
                if (this.isAuthenticated && this.isEmailVerified) {
                  this.startSessionKeeper();
                } else {
                  this.stopSessionKeeper();
                }
              } else {
                // Firebaseユーザーがいない（ログアウト状態）
                this.token = null;
                this.user = null;
                clearToken(); // useAuth()を通じてLocalStorageをクリア
                this.stopSessionKeeper();
              }
            } catch (e) {
              console.warn(
                "[initAuth/onAuthStateChanged] Unexpected error in logic flow, clearing state.",
                e
              );
              this.token = null;
              this.user = null;
              clearToken(); // useAuth()を通じてLocalStorageをクリア
              this.stopSessionKeeper();
            } finally {
              if (wasLoading) {
                this.isLoading = false;
                console.log(
                  "✅ [onAuthStateChanged] Initial resolution finished."
                );
                if (resolveAuthPromise) {
                  resolveAuthPromise();
                  resolveAuthPromise = null;
                  authPromise = null;
                }
              }
            }
          }
        );

        await authPromise;
      } catch (e: any) {
        console.error("[initAuth] Unexpected error during setup:", e);
        this.isLoading = false;
      } finally {
        if (this.isLoading) {
          this.isLoading = false;
          console.log("✅ [initAuth] Fallback: Forcing UI ready.");
          if (resolveAuthPromise) {
            resolveAuthPromise();
            resolveAuthPromise = null;
            authPromise = null;
          }
        }
      }

      console.log("[initAuth] Initial wait finished.");
    },

    // ----------------------------------------------------
    // ログイン処理（セッションキーパーを開始）
    // ----------------------------------------------------
    async login(credentials: any) {
      this.isLoading = true;

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

        // IDトークンを強制リフレッシュせずに取得（ログイン時にリフレッシュされているはずなので）
        const idToken = await firebaseUser.getIdToken();

        console.log("[LOGIN] Sending ID Token to Laravel...");

        // APIパスを '/api/firebase/login' に変更
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

        console.log("[LOGIN] Laravel response received. Updating state.");

        this.token = response.token; // Pinia state (Sanctum Token)
        this.user = response.user as User;
        setToken(response.token); // useAuth()を通じてLocalStorageに保存

        // 🌟 トークン設定後、すぐにCSRFクッキーを強制取得
        // これがトークンをインターセプターに確実に適用させるためのワンクッションとなります
        await this.getSanctumCsrfToken();

        // 登録/ログインAPIが最新のユーザー情報を返しているため、fetchUserの呼び出しを削除

        if (this.isEmailVerified) {
          this.startSessionKeeper();
        } else {
          this.stopSessionKeeper();
        }

        this.isLoading = false;
      } catch (error: any) {
        this.isLoading = false;
        this.stopSessionKeeper();
        console.error("Login Error Catch:", error);
        throw error;
      }
    },

    // ----------------------------------------------------
    // 新規登録処理（クッキーを確実にセット）
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
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();

        console.log("[REGISTER] ID Token retrieved. Sending to Laravel...");

        // APIパスを '/api/firebase/register' に変更
        const response: any = await fetcher("/firebase/register", {
          baseURL: baseUrl,
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          body: {
            id_token: idToken,
            name: data.name,
            email: data.email,
          },
        });

        console.log("[REGISTER] Laravel response received. Updating state.");

        if (!response || !response.token || !response.user) {
          throw new Error(
            "Registration succeeded but failed to receive user authentication data from backend."
          );
        }

        this.token = response.token; // Pinia state (Sanctum Token)
        this.user = response.user as User;
        setToken(response.token); // useAuth()を通じてLocalStorageに保存

        // 🌟 トークン設定後、すぐにCSRFクッキーを強制取得
        // これがトークンをインターセプターに確実に適用させるためのワンクッションとなります
        await this.getSanctumCsrfToken();

        // 登録/ログインAPIが最新のユーザー情報を返しているため、fetchUserの呼び出しを削除

        this.stopSessionKeeper();

        console.log(
          "[REGISTER] Auth store state updated successfully. User is now logged in but REQUIRES email verification."
        );

        this.isLoading = false;
      } catch (error: any) {
        this.isLoading = false;
        this.stopSessionKeeper();
        console.error("Register Error Catch (Final):", error);
        throw error;
      }
    },

    // ----------------------------------------------------
    // メール認証処理 (セッションリフレッシュ処理とキーパー開始を追加)
    // ----------------------------------------------------
    async verifyEmail(url: string) {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const baseUrl = this.getApiBaseUrl();

      const urlObj = new URL(url, "http://dummy.com");
      const queryParams = urlObj.search;

      console.log(
        `[VERIFY] Sending verification request to: /email/verify${queryParams}`
      );

      try {
        // サーバー側のルーティングで/email/verifyがJSONを返すように調整が必要です。
        const verificationResponse: any = await fetcher(
          `/email/verify${queryParams}`,
          {
            baseURL: baseUrl,
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );

        console.log(
          "[VERIFY] Verification successful. Response:",
          verificationResponse
        );

        if (verificationResponse && verificationResponse.user) {
          this.user = verificationResponse.user as User;

          console.log(
            "[VERIFY] Verification successful. Starting session refresh..."
          );

          const $firebaseAuth = getFirebaseAuth();
          if (!$firebaseAuth || !$firebaseAuth.currentUser) {
            console.warn(
              "[VERIFY] Current Firebase user is null. Skipping session refresh."
            );
            return true;
          }

          // セッション再確立を試みる
          const success = await this.reEstablishSanctumSession(
            $firebaseAuth.currentUser
          );

          if (success) {
            console.log(
              "[VERIFY] Session successfully refreshed with Laravel. User is now verified."
            );
            this.startSessionKeeper();
            return true;
          }
        }

        return false;
      } catch (error: any) {
        console.error("[VERIFY ERROR] Email verification failed:", error);

        // リダイレクトではなく、サーバーから403エラーが返ってきた場合
        if (error.statusCode === 403) {
          console.error(
            "Verification failed: Forbidden (Likely invalid/expired signature)."
          );
          throw new Error(
            "メール認証リンクの有効期限が切れているか、無効です。"
          );
        }

        throw error;
      }
    },

    // ----------------------------------------------------
    // ログアウト処理
    // ----------------------------------------------------
    async logout() {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const config = useRuntimeConfig();
      const { clearToken } = this._getAuthManager();

      // ★★★ 追記: Item Storeのインスタンスを取得 ★★★
      const itemStore = useItemStore();

      this.isLoading = true;

      this.stopSessionKeeper();

      // ★★★ 修正: onAuthStateChanged の監視解除を削除 ★★★
      // signOut() が onAuthStateChanged をトリガーし、そこで状態をクリアさせるため、
      // ここで解除すると状態の同期が取れなくなる可能性があります。

      // 1. Firebaseからのサインアウト（クライアント側での認証状態クリア）
      try {
        const $firebaseAuth = getFirebaseAuth();
        if ($firebaseAuth) {
          await signOut($firebaseAuth);
        }
      } catch (e: any) {
        if (
          !e.message.includes("Firebase Auth service is not available") &&
          !e.message.includes("on the server")
        ) {
          console.error("Firebase SignOut failed:", e);
        }
      }

      // 2. LaravelのログアウトAPIを呼び出し（サーバー側でのセッションクリア）
      if (typeof fetcher === "function") {
        try {
          // Sanctumのセッションを確実に削除するため、APIを叩く
          await fetcher("/logout", {
            baseURL: config.public.apiBaseUrl,
            method: "POST",
            credentials: "include",
          });
        } catch (e: any) {
          const status = e.response?.status;

          if (status === 401 || status === 403 || status === 500) {
            console.warn(
              `[LOGOUT] Backend API failed with status ${status}. This is often expected if session is already weak/invalid. Continuing local clear.`
            );
          } else {
            console.error("Logout API failed with unexpected error.", e);
          }
        }
      }

      // 3. ローカルの状態を確実にクリア
      // Firebaseの onAuthStateChanged がトリガーされるまでの保険として、ローカルの状態も即座にクリアします。
      this.token = null;
      this.user = null;
      clearToken(); // useAuth()を通じてLocalStorageをクリア

      // Cookieをクリア（Laravelセッションと古いauth_token）
      useCookie("laravel_session").value = null;
      useCookie("auth_token").value = null; // 念の為、useCookieもクリア

      // ★★★ 追記: 商品ストアのデータをクリアする ★★★
      // useItemStore の $reset() を呼び出します
      itemStore.$reset();

      this.isLoading = false;
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
    // ユーザー情報の読み込み (401/403ハンドリングを修正)
    // ----------------------------------------------------
    async fetchUser(isForce: boolean = false) {
      // ★ $fetch ではなく $api を使用する (プラグインで提供されるカスタムインスタンス)
      const nuxtApp = useNuxtApp() as any;
      const $api = nuxtApp.$api as typeof globalThis.$fetch; // $apiを型付け
      const { token: localToken, clearToken } = this._getAuthManager();
      const config = useRuntimeConfig();

      if (typeof $api !== "function") {
        // SPAなので、$apiが関数でない場合はプラグインの初期化エラーです。
        console.error(
          "FetchUser Error: Custom $api is not available. APIプラグインが正しく読み込まれているか確認してください。"
        );
        return;
      }

      if (!localToken.value) {
        this.user = null;
        this.token = null;
        return;
      }

      // Pinia state の token を更新
      this.token = localToken.value;

      try {
        // $api を使用することで、Authorizationヘッダーの付与がプラグインに任せられる
        const user: User = await $api("/user", {
          baseURL: config.public.apiBaseUrl,
          credentials: "include",
          // skipAutoLogout: true フラグを context に追加
          context: {
            skipAutoLogout: true, // <-- 正しい位置: インターセプターに自動ログアウトをスキップするよう指示
          },
        });

        this.user = user;
        // this.token は既に localToken.value で設定済み
        console.log("[FetchUser] User data loaded successfully.");
      } catch (e: any) {
        const status = e.response?.status;
        const shouldClear = status === 401; // 401: セッション切れはクリア必須
        const shouldMaintain = status === 403; // 403: 権限なし(未認証ポリシー)は状態維持

        if (shouldClear) {
          console.warn(
            `[FetchUser] Received 401 Unauthorized. Clearing local state to force full re-auth.`
          );
          // 401 の場合は、ローカル状態をクリアして、onAuthStateChangedの再実行を促す
          this.token = null;
          this.user = null;
          clearToken(); // useAuth()を通じてLocalStorageをクリア
          this.stopSessionKeeper();
        } else if (shouldMaintain) {
          console.warn(
            `[FetchUser] Received 403 Forbidden (Likely unverified email). Maintaining local state to show prompt.`
          );
          // 403 の場合、ローカル状態を維持し、ログアウトしない。
        } else {
          console.error(
            "[FetchUser] Failed to fetch user with unexpected error.",
            e
          );
          // 予期せぬエラーの場合は安全のためにクリア
          this.token = null;
          this.user = null;
          clearToken(); // useAuth()を通じてLocalStorageをクリア
          this.stopSessionKeeper();
        }

        // fetchUserが失敗した場合でも、例外は再スローしない
        return;
      }
    },
  },



});
