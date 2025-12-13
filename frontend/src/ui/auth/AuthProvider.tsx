"use client";

import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { AuthService } from "@/application/auth/AuthService";
import { FirebaseAuthClient } from "@/infrastructure/auth/FirebaseAuthClient";
import { LaravelAuthApi } from "@/infrastructure/auth/LaravelAuthApi";
import { createHttpClient } from "@/infrastructure/auth/HttpClient";
import { TokenRefreshService } from "@/application/auth/TokenRefreshService";
import { TokenStorage } from "@/infrastructure/auth/TokenStorage";
import type { AuthUser } from "@/domain/auth/AuthUser";

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authService, setAuthService] = useState<AuthService | null>(null);
  const [laravelApi, setLaravelApi] = useState<LaravelAuthApi | null>(null);
  const [refreshService, setRefreshService] =
    useState<TokenRefreshService | null>(null);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ======================================================
  // 初期化フェーズ
  // ======================================================
  useEffect(() => {
    const firebase = new FirebaseAuthClient();

    // callback が stale state を参照しないよう、
    // callback 内で "常に最新の state" を参照する書き方にする。
    const httpClient = createHttpClient(async () => {
      console.log("[AuthProvider] Refresh callback fired");

      // この時点で最新 state を参照
      const currentRefresh = refreshService;
      const currentApi = laravelApi;

      if (!currentRefresh || !currentApi) return;

      const tokens = await currentRefresh.refresh();
      if (!tokens) {
        TokenStorage.clear();
        setUser(null);
        return;
      }

      TokenStorage.save(tokens);
      const u = await currentApi.me();
      setUser(u);
    });

    const api = new LaravelAuthApi(httpClient);
    const auth = new AuthService(firebase, api);
    const refresh = new TokenRefreshService(api);

    setAuthService(auth);
    setLaravelApi(api);
    setRefreshService(refresh);
  }, []);

  // ======================================================
  // /me を実行（services が揃ったら 1 回だけ実行）
  // ======================================================
  useEffect(() => {
    if (!laravelApi) return;

    (async () => {
      try {
        const u = await laravelApi.me();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [laravelApi]);

  // ======================================================
  // 認証メソッド
  // ======================================================
  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    if (!authService) return;
    setIsLoading(true);

    const u = await authService.login({ email, password });

    console.log("[AuthProvider] login() returned user:", u);
    
    setUser(u);

    setIsLoading(false);
  }

  async function register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    if (!authService) return;
    return await authService.register(name, email, password);
  }

  async function logout() {
    if (!authService) return;
    await authService.logout();
    setUser(null);
  }

  async function reloadUser() {
    if (!laravelApi) return;
    try {
      const u = await laravelApi.me();
      setUser(u);
    } catch {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        reloadUser,
        apiClient: laravelApi?.client ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
