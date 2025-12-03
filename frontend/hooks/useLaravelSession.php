"use client";

import { useCallback, useEffect } from "react";
import { User } from "firebase/auth";
import axios, { AxiosError } from "axios";
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

export interface CheckSessionResult {
  authenticated: boolean;
  user?: BackendUser;
  message?: string;
  status_code_override?: number;
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
    ...(name !== undefined ? { name: name } : {}),
  };

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/login_or_register`,
      payload,
      {
        withCredentials: true,
      },
    );

    // 💡 【修正】成功時の処理を追加し、必ず値を返すようにする
    const { token, user: backendUser } = res.data;

    if (token && backendUser) {
      return { token, user: backendUser }; // ✅ 成功時はここで return
    } else {
      // APIがデータの一部を返さなかった場合
      throw new Error(
        "Sanctum token exchange failed: Missing token or user data in response.",
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const detail = JSON.stringify(error.response.data);
      console.error(
        `[LOGIN_API_ERROR] Laravel API Error (${status}): ${detail}`,
        `Endpoint: ${API_BASE_URL}/api/login_or_register`,
        `Payload Keys: ${Object.keys(payload).join(", ")}`,
      );
      throw new Error(`Laravel API Error (${status}): ${detail}`); // 💡 throwで終了
    } else if (axios.isAxiosError(error) && error.request) {
      console.error(
        "[NETWORK_ERROR] Request made but no response received (possible timeout or network issue).",
        error.message,
      );
      throw new Error(`Network Error: ${error.message}`); // 💡 throwで終了
    } else {
      console.error("[UNKNOWN_LOGIN_ERROR] Unknown error during login:", error);
      throw error; // 💡 throwで終了
    }
  }
  // ⚠️ try/catchブロックの後に処理は到達しないため、ts(2355)は解消される
};

/**
 * 💡 Laravelサーバーのセッション状態を確認する関数
 */
export const checkLaravelSession = async (): Promise<CheckSessionResult> => {
  if (!API_BASE_URL) return { authenticated: false };

  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/check`);
    return res.data;
  } catch (e) {
    const error = e as AxiosError;
    if (error.response?.status === 401) {
      // 401 Unauthorized の場合
      return {
        authenticated: false,
        message: "Unauthenticated by server.",
        status_code_override: 401,
      };
    }
    // その他のエラー
    console.error("[checkLaravelSession] Error:", error);
    return { authenticated: false };
  }
};

// -----------------------------------------------------------------
// 2. メインフック: Laravelセッション同期 (useLaravelSession)
// -----------------------------------------------------------------

export const useLaravelSession = (
  user: User | null,
  auth: Auth | null,
  checkLaravelSession: () => Promise<CheckSessionResult>,
  setLaravelAuthenticated: (isAuthenticated: boolean) => void,
  setInitialCheckComplete: (isComplete: boolean) => void,
  setBackendUser: (user: BackendUser | null) => void,
) => {
  const router = useRouter();

  const isVerificationRedirect = useCallback(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("verified") === "true" || params.get("token") !== null;
  }, []);

  /**
   * 💡 セッション確立後にリダイレクトをチェックするロジックに特化
   */
  const syncAndRedirect = useCallback(async () => {
    // 💡 ログアウト状態や匿名ユーザーの場合は何もしない
    if (!user || !auth || user.isAnonymous) {
      setInitialCheckComplete(true);
      return;
    }

    try {
      // 💡 サーバーにセッション状態を問い合わせ、結果をAuthProviderにフィードバック
      const sessionData = await checkLaravelSession();
      setLaravelAuthenticated(sessionData.authenticated);

      if (sessionData.authenticated && sessionData.user) {
        setBackendUser(sessionData.user);

        // メール認証チェックとURLクリーンアップ
        const backendUser = sessionData.user;
        if (backendUser && !backendUser.email_verified_at) {
          router.push("/email/verify");
        } else if (isVerificationRedirect()) {
          // 認証完了後のURLクリーンアップ
          router.replace(window.location.pathname);
        }
      } else {
        // セッションがない場合はログアウト状態として扱う
        setBackendUser(null);
      }
    } catch (error) {
      console.error("[Sanctum Sync] An error occurred during sync:", error);
      setLaravelAuthenticated(false);
      setBackendUser(null);
    } finally {
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
    setBackendUser,
  ]);

  useEffect(() => {
    // Firebaseユーザーが設定された後、Laravelセッションの同期とリダイレクトチェックを開始
    if (user !== undefined && auth) {
      syncAndRedirect();
    }
    // 💡 依存配列
  }, [user, auth, syncAndRedirect]);

  return {};
};
