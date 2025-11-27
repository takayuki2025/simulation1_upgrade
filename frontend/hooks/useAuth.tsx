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
// 認証ロジックのコア: Firebase Authentication SDK
import { Auth, User, signInWithEmailAndPassword, signOut } from "firebase/auth";
// ネットワーク通信ライブラリ: Axios
import axios, { AxiosInstance } from "axios";
// 外部の依存フック (Firebase初期化と設定)
import { useFirebaseInit } from "@/hooks/useFirebaseInit";
// Next.jsのルーター (リダイレクト処理に利用)
import { useRouter } from "next/navigation";
// 外部の依存フック (Laravelセッション管理ロジック)
import {
  useLaravelSession,
  completeLaravelLogin,
} from "@/hooks/useLaravelSession";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// I. 型定義とContextの初期化
// =======================================================

/**
 * ★重要: useLaravelSession.ts の BackendUser と同一である必要があります
 */
interface BackendUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  // ... その他のユーザープロパティ ...
}

export interface AuthContextType {
  user: User | null;
  auth: Auth | null;
  userId: string | null;
  backendUser: BackendUser | null; // Laravelから取得した完全なユーザーデータ
  isAuthenticated: boolean;
  isLoading: boolean; // Firebase, Laravelセッション, BackendUserロードの全てを含む
  isLoggingOut: boolean;
  token: string | null;
  apiClient: AxiosInstance | null;
  login: (credentials: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;

  // 💡 修正: 戻り値を Promise<void> から Promise<BackendUser> に変更
  logout: (redirectPath?: string) => Promise<void>;
  reloadAuthToken: () => Promise<BackendUser>;

  // ★追加: 外部から backendUser を更新するための関数
  setBackendUserStatus: (user: BackendUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// =======================================================
// II. Auth Provider コンポーネント (状態管理のコア)
// =======================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, userId, isReady } = useFirebaseInit();
  const router = useRouter();

  // 内部状態
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  // Laravelユーザーのロード状態をトラッキング
  const [isBackendUserLoading, setIsBackendUserLoading] = useState(false);

  // --- A. Laravel/Sanctum 連携ヘルパー (変更なし) ---
  const fetchCsrfCookie = useCallback(async () => {
    if (!API_BASE_URL) return;
    try {
      axios.defaults.withCredentials = true;
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
    } catch (error) {
      console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
    }
  }, []);

  const checkLaravelSession = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/check`);
      return res.data;
    } catch {
      return { authenticated: false };
    }
  }, []);

  const { laravelAuthenticated, initialCheckComplete } = useLaravelSession(
    user,
    auth,
    checkLaravelSession,
  );

  // --- B. 状態監視と同期 (useEffect) ---

  /**
   * 責務 1: Firebaseの認証状態変更の監視とBackendUserのロード
   */
  useEffect(() => {
    if (!auth || !isReady) return;

    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setIsBackendUserLoading(true); // ★ロード開始
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);

          // IDトークンがあれば、Laravelからプロフィールをロード
          if (idToken) {
            try {
              // LaravelのプロフィールAPIを叩き、最新のユーザー情報を取得
              const profileRes = await axios.get(
                `${API_BASE_URL}/api/mypage/profile`,
                { headers: { Authorization: `Bearer ${idToken}` } },
              );
              // 型アサーションは、useLaravelSession.ts の BackendUser 型と一致しているため安全
              setBackendUser(profileRes.data.user as BackendUser);
            } catch (profileError) {
              console.warn(
                "[Profile] Failed to load backend user profile:",
                profileError,
              );
              setBackendUser(null);
            }
          }
        } catch (error) {
          console.error("[Firebase] Failed to get ID Token:", error);
          setToken(null);
          setBackendUser(null);
        } finally {
          setIsBackendUserLoading(false); // ★ロード完了
        }
      } else {
        setToken(null);
        setBackendUser(null);
      }
    });

    return () => unsub();
  }, [auth, isReady]);

  /**
   * 責務 2 & 3: CSRF Cookieの初回取得と apiClient の生成 (変更なし)
   */
  useEffect(() => {
    fetchCsrfCookie();
  }, [fetchCsrfCookie]);

  const apiClient = useMemo(() => {
    if (!token) {
      return null;
    }
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

  // ★外部公開用の setBackendUser ラッパー関数 (メール認証後の即時更新用)
  const setBackendUserStatus = useCallback((user: BackendUser | null) => {
    setBackendUser(user);
  }, []);

  // --- C. 状態の計算 (useMemo) ---

  /**
   * 💡 最終的な認証状態の計算 (二重認証チェック)
   */
  const isAuthenticated = useMemo(() => {
    const isAuth =
      initialCheckComplete &&
      !!user &&
      !user.isAnonymous &&
      laravelAuthenticated === true;
    return isAuth;
  }, [initialCheckComplete, user, laravelAuthenticated]);

  /**
   * 💡 ローディング状態の計算 (BackendUserのロードまで待つ)
   */
  const isLoading = useMemo(() => {
    const loading = !isReady || !initialCheckComplete || isBackendUserLoading;
    return loading;
  }, [isReady, initialCheckComplete, isBackendUserLoading]);

  // --- D. 認証アクション ---

  /**
   * 💡 ログイン処理のオーケストレーション
   */
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

      await fetchCsrfCookie();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      setToken(idToken);

      // Laravel側で認証セッションを確立し、ユーザー情報を取得
      const { user: newBackendUser } = await completeLaravelLogin(
        idToken,
        name,
      );

      setBackendUser(newBackendUser);

      if (!newBackendUser.email_verified_at) {
        router.push("/email/verify");
      }
    },
    [auth, fetchCsrfCookie, router],
  );

  /**
   * 💡 ログアウト処理
   */
  const logout = useCallback(
    async (redirectPath = "/") => {
      if (!auth) return;

      setIsLoggingOut(true);
      try {
        await signOut(auth);

        setToken(null);
        setUser(null);
        setBackendUser(null);

        router.push(redirectPath);
      } catch (e) {
        console.error("Logout failed:", e);
      } finally {
        setIsLoggingOut(false);
      }
    },
    [auth, router],
  );

  /**
   * 💡 トークン失効時のリカバリー
   * BackendUserの最新情報を返す
   */
  const reloadAuthToken = useCallback(async () => {
    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        setToken(idToken);

        // Laravelセッションも更新し、ユーザー情報を取得
        const { user: refreshedBackendUser } =
          await completeLaravelLogin(idToken);

        setBackendUser(refreshedBackendUser);
        // 💡 修正点: BackendUser型の値を返す
        return refreshedBackendUser as BackendUser;
      } catch (error) {
        console.error("[Firebase] Failed to refresh ID Token:", error);
        throw error;
      }
    } else {
      throw new Error("User not found for token refresh.");
    }
  }, [user]);

  // --- E. Context Provider ---

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
        userId,
        backendUser,
        isAuthenticated,
        isLoading,
        isLoggingOut,
        token,
        apiClient,
        login,
        logout,
        reloadAuthToken,
        setBackendUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =======================================================
// III. カスタムフック (Consumer)
// =======================================================

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useApiClient = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useApiClient must be used within AuthProvider");
  }

  if (!ctx.apiClient) {
    throw new Error(
      "Authenticated API client is not available. Check if the user is authenticated and loading is complete.",
    );
  }
  return ctx.apiClient;
};
