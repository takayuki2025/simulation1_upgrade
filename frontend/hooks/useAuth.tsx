"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Auth, User, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios, { AxiosInstance } from "axios"; // AxiosInstanceをインポート
import { useFirebaseInit } from "@/hooks/useFirebaseInit";
import { useRouter } from "next/navigation";
import {
  useLaravelSession,
  completeLaravelLogin,
} from "@/hooks/useLaravelSession";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- 型定義 ---
export interface AuthContextType {
  user: User | null;
  auth: Auth | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  token: string | null;
  apiClient: AxiosInstance | null; // ★ 追加: 認証済みAxiosインスタンス
  login: (credentials: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>;
  reloadAuthToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// --- Auth Provider コンポーネント ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, userId, isReady } = useFirebaseInit();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- Laravel/Sanctum 関連のヘルパー関数 ---
  const fetchCsrfCookie = useCallback(async () => {
    if (!API_BASE_URL) return;
    try {
      // Axiosのグローバル設定が withCredentials=true であることを保証
      axios.defaults.withCredentials = true;
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
      console.log("[Sanctum] CSRF cookie fetched.");
    } catch (error) {
      console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
    }
  }, []);

  const checkLaravelSession = useCallback(async () => {
    try {
      // グローバルAxiosを使用してセッションチェック（Authorizationヘッダーは不要）
      const res = await axios.get(`${API_BASE_URL}/api/auth/check`);
      return res.data;
    } catch {
      return { authenticated: false };
    }
  }, []);
  // --------------------------------------------------

  // 外部フックの利用
  const { laravelAuthenticated, initialCheckComplete } = useLaravelSession(
    user,
    auth,
    checkLaravelSession
  );

  // --- 状態監視 useEffect ---

  // 1. Firebase user 変化 → token 更新
  useEffect(() => {
    if (!auth || !isReady) return;

    // onAuthStateChangedはコンポーネントがマウントされている限りアクティブ
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // トークン取得を試行
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
        } catch (error) {
          console.error("[Firebase] Failed to get ID Token:", error);
          setToken(null);
        }
      } else {
        setToken(null);
      }
    });

    return () => unsub();
  }, [auth, isReady]);

  // 2. 初回 CSRF Cookie 取得 (リロード時にセッション確立のために必要)
  useEffect(() => {
    // 💡 リロード時にすぐ実行されるように、このフックは残します。
    fetchCsrfCookie();
  }, [fetchCsrfCookie]);

  // 3. 🚨 削除: グローバルな axios.defaults の設定は削除し、カスタムインスタンスに移行します。
  // 以前のロジック:
  /*
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log("[Axios Config] Set Authorization header with new token.");
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log("[Axios Config] Cleared Authorization header.");
    }
  }, [token]);
  */

  // 4. グローバルな withCredentials 設定は CSRF 取得時に移し、ここでは削除
  // 以前のロジック:
  /*
  useEffect(() => {
      axios.defaults.withCredentials = true;
  }, []);
  */

  // --- カスタム Axios インスタンスの生成 ---
  const apiClient = useMemo(() => {
    if (!token) {
      console.log("[API Client] Token is missing. Returning null client.");
      return null;
    }

    console.log(
      "[API Client] Creating new Axios instance with Authorization header."
    );

    // ★ トークンが存在するときのみカスタムインスタンスを生成
    const instance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return instance;
  }, [token]);

  // --- useMemo で状態を集約 (省略) ---

  const isAuthenticated = useMemo(() => {
    const isAuth =
      initialCheckComplete &&
      !!user &&
      !user.isAnonymous &&
      laravelAuthenticated === true;
    console.log(
      `[AUTH STATE] isAuthenticated computed: ${isAuth}. (initialCheckComplete: ${initialCheckComplete}, laravelAuthenticated: ${laravelAuthenticated}, user present: ${!!user})`
    );
    return isAuth;
  }, [initialCheckComplete, user, laravelAuthenticated]);

  const isLoading = useMemo(() => {
    const loading = !isReady || !initialCheckComplete;
    console.log(
      `[AUTH STATE] isLoading computed: ${loading}. (isReady: ${isReady}, initialCheckComplete: ${initialCheckComplete})`
    );
    return loading;
  }, [isReady, initialCheckComplete]);

  // --- 認証アクション (省略) ---

  // Login (省略)
  const login = useCallback(
    async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => {
      if (!auth) throw new Error("Auth service unavailable.");

      // 1. CSRF Cookie を取得 (ログイン前に必ず)
      await fetchCsrfCookie();

      // 2. Firebase ログイン
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("[Firebase] Sign-in successful. Proceeding to Sanctum...");

      // 3. IDトークンを取得し、Laravel側にセッションを確立
      const idToken = await userCredential.user.getIdToken();

      // ★ トークンを即座にステートに設定
      setToken(idToken);

      // ログインリクエストはトークンを設定した後に行う
      const { user: backendUser } = await completeLaravelLogin(idToken, name);

      // 4. メール認証が必要な場合のみリダイレクト
      if (!backendUser.email_verified_at) {
        router.push("/email/verify");
      }
      // 成功時 (メール認証不要) は、LoginPage.tsxがリダイレクトを制御する
    },
    [auth, fetchCsrfCookie, router]
  );

  // Logout (省略)
  const logout = useCallback(
    async (redirectPath = "/") => {
      if (!auth) return;

      setIsLoggingOut(true);
      try {
        // Laravel側セッションの破棄（明示的なAPIコールが最善だが、ここではFirebase側のみ）
        // Firebaseからのサインアウト
        await signOut(auth);

        // トークンをクリア
        setToken(null);

        router.push(redirectPath);
      } catch (e) {
        console.error("Logout failed:", e);
      } finally {
        setIsLoggingOut(false);
      }
    },
    [auth, router]
  );

  // reloadAuthToken (省略)
  const reloadAuthToken = useCallback(async () => {
    if (user) {
      console.log("[Firebase] Forcing ID Token refresh...");
      try {
        const idToken = await user.getIdToken(true);
        setToken(idToken); // ステート更新により、apiClientが再生成される
        // リフレッシュされたトークンでLaravelセッションを再確立
        await completeLaravelLogin(idToken);
      } catch (error) {
        console.error("[Firebase] Failed to refresh ID Token:", error);
        throw error;
      }
    } else {
      throw new Error("User not found for token refresh.");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
        userId,
        isAuthenticated,
        isLoading,
        isLoggingOut,
        token,
        apiClient, // ★ カスタムインスタンスを提供
        login,
        logout,
        reloadAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// アプリケーション内の他の場所で認証済みAxiosクライアントを使用するためのカスタムフック
export const useApiClient = () => {
  const ctx = useContext(AuthContext);
  if (!ctx || !ctx.apiClient) {
    // 認証情報がないか、認証済みクライアントがまだ準備できていない（トークンがない）
    // このエラーは、認証が必要なページで api が null の場合に発生します。
    // その場合、ページ側で isLoading や isAuthenticated をチェックする必要があります。
    // ★ 認証なしでもアクセスできるAPIにはグローバルAxiosを使用し、
    // 認証が必要なAPIには apiClient を使用するようにフロントエンドのコードを修正する必要があります。
    throw new Error(
      "Authenticated API client is not available. Ensure you are within AuthProvider and the user is authenticated."
    );
  }
  return ctx.apiClient;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  // apiClient を提供する useAuth フック（既存のものを保持）
  return ctx;
};
