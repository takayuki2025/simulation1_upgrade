"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useSanctumAuth";

const CHECK_INTERVAL_MS = 3000;
const AFTER_SUCCESS_REDIRECT = "/mypage/profile?verified=true";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, firebaseUser, reloadAuthToken, apiClient, isLoading } =
    useAuth();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const verifyUrl = searchParams.get("redirect");

  /* ============================================================
     Step 1: Laravel verifyURL にジャンプ
  ============================================================ */
  useEffect(() => {
    if (verifyUrl) {
      window.location.href = verifyUrl;
    }
  }, [verifyUrl]);

  /* ============================================================
     Step 2: Firebase の emailVerified をポーリング
  ============================================================ */
  const beginPolling = useCallback(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = window.setInterval(async () => {
      try {
        await firebaseUser?.reload();
      } catch {}
    }, CHECK_INTERVAL_MS);
  }, [firebaseUser]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /* ============================================================
     Step 3: 最終確定（Laravel Token 再発行）
  ============================================================ */
  const finalize = useCallback(async () => {
    if (isFinalizing) return;

    setIsFinalizing(true);
    setStatusMessage(null);

    try {
      console.log("🔥 [VerifyEmail] Finalizing → reloadAuthToken()");
      await reloadAuthToken(); // ← 最重要（Sanctum Token 再発行 & Laravel user 更新）

      router.replace(AFTER_SUCCESS_REDIRECT);
    } catch (err) {
      console.error("Verify finalize error:", err);
      setStatusMessage("認証の確定に失敗しました。再ログインしてください。");
    } finally {
      setIsFinalizing(false);
    }
  }, [reloadAuthToken, router, isFinalizing]);

  /* ============================================================
     Step 4: 状態監視
  ============================================================ */
  useEffect(() => {
    if (isLoading) return;

    // Firebase または Laravel のどちらか verified → OK
    if (firebaseUser?.emailVerified || user?.emailVerified) {
      stopPolling();
      finalize();
      return;
    }

    // 未 verified → ポーリング
    beginPolling();
    return () => stopPolling();
  }, [isLoading, user, firebaseUser, beginPolling, stopPolling, finalize]);

  /* ============================================================
     認証メール再送 API（Laravel 標準ルート）
  ============================================================ */
  const handleResend = async () => {
    if (!apiClient) {
      setStatusMessage("API クライアントが初期化されていません。");
      return;
    }

    setIsResending(true);
    setStatusMessage(null);

    try {
      await apiClient.post("/email/verification-notification"); // ← Laravel 標準
      setStatusMessage("新しい認証メールを送信しました。");
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

  if (isLoading || isFinalizing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-lg text-gray-700">
          {isFinalizing ? "認証を確定しています..." : "読み込み中..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-gray-50">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-6 border-b-2 pb-3 text-center">
          💌 メール認証のお願い
        </h2>

        <p className="text-xl text-center text-gray-700">
          ご登録ありがとうございます！
        </p>

        <p className="mt-2 text-center text-gray-600">
          <span className="font-bold text-blue-700">{user?.email}</span>{" "}
          宛に認証メールを送信しました。
        </p>

        {statusMessage && (
          <div className="mt-6 p-3 bg-green-100 border border-green-300 text-green-700 text-center rounded">
            {statusMessage}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="http://localhost:8025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800 transition"
          >
            開発用: MailHog を開く
          </a>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResend();
          }}
          className="mt-6"
        >
          <button
            type="submit"
            disabled={isResending}
            className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {isResending ? "送信中..." : "認証メールを再送する"}
          </button>
        </form>
      </div>
    </div>
  );
}
