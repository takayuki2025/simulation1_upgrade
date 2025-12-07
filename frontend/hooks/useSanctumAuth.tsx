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
import { onIdTokenChanged } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

import { getFirebaseAuth } from "@/src/lib/firebase";
import { createApiClient } from "@/src/lib/api";
import type { LoginResponse } from "@/src/types/auth";

// ================================
// 型
// ================================
export interface LaravelUser {
  id: number;
  name: string;
  email: string;
  user_image?: string | null;
}

export interface AuthContextType {
  user: LaravelUser | null;
  firebaseUser: FirebaseUser | null;

  apiClient: AxiosInstance | null;
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ needsEmailVerification: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ================================
// 🔑 Laravel Token 発行専用関数
// ================================
async function loginWithLaravel(idToken: string): Promise<string> {
  const { data } = await axios.post<LoginResponse>(
    `${API_BASE_URL}/api/login_or_register`,
    { id_token: idToken },
  );

  return data.token;
}

// ================================
// AuthProvider 本体
// ================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<LaravelUser | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ================================
  // token → axios client へ同期
  // ================================
  const apiClient: AxiosInstance | null = useMemo(() => {
    if (!token) return null;
    return createApiClient(token);
  }, [token]);

  // ================================
  // 初期ログイン: Firebase → Laravel 同期
  // ================================
  useEffect(() => {
    console.log("[AuthProvider] START onAuthStateChanged");

    const unsub = auth.onAuthStateChanged(async (u) => {
      console.log("[AuthProvider] Firebase user =", u);

      if (!u) {
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setFirebaseUser(u);
      setIsLoading(true);

      try {
        const idToken = await u.getIdToken();

        const appToken = await loginWithLaravel(idToken);
        setToken(appToken);

        const client = createApiClient(appToken);
        const me = await client.get("/api/user");
        setUser(me.data.user);
      } catch (e) {
        console.error("[AuthProvider] Token Login failed", e);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, [auth]);

  // ================================
  // Token 自動更新
  // ================================
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (u) => {
      if (!u) return;

      try {
        const idToken = await u.getIdToken();
        const appToken = await loginWithLaravel(idToken);
        setToken(appToken);
      } catch (e) {
        console.error("[AuthProvider] Token refresh failed", e);
      }
    });

    return () => unsub();
  }, [auth]);

  // ================================
  // login
  // ================================
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);

      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await cred.user.getIdToken();

        const appToken = await loginWithLaravel(idToken);

        setFirebaseUser(cred.user);
        setToken(appToken);

        const client = createApiClient(appToken);
        const me = await client.get("/api/user");
        setUser(me.data.user);
      } catch (e) {
        console.error("[AuthProvider] login failed", e);
        setUser(null);
        setToken(null);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [auth],
  );

  // ================================
  // register（新規登録）
  // ================================
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
      setIsLoading(true);

      try {
        // ① Firebase アカウント作成
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // ② 表示名を Firebase に保存
        await updateProfile(cred.user, { displayName: name });

        const idToken = await cred.user.getIdToken();

        // ③ Laravel 側で DB 登録 or login
        const appToken = await loginWithLaravel(idToken);
        setToken(appToken);

        const client = createApiClient(appToken);
        const me = await client.get("/api/user");
        setUser(me.data.user);

        return { needsEmailVerification: false };
      } catch (e) {
        console.error("[AuthProvider] register failed", e);
        setUser(null);
        setToken(null);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [auth],
  );

  // ================================
  // logout
  // ================================
  const logout = useCallback(async () => {
    await auth.signOut();
    setFirebaseUser(null);
    setUser(null);
    setToken(null);
  }, [auth]);

  // ================================
  // isAuthenticated
  // ================================
  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        apiClient,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ================================
// Hooks
// ================================
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function useApiClient() {
  const { apiClient } = useAuth();
  if (!apiClient) throw new Error("API client not ready");
  return apiClient;
}
