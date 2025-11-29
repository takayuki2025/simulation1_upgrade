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
import { useFirebaseInit } from "@/hooks/useFirebaseInit";
// Next.jsのルーター (リダイレクト処理に利用)
import { useRouter } from "next/navigation";
// 💡 useLaravelSession は不要だが、BackendUser型とAPI通信の簡略化のために一部ヘルパー関数は残す
import {
  BackendUser,
  // 💡 Firebase認証フローでは、Sanctumセッションの確立は不要
  // completeLaravelLogin,
  // checkLaravelSession,
} from "@/hooks/useLaravelSession";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// I. 型定義とContextの初期化
// =======================================================

// 💡 戻り値はBackendUser情報と新しいトークン (ID Token)
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
  token: string | null; // 💡 Firebase ID Token が格納される
  apiClient: AxiosInstance | null;
  login: (credentials: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>;
  reloadAuthToken: () => Promise<ReloadResult>;
  setBackendUserStatus: (user: BackendUser | null) => void;
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
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

// =======================================================
// II. Auth Provider コンポーネント
// =======================================================

/**
 * 💡 認証状態管理の中心となるプロバイダー (FirebaseAuth専用)
 * 責務: Firebase ID Token の取得と、それを使った API 通信、リフレッシュ。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, userId, isReady } = useFirebaseInit();
  const router = useRouter();

  // --- Core State ---
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null); // 💡 ID Token
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [isBackendUserLoading, setIsBackendUserLoading] = useState(false);

  // --- ローディング完了フラグ ---
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

  // --- A. ヘルパー関数定義 ---

  /**
   * 💡 CSRF Cookieの取得は不要だが、LaravelのAPIへのアクセスを簡易化するため残す。
   */
  const fetchCsrfCookie = useCallback(async () => {
    // 💡 FirebaseAuthではCSRFは不要だが、Laravelのセッション確立ルートを叩くなら必要。
    // 今回は Sanctuｍフローではないため、CSRF Cookieの取得は**基本的に不要**。
    // ログイン処理のシンプル化のため、この関数は空にするか削除が望ましいが、元の構造維持のため残す。
    if (!API_BASE_URL) return;
    try {
      axios.defaults.withCredentials = true;
      // 💡 CSRF取得はSanctum特有のため、ここでは削除（またはコメントアウト）する
      // await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
    } catch (error) {
      console.error(
        "[Sanctum] CSRF process removed for FirebaseAuth study:",
        error,
      );
    }
  }, []);

  /**
   * 💡 ユーザープロフィールをロードするためのシンプルなヘルパー関数
   * @param idToken 現在有効なFirebase ID Token
   * @returns ユーザー情報 (BackendUser)
   */
  const fetchProfile = useCallback(
    async (idToken: string): Promise<BackendUser> => {
      // 💡 /api/mypage/profile を叩く。このルートは `auth:firebase` ミドルウェアで保護されている必要がある。
      const profileRes = await axios.get(
        `${API_BASE_URL}/api/mypage/profile/firebase`, // 💡 Firebase専用のルートを叩く
        { headers: { Authorization: `Bearer ${idToken}` } },
      );
      return profileRes.data.user as BackendUser;
    },
    [],
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

        setToken(null);
        setUser(null);
        setBackendUser(null);
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
   * 責務: Firebase ID Token のリフレッシュのみを実行する (Sanctum交換は不要)。
   */
  const reloadAuthToken = useCallback(async () => {
    if (user) {
      try {
        // 1. Firebase ID Token を強制的にリフレッシュ
        const idToken = await user.getIdToken(true);
        setToken(idToken);

        // 2. 💡 BackendUser情報も最新化（念のため）
        const refreshedBackendUser = await fetchProfile(idToken);
        setBackendUser(refreshedBackendUser);

        // 💡 修正点: BackendUser情報と新しいID Tokenを返す
        return { ...refreshedBackendUser, token: idToken };
      } catch (error) {
        console.error("[Firebase Refresh] Failed to refresh ID Token:", error);
        throw error;
      }
    } else {
      throw new Error("User not found for token refresh.");
    }
  }, [user, fetchProfile]);

  /**
   * 💡 ログイン処理の核。Firebase認証 -> BackendUser情報ロードを実行する。
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

      // 1. Firebase 認証を実行
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      setToken(idToken); // 💡 ID Tokenをセット

      // 2. 💡 Laravel側でユーザー情報をロード (認証はミドルウェアに委ねる)
      // ログイン直後なので、/api/mypage/profile を叩き、ユーザー情報をDBから取得
      const newBackendUser = await fetchProfile(idToken);
      setBackendUser(newBackendUser);

      // 3. 認証状態を確定
      setInitialCheckComplete(true);

      // 4. リダイレクト
      if (!newBackendUser.email_verified_at) {
        router.push("/email/verify");
      } else {
        router.push("/");
      }
    },
    [auth, router, fetchProfile],
  );

  // ★外部公開用の setBackendUser ラッパー関数
  const setBackendUserStatus = useCallback((user: BackendUser | null) => {
    setBackendUser(user);
  }, []);

  // --- C. 状態監視と同期 (useEffect) ---

  /**
   * 責務 1: Firebaseの認証状態変更の監視 (`onAuthStateChanged`)
   * 💡 リロード/ページ遷移時の ID Token 確立と BackendUser 情報のロードを担う
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
              // 💡 認証の核（リロード時）: ID Tokenを使ってLaravelからプロフィールをロード
              const newBackendUser = await fetchProfile(idToken);
              setBackendUser(newBackendUser);

              // ★★★ 状態の最終確定 ★★★
              setInitialCheckComplete(true);
            } catch (profileError) {
              console.error(
                "[Profile] Failed to load backend profile. Initiating logout.",
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
        setInitialCheckComplete(true);
      }
    });

    return () => unsub();
  }, [auth, isReady, logout, fetchProfile]);

  // --- D. apiClient の生成と Interceptor の実装（核心部分） ---

  /**
   * 💡 Axios Interceptorの実装とAPI Clientの生成。
   * 責務: Firebase ID Tokenをヘッダーに付与し、401エラー時に ID Token リフレッシュのみを再試行する。
   */
  const apiClient = useMemo(() => {
    if (!token) {
      return null;
    }

    const instance = axios.create({
      baseURL: API_BASE_URL,
      // 💡 withCredentials: true は Sanctum の Cookie認証で必須。FirebaseAuthでは基本的に不要だが、Laravel側のCSRF対策があれば残す場合もある。
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`, // 💡 Firebase ID Token を付与
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
              const { token: newToken } = await refreshPromiseRef.current; // 💡 newToken は新しい ID Token
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

  // --- E. 状態の計算 (useMemo) ---

  /**
   * 💡 最終的な認証状態の計算。
   */
  const isAuthenticated = useMemo(() => {
    // 💡 laravelAuthenticated のチェックは不要。Firebase User と Token の存在のみをチェック。
    const isAuth = initialCheckComplete && !!user && !user.isAnonymous;
    return isAuth;
  }, [initialCheckComplete, user]);

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
  return ctx;
};

/**
 * 💡 認証済みAPIクライアント (apiClient) のみにアクセスするためのカスタムフック。
 */
export const useApiClient = () => {
  const ctx = useContext(AuthContext);

  if (!ctx.apiClient) {
    throw new Error(
      "Authenticated API client is not available. Check if the user is authenticated and loading is complete.",
    );
  }
  return ctx.apiClient;
};
