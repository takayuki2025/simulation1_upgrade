"use client";

import React, {
  createContext,
  useEffect,
  useRef,
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
import type {
  AuthContextType,
  RegisterResult,
  LoginResult,
} from "./AuthContextType";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authServiceRef = useRef<AuthService | null>(null);
  const laravelApiRef = useRef<LaravelAuthApi | null>(null);
  const refreshServiceRef = useRef<TokenRefreshService | null>(null);

  /** 初期化（1回だけ） */
  useEffect(() => {
    const firebase = new FirebaseAuthClient();

    const api = new LaravelAuthApi(
      createHttpClient(async () => {
        const refresh = refreshServiceRef.current;
        const api = laravelApiRef.current;
        if (!refresh || !api) return;

        const tokens = await refresh.refresh();
        if (!tokens) {
          TokenStorage.clear();
          setUser(null);
          return;
        }

        TokenStorage.save(tokens);
        const u = await api.me();
        setUser(u);
      }),
    );

    const auth = new AuthService(firebase, api);
    const refresh = new TokenRefreshService(api);

    laravelApiRef.current = api;
    authServiceRef.current = auth;
    refreshServiceRef.current = refresh;

    // 起動時 /me
    const { accessToken } = TokenStorage.load();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const u = await api.me();
        setUser(u);
      } catch {
        TokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /** login */
  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    const auth = authServiceRef.current;
    if (!auth) throw new Error("AuthService not ready");

    setIsLoading(true);
    const result = await auth.login({ email, password });
    setUser(result.user);
    setIsLoading(false);

    return result;
  }

  async function register(args: {
    name: string;
    email: string;
    password: string;
  }): Promise<RegisterResult> {
    const auth = authServiceRef.current;
    if (!auth) return { needsEmailVerification: true };
    return auth.register(args.name, args.email, args.password);
  }

  async function logout() {
    const auth = authServiceRef.current;
    if (!auth) return;
    await auth.logout();
    setUser(null);
  }

  async function reloadUser() {
    const api = laravelApiRef.current;
    if (!api) return;
    try {
      const u = await api.me();
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
        reloginWithFirebaseToken: async () => {
          throw new Error("Not supported in this flow");
        },
        apiClient: laravelApiRef.current?.client ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
