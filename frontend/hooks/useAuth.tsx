"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from "react";
// Firebase Authの主要なインポート
import {
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// AxiosとAxiosInterceptorのための型インポート
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// 💡 依存関係: Firebase初期化とLaravelセッション関連のヘルパー
import { useFirebaseInit } from "@/hooks/useFirebaseInit";
import {
  useLaravelSession,
  completeLaravelLogin,
  BackendUser,
  checkLaravelSession,
} from "@/hooks/useLaravelSession";

import { useRouter, usePathname } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// I. 型定義とContextの初期化
// =======================================================

type ReloadResult = BackendUser & { token: string };

/**
 * 💡 AuthContextで提供される全ての状態、関数、オブジェクトの型定義。
 */
export interface AuthContextType {
  user: FirebaseUser | null;
  auth: Auth | null;
  userId: string | null;
  backendUser: BackendUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  token: string | null;
  apiClient: AxiosInstance | null;
  login: (credentials: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>; // 💡 該当プロパティ
  reloadAuthToken: () => Promise<ReloadResult>;
  setBackendUserStatus: (user: BackendUser | null) => void;
}

// 🚨 修正箇所: createContextの初期値として、AuthContextTypeの全プロパティを実装したダミーオブジェクトを提供します。
const initialAuthContext: AuthContextType = {
  user: null,
  auth: null,
  userId: null,
  backendUser: null,
  isAuthenticated: false,
  isLoading: true, // 初期ロード中はtrue
  isLoggingOut: false,
  token: null,
  apiClient: null,
  // 💡 関数プロパティのダミー実装
  login: () => Promise.reject("Context not initialized"),
  logout: () => Promise.reject("Context not initialized"), // 💡 エラー解消のため実装
  reloadAuthToken: () => Promise.reject("Context not initialized"),
  setBackendUserStatus: () => {},
};

// 💡 Contextの初期化を AuthContextType の非Nullable型で行う
const AuthContext = createContext<AuthContextType>(initialAuthContext);

// =======================================================
// II. Auth Provider コンポーネント
// =======================================================

/**
 * 💡 認証状態管理の中心となるプロバイダー (Higher-Order Component)
 * 責務: 認証フローの実行、状態の保持、クライアントの状態管理を一元化する。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, userId, isReady } = useFirebaseInit();
  const router = useRouter();
  const pathname = usePathname();

  // --- Core State ---
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [isBackendUserLoading, setIsBackendUserLoading] = useState(false);

  // --- Laravel Session State (統合管理) ---
  const [laravelAuthenticated, setLaravelAuthenticated] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // --- トークンリフレッシュ/キューイングのためのRef (Interceptorの排他制御) ---
  const refreshPromiseRef = useRef<Promise<ReloadResult> | null>(null);
  const failedQueueRef = useRef<
    Array<{
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      originalRequest: InternalAxiosRequestConfig;
    }>
  >([]);

  // --- useLaravelSession の利用 (状態監視のヘルパー) ---
  useLaravelSession(
    user,
    auth,
    checkLaravelSession,
    setLaravelAuthenticated,
    setInitialCheckComplete,
  );

  // --- B. 認証アクション定義 ---

  /**
   * 💡 CSRF Cookieの取得。Sanctum認証に必要な前提処理。
   */
  const fetchCsrfCookie = useCallback(async () => {
    if (!API_BASE_URL) return;
    try {
      axios.defaults.withCredentials = true;
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
    } catch (error) {
      console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
    }
  }, []);

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
        // ログアウト時はLaravel認証状態もリセット
        setLaravelAuthenticated(false);
        setInitialCheckComplete(true);

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
   * 💡 認証トークン失効時（401エラー時）のリカバリーロジック。
   */
  const reloadAuthToken = useCallback(async () => {
    if (user) {
      try {
        // Firebase ID Token を強制的にリフレッシュ
        const idToken = await user.getIdToken(true);
        setToken(idToken);

        // 💡 トークン交換: 新しいID Tokenを使ってLaravelセッションを更新し、新しいSanctumトークンを取得
        const { token: newToken, user: refreshedBackendUser } =
          await completeLaravelLogin(idToken);

        setBackendUser(refreshedBackendUser);

        return { ...refreshedBackendUser, token: newToken }; // 新しいSanctumトークンを返す
      } catch (error) {
        console.error("[Firebase] Failed to refresh ID Token:", error);
        throw error;
      }
    } else {
      throw new Error("User not found for token refresh.");
    }
  }, [user]);

  /**
   * 💡 ログイン処理の核。Firebase認証 -> Laravelセッション確立を一連で実行する。
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
      // 1. Firebase 認証を実行
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      setToken(idToken); // 一旦ID Tokenをセット

      // 2. Laravel側でSanctumセッションを確立 (ID Token -> Sanctum Tokenへの交換)
      const { user: newBackendUser, token: newToken } =
        await completeLaravelLogin(idToken, name);
      setBackendUser(newBackendUser);
      setToken(newToken); // 確実にAPIで使用するSanctumトークンをセット

      // 3. 認証状態を確定
      setLaravelAuthenticated(true);
      setInitialCheckComplete(true);

      // 4. リダイレクト
      if (!newBackendUser.email_verified_at) {
        router.push("/email/verify");
      } else {
        router.push("/");
      }
    },
    [auth, fetchCsrfCookie, router],
  );

  // --- C. 状態監視と同期 (useEffect) ---

  /**
   * 責務 1: Firebaseの認証状態変更の監視 (`onAuthStateChanged`)
   */
  useEffect(() => {
    if (!auth || !isReady) return;

    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setIsBackendUserLoading(true);
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);

          if (idToken) {
            try {
              // 💡 認証の核（リロード時）: ID Tokenを使ってLaravelセッションを確立し直す
              const { user: newBackendUser, token: newToken } =
                await completeLaravelLogin(idToken);
              setBackendUser(newBackendUser);
              setToken(newToken); // 新しいSanctumトークンをセット

              // ★★★ 状態の最終確定 ★★★
              setLaravelAuthenticated(true);
              setInitialCheckComplete(true);
            } catch (profileError) {
              console.error(
                "[Profile] Critical: Failed to load backend profile. Initiating logout.",
                profileError,
              );
              await logout();
            }
          }
        } catch (error) {
          console.error(
            "[Firebase] Failed to get ID Token. Initiating logout.",
            error,
          );
          await logout();
        } finally {
          setIsBackendUserLoading(false);
        }
      } else {
        // ログアウト時
        setToken(null);
        setBackendUser(null);
        setLaravelAuthenticated(false);
        setInitialCheckComplete(true);
      }
    });

    return () => unsub();
  }, [auth, isReady, logout]);

  /**
   * 責務 2: CSRF Cookieの初期取得
   */
  useEffect(() => {
    fetchCsrfCookie();
  }, [fetchCsrfCookie]);

  /**
   * 責務 3: メール認証後のリダイレクト処理
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const queryParams = new URLSearchParams(window.location.search);
    const newToken = queryParams.get("token");
    const isVerifiedRedirect = queryParams.get("verified") === "true";

    if (newToken && isVerifiedRedirect) {
      router.replace(pathname, { scroll: false });
    }
  }, [pathname, router]);

  // --- D. apiClient の生成と Interceptor の実装（核心部分） ---

  /**
   * 💡 Axios Interceptorの実装とAPI Clientの生成。
   */
  const apiClient = useMemo(() => {
    if (!token) {
      return null;
    }

    const instance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // Sanctumトークンを付与
        Accept: "application/json",
      },
    });

    // キュー内のリクエストを処理するヘルパー関数
    const processQueue = (
      error: any | null,
      newToken: string | null = null,
    ) => {
      failedQueueRef.current.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else if (newToken && prom.originalRequest.headers) {
          prom.originalRequest.headers.Authorization = `Bearer ${newToken}`;
          prom.resolve(instance(prom.originalRequest));
        }
      });
      failedQueueRef.current = [];
    };

    // Axios Interceptor の実装
    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // 401エラー（未認証/トークン切れ）で、かつリトライされていないリクエストの場合
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          if (!refreshPromiseRef.current) {
            // 💡 ロック取得: トークンリフレッシュを開始
            refreshPromiseRef.current = reloadAuthToken();

            try {
              const { token: newToken } = await refreshPromiseRef.current;
              processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              refreshPromiseRef.current = null;
              return instance(originalRequest);
            } catch (refreshError) {
              // リフレッシュ失敗時はキューを失敗させ、ログアウト
              processQueue(refreshError, null);
              refreshPromiseRef.current = null;
              await logout();
              return Promise.reject(refreshError);
            }
          } else {
            // 💡 リフレッシュ処理が進行中の場合、このリクエストをキューに追加
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({ resolve, reject, originalRequest });
            });
          }
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [token, logout, reloadAuthToken]);

  const setBackendUserStatus = useCallback((user: BackendUser | null) => {
    setBackendUser(user);
  }, []);

  // --- E. 状態の計算 (useMemo) ---

  /**
   * 💡 最終的な認証状態の計算。
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
   * 💡 ローディング状態の計算。
   */
  const isLoading = useMemo(() => {
    const loading = !isReady || !initialCheckComplete || isBackendUserLoading;
    return loading;
  }, [isReady, initialCheckComplete, isBackendUserLoading]);

  // --- F. Context Provider ---

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

/**
 * 💡 Contextデータ全体にアクセスするためのカスタムフック。
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  // 💡 initialAuthContext を初期値にしたため、null チェックは必須ではありませんが、安全のため残すこともできます。
  // if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/**
 * 💡 認証済みAPIクライアント (apiClient) のみにアクセスするためのカスタムフック。
 */
export const useApiClient = () => {
  const ctx = useContext(AuthContext);

  // 💡 Contextが初期化されていることは保証されるため、ここで ctx が null かどうかはチェックしません。

  if (!ctx.apiClient) {
    throw new Error(
      "Authenticated API client is not available. Check if the user is authenticated and loading is complete.",
    );
  }
  return ctx.apiClient;
};
