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
import { apiToken } from "@/src/lib/api/client";

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
}

export interface AuthContextType {
  user: LaravelUser | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  apiClient: AxiosInstance | null;

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

/* ============================================================
   Context 作成
============================================================ */
const AuthContext = createContext<AuthContextType | null>(null);

/* ============================================================
   Laravel User の変換
============================================================ */
function mapLaravelUser(raw: any): LaravelUser {
  return {
    ...raw,
    emailVerified: raw.email_verified_at !== null,
  };
}

/* ============================================================
   Laravel login/register API
============================================================ */
async function loginWithLaravel(
  idToken: string,
  name?: string, // register のときだけ必要
): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(
    `/api/login_or_register`,
    { id_token: idToken, name },
    { withCredentials: true },
  );

  return data;
}

/* ============================================================
   Sanctum API Client 生成
============================================================ */
function createSanctumApiClient(token: string): AxiosInstance {
  return axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

/* ============================================================
   AuthProvider
============================================================ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LaravelUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const sanctumApiClient = useMemo(() => {
    if (!token) return null;
    return createSanctumApiClient(token);
  }, [token]);

  /* ============================================================
     メール認証後：Laravel と同期する
============================================================ */
  const reloadAuthToken = useCallback(async () => {
    if (!firebaseUser) return;

    const idToken = await firebaseUser.getIdToken(true);
    const result = await loginWithLaravel(idToken);

    apiToken.set(result.token);
    setToken(result.token);

    const client = createSanctumApiClient(result.token);
    const me = await client.get("/user");

    setUser(mapLaravelUser(me.data.user));
  }, [firebaseUser]);

  /* ============================================================
     Firebase auth listener
============================================================ */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
        apiToken.clear();
        setIsLoading(false);
        return;
      }

      setFirebaseUser(u);
      setIsLoading(false);
    });

    return () => unsub();
  }, [auth]);

  /* ============================================================
     Firebase token refresh
============================================================ */
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (u) => {
      if (!u || isRegistering) return;
      await u.getIdToken(true); // ← 強制リフレッシュに変更！
    });

    return () => unsub();
  }, [auth, isRegistering]);

  /* ============================================================
   LOGIN（強制リフレッシュ版）
============================================================ */
  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // 🔥 修正ポイント：必ず最新 token を生成
      const idToken = await cred.user.getIdToken(true);

      const result = await loginWithLaravel(idToken);

      apiToken.set(result.token);
      setToken(result.token);

      const client = createSanctumApiClient(result.token);
      const me = await client.get("/user");
      setUser(mapLaravelUser(me.data.user));
    },
    [auth],
  );

  /* ============================================================
   REGISTER（強制リフレッシュ版）
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
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(cred.user, { displayName: name });

        const idToken = await cred.user.getIdToken(true);

        const result = await loginWithLaravel(idToken, name);

        apiToken.set(result.token);
        setToken(result.token);

        const client = createSanctumApiClient(result.token);
        const me = await client.get("/user");
        setUser(mapLaravelUser(me.data.user));

        return { needsEmailVerification: true };
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
    apiToken.clear();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        apiClient: sanctumApiClient,
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

export function useApiClient() {
  const { apiClient } = useAuth();
  if (!apiClient) throw new Error("API client not ready");
  return apiClient;
}
