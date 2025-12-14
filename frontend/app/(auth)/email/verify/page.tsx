"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/ui/auth/useAuth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, apiClient, isLoading } = useAuth();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!apiClient) return;

    setIsResending(true);
    setStatusMessage(null);

    try {
      await apiClient.post("/email/verification-notification");
      setStatusMessage("認証メールを再送しました。メールをご確認ください。");
    } catch (e) {
      const err = e as AxiosError<any>;
      setStatusMessage(err.response?.data?.message ?? "再送に失敗しました。");
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return <div className="mt-20 text-center">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-gray-50">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          メール認証のご案内
        </h2>

        <p className="text-center text-gray-700">
          <strong>{user?.email}</strong> 宛に認証メールを送信しました。
        </p>

        <p className="mt-3 text-center text-gray-600">
          メール内のリンクをクリックした後、
          <br />
          <strong>ログインページからログインしてください。</strong>
        </p>

        {statusMessage && (
          <div className="mt-6 p-3 bg-blue-50 text-blue-700 rounded text-center">
            {statusMessage}
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="w-full bg-indigo-600 text-white py-3 rounded font-bold"
          >
            認証メールを再送
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full border py-3 rounded font-semibold"
          >
            ログインページへ
          </button>
        </div>
      </div>
    </div>
  );
}
