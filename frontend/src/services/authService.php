import axios from "axios";
import type { AxiosInstance } from "axios";

// Laravel 側で扱うユーザー型
export interface LaravelUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  uid: string;
  post_number: string | null;
  address: string | null;
  building: string | null;
  user_image?: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ------------------------------------------------------
// 1. Firebase Email/Password ログイン
//    → Firebase ID Token を取得
//    → Laravel へ POST /api/login_or_register
// ------------------------------------------------------
import { getFirebaseAuth } from "@/src/lib/firebase";
import { signInWithEmailAndPassword, type UserCredential } from "firebase/auth";

export async function loginWithEmailPassword(
  email: string,
  password: string,
): Promise<{ token: string; user: LaravelUser }> {
  const auth = getFirebaseAuth();

  // 1. Firebase ログイン
  const cred: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const idToken = await cred.user.getIdToken();

  // 2. Laravel の Token 交換
  const res = await axios.post(`${API_BASE_URL}/api/login_or_register`, {
    id_token: idToken,
    name: cred.user.displayName ?? undefined,
  });

  const token = res.data.token;
  const user = res.data.user;

  if (!token || !user) {
    throw new Error("Token exchange failed (token or user missing)");
  }

  return { token, user };
}

// ------------------------------------------------------
// 2. Sanctum Token で /api/user を取得
// ------------------------------------------------------
export async function fetchCurrentUser(
  client: AxiosInstance,
): Promise<LaravelUser> {
  const res = await client.get("/api/user");
  return res.data as LaravelUser;
}

// ------------------------------------------------------
// 3. ログアウト（Laravel + Firebase）
// ------------------------------------------------------
export async function logoutFromAll(client: AxiosInstance) {
  try {
    await client.post("/api/logout");
  } catch (e) {
    console.warn("Laravel logout failed (ignored):", e);
  }
}
