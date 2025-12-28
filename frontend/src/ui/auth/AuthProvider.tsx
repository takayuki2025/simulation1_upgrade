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
import type { AuthUser } from "@/types/auth";
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

  useEffect(() => {
    const firebase = new FirebaseAuthClient();

    // ① API を作る（client は後で注入）
    const api = new LaravelAuthApi(null);

    // ② refresh service（api.refresh を呼ぶ）
    const refresh = new TokenRefreshService(api);

    // ③ http client（interceptor 内で refresh.refresh() を呼ぶ）
    const client = createHttpClient(refresh);

    // ④ api に client 注入（unsafe any 禁止）
    api.setClient(client);

    const auth = new AuthService(firebase, api);

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

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    const auth = authServiceRef.current;
    const api = laravelApiRef.current;
    if (!auth || !api) throw new Error("AuthService not ready");

    setIsLoading(true);

    // ① login_or_register（トークン発行）
    const result = await auth.login({ email, password });

    // ② user は /me で確定
    const freshUser = await api.me();
    setUser(freshUser);

    setIsLoading(false);

    return {
      user: freshUser,
      isFirstLogin: result.isFirstLogin,
    };
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
