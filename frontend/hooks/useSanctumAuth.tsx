"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import axios, { AxiosInstance } from "axios";

import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

import { getFirebaseAuth } from "@/src/lib/firebase";

/* ============================================================
   型定義
============================================================ */
export interface LaravelUser {
  id: number;
  name: string;
  email: string;
  role: string;
  shop_id?: number | null;
  user_image?: string | null;
  email_verified_at?: string | null;
  emailVerified: boolean;
}

interface LoginResponse {
  token: string;
  user: LaravelUser;
  status: "login" | "register";
  needsEmailVerification: boolean; // ← これを追加
}

export interface AuthContextType {
  user: LaravelUser | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  apiClient: AxiosInstance | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ needsEmailVerification: boolean }>;

  reloadAuthToken: () => Promise<void>;
  logout: () => Promise<void>;
}

/* ============================================================
   Context
============================================================ */
const AuthContext = createContext<AuthContextType | null>(null);

/* ============================================================
   helper
============================================================ */
function mapLaravelUser(raw: any): LaravelUser {
  return {
    ...raw,
    emailVerified: raw.email_verified_at !== null,
  };
}

function loginWithLaravel(idToken: string, name?: string) {
  return axios
    .post<LoginResponse>(
      "/api/login_or_register",
      { id_token: idToken, name },
      { withCredentials: true },
    )
    .then((r) => r.data);
}

/* Sanctum API client */
function createSanctumApiClient(token: string): AxiosInstance {
  const instance = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
}

/* ============================================================
   AuthProvider（修正版）
============================================================ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LaravelUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 修正: 競合を防ぐための新しいフラグ
  const [isRegistering, setIsRegistering] = useState(false);

  /* ================================
     localStorage 永続化復元
  ================================= */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));

    setIsLoading(false);
  }, []);

  /* ============================================================
     Sanctum API Client
============================================================ */
  const apiClient = useMemo(() => {
    if (!token) return null;

    const instance = createSanctumApiClient(token);

    // -------------------------------------------------------
    // Silent Refresh（401 を 1 度だけ自動回復）
    // -------------------------------------------------------
    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;

        if (
          error.response?.status === 401 &&
          !original._retry &&
          firebaseUser
        ) {
          original._retry = true;

          try {
            const newIdToken = await firebaseUser.getIdToken(true);
            const result = await loginWithLaravel(newIdToken);

            setToken(result.token);
            localStorage.setItem("token", result.token);

            setUser(result.user);
            localStorage.setItem("user", JSON.stringify(result.user));

            original.headers["Authorization"] = `Bearer ${result.token}`;

            return instance(original);
          } catch (e) {
            console.warn("Silent Refresh failed:", e);
            logout();
          }
        }

        return Promise.reject(error);
      },
    );

    return instance;
  }, [token, firebaseUser]);

  /* ============================================================
     Firebase Auth State Listener
============================================================ */
  useEffect(() => {
    // onAuthStateChanged は必ず token より先に実行されます。
    return auth.onAuthStateChanged(async (u) => {
      setFirebaseUser(u);

      // 🔥 修正: 登録処理中(isRegistering)の場合は、リスナーによる自動ログインをスキップ
      if (isRegistering) return;

      // u があり、トークンがまだ設定されていない（つまり、リスナーが先に走った）場合のみ
      // または、uがあり、かつ Laravelユーザー情報がない場合（トークン切れ）に実行
      if (u && !token) {
        // 新規登録の直後など、tokenがまだセットされていない状態

        const idToken = await u.getIdToken(true);
        // 🚨 リスナーによる自動ログイン (これがリクエスト #2になるのを防ぐ)
        const result = await loginWithLaravel(idToken);

        setToken(result.token);
        setUser(result.user);

        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    });
  }, [auth, token, isRegistering]); // isRegistering を依存配列に追加

  /* ============================================================
     MAIL VERIFIED → Laravel と同期
============================================================ */
  const reloadAuthToken = useCallback(async () => {
    if (!firebaseUser) return;

    const idToken = await firebaseUser.getIdToken(true);
    const result = await loginWithLaravel(idToken);

    setToken(result.token);
    setUser(result.user);

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }, [firebaseUser]);

  /* ============================================================
     LOGIN（完全版）
============================================================ */
  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken(true);

      const result = await loginWithLaravel(idToken);

      setToken(result.token);
      setUser(result.user);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    },
    [auth],
  );

  /* ============================================================
     REGISTER（修正版）
============================================================ */
  const register = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      setIsRegistering(true);

      try {
        // Firebase アカウント作成
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(cred.user, { displayName: name });

        const idToken = await cred.user.getIdToken(true);

        // Laravel 側に login_or_register を送る
        const result = await loginWithLaravel(idToken, name);

        // トークン保存
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // ← ここが重要！！
        return {
          needsEmailVerification: result.needsEmailVerification,
        };
      } finally {
        setIsRegistering(false);
      }
    },
    [auth],
  );

  /* ============================================================
     LOGOUT
============================================================ */
  const logout = useCallback(async () => {
    await auth.signOut();

    setFirebaseUser(null);
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, [auth]);

  const value: AuthContextType = {
    user,
    firebaseUser,
    token,
    apiClient,
    isAuthenticated: !!token,
    isLoading,

    login,
    register,
    logout,
    reloadAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function useApiClient() {
  const { apiClient } = useAuth();

  if (!apiClient) {
    throw new Error("API client is not ready. User may not be authenticated.");
  }

  return apiClient;
}
