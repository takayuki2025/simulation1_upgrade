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
import axios from "axios";
import { useFirebaseInit } from "@/hooks/useFirebaseInit";
import { useRouter } from "next/navigation";
import { useLaravelSession } from "@/hooks/useLaravelSession";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.withCredentials = true;

// --- 型定義 ---
export interface AuthContextType {
  user: User | null;
  auth: Auth | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  token: string | null;
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

  // Sanctum CSRF Cookieの取得
  const fetchCsrfCookie = useCallback(async () => {
    if (!API_BASE_URL) return;
    try {
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
      console.log("[Sanctum] CSRF cookie fetched");
    } catch (error) {
      console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
    }
  }, []);

  // Laravel セッションチェック API
  const checkLaravelSession = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/check`, {
        withCredentials: true,
      });
      return res.data;
    } catch {
      return { authenticated: false };
    }
  }, []);

  // ★★★ 外部フックの利用 ★★★
  const { laravelAuthenticated, initialCheckComplete, completeLaravelLogin } =
    useLaravelSession(user, auth, checkLaravelSession);

  // Firebase user 変化 → token 更新 のみ
  useEffect(() => {
    if (!auth || !isReady) return;

    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
        } catch {
          setToken(null);
        }
      } else {
        setToken(null);
      }
    });

    return () => unsub();
  }, [auth, isReady]);

  // 初回 CSRF
  useEffect(() => {
    fetchCsrfCookie();
  }, [fetchCsrfCookie]);

  // isAuthenticated の正しい条件
  const isAuthenticated = useMemo(() => {
    return (
      initialCheckComplete &&
      !!user &&
      !user.isAnonymous &&
      laravelAuthenticated === true
    );
  }, [initialCheckComplete, user, laravelAuthenticated]);

  // isLoading の定義をシンプルに
  const isLoading = useMemo(
    () => !isReady || !initialCheckComplete,
    [isReady, initialCheckComplete]
  );

  // Login
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
        password
      );

      // Firebaseログイン成功後、IDトークンを使ってLaravel側にセッションを確立
      const idToken = await userCredential.user.getIdToken();

      const { user: backendUser } = await completeLaravelLogin(idToken, name);

      // ログイン成功時にリダイレクト
      if (!backendUser.email_verified_at) {
        router.push("/email/verify");
      } else {
        router.push("/");
      }
    },
    [auth, fetchCsrfCookie, completeLaravelLogin, router]
  );

  // Logout
  const logout = useCallback(
    async (redirectPath = "/") => {
      if (!auth) return;

      setIsLoggingOut(true);
      try {
        // Laravelセッションを無効化するAPIを叩く処理を追加しても良いが、
        // 今回はFirebaseのsignOutとSanctum Cookieの期限切れに頼る
        await signOut(auth);
        router.push(redirectPath);
      } catch (e) {
        console.error("Logout failed:", e);
      } finally {
        setIsLoggingOut(false);
      }
    },
    [auth, router]
  );

  /**
   * 認証トークンを強制的にリロードする関数
   */
  const reloadAuthToken = useCallback(async () => {
    if (user) {
      console.log("[Firebase] Forcing ID Token refresh...");
      try {
        const idToken = await user.getIdToken(true);
        setToken(idToken);
        // リフレッシュされたトークンでLaravelセッションを再確立
        await completeLaravelLogin(idToken);
      } catch (error) {
        console.error("[Firebase] Failed to refresh ID Token:", error);
        throw error; // 呼び出し元にエラーを再スロー
      }
    } else {
      throw new Error("User not found for token refresh.");
    }
  }, [user, completeLaravelLogin]);

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
        login,
        logout,
        reloadAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
