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
 * (useAuthとuseLaravelSessionの両方から参照できるように、ファイル内でexportしています)
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

  // SanctumはCookieベースの認証であり、このPOSTリクエストはセッション確立を担う
  const res = await axios.post(
    `${API_BASE_URL}/api/register_or_login`,
    payload,
    {
      withCredentials: true, // Sanctum Cookieの送受信に必須
    }
  );

  const { token, user: backendUser } = res.data;

  if (token && backendUser) {
    console.log("[Sanctum] Successful token exchange and session established.");
    return { token, user: backendUser };
  } else {
    throw new Error(
      "Sanctum token exchange failed: Missing token or user data."
    );
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

  // URLクエリパラメータからメール認証状態を取得
  const isVerificationRedirect = useCallback(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("verified") === "true";
  }, []);

  // トークンを強制的にリロードするヘルパー
  const forceTokenRefresh = useCallback(async (currentUser: User) => {
    // キャッシュを無視して、Firebaseから最新のトークンを強制的に取得
    const idToken = await currentUser.getIdToken(true);
    console.log("[Firebase] Forced ID Token refresh successful during sync.");
    return idToken;
  }, []);

  /**
   * 認証状態の同期を試行し、必要に応じてリダイレクト処理を行う
   */
  const syncAndRedirect = useCallback(async () => {
    if (!user || !auth) {
      // ログアウト状態の場合、Laravelセッションチェックのみ実行
      const sessionData = await checkLaravelSession();
      setLaravelAuthenticated(sessionData.authenticated);
      setInitialCheckComplete(true);
      return;
    }

    let sessionData = await checkLaravelSession();

    // 匿名ユーザーまたはLaravelセッションが既に確立されている場合はスキップ
    if (user.isAnonymous) {
      if (sessionData.authenticated) {
        console.warn(
          "[Sanctum] Anonymous user found with active Laravel session. Forcing logout."
        );
        await signOut(auth);
      }
      setInitialCheckComplete(true);
      return;
    }

    // 既存のセッションがない場合、自動ログインを試行
    if (!sessionData.authenticated) {
      console.log(
        "[Sanctum] Non-anonymous user present but session missing. Attempting auto-login..."
      );
      try {
        // nameはauto-loginの際は省略
        const { user: backendUser } = await completeLaravelLogin(
          await forceTokenRefresh(user) // 最新のトークンで自動ログイン
        );
        setLaravelAuthenticated(true);

        // Sanctumセッション確立後、useApiなどが最新トークンを使うことを保証するため再度強制リロード
        await forceTokenRefresh(user);

        // リダイレクト処理
        if (!backendUser.email_verified_at) {
          router.push("/email/verify");
        } else {
          // 自動ログイン成功時は、認証が必要なページへリダイレクト
          const currentPath = window.location.pathname;

          if (
            currentPath === "/login" ||
            currentPath === "/register" ||
            currentPath === "/email/verify" ||
            isVerificationRedirect()
          ) {
            // replaceを使用して履歴を整理し、無限ループを防ぐ
            router.replace("/mypage/profile");
          }
        }
      } catch (error) {
        console.error(
          "[Sanctum] Auto-login attempt failed. Forcing Firebase logout."
        );
        await signOut(auth);
      }
    } else {
      // セッション確立済みの場合

      // ✅ 修正済み箇所: セッション確立済みの場合も true に設定する
      setLaravelAuthenticated(true);

      // セッション確立済みの場合も、useApiが最新のトークンを使用することを保証するため強制リロード
      await forceTokenRefresh(user);

      const backendUser = sessionData.user;

      if (backendUser && !backendUser.email_verified_at) {
        router.push("/email/verify");
      } else {
        // 認証完了済みの場合、URLクエリパラメータをクリーンアップ
        if (isVerificationRedirect()) {
          console.log("Session verified, cleaning up URL parameter.");
          // verified=true を URL から削除し、ループを止める
          router.replace(window.location.pathname);
        }
      }
    }

    setInitialCheckComplete(true);
  }, [
    user,
    auth,
    checkLaravelSession,
    router,
    forceTokenRefresh,
    isVerificationRedirect,
  ]);

  // Firebase user/auth/ready の状態変化時に同期を実行
  useEffect(() => {
    // initialCheckCompleteがtrueになれば、以降は実行されない
    if (user !== undefined && auth && initialCheckComplete === false) {
      syncAndRedirect();
    }
  }, [user, auth, syncAndRedirect, initialCheckComplete]);

  return {
    laravelAuthenticated,
    initialCheckComplete,
    // completeLaravelLogin はこのファイルで export されているため、フックの戻り値からは削除
  };
};
