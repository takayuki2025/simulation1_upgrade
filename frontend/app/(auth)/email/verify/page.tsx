"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
// Next.js Router
import { useRouter, usePathname } from "next/navigation";
// Axiosの型定義（AxiosError）のみをインポート
import { AxiosError } from "axios";
// カスタムフックから認証状態とAPIクライアントを取得
import { useAuth } from "@/hooks/useSanctumAuth";

// --- ユーティリティ: エラーハンドリングのための型述語 ---
// 💡 catchブロックのerrorを安全に扱うためのプロフェッショナルな解決策
const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
};

const toErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return String(error);
};
// --------------------------------------------------------

// 定数: 認証状態をチェックする間隔（ミリ秒）
const CHECK_INTERVAL_MS = 3000; // 3秒ごとにチェック
// 認証完了後のリダイレクト先
const POST_VERIFY_REDIRECT_ROUTE = "/mypage/profile?verified=true";

export default function VerifyEmailPage() {
  const router = useRouter();
  const pathname = usePathname();

  // useAuthから必要な情報を取得
  const { user, auth, isLoading, reloadAuthToken, apiClient } = useAuth();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // ---------------------------------------------
  // 副作用: 認証状態の監視とリダイレクト (変更なし)
  // ---------------------------------------------

  const checkVerificationStatus = useCallback(() => {
    if (intervalRef.current !== null) return;

    console.log("未認証状態: 3秒ごとにFirebaseユーザーをリロードします。");

    const id = window.setInterval(async () => {
      if (auth?.currentUser) {
        try {
          await auth.currentUser.reload();
          console.log(
            "Firebase user reloaded. Checking verification status...",
          );
        } catch (error) {
          console.warn("Firebase user reload failed:", error);
        }
      }
    }, CHECK_INTERVAL_MS);

    intervalRef.current = id;
    return id as unknown as number;
  }, [auth]);

  const clearCheckInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("✅ 認証チェックインターバルを停止しました。");
    }
  }, []);

  useEffect(() => {
    if (isLoading || isReloading) return;

    // URLパラメータからのトークン取得と処理
    const params = new URLSearchParams(window.location.search);
    const isVerifiedFromRedirect = params.get("verified") === "true";

    // Laravelからの認証成功リダイレクトを検知した場合
    if (isVerifiedFromRedirect) {
      clearCheckInterval();
      router.replace(pathname);

      if (!isReloading) {
        setIsReloading(true);
        console.log(
          "Laravel認証リダイレクトを検知。Sanctumセッション確立のため reloadAuthToken を実行します。",
        );

        reloadAuthToken()
          .then(() => {
            console.log("✅ トークンとプロフィール情報のリフレッシュに成功。");
            router.replace(POST_VERIFY_REDIRECT_ROUTE);
          })
          .catch((error) => {
            console.error(
              "リダイレクト後のSanctumセッション確立に失敗:",
              error,
            );
            // 💡 toErrorMessageを使用
            setStatusMessage(
              `認証情報の更新に失敗しました。再度ログインしてください。 (${toErrorMessage(error)})`,
            );
          })
          .finally(() => {
            setIsReloading(false);
          });
      }
      return;
    }

    // 未ログイン（Firebaseのuserオブジェクトがない状態） → login へ
    if (!user) {
      clearCheckInterval();
      console.log("未ログイン状態を検知。/loginへリダイレクト。");
      router.replace("/login");
      return;
    }

    // すでにメール認証済み（userが存在し、emailVerifiedがtrue）
    if (user.emailVerified) {
      clearCheckInterval();

      if (!isReloading) {
        setIsReloading(true);
        console.log(
          "Firebaseメール認証完了。Sanctumセッション確立のため reloadAuthToken を実行します。",
        );

        reloadAuthToken()
          .then(() => {
            console.log("✅ トークンとプロフィール情報のリフレッシュに成功。");
            router.replace(POST_VERIFY_REDIRECT_ROUTE);
          })
          .catch((error) => {
            console.error(
              "Sanctumセッション確立/トークンリフレッシュに失敗:",
              error,
            );
            // 💡 toErrorMessageを使用
            setStatusMessage(
              `認証情報の更新に失敗しました。再度ログインしてください。 (${toErrorMessage(error)})`,
            );
          })
          .finally(() => {
            setIsReloading(false);
          });
      }
      return;
    }

    // 未認証でこのページに留まる場合: 認証状態を定期的にチェックするインターバルを開始
    if (!user.emailVerified && intervalRef.current === null) {
      checkVerificationStatus();
    }

    return () => {
      clearCheckInterval();
    };
  }, [
    isLoading,
    user,
    router,
    checkVerificationStatus,
    clearCheckInterval,
    reloadAuthToken,
    isReloading,
    pathname,
  ]);

  // Still loading
  if (isLoading || isReloading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="ml-3 text-gray-700">
          {isReloading ? "認証情報を確定中..." : "認証状態を確認中..."}
        </p>
      </div>
    );
  }

  // 認証済みだと useEffect で移動するので return null
  if (!user || user.emailVerified) return null;

  // ---------------------------------------------
  // 認証メール再送 (Laravel API 利用)
  // ---------------------------------------------
  const handleResend = async () => {
    if (!apiClient) {
      setStatusMessage("エラー: APIクライアントが初期化されていません。");
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    try {
      // Sanctum Token を使って、Laravelのメール再送エンドポイントを叩く
      await apiClient.post("/api/email/verification-notification");

      setStatusMessage(
        "新しい認証メールを送信しました。メールボックスを確認してください。",
      );
    } catch (error) {
      console.error(
        "Failed to resend email verification via Laravel API:",
        error,
      );

      // 💡 プロフェッショナルなエラー処理: AxiosError -> 型述語を使った標準エラー
      let errorMessage = "不明なエラーです。";

      if (error instanceof AxiosError) {
        // AxiosErrorの場合、レスポンス内のLaravelエラーメッセージを優先
        errorMessage = error.response?.data?.message || error.message;
      } else {
        // それ以外の場合、汎用ヘルパー関数を使用
        errorMessage = toErrorMessage(error);
      }

      setStatusMessage(
        `認証メールの再送に失敗しました。時間をおいてお試しください。 (${errorMessage})`,
      );
    } finally {
      setIsSending(false);
    }
  };

  // ---------------------------------------------
  // レンダリング (変更なし)
  // ---------------------------------------------

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-gray-50">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-6 border-b-2 pb-3 text-center">
          💌 メール認証のお願い
        </h2>

        <div className="space-y-4 text-gray-700 text-center">
          <p className="text-xl font-medium">ご登録ありがとうございます！</p>
          <p className="text-base">
            以下のメールアドレス宛に**認証メール**を送付しました。
            <br />
            <span className="font-bold text-lg text-blue-700">
              {user.email ?? "メールアドレス不明"}
            </span>
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md shadow-sm">
            <p className="text-base font-semibold text-red-600">
              メール内のリンクをクリックして認証を完了してください。
            </p>
            <p className="text-sm mt-1 text-gray-600">
              認証が完了すると、このページは自動的に移動します。
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-6 p-3 bg-green-100 text-green-700 rounded text-sm font-medium text-center border border-green-300">
            {statusMessage}
          </div>
        )}

        {/* 開発用メール確認 */}
        <div className="mt-8 text-center">
          <a
            href="http://localhost:8025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800 transition duration-150 shadow-md text-sm"
          >
            👨‍💻 開発用: メールボックスを確認 (MailHog)
          </a>
        </div>

        {/* 認証メール再送 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResend();
          }}
          className="mt-6"
        >
          <button
            type="submit"
            disabled={isSending || isReloading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-bold text-lg hover:bg-indigo-700 transition duration-150 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSending
              ? "送信中..."
              : isReloading
                ? "認証情報の確定中..."
                : "認証メールを再送する"}
          </button>
        </form>
      </div>
    </div>
  );
}
