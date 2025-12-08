"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useSanctumAuth";

const isErrorWithMessage = (error: unknown): error is { message: string } =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof (error as { message: unknown }).message === "string";

const toErrorMessage = (error: unknown): string =>
  isErrorWithMessage(error) ? error.message : String(error);

const CHECK_INTERVAL_MS = 3000;
const POST_VERIFY_REDIRECT_ROUTE = "/mypage/profile?verified=true";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect");

  const { user, firebaseUser, auth, isLoading, reloadAuthToken, apiClient } =
    useAuth();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const intervalRef = useRef<number | null>(null);

  // Step 1: Laravel verify URL にジャンプ
  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const beginPollingFirebase = useCallback(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = window.setInterval(async () => {
      try {
        await firebaseUser?.reload();
      } catch (err) {}
    }, CHECK_INTERVAL_MS);
  }, [firebaseUser]);

  const stopPollingFirebase = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Step 2: 認証成功後、Laravel と同期
  const finalizeVerification = useCallback(async () => {
    if (isFinalizing) return;

    setIsFinalizing(true);

    try {
      await reloadAuthToken();
      router.replace(POST_VERIFY_REDIRECT_ROUTE);
    } catch (err) {
      setStatusMessage(
        `認証の確定に失敗しました。ログインし直してください。(${toErrorMessage(
          err,
        )})`,
      );
    } finally {
      setIsFinalizing(false);
    }
  }, [reloadAuthToken, router, isFinalizing]);

  // Step 3: 状態監視（user === null でも redirect しない!!）
  useEffect(() => {
    if (isLoading) return;

    // Laravel verified
    if (user && user.emailVerified) {
      stopPollingFirebase();
      finalizeVerification();
      return;
    }

    // Firebase verified
    if (firebaseUser?.emailVerified) {
      stopPollingFirebase();
      finalizeVerification();
      return;
    }

    // 未 verified → ポーリング
    beginPollingFirebase();

    return () => stopPollingFirebase();
  }, [
    isLoading,
    user,
    firebaseUser,
    beginPollingFirebase,
    stopPollingFirebase,
    finalizeVerification,
  ]);

  const handleResend = async () => {
    if (!apiClient) {
      setStatusMessage("APIクライアントが初期化されていません。");
      return;
    }

    setIsResending(true);
    setStatusMessage(null);

    try {
      await apiClient.post("/api/email/verification-notification");
      setStatusMessage("新しい認証メールを送信しました。");
    } catch (err: unknown) {
      let msg = "メール再送に失敗しました。";

      if (err instanceof AxiosError) {
        msg = err.response?.data?.message || err.message;
      } else {
        msg = toErrorMessage(err);
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
