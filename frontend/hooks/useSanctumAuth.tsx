"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import axios, { AxiosInstance, AxiosError } from "axios";
import { createApiClient } from "@/src/lib/api";

// Firebase
import {
  getAuth,
  signInWithEmailAndPassword,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth } from "@/src/lib/firebase";

// Laravel User Type
export interface LaravelUser {
  id: number;
  name: string;
  email: string;
  user_image?: string | null;
}

// CONTEXT 型
export interface AuthContextType {
  user: LaravelUser | null;
  firebaseUser: FirebaseUser | null;

  apiClient: AxiosInstance | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// API Base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// -----------------------------------------------
// Provider
// -----------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<LaravelUser | null>(null);

  const [apiClient, setApiClient] = useState<AxiosInstance | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  // -----------------------------------------------
  // Firebase onAuthStateChanged
  // -----------------------------------------------
  useEffect(() => {
    console.log("[AuthProvider] onAuthStateChanged START");

    const unsub = auth.onAuthStateChanged(async (u) => {
      console.log("[AuthProvider] Firebase user =", u);
      console.log(
        "[AuthProvider] BEFORE createApiClient apiClient =",
        apiClient,
      );

      if (u) {
        const idToken = await u.getIdToken();
        console.log(
          "[AuthProvider] Firebase ID token =",
          idToken.substring(0, 12),
        );

        // Cookie
        await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });

        await axios.post(
          `${API_BASE_URL}/api/login_or_register`,
          { id_token: idToken },
          { withCredentials: true },
        );

        const client = createApiClient();
        console.log("[AuthProvider] NEW apiClient =", client);
        setApiClient(() => client); // これで Promise 化を防止

        const me = await client.get("/api/user");
        console.log("[AuthProvider] /api/user response =", me.data);

        setUser(me.data.user);
      } else {
        console.log("[AuthProvider] Firebase user not found");
        setUser(null);
        setApiClient(null);
      }

      setIsLoading(false);
    });

    return () => unsub();
  }, [auth]);

  // -----------------------------------------------
  // login(email, password)
  // -----------------------------------------------
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);

      try {
        console.log("[Login] Firebase login start:", email);

        const cred = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await cred.user.getIdToken();

        // Sanctum CSRF
        await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });

        // Laravel にログイン要求
        await axios.post(
          `${API_BASE_URL}/api/login_or_register`,
          { id_token: idToken },
          { withCredentials: true },
        );

        // Cookie 認証 API Client
        const client = createApiClient();
        setApiClient(() => client); // これで Promise 化を防止

        const me = await client.get("/api/user");
        setUser(me.data.user);

        console.log("[Login] Success → Laravel cookie authenticated");
      } catch (err) {
        console.error("[Login] Failed", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [auth],
  );

  // -----------------------------------------------
  // logout
  // -----------------------------------------------
  const logout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      if (apiClient) {
        await apiClient.post("/api/logout");
      }
    } catch (err) {
      console.error("logout error:", err);
    }

    if (auth) {
      await auth.signOut();
    }

    setUser(null);
    setApiClient(null);
    setIsLoggingOut(false);
  }, [apiClient, auth]);

  // -----------------------------------------------
  // isAuthenticated
  // -----------------------------------------------
  const isAuthenticated = useMemo(() => {
    return !!user;
  }, [user]);

  // -----------------------------------------------
  // 値
  // -----------------------------------------------
  const value: AuthContextType = {
    user,
    firebaseUser,
    apiClient,
    isAuthenticated,
    isLoading,
    isLoggingOut,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// -----------------------------------------------
// Hooks
// -----------------------------------------------
export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used inside <AuthProvider>");
  return c;
}

export function useApiClient() {
  const { apiClient } = useAuth();
  if (!apiClient) throw new Error("API client not ready");
  return apiClient;
}
