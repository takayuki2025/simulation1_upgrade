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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ================================
// 🔑 Laravel トークンだけを返す関数
// ================================
async function loginWithLaravel(idToken: string): Promise<string> {
  const { data } = await axios.post<LoginResponse>(
    `${API_BASE_URL}/api/login_or_register`,
    { id_token: idToken },
  );

  // ここでは token（文字列）だけ返す
  return data.token;
}

// ================================
// Provider 本体
// ================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<LaravelUser | null>(null);

  // ★ ここが一番重要：API トークンだけを state で持つ
  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // ================================
  // apiClient は token から同期的に生成
  // ================================
  const apiClient: AxiosInstance | null = useMemo(() => {
    if (!token) return null;
    const client = createApiClient(token);
    // デバッグ用
    // console.log("[AuthProvider] createApiClient from token:", token.slice(0, 10));
    return client;
  }, [token]);

  // ================================
  // 初期ログイン (onAuthStateChanged)
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

        // Laravel でアプリ用トークンを発行
        const appToken = await loginWithLaravel(idToken);
        setToken(appToken);

        // /api/user を取るときだけ一時的に client を作る
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
  // Token 自動更新 (onIdTokenChanged)
  // ================================
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (u) => {
      if (!u) {
        // サインアウト済み
        return;
      }

      try {
        const newFirebaseToken = await u.getIdToken();
        const appToken = await loginWithLaravel(newFirebaseToken);
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
  // ログイン判定
  // ================================
  const isAuthenticated = useMemo(() => {
    // user がまだ取れていない瞬間があっても、token があれば「ログイン中」とみなす
    return !!token;
  }, [token]);

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
