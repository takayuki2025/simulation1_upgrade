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
import {
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";

// 💡 実際のパスに修正してください
import { useFirebaseInit } from "./useFirebaseInit";
import { useRouter, usePathname } from "next/navigation";
// 💡 実際のパスに修正してください
import { completeLaravelLogin, BackendUser } from "./useLaravelSession";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// I. 型定義とContextの初期化
// =======================================================

type ReloadResult = BackendUser & { token: string };

export interface AuthContextType {
  user: FirebaseUser | null;
  auth: Auth | null;
  userId: string | null;
  backendUser: BackendUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  isRefreshing: boolean;
  token: string | null;
  apiClient: AxiosInstance | null;
  login: (credentials: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  logout: (redirectPath?: string, shouldRedirect?: boolean) => Promise<void>;
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
  isRefreshing: false,
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

  // --- B. 認証アクション定義 ---

  /**
   * 💡 ログアウト処理
   */
  const logout = useCallback(
    async (redirectPath = "/", shouldRedirect = true) => {
      if (!auth) return;

      setIsLoggingOut(true);
      try {
        await signOut(auth);

        delete axios.defaults.headers.common.Authorization;

        setToken(null);
        setUser(null);
        setBackendUser(null);
        setLaravelAuthenticated(false);
        setInitialCheckComplete(true); // ログアウト時も完了とする

        // 💡 shouldRedirect が true の場合のみリダイレクトを実行
        if (shouldRedirect) {
          router.push(redirectPath);
        }
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

        // 💡 リフレッシュ処理の前に CSRF Cookie を取得
        await fetchCsrfCookie();

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
  }, [user, fetchCsrfCookie]);

  /**
   * 💡 ログイン処理の核。
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

      // 2. Laravel側でSanctumセッションを確立
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

  /**
   * 💡 最終的な認証状態の計算。
   */
  const isAuthenticated = useMemo(() => {
    const isAuth =
      initialCheckComplete &&
      !!user &&
      !user.isAnonymous &&
      laravelAuthenticated === true &&
      !!backendUser;
    return isAuth;
  }, [initialCheckComplete, user, laravelAuthenticated, backendUser]);

  /**
   * 💡 ローディング状態の計算を強化
   */
  const isLoading = useMemo(() => {
    const loading =
      !isReady ||
      !initialCheckComplete ||
      (!!user && !backendUser && laravelAuthenticated);

    return loading;
  }, [isReady, initialCheckComplete, user, backendUser, laravelAuthenticated]);

  /**
   * 💡 isRefreshing の計算。
   */
  const isRefreshing = useMemo(() => {
    return !!refreshPromiseRef.current;
  }, [refreshPromiseRef.current]);

  // --- C. 状態監視と同期 (useEffect) ---

  /**
   * 責務 1: Firebaseの認証状態変更の監視 (`onAuthStateChanged`)
   */
  useEffect(() => {
    if (!auth || !isReady) return;

    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      // 認証フロー開始時にリセット
      setLaravelAuthenticated(false);
      setBackendUser(null);
      setInitialCheckComplete(false); // 初期チェック未完了に戻す

      let success = false;
      let finalBackendUser: BackendUser | null = null;
      let finalToken: string | null = null;

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();

          if (idToken) {
            await fetchCsrfCookie();
            const { user: newBackendUser, token: newToken } =
              await completeLaravelLogin(idToken);

            axios.defaults.headers.common["Authorization"] =
              `Bearer ${newToken}`;

            finalBackendUser = newBackendUser;
            finalToken = newToken;
            success = true;
          } else {
            throw new Error("Failed to get Firebase ID Token.");
          }
        } catch (error) {
          console.error(
            "[Auth Check] Session sync failed. Initiating cleanup and redirect to login.",
            error,
          );
          // 🚨 修正: 認証失敗時は、確実にログインページにリダイレクトさせる (デッドロック回避)
          await logout("/login", true);
          // success は false のまま
        } finally {
          // ★★★ 状態の最終確定をまとめて行う ★★★
          if (success) {
            setBackendUser(finalBackendUser);
            setToken(finalToken);
            setLaravelAuthenticated(true);
          } else {
            // 失敗した場合、logout() で既にクリアされた状態を維持
            setBackendUser(null);
            setToken(null);
            setLaravelAuthenticated(false);
          }

          // 🚨 最後に必ず初期チェック完了を設定する (デッドロック解除)
          setInitialCheckComplete(true);
        }
      } else {
        // ログアウト時 (currentUser === null)
        delete axios.defaults.headers.common.Authorization;
        setToken(null);
        setBackendUser(null);
        setLaravelAuthenticated(false);
        setInitialCheckComplete(true); // ログアウト時も完了
      }
    });

    return () => unsub();
  }, [auth, isReady, fetchCsrfCookie, logout]);

  /**
   * 責務 2: CSRF Cookieの初期取得
   */
  useEffect(() => {
    fetchCsrfCookie();
  }, [fetchCsrfCookie]);

  /**
   * 責務 3: 💡 アプリケーション全体での認証状態に基づいたリダイレクト制御
   */
  useEffect(() => {
    // 認証情報が確定するまでリダイレクトを遅延
    if (isLoading || !initialCheckComplete) return;

    if (isAuthenticated) {
      const isEmailUnverified = backendUser && !backendUser.email_verified_at;
      const exemptPaths = ["/email/verify", "/logout"];

      if (isEmailUnverified) {
        if (!exemptPaths.includes(pathname)) {
          router.push("/email/verify");
        }
      } else {
        if (pathname === "/email/verify") {
          router.push("/");
        }
      }
    } else {
      // 未認証時の制御（ここでは省略）
    }
  }, [
    isLoading,
    initialCheckComplete,
    isAuthenticated,
    backendUser,
    pathname,
    router,
  ]);

  // --- D. apiClient の生成と Interceptor の実装（変更なし） ---

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
      // 成功・失敗に関わらず Ref をリセット
      refreshPromiseRef.current = null;
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
                // 💡 ユーザーなしの場合、リダイレクト付きでログアウト
                await logout("/", true);
                return Promise.reject(error);
              }

              // ★ リフレッシュ処理を開始し、Ref に Promise を保持させる
              refreshPromiseRef.current = reloadAuthToken();

              try {
                const { token: newToken } = await refreshPromiseRef.current;
                processQueue(null, newToken);
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return instance(originalRequest);
              } catch (refreshError) {
                processQueue(refreshError, null);
                // 💡 リフレッシュ失敗の場合、リダイレクト付きでログアウト
                await logout("/", true);
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
        isAuthenticated,
        isLoading,
        isLoggingOut,
        isRefreshing,
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx;
};

export const useApiClient = () => {
  const ctx = useContext(AuthContext);

  if (!ctx.apiClient) {
    return axios;
  }
  return ctx.apiClient;
};
