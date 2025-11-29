"use client";

import { useCallback, useEffect } from "react";
import { User, signOut } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Auth } from "firebase/auth";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- 型定義 ---
export interface BackendUser {
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

// -----------------------------------------------------------------
// 1. ヘルパー関数: Laravelセッション確立 (completeLaravelLogin)
// -----------------------------------------------------------------

export const completeLaravelLogin = async (
  idToken: string,
  name?: string,
): Promise<{ token: string; user: BackendUser }> => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined.");

  const payload = {
    id_token: idToken,
    ...(name && { name: name }),
  };

  try {
    const res = await axios.post(
      // ★★★ 修正箇所: URLを '/api/login_or_register' に修正 (404エラー対策) ★★★
      `${API_BASE_URL}/api/login_or_register`,
      payload,
      {
        withCredentials: true,
      },
    );

    const { token, user: backendUser } = res.data;

    if (token && backendUser) {
      return { token, user: backendUser };
    } else {
      throw new Error(
        "Sanctum token exchange failed: Missing token or user data.",
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const detail = JSON.stringify(error.response.data);
      console.error(
        "PAGE_HANDLE: Login failed in catch block. Error:",
        `Laravel API Error (${status}): ${detail}`,
      );
      throw new Error(`Laravel API Error (${status}): ${detail}`);
    } else {
      throw error;
    }
  }
};

export const checkLaravelSession = async (): Promise<{
  authenticated: boolean;
  user?: BackendUser;
}> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/check`);
    return res.data;
  } catch {
    // 401 Unauthorized の場合はここに来る。
    return { authenticated: false };
  }
};

// -----------------------------------------------------------------
// 2. メインフック: Laravelセッション同期 (useLaravelSession)
// -----------------------------------------------------------------

export const useLaravelSession = (
  user: User | null,
  auth: Auth | null,
  checkLaravelSession: () => Promise<{
    authenticated: boolean;
    user?: BackendUser;
  }>,
  setLaravelAuthenticated: (isAuthenticated: boolean) => void,
  setInitialCheckComplete: (isComplete: boolean) => void,
) => {
  const router = useRouter();

  const isVerificationRedirect = useCallback(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("verified") === "true" || params.get("token") !== null;
  }, []);

  const syncAndRedirect = useCallback(async () => {
    let finalAuthStatus = false;

    try {
      const sessionData = await checkLaravelSession();
      finalAuthStatus = sessionData.authenticated;

      // 1. ログアウト状態 or 匿名ユーザーの場合の処理
      if (!user || !auth || user.isAnonymous) {
        // 💡 匿名ユーザーだがLaravelセッションがある場合、Firebase側を強制ログアウト（状態のクリーンアップ）
        if (user?.isAnonymous && sessionData.authenticated && auth) {
          await signOut(auth);
          finalAuthStatus = false;
          console.log(
            "[Sanctum Sync] Forced Firebase sign-out due to anonymous user having Laravel session.",
          );
        }
        // ログアウト状態はここで状態を確定させる
        setLaravelAuthenticated(finalAuthStatus);
        setInitialCheckComplete(true);
        return;
      }

      // 2. ユーザーはいるがセッションがない場合 (ログイン直後の競合回避)
      else if (!sessionData.authenticated) {
        // セッションがない場合は、外部のログイン処理（useSanctumAuth）が Firebase Token を使って
        // completeLaravelLogin を実行するのを待つため、ここでは何もしない。
        // checkLaravelSessionが再実行されるのを待機
        console.log(
          "[Sanctum Sync] Firebase user present but no Laravel session. Awaiting token exchange.",
        );
        return;
      }

      // 3. セッション確立済みの場合 (リロード時など)
      else {
        // 💡 既にセッションが確立されている場合は確定させる
        setLaravelAuthenticated(finalAuthStatus);
        setInitialCheckComplete(true);
        console.log(
          "[Sanctum Sync] Laravel session confirmed and user authenticated.",
        );

        // メール認証チェックとURLクリーンアップ（リダイレクト補助ロジック）
        const backendUser = sessionData.user;
        if (backendUser && !backendUser.email_verified_at) {
          router.push("/email/verify");
        } else if (isVerificationRedirect()) {
          // メール認証完了後のリダイレクトパラメータをクリーンアップ
          router.replace(window.location.pathname);
        }
      }
    } catch (error) {
      console.error("[Sanctum Sync] An error occurred during sync:", error);
      setLaravelAuthenticated(false);
      setInitialCheckComplete(true);
    }
  }, [
    user,
    auth,
    checkLaravelSession,
    router,
    isVerificationRedirect,
    setLaravelAuthenticated,
    setInitialCheckComplete,
  ]);

  useEffect(() => {
    if (user !== undefined && auth) {
      syncAndRedirect();
    }
  }, [user, auth, syncAndRedirect]);

  return {};
};
