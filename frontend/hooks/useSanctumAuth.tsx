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
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { getFirebaseAuth } from "@/src/lib/firebase";

/* =====================================
   型定義
===================================== */
export interface LaravelUser {
  id: number;
  name: string;
  email: string;
  role: string;
  shop_id?: number | null;
  user_image?: string | null;

  /* ⭐ Laravel の email_verified_at を Next.js 側は boolean に変換して扱う */
  emailVerified: boolean;
}

interface LoginResponse {
  token: string;
  user: any; // 後で mapLaravelUser() で型変換
  status: "login" | "register";
}

export interface AuthContextType {
  user: LaravelUser | null;
  firebaseUser: FirebaseUser | null;
  apiClient: AxiosInstance | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  auth: ReturnType<typeof getFirebaseAuth>;
  reloadAuthToken: () => Promise<void>;

  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ needsEmailVerification: boolean }>;

  logout: () => Promise<void>;
}

/* =====================================
   Context
===================================== */
const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

/* =====================================
   ユーザー変換（Laravel → Next.js）
===================================== */
function mapLaravelUser(raw: any): LaravelUser {
  return {
    ...raw,
    emailVerified: raw.email_verified_at !== null,
  };
}

/* =====================================
   Laravel Token 発行
===================================== */
async function loginWithLaravel(idToken: string): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(
    `${API_BASE_URL}/api/login_or_register`,
    { id_token: idToken },
    { withCredentials: true },
  );
  return data;
}

/* =====================================
   Axios Client
===================================== */
function createApiClient(token: string): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

/* =====================================
   AuthProvider（決定版）
===================================== */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<LaravelUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  /* Axios Client */
  const apiClient = useMemo(() => {
    if (!token) return null;
    return createApiClient(token);
  }, [token]);

  /* =====================================
     reloadAuthToken（メール認証後の重要処理）
  ====================================== */
  const reloadAuthToken = useCallback(async () => {
    if (!firebaseUser) return;

    const idToken = await firebaseUser.getIdToken(true); // force refresh
    const result = await loginWithLaravel(idToken);

    setToken(result.token);

    const client = createApiClient(result.token);
    const me = await client.get("/api/user");

    setUser(mapLaravelUser(me.data.user));
  }, [firebaseUser]);

  /* =====================================
     Firebase の状態監視（login / logout）
  ====================================== */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setFirebaseUser(u);

      // ここでは絶対に loginWithLaravel を呼ばない！
      // メール認証後の同期は reloadAuthToken() が担当する。

      setIsLoading(false);
    });

    return () => unsub();
  }, [auth]);

  // =========================
  // Token Refresh（Laravel へ送らない）
  // =========================
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (u) => {
      if (!u || isRegistering) return;

      // Firebase 内部の token 更新だけ行う（Laravel へは送らない）
      await u.getIdToken();
    });

    return () => unsub();
  }, [auth, isRegistering]);

  /* =====================================
     login
  ====================================== */
  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await cred.user.getIdToken();
      const result = await loginWithLaravel(idToken);

      setToken(result.token);

      const client = createApiClient(result.token);
      const me = await client.get("/api/user");

      setUser(mapLaravelUser(me.data.user));
    },
    [auth],
  );

  /* =====================================
     register
  ====================================== */
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
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(cred.user, { displayName: name });

        const idToken = await cred.user.getIdToken();
        const result = await loginWithLaravel(idToken);

        setToken(result.token);

        const client = createApiClient(result.token);
        const me = await client.get("/api/user");

        setUser(mapLaravelUser(me.data.user));

        return { needsEmailVerification: true };
      } finally {
        setIsRegistering(false);
      }
    },
    [auth],
  );

  /* =====================================
     logout
  ====================================== */
  const logout = useCallback(async () => {
    await auth.signOut();
    setFirebaseUser(null);
    setUser(null);
    setToken(null);
  }, [auth]);

  /* =====================================
     Context 提供
  ====================================== */
  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        apiClient,
        token,
        isAuthenticated: !!token,
        isLoading,

        auth,
        reloadAuthToken,

        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================
   Hooks
===================================== */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

/* API クライアントを安全に取得（必須） */
export function useApiClient() {
  const { apiClient } = useAuth();
  if (!apiClient) {
    throw new Error("API client is not ready yet. (token not issued)");
  }
  return apiClient;
}
