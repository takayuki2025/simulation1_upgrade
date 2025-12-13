"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/ui/auth/useAuth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, apiClient, reloadUser, isLoading } = useAuth();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const fromRegister = searchParams.get("from") === "register";

  const handleResend = async () => {
    if (!apiClient) {
      setStatusMessage("API クライアントが初期化されていません。");
      return;
    }

    setIsResending(true);
    setStatusMessage(null);

    try {
      await apiClient.post("/email/verification-notification");
      setStatusMessage(
        "新しい認証メールを送信しました。メールをご確認ください。",
      );
    } catch (err: unknown) {
      let msg = "メール再送に失敗しました。";

      if (err instanceof AxiosError) {
        msg = err.response?.data?.message || err.message;
      } else {
        msg = String(err);
      }

      setStatusMessage(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerified = async () => {
    setIsChecking(true);
    setStatusMessage(null);

    try {
      await reloadUser();
      // AuthUser は email_verified_at を持っている前提
      const refreshed = await reloadUser();
      // reloadUser の戻り値を返していない場合は、Context 内 user を見に行くしかないので、
      // ここでは簡易的に useAuth().user を再チェックする想定。
      // 実装によっては reloadUser で user が更新されるので、router.push だけで十分なケースも多い。
    } catch (err) {
      console.error("[VerifyEmail] check error:", err);
    } finally {
      setIsChecking(false);
    }

    // email_verified_at が埋まっていれば OK
    if ((user as any)?.email_verified_at) {
      router.replace("/mypage/profile?verified=true");
    } else {
      setStatusMessage(
        "まだメール認証が完了していません。リンクをクリックしてください。",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-lg text-gray-700">読み込み中...</p>
      </div>
    );
  }

  const emailLabel = (user as any)?.email ?? "ご登録のメールアドレス";

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-gray-50">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-6 border-b-2 pb-3 text-center">
          メール認証のお願い
        </h2>

        <p className="text-xl text-center text-gray-700">
          {fromRegister
            ? "ご登録ありがとうございます！"
            : "メールアドレスの確認が必要です。"}
        </p>

        <p className="mt-2 text-center text-gray-600">
          <span className="font-bold text-blue-700">{emailLabel}</span>{" "}
          宛に認証メールを送信しています。
          メール内のリンクをクリックして認証を完了してください。
        </p>

        {statusMessage && (
          <div className="mt-6 p-3 bg-green-100 border border-green-300 text-green-700 text-center rounded">
            {statusMessage}
          </div>
        )}

        <div className="mt-8 text-center space-y-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {isResending ? "送信中..." : "認証メールを再送する"}
          </button>

          <button
            type="button"
            onClick={handleCheckVerified}
            disabled={isChecking}
            className="w-full bg-gray-700 text-white py-3 rounded-md text-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isChecking ? "認証状態を確認中..." : "認証完了をチェックする"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <a
            href="http://localhost:8025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800 transition"
          >
            開発用: MailHog を開く
          </a>
        </div>
      </div>
    </div>
  );
}
