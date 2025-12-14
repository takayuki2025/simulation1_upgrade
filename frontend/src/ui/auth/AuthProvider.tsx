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
import type { AuthContextType, RegisterResult } from "./AuthContextType";
import type { LoginResult } from "./AuthContextType";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authService, setAuthService] = useState<AuthService | null>(null);
  const [laravelApi, setLaravelApi] = useState<LaravelAuthApi | null>(null);
  const [refreshService, setRefreshService] =
    useState<TokenRefreshService | null>(null);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化
  useEffect(() => {
    const firebase = new FirebaseAuthClient();

    const httpClient = createHttpClient(async () => {
      const currentApi = laravelApi;
      const currentRefresh = refreshService;
      if (!currentApi || !currentRefresh) return;

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

    setLaravelApi(api);
    setAuthService(auth);
    setRefreshService(refresh);
  }, []);

  // 起動時 /me
  useEffect(() => {
    if (!laravelApi) return;

    const { accessToken } = TokenStorage.load();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const u = await laravelApi.me();
        setUser(u);
      } catch {
        TokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [laravelApi]);

  // 🔑 ここが超重要
  
async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  if (!authService) {
    throw new Error("AuthService not ready");
  }

  setIsLoading(true);

  const result = await authService.login({ email, password });

  setUser(result.user);
  setIsLoading(false);

  return result; // ★ ここが最重要
}

  async function register(args: {
    name: string;
    email: string;
    password: string;
  }): Promise<RegisterResult> {
    if (!authService) return { needsEmailVerification: true };
    return authService.register(args.name, args.email, args.password);
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

  async function reloginWithFirebaseToken(idToken: string) {
    if (!laravelApi) throw new Error("Laravel API not ready");
    const { tokens, user } = await laravelApi.loginWithFirebaseToken(
      idToken,
      "email-verify",
    );
    TokenStorage.save(tokens);
    setUser(user);
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
        reloginWithFirebaseToken,
        apiClient: laravelApi?.client ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
