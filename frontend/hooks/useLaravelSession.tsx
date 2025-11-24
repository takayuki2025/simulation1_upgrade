import { useCallback, useEffect, useState } from "react";
import { User, signOut } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Auth } from "firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface BackendUser {
  id: number;
  email_verified_at: string | null;
  // 他のユーザー情報...
}

/**
 * Firebase ID TokenをLaravelに送り、Sanctumセッションを確立する
 * (useAuthフックに移動し、useAuthとuseLaravelSessionの両方から参照できるようにします)
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

  const res = await axios.post(
    `${API_BASE_URL}/api/register_or_login`,
    payload
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

/**
 * Laravelとの認証状態の同期とリダイレクトを処理するカスタムフック
 */
export const useLaravelSession = (
  user: User | null,
  auth: Auth | null,
  checkLaravelSession: () => Promise<any>
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

  const syncAndRedirect = useCallback(async () => {
    if (!user || !auth) {
      // ログアウト状態の場合、Laravelセッションチェックのみ実行
      const sessionData = await checkLaravelSession();
      setLaravelAuthenticated(sessionData.authenticated);
      setInitialCheckComplete(true);
      return;
    }

    // ★修正: getIdToken(false) を使用し、トークンが古ければ強制リロードする
    let idToken = await forceTokenRefresh(user);
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
        const { user: backendUser } = await completeLaravelLogin(idToken);
        setLaravelAuthenticated(true);

        // ★★★ 修正点 1: Sanctumセッション確立後、Firebaseトークンを再度強制リロード ★★★
        // useApiが最新トークンを使うことを保証するため、二重に実行します
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
      // セッション確立済みの場合のリダイレクトチェック

      // ★★★ 修正点 2: セッション確立済みの場合もトークンを強制リロード ★★★
      await forceTokenRefresh(user);

      const backendUser = sessionData.user;

      if (backendUser && !backendUser.email_verified_at) {
        router.push("/email/verify");
      } else {
        // ★★★ 修正点 3: 認証完了済みの場合、URLクエリパラメータをクリーンアップ ★★★
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
    completeLaravelLogin,
  };
};
