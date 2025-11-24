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
// Firebaseのインポート
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
} from "firebase/auth";
// axiosのインポート
import axios from "axios";
// プロジェクト内のフック
import { useFirebaseInit } from "@/hooks/useFirebaseInit";
// Next.jsのルーター
import { useRouter } from "next/navigation";

// 環境変数からAPI URLを取得
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ★★★ 修正箇所: AxiosにCookie(クレデンシャル)を常に送信するよう設定 ★★★
axios.defaults.withCredentials = true;

export interface AuthContextType {
  user: User | null;
  auth: Auth | null;
  userId: string | null;
  isAuthenticated: boolean; // 匿名ユーザーは認証済みにしない
  isLoading: boolean; // useFirebaseInitのisReady (!isReady) と連動
  isLoggingOut: boolean;
  token: string | null; // Firebase ID Token
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ★★★ 修正箇所: childrenの型を { children: ReactNode } に修正 ★★★
export function AuthProvider({ children }: { children: ReactNode }) {
  // isReadyがfalseの間、isLoadingはtrueになる (認証初期化待ち)
  const { auth, userId, isReady } = useFirebaseInit();
  const router = useRouter(); // ルーターを使用

  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [token, setToken] = useState<string | null>(null); // トークン状態を追加

  // =======================================================
  // CSRF Cookieの取得ロジック (Sanctum連携に必須)
  // =======================================================
  const fetchCsrfCookie = useCallback(async () => {
    // API_BASE_URLが設定されていない場合はスキップ
    if (!API_BASE_URL) return;

    try {
      // Laravel SanctumがCookieを設定するためのエンドポイントを叩く
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
      console.log("[Sanctum Setup] CSRF Cookie fetched successfully.");
    } catch (error) {
      console.error("[Sanctum Setup] Failed to fetch CSRF cookie:", error);
    }
  }, []);

  // 1. Firebase Auth リスナー（useFirebaseInitに渡したリスナーとは別に、ローカルなuser/token状態を更新するためのもの）
  // ★重要: useFirebaseInitがisReady=trueにした後も、ユーザー情報やトークンはここで最新化される
  useEffect(() => {
    if (!auth) return;

    // useFirebaseInitで既に onAuthStateChanged はセットされているが、
    // ローカルな user/token の状態更新ロジックを here に集約する
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      // ユーザーが存在すれば、IDトークンを取得して状態に保存
      if (currentUser) {
        // IDトークンを強制的にリフレッシュし、最新のものを取得
        currentUser
          .getIdToken(true) // trueを指定してトークンをリフレッシュ
          .then(setToken)
          .catch((e) => {
            console.error("Failed to get ID Token:", e);
            setToken(null);
          });
      } else {
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // 2. ★CSRF Cookieの初期取得
  useEffect(() => {
    // コンポーネントマウント時に一度実行
    if (API_BASE_URL) {
      fetchCsrfCookie();
    }
  }, [fetchCsrfCookie]);

  // 匿名ユーザーはログイン済みとみなさない
  const isAuthenticated = useMemo(() => !!user && !user.isAnonymous, [user]);

  // isReady (Firebase初期化完了) が true になるまで、ローディング状態
  const isLoading = useMemo(() => !isReady, [isReady]);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (!auth) throw new Error("Auth service is unavailable.");

      // ログイン前にCSRF Cookieが最新であることを確認（念のため再実行）
      await fetchCsrfCookie();

      // ログイン成功後、onAuthStateChanged が実行され user/token が更新される
      await signInWithEmailAndPassword(auth, email, password);
    },
    [auth, fetchCsrfCookie]
  );

  const logout = useCallback(
    async (redirectPath = "/") => {
      if (!auth) return;
      setIsLoggingOut(true);
      try {
        await signOut(auth);

        // ログアウト処理後にSanctumセッションを破棄するAPIコールを追加することも検討
        // await axios.post(`${API_BASE_URL}/api/logout`);

        console.log(`Logout successful. Redirect to: ${redirectPath}`);
        // リダイレクト処理
        router.push(redirectPath);
      } catch (err) {
        console.error("Logout Error:", err);
      } finally {
        setIsLoggingOut(false);
      }
    },
    [auth, router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
        userId,
        isAuthenticated,
        isLoading,
        isLoggingOut,
        token, // token
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
