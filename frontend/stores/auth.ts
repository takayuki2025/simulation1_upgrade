import { defineStore } from "pinia";
import { useCookie, useRuntimeConfig, useNuxtApp } from "#app";
// Firebaseのインポート
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  Auth,
  onAuthStateChanged,
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
  token: string | null;
  user: User | null;
  isInitialized: boolean; // initAuthが呼ばれたかどうか
  isLoading: boolean; // 認証状態解決中かどうか (true の間、画面がブロックされる)
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

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    user: null,
    isInitialized: false, // 新しいフラグ: initAuthが実行されたか
    isLoading: true, // 認証状態の解決が完了するまでtrue
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    // 認証状態の解決が完了しているか（画面描画の準備完了）
    isAuthResolved: (state) => !state.isLoading,
  },

  actions: {
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
          console.log(`[API Base] SSR (to PHP-FPM): ${finalPhpBaseUrl}`);
          return finalPhpBaseUrl;
        } catch (e) {
          console.error(
            "[API Base] Failed to parse API Base URL for SSR. Using original.",
            e
          );
          return originalBaseUrl.replace(/\/api$/, "") + ":9000/api";
        }
      }

      console.log(`[API Base] Client (to Nginx): ${originalBaseUrl}`);
      return originalBaseUrl;
    },

    // ----------------------------------------------------
    // ヘルパー関数: Firebase Authインスタンスを安全に取得する（変更なし）
    // ----------------------------------------------------
    async waitForFirebaseAuth(): Promise<Auth> {
      for (let i = 0; i < 100; i++) {
        const nuxtApp = useNuxtApp() as any;
        const $firebaseAuth = nuxtApp.$firebaseAuth as Auth | undefined;

        if ($firebaseAuth) {
          return $firebaseAuth;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.error("Firebase Auth instance not available after waiting.");
      const error = new Error("Firebase service not ready after timeout.");
      error.name = "FirebaseTimeoutError";
      throw error;
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
    // 【重要修正箇所】認証状態の初期化ロジック
    // LaravelのfetchUserを非同期化し、isLoadingの解放を高速化します。
    // ----------------------------------------------------
    async initAuth() {
      // isInitialized で二重実行を防ぐ
      if (this.isInitialized) return;
      this.isInitialized = true; // 初回実行をマーク

      console.log(
        "[initAuth] Starting authentication state resolution (Fast path)..."
      );

      let $firebaseAuth: Auth;
      try {
        $firebaseAuth = await this.waitForFirebaseAuth();
      } catch (e) {
        console.error(
          "Firebase Authの準備に失敗しました。認証初期化をスキップします。",
          e
        );
        this.isLoading = false; // エラーでも解決済みとしてマーク
        return;
      }

      const tokenCookie = useCookie("auth_token");

      onAuthStateChanged($firebaseAuth, async (user) => {
        console.log(
          `[onAuthStateChanged] State changed. Firebase User: ${
            user ? user.uid : "null"
          }`
        );

        // ----------------------------------------------------------
        // ステップ 1: 認証状態に関わらず、isLoadingを即座にfalseにする
        // これにより、waitForAuthResolved() はすぐに解決され、画面のブロックが解除される
        // ----------------------------------------------------------
        if (this.isLoading) {
          this.isLoading = false;
          console.log(
            `[initAuth] Resolution finished (Fast path). LoggedIn Check State: ${!!tokenCookie.value}`
          );
        }

        // 既に解決済みであれば、ユーザー状態の更新のみ行う
        if (!user) {
          this.token = null;
          this.user = null;
          tokenCookie.value = null;
          return;
        }

        // ----------------------------------------------------------
        // ステップ 2: Sanctumセッションチェック (遅い処理) を非同期で実行
        // await を削除することで、isLoading の解放をブロックしないようにする
        // ----------------------------------------------------------
        if (user && tokenCookie.value) {
          // fetchUserの完了を待たずに、次の処理に進む（非同期実行）
          this.fetchUser().catch((e) => {
            console.warn(
              "[initAuth/onAuthStateChanged] Async fetchUser failed after fast resolution.",
              e
            );
            // fetchUser自体が失敗時にstateをクリアするため、ここでは何もしない
          });
        } else {
          // FirebaseユーザーはいるがCookieがない場合（通常は発生しない）
          this.token = null;
          this.user = null;
          tokenCookie.value = null;
        }
      });
    },

    // ----------------------------------------------------
    // 【修正箇所】認証解決を安全に待機するアクション (ポーリング回数を元に戻す)
    // ----------------------------------------------------
    async waitForAuthResolved(): Promise<void> {
      // isAuthResolved が true になるまでポーリング
      if (this.isAuthResolved) {
        return;
      }

      console.log("[waitForAuthResolved] Awaiting auth resolution...");

      // 最大10秒待機 (100回 * 100ms) - ブロッキング処理がなくなったため、10秒で十分
      const maxIterations = 100;

      for (let i = 0; i < maxIterations; i++) {
        if (this.isAuthResolved) {
          console.log("[waitForAuthResolved] Auth resolved.");
          return;
        }
        // イベントループをブロックしないように100ms待機
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.warn(
        "[waitForAuthResolved] Timeout waiting for auth resolution."
      );
      // タイムアウトしても処理を進めます
    },

    // ----------------------------------------------------
    // ログイン処理（変更なし）
    // ----------------------------------------------------
    async login(credentials: any) {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const $firebaseAuth = await this.waitForFirebaseAuth();
      const baseUrl = this.getApiBaseUrl();

      if (typeof fetcher !== "function") {
        console.error("Login Error: Global $fetch is not available.");
        throw new Error("API communication function ($fetch) is not ready.");
      }

      try {
        const userCredential = await signInWithEmailAndPassword(
          $firebaseAuth,
          credentials.email,
          credentials.password
        );
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();

        console.log("[LOGIN] Sending ID Token to Laravel...");

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

        this.token = response.token;
        this.user = response.user as User;

        const tokenCookie = useCookie("auth_token");
        tokenCookie.value = response.token;

        // ログイン成功時にisLoadingをfalseにすることで、画面が切り替わる
        this.isLoading = false;
      } catch (error: any) {
        if (error.name === "FirebaseTimeoutError") {
          console.error(
            "Login Error: Firebase service failed to initialize within 10 seconds."
          );
          throw error;
        }

        console.error("Login Error Catch:", error);
        throw error;
      }
    },

    // ----------------------------------------------------
    // 新規登録処理（変更なし）
    // ----------------------------------------------------
    async register(data: RegisterForm) {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const $firebaseAuth = await this.waitForFirebaseAuth();
      const baseUrl = this.getApiBaseUrl();

      if (typeof fetcher !== "function") {
        console.error("Register Error: Global $fetch is not available.");
        throw new Error("API communication function ($fetch) is not ready.");
      }

      try {
        console.log("[REGISTER] Starting Firebase user creation...");
        const userCredential = await createUserWithEmailAndPassword(
          $firebaseAuth,
          data.email,
          data.password
        );
        const firebaseUser = userCredential.user;
        console.log(`[REGISTER] Firebase user created: ${firebaseUser.uid}`);
        const idToken = await firebaseUser.getIdToken();
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

        this.token = response.token;
        this.user = response.user as User;
        const tokenCookie = useCookie("auth_token");
        tokenCookie.value = response.token;

        // 登録成功時にisLoadingをfalseにすることで、画面が切り替わる
        this.isLoading = false;

        console.log(
          "[REGISTER] Auth store state updated successfully. Action finished."
        );
      } catch (error: any) {
        if (error.name === "FirebaseTimeoutError") {
          console.error(
            "Register Error: Firebase service failed to initialize within 10 seconds."
          );
          throw error;
        }

        console.error("Register Error Catch (Final):", error);
        throw error;
      }
    },

    // ----------------------------------------------------
    // メール認証処理（変更なし）
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
        const response: any = await fetcher(`/email/verify${queryParams}`, {
          baseURL: baseUrl,
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        console.log("[VERIFY] Verification successful. Response:", response);

        if (response && response.user) {
          this.user = response.user as User;
          return true;
        }

        return false;
      } catch (error: any) {
        console.error("[VERIFY ERROR] Email verification failed:", error);

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
    // ログアウト処理（変更なし）
    // ----------------------------------------------------
    async logout() {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const $firebaseAuth = await this.waitForFirebaseAuth();
      const config = useRuntimeConfig();

      if (typeof fetcher !== "function") {
        console.error("Logout Error: Global $fetch is not available.");
      }

      try {
        await signOut($firebaseAuth);
        console.log("[LOGOUT] Firebase signed out.");
      } catch (e) {
        console.error("Firebase SignOut failed:", e);
      }

      if (typeof fetcher === "function") {
        try {
          await fetcher("/logout", {
            baseURL: config.public.apiBaseUrl,
            method: "POST",
            credentials: "include",
          });
          console.log("[LOGOUT] Laravel session destroyed.");
        } catch (e) {
          console.error("Logout API failed, but clearing local state.", e);
        }
      }

      this.token = null;
      this.user = null;
      const tokenCookie = useCookie("auth_token");
      tokenCookie.value = null;
    },

    // ----------------------------------------------------
    // ユーザー情報の読み込み (変更なし)
    // ----------------------------------------------------
    async fetchUser() {
      const fetcher = globalThis.$fetch as typeof globalThis.fetch;
      const tokenCookie = useCookie("auth_token");
      const config = useRuntimeConfig();

      if (typeof fetcher !== "function") {
        console.error("FetchUser Error: Global $fetch is not available.");
        return;
      }

      if (!tokenCookie.value) {
        this.user = null;
        this.token = null;
        return;
      }

      try {
        const user: User = await fetcher("/user", {
          baseURL: config.public.apiBaseUrl,
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        this.user = user;
        this.token = tokenCookie.value;
        console.log("[FetchUser] User data loaded successfully.");
      } catch (e) {
        console.error(
          "[FetchUser] Failed to fetch user. Logging out locally.",
          e
        );
        this.token = null;
        this.user = null;
        tokenCookie.value = null;
      }
    },
  },
});
