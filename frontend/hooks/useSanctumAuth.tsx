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
// 認証ロジックのコア: Firebase Authentication SDK
import {
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// ネットワーク通信ライブラリ: Axios
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
// 外部の依存フック (Firebase初期化と設定)
// 💡 実際のパスに修正してください
import { useFirebaseInit } from "./useFirebaseInit";
// Next.jsのルーター (リダイレクト処理に利用)
import { useRouter, usePathname } from "next/navigation";
// 外部の依存フック (Laravelセッション管理ロジック)
// 💡 実際のパスに修正してください
import {
  useLaravelSession,
  completeLaravelLogin,
  BackendUser,
} from "./useLaravelSession";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// I. 型定義とContextの初期化
// =======================================================

type ReloadResult = BackendUser & { token: string };

interface CheckSessionResult {
  authenticated: boolean;
  user?: BackendUser;
  message?: string;
  status_code_override?: number;
}

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
  logout: (redirectPath?: string) => Promise<void>;
  reloadAuthToken: () => Promise<ReloadResult>;
  setBackendUserStatus: (user: BackendUser | null) => void;
  initialCheckComplete: boolean;
}

const initialAuthContext: AuthContextType = {
  user: null,
  auth: null,
  userId: null,
  backendUser: null,
  isAuthenticated: false,
  isLoading: true,
  isLoggingOut: false,
  token: null,
  apiClient: null,
  login: () => Promise.reject("Context not initialized"),
  logout: () => Promise.reject("Context not initialized"),
  reloadAuthToken: () => Promise.reject("Context not initialized"),
  setBackendUserStatus: () => {},
  initialCheckComplete: false,
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

// =======================================================
// II. Auth Provider コンポーネント
// =======================================================

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

  // --- Laravel Session State ---
  const [laravelAuthenticated, setLaravelAuthenticated] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // --- Interceptor 制御のための Ref ---
  const refreshPromiseRef = useRef<Promise<ReloadResult> | null>(null);
  const failedQueueRef = useRef<
    Array<{
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      originalRequest: InternalAxiosRequestConfig;
    }>
  >([]);
  const interceptorSetupRef = useRef(false);

  // 💡 Axiosの基本インスタンスをuseMemoで定義（インターセプターなし）
  const baseApiClient = useMemo(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.Accept = "application/json";

    return axios;
  }, []);

  // --- A. ヘルパー関数定義 ---

  const fetchCsrfCookie = useCallback(async () => {
    if (!API_BASE_URL) return;
    try {
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
    } catch (error) {
      console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
    }
  }, []);

  const checkSession = useCallback(async (): Promise<CheckSessionResult> => {
    if (!API_BASE_URL) return { authenticated: false };

    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/check`);

      const data: CheckSessionResult & {
        user: BackendUser | null | undefined;
      } = res.data;

      if (data.authenticated) {
        console.log("[Sanctum Check] Session active (200 OK).");
        return { authenticated: true, user: data.user || undefined };
      }

      console.log(
        `[Sanctum Check] Session inactive (Override Code: ${data.status_code_override || "N/A"}). ${data.message || "Proceeding."}`,
      );
      return { authenticated: false };
    } catch (e) {
      const error = e as AxiosError;

      console.error(
        "[Sanctum Check] Critical failure during session check (Network/Server Error):",
        error,
      );
      return { authenticated: false };
    }
  }, []);

  useLaravelSession(
    user,
    auth,
    checkSession,
    setLaravelAuthenticated,
    setInitialCheckComplete,
  );

  // --- B. 認証アクション定義 ---

  /**
   * 💡 ログアウト処理
   */
  const logout = useCallback(
    async (redirectPath = "/") => {
      if (!auth) return;

      setIsLoggingOut(true);
      try {
        await signOut(auth);

        delete axios.defaults.headers.common.Authorization;

        setToken(null);
        setUser(null);
        setBackendUser(null);
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
        const idToken = await user.getIdToken(true);

        const { token: newToken, user: refreshedBackendUser } =
          await completeLaravelLogin(idToken);

        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        setBackendUser(refreshedBackendUser);
        setToken(newToken);

        return { ...refreshedBackendUser, token: newToken };
      } catch (error) {
        console.error(
          "[Sanctum Refresh] Failed to complete token exchange:",
          error,
        );
        throw error;
      }
    } else {
      throw new Error("User not found for token refresh.");
    }
  }, [user]);

  /**
   * 💡 ログイン処理の核。Firebase認証 -> Laravelセッション確立を連続で実行する。
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

      // 2. Laravel側でSanctumセッションを確立 (ID Token -> Sanctum Tokenへの交換)
      const { user: newBackendUser, token: newToken } =
        await completeLaravelLogin(idToken, name);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      setBackendUser(newBackendUser);
      setToken(newToken);

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

  const setBackendUserStatus = useCallback((user: BackendUser | null) => {
    setBackendUser(user);
  }, []);

  // --- E. 状態の計算 (useMemo) ---
  // 💡 修正箇所: useEffectより前に定義を移動

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

          if (idToken) {
            try {
              // 💡 認証の核（リロード時）: ID Tokenを使ってLaravelセッションを確立し直す
              const { user: newBackendUser, token: newToken } =
                await completeLaravelLogin(idToken);

              axios.defaults.headers.common["Authorization"] =
                `Bearer ${newToken}`;

              setBackendUser(newBackendUser);
              setToken(newToken);

              // ★★★ 状態の最終確定 ★★★
              setLaravelAuthenticated(true);
              setInitialCheckComplete(true);
            } catch (profileError) {
              console.error(
                "[Profile] Failed to load backend profile. Assuming unauthenticated.",
                profileError,
              );
              setLaravelAuthenticated(false);
              setInitialCheckComplete(true);
            }
          }
        } catch (error) {
          console.error(
            "[Firebase] Failed to get ID Token. Initiating cleanup.",
            error,
          );
          // 💡 cleanup
          delete axios.defaults.headers.common.Authorization;
          setToken(null);
          setBackendUser(null);
          setLaravelAuthenticated(false);
          setInitialCheckComplete(true);
        } finally {
          setIsBackendUserLoading(false);
        }
      } else {
        // ログアウト時
        delete axios.defaults.headers.common.Authorization;
        setToken(null);
        setBackendUser(null);
        setLaravelAuthenticated(false);
        setInitialCheckComplete(true);
      }
    });

    return () => unsub();
  }, [auth, isReady]);

  /**
   * 責務 2: CSRF Cookieの初期取得
   */
  useEffect(() => {
    fetchCsrfCookie();
  }, [fetchCsrfCookie]);

  /**
   * 責務 3: 💡 アプリケーション全体での認証状態に基づいたリダイレクト制御
   * 💡 修正後: isLoadingとisAuthenticatedがこの時点で定義されている
   */
  useEffect(() => {
    // 1. 認証チェックが完了していること
    if (isLoading || !initialCheckComplete) return;

    // 2. 認証済みであること
    if (isAuthenticated) {
      // 3. バックエンドユーザー情報があり、かつメール未確認であること
      const isEmailUnverified = backendUser && !backendUser.email_verified_at;

      // 💡 リダイレクトが不要なページを定義
      const exemptPaths = ["/email/verify", "/logout"];

      if (isEmailUnverified) {
        // 💡 現在のパスが exemptPaths に含まれていないかチェック
        if (!exemptPaths.includes(pathname)) {
          console.log(
            "[AuthGuard] Email unverified. Redirecting to /email/verify",
          );
          router.push("/email/verify");
        }
      } else {
        // 💡 メール認証済みの場合、/email/verify にいるならトップへリダイレクト
        if (pathname === "/email/verify") {
          console.log("[AuthGuard] Email verified. Redirecting to /");
          router.push("/");
        }
      }
    } else {
      // 💡 未認証の場合の制御（ここでは省略）
    }
  }, [
    isLoading,
    initialCheckComplete,
    isAuthenticated,
    backendUser,
    pathname,
    router,
  ]);

  // --- D. apiClient の生成と Interceptor の実装（核心部分） ---

  /**
   * 💡 Axios Interceptorの実装とAPI Clientの生成。
   */
  const apiClient = useMemo(() => {
    const instance = baseApiClient;

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
    if (!interceptorSetupRef.current) {
      instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          const originalRequest = error.config;

          // 💡 リフレッシュロジックは 401 Unauthorized にのみ反応させる
          if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;

            if (!refreshPromiseRef.current) {
              if (!user) {
                await logout();
                return Promise.reject(error);
              }

              refreshPromiseRef.current = reloadAuthToken();

              try {
                const { token: newToken } = await refreshPromiseRef.current;
                processQueue(null, newToken);
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                refreshPromiseRef.current = null;
                return instance(originalRequest);
              } catch (refreshError) {
                processQueue(refreshError, null);
                refreshPromiseRef.current = null;
                await logout();
                return Promise.reject(refreshError);
              }
            } else {
              return new Promise((resolve, reject) => {
                failedQueueRef.current.push({
                  resolve,
                  reject,
                  originalRequest,
                });
              });
            }
          }
          return Promise.reject(error);
        },
      );
      interceptorSetupRef.current = true;
    }
    return instance;
  }, [baseApiClient, logout, reloadAuthToken, user]);

  // --- F. Context Provider ---

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
        userId,
        backendUser,
        // 💡 定義が上部に移動し、エラーが解消
        isAuthenticated,
        isLoading,
        isLoggingOut,
        token,
        apiClient,
        login,
        logout,
        reloadAuthToken,
        setBackendUserStatus,
        initialCheckComplete,
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
  return ctx;
};

/**
 * 💡 認証済みAPIクライアント (apiClient) のみにアクセスするためのカスタムフック。
 */
export const useApiClient = () => {
  const ctx = useContext(AuthContext);

  if (!ctx.apiClient) {
    return ctx.apiClient as unknown as AxiosInstance;
  }
  return ctx.apiClient;
};
