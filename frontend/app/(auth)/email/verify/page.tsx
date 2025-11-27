"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
// 💡 useAuth から reloadAuthToken を取得します
import { useAuth } from "@/hooks/useAuth";

// 💡 定数: 認証状態をチェックする間隔（ミリ秒）
const CHECK_INTERVAL_MS = 3000; // 3秒ごとにチェック
// 💡 認証完了後のリダイレクト先 (ItemSellPageへの競合を避ける)
const POST_VERIFY_REDIRECT_ROUTE = "/mypage/profile?verified=true";

export default function VerifyEmailPage() {
  const router = useRouter();
  // ★ 修正: useAuth から reloadAuthToken を取得
  const { user, auth, isLoading, reloadAuthToken } = useAuth();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isReloading, setIsReloading] = useState(false); // ★ 追加: トークン再取得中
  const intervalRef = useRef<number | null>(null);

  // ---------------------------------------------
  // 副作用: 認証状態の監視とリダイレクト
  // ---------------------------------------------

  // インターバルを開始/クリアする関数を定義 (前回の修正版)
  const checkVerificationStatus = useCallback(() => {
    if (intervalRef.current !== null) return;

    console.log("未認証状態: 3秒ごとにFirebaseユーザーをリロードします。");

    const id = window.setInterval(async () => {
      if (auth?.currentUser) {
        try {
          await auth.currentUser.reload();
          console.log(
            "Firebase user reloaded. Checking verification status..."
          );
        } catch (error) {
          console.warn("Firebase user reload failed:", error);
        }
      }
    }, CHECK_INTERVAL_MS);

    intervalRef.current = id;
    return id;
  }, [auth]);

  // クリーンアップ処理を共通化
  const clearCheckInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("✅ 認証チェックインターバルを停止しました。");
    }
  }, []);

  useEffect(() => {
    // 1. 認証状態が解決するまで待つ or トークン再取得中は待つ
    if (isLoading || isReloading) return;

    // 2. 未ログイン（Firebaseのuserオブジェクトがない状態） → login へ
    if (!user) {
      clearCheckInterval();
      console.log("未ログイン状態を検知。/loginへリダイレクト。");
      router.replace("/login");
      return;
    }

    // 3. すでにメール認証済み（userが存在し、emailVerifiedがtrue）
    if (user.emailVerified) {
      clearCheckInterval();

      // ★★★ 最重要修正箇所 ★★★
      // Firebase認証完了後、SanctumセッションとBackendUserの状態を強制的に最新化
      if (!isReloading) {
        setIsReloading(true);
        console.log(
          "Firebaseメール認証完了。Sanctumセッション確立のため reloadAuthToken を実行します。"
        );

        reloadAuthToken()
          .then(() => {
            console.log("✅ トークンとプロフィール情報のリフレッシュに成功。");
            // 状態が完全に更新された後、安全なルートへリダイレクト
            router.replace(POST_VERIFY_REDIRECT_ROUTE);
          })
          .catch((error) => {
            // リロード失敗時はエラーメッセージを表示するか、ログアウト
            console.error(
              "Sanctumセッション確立/トークンリフレッシュに失敗:",
              error
            );
            setStatusMessage(
              "認証情報の更新に失敗しました。再度ログインしてください。"
            );
            // 💡 エラー処理: ログアウト処理を入れるのも手ですが、ここでは表示に留めます
          })
          .finally(() => {
            setIsReloading(false);
          });
      }
      return;
    }
    // ★★★ 修正箇所終わり ★★★

    // 4. 未認証でこのページに留まる場合: 認証状態を定期的にチェックするインターバルを開始
    if (!user.emailVerified && intervalRef.current === null) {
      checkVerificationStatus();
    }

    return () => {
      // クリーンアップはクリアCheckIntervalに任せる
    };
  }, [
    isLoading,
    user,
    router,
    checkVerificationStatus,
    clearCheckInterval,
    reloadAuthToken,
    isReloading,
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
  // 認証メール再送 (ロジックは変更なし)
  // ---------------------------------------------
  const handleResend = async () => {
    // ... (省略)
  };

  // ---------------------------------------------
  // レンダリング (変更なし)
  // ---------------------------------------------

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-gray-50">
      {/* ... HTMLレンダリング ... */}
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
