"use client";

import { useCallback, useEffect, useState } from "react";
import { User, signOut } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Auth } from "firebase/auth";

// --- 設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- 型定義 ---
interface BackendUser {
  id: number;
  email_verified_at: string | null;
  // 他のユーザー情報...
}

// -----------------------------------------------------------------
// 1. ヘルパー関数: Laravelセッション確立 (completeLaravelLogin)
// -----------------------------------------------------------------

/**
 * Firebase ID TokenをLaravelに送り、Sanctumセッションを確立する
 */
export const completeLaravelLogin = async (
  idToken: string,
  name?: string
): Promise<{ token: string; user: BackendUser }> => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined.");

  const payload = {
    id_token: idToken,
    ...(name && { name: name }),
  };

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/register_or_login`,
      payload,
      {
        withCredentials: true,
      }
    );

    const { token, user: backendUser } = res.data;

    if (token && backendUser) {
      console.log(
        "[Sanctum] Successful token exchange and session established."
      );
      return { token, user: backendUser };
    } else {
      throw new Error(
        "Sanctum token exchange failed: Missing token or user data."
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        `[Sanctum ERROR] completeLaravelLogin API failed. Status: ${error.response.status}`,
        "Data:",
        error.response.data
      );
      const status = error.response.status;
      const detail = JSON.stringify(error.response.data);
      throw new Error(`Laravel API Error (${status}): ${detail}`);
    } else {
      console.error("[Sanctum ERROR] completeLaravelLogin failed:", error);
      throw error;
    }
  }
};

// -----------------------------------------------------------------
// 2. メインフック: Laravelセッション同期 (useLaravelSession)
// -----------------------------------------------------------------

/**
 * Laravelとの認証状態の同期とリダイレクトを処理するカスタムフック
 */
export const useLaravelSession = (
  user: User | null,
  auth: Auth | null,
  checkLaravelSession: () => Promise<any> // AuthProviderから渡されるセッションチェック関数
) => {
  const router = useRouter();
  const [laravelAuthenticated, setLaravelAuthenticated] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  const isVerificationRedirect = useCallback(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("verified") === "true";
  }, []);

  // トークンを強制的にリロードするヘルパー
  const forceTokenRefresh = useCallback(async (currentUser: User) => {
    const idToken = await currentUser.getIdToken(true);
    console.log("[Firebase] Forced ID Token refresh successful during sync.");
    return idToken;
  }, []);

  /**
   * 認証状態の同期を試行し、必要に応じてリダイレクト処理を行う
   */
  const syncAndRedirect = useCallback(async () => {
    console.log("[Sanctum Sync] Starting sync check...");
    let finalAuthStatus = false;

    try {
      // ログアウト状態
      if (!user || !auth) {
        const sessionData = await checkLaravelSession();
        finalAuthStatus = sessionData.authenticated;
        console.log(
          `[Sanctum Sync] FINAL CHECK COMPLETE (Logged Out). laravelAuthenticated: ${finalAuthStatus}`
        );
        return; // ここで return しても finally は実行される
      }

      let sessionData = await checkLaravelSession();
      finalAuthStatus = sessionData.authenticated; // 最終的な認証ステータスを格納する変数

      // 匿名ユーザー
      if (user.isAnonymous) {
        if (sessionData.authenticated) {
          console.warn(
            "[Sanctum] Anonymous user found with active Laravel session. Forcing Firebase logout."
          );
          await signOut(auth);
          finalAuthStatus = false;
        } else {
          finalAuthStatus = false; // 匿名ユーザーは未認証扱い
        }
      }
      // 既存のセッションがない場合、自動ログインを試行
      else if (!sessionData.authenticated) {
        console.log(
          "[Sanctum] Non-anonymous user present but session missing. Attempting auto-login..."
        );
        try {
          // ログイン成功時にIDトークンを強制リフレッシュし、Laravelに送信
          const { user: backendUser } = await completeLaravelLogin(
            await forceTokenRefresh(user)
          );
          finalAuthStatus = true; // ログイン成功

          // リダイレクト処理
          if (!backendUser.email_verified_at) {
            router.push("/email/verify");
          } else {
            const currentPath = window.location.pathname;
            if (
              currentPath === "/login" ||
              currentPath === "/register" ||
              currentPath === "/email/verify" ||
              isVerificationRedirect()
            ) {
              router.replace("/mypage/profile");
            }
          }
        } catch (error) {
          console.error(
            "[Sanctum] Auto-login attempt failed. Forcing Firebase logout."
          );
          await signOut(auth);
          finalAuthStatus = false; // ログイン失敗
        }
      }
      // セッション確立済みの場合
      else {
        finalAuthStatus = true; // 既に認証済み
        // IDトークンを強制リフレッシュして、有効性を確保
        await forceTokenRefresh(user);
        const backendUser = sessionData.user;

        if (backendUser && !backendUser.email_verified_at) {
          router.push("/email/verify");
        } else {
          if (isVerificationRedirect()) {
            console.log("Session verified, cleaning up URL parameter.");
            router.replace(window.location.pathname);
          }
        }
      }
    } catch (error) {
      console.error("[Sanctum Sync] An error occurred during sync:", error);
      // エラー発生時は安全策として認証を解除
      finalAuthStatus = false;
    } finally {
      // 🔥 修正の核心: 全てのロジックが完了した後、最終的な状態を同時に更新する
      // 1. 最終的な認証ステータスを設定
      setLaravelAuthenticated(finalAuthStatus);

      // 2. 認証ステータスを設定した直後に完了フラグを設定
      //    (成功/失敗/エラーに関わらず、必ずロード状態を解除)
      setInitialCheckComplete(true);

      console.log(
        `[Sanctum Sync] FINAL CHECK COMPLETE. laravelAuthenticated: ${finalAuthStatus}`
      );
    }
  }, [
    user,
    auth,
    checkLaravelSession,
    router,
    forceTokenRefresh,
    isVerificationRedirect,
  ]);
  // 依存配列から laravelAuthenticated を削除。このフックは認証状態の決定者であり、自身を依存すべきではない。

  // Firebase user/auth/ready の状態変化時に同期を実行
  useEffect(() => {
    // user が null/User オブジェクトのどちらかに定まり、auth が存在し、
    // まだ初回チェックが完了していない場合のみ実行
    if (user !== undefined && auth && initialCheckComplete === false) {
      syncAndRedirect();
    }
  }, [user, auth, syncAndRedirect, initialCheckComplete]);

  return {
    laravelAuthenticated,
    initialCheckComplete,
  };
};
