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
import axios from "axios"; // API通信に必要
import { useFirebaseInit } from "@/hooks/useFirebaseInit";
import { useRouter } from "next/navigation";
import { useLaravelSession } from "@/hooks/useLaravelSession"; // Laravelセッション管理の外部フック

// --- 設定 ---
// API_BASE_URL の取得はここで維持
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ★ 修正点: グローバルな axios.defaults.withCredentials = true の設定を削除
// これにより、axiosの設定をより細かく制御できるようになります。
// 代わりに、認証フック内で使用される axios インスタンスまたはカスタムフック内で withCredentials を設定することを推奨します。

// --- 型定義 (変更なし) ---
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

  // --- Laravel/Sanctum 関連のヘルパー関数 ---
  // CSRF Cookieの取得
  const fetchCsrfCookie = useCallback(async () => {
    if (!API_BASE_URL) return;
    try {
      // 修正: withCredentialsを明示的に指定
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      console.log("[Sanctum] CSRF cookie fetched.");
    } catch (error) {
      console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
    }
  }, []);

  // Laravel セッションチェック API
  const checkLaravelSession = useCallback(async () => {
    try {
      // 修正: withCredentialsを明示的に指定
      const res = await axios.get(`${API_BASE_URL}/api/auth/check`, {
        withCredentials: true,
      });
      return res.data;
    } catch {
      return { authenticated: false };
    }
  }, []);

  // ★★★ 外部フックの利用 (変更なし) ★★★
  // user, auth の変化を監視し、Laravel側の認証状態を管理
  const { laravelAuthenticated, initialCheckComplete, completeLaravelLogin } =
    useLaravelSession(user, auth, checkLaravelSession);

  // --- 状態監視 useEffect ---

  // 1. Firebase user 変化 → token 更新
  useEffect(() => {
    if (!auth || !isReady) return;

    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // トークンを取得し、状態を更新
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

  // 2. 初回 CSRF Cookie 取得
  useEffect(() => {
    fetchCsrfCookie();
  }, [fetchCsrfCookie]);

  // --- useMemo で状態を集約 ---

  // isAuthenticated の正しい条件 (変更なし)
  const isAuthenticated = useMemo(() => {
    // Firebaseユーザーが存在し、匿名ユーザーでなく、かつLaravel側でのセッションチェックも完了し認証済みである
    return (
      initialCheckComplete &&
      !!user &&
      !user.isAnonymous &&
      laravelAuthenticated === true
    );
  }, [initialCheckComplete, user, laravelAuthenticated]);

  // isLoading の定義をシンプルに (変更なし)
  const isLoading = useMemo(
    () => !isReady || !initialCheckComplete,
    [isReady, initialCheckComplete]
  );

  // --- 認証アクション ---

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

      // 1. CSRF Cookie を取得 (ログイン前に必ず)
      await fetchCsrfCookie();

      // 2. Firebase ログイン
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 3. IDトークンを取得し、Laravel側にセッションを確立 (completeLaravelLoginはuseLaravelSession由来)
      const idToken = await userCredential.user.getIdToken();
      const { user: backendUser } = await completeLaravelLogin(idToken, name);

      // 4. ログイン後のリダイレクト
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
        // 修正: Laravel側でのログアウトAPIを叩く処理を追加しても良い (Sanctumセッションの即時破棄)
        // ここでは実装せず、FirebaseログアウトとCookie期限切れに依存する既存のロジックを維持
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
   * 認証トークンを強制的にリロードする関数 (変更なし)
   */
  const reloadAuthToken = useCallback(async () => {
    if (user) {
      console.log("[Firebase] Forcing ID Token refresh...");
      try {
        const idToken = await user.getIdToken(true);
        setToken(idToken);
        // リフレッシュされたトークンでLaravelセッションを再確立 (completeLaravelLoginはuseLaravelSession由来)
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
