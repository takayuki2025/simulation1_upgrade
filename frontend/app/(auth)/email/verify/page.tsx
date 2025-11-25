"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

// 💡 定数: 認証状態をチェックする間隔（ミリ秒）
const CHECK_INTERVAL_MS = 3000; // 3秒ごとにチェック
// 💡 定数: 認証完了後にLaravelセッション確立を試みるルート
const POST_VERIFY_REDIRECT_ROUTE = "/mypage/profile?verified=true"; // Laravel側のリダイレクトと一致させる

export default function VerifyEmailPage() {
    const router = useRouter();
  // user: Firebase Authのユーザーオブジェクト, isAuthenticated: Laravelセッションの有無
    const { user, auth, isLoading } = useAuth(); // isAuthenticated は依存配列で使用

    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

  // ---------------------------------------------
  // 副作用: 認証が必要 / 既に認証済みの場合のリダイレクトと認証状態の監視
  // ---------------------------------------------

  // インターバル関数をメモ化
    const startVerificationCheck = useCallback(() => {
    console.log("未認証状態: 3秒ごとにFirebaseユーザーをリロードします。");

    // 既存のインターバルをクリア
    const existingInterval = window.sessionStorage.getItem("verifyInterval");
    if (existingInterval) {
    clearInterval(parseInt(existingInterval));
    window.sessionStorage.removeItem("verifyInterval");
    }

    const intervalId = setInterval(async () => {
      // Firebaseユーザーオブジェクトを強制的に最新にリロード
    if (auth?.currentUser) {
        try {
          // これが成功すると、onAuthStateChanged経由で 'user' オブジェクトが更新される
        await auth.currentUser.reload();
        console.log(
            "Firebase user reloaded. Checking verification status..."
        );
        } catch (error) {
        console.warn("Firebase user reload failed:", error);
          // エラーが発生した場合、セッション切れの可能性もあるため、インターバルはそのまま
        }
    }
    }, CHECK_INTERVAL_MS);

    // インターバルIDを sessionStorage に保存
    window.sessionStorage.setItem("verifyInterval", intervalId.toString());

    return intervalId;
    }, [auth]);

    useEffect(() => {
    // 1. 認証状態が解決するまで待つ
    if (isLoading) return;

    const intervalId = window.sessionStorage.getItem("verifyInterval");

    // 2. 未ログイン（Firebaseのuserオブジェクトがない状態） → login へ
    if (!user) {
        if (intervalId) clearInterval(parseInt(intervalId));
        window.sessionStorage.removeItem("verifyInterval");
        console.log("未ログイン状態を検知。/loginへリダイレクト。");
        router.replace("/login");
        return;
    }

    // 3. すでにメール認証済み（userが存在し、emailVerifiedがtrue）
    // 認証完了後のリダイレクトを**POST_VERIFY_REDIRECT_ROUTE**に統一
    if (user.emailVerified) {
        if (intervalId) clearInterval(parseInt(intervalId));
        window.sessionStorage.removeItem("verifyInterval");

      // 認証完了後は、Sanctumトークンを確立するためのルートへリダイレクト
        console.log(
        "Firebaseメール認証完了。Sanctumセッション確立のためリダイレクト。"
        );
        router.replace(POST_VERIFY_REDIRECT_ROUTE);
        return;
    }

    // 4. 未認証でこのページに留まる場合: 認証状態を定期的にチェックするインターバルを開始/維持
    if (!user.emailVerified && !intervalId) {
        startVerificationCheck();
    }

    // 5. クリーンアップ関数
    return () => {
      // コンポーネントがアンマウントされても、認証完了まではインターバルは残しておく
      // 認証完了時にのみ、インターバルを停止するロジックを優先します。
    };
  }, [isLoading, user, router, startVerificationCheck]); // isAuthenticated の削除（Firebase userの状態に依存させる）

  // Still loading
    if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="ml-3 text-gray-700">認証状態を確認中...</p>
        </div>
    );
    }

  // 認証済みだと useEffect で移動するので return null
    if (!user || user.emailVerified) return null;

  // ---------------------------------------------
  // 認証メール再送 (ロジックは変更なし)
  // ---------------------------------------------
    const handleResend = async () => {
    if (!auth?.currentUser) return;

    setStatusMessage(null);
    setIsSending(true);

    try {
        await sendEmailVerification(auth.currentUser);
        setStatusMessage("新しい認証リンクをメールに送信しました。");
    } catch (err) {
        console.error("Resend verification failed:", err);
        setStatusMessage(
        "認証メールの再送に失敗しました。しばらくしてからお試しください。"
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
                認証が完了すると、このページは自動的にホームへ移動します。
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
            disabled={isSending}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-bold text-lg hover:bg-indigo-700 transition duration-150 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
            {isSending ? "送信中..." : "認証メールを再送する"}
            </button>
        </form>
        </div>
    </div>
    );
}
