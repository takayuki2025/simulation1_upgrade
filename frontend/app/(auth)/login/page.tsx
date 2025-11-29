"use client";

import React, { useState, useEffect, useMemo, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useSanctumAuth"; // 実際の useAuth を利用

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth(); // 👈 実際の login を使用

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------
  // 副作用: 認証済みならトップへリダイレクト（ページ読み込み時の安全策として維持）
  // -------------------------
  useEffect(() => {
    console.log(
      "PAGE_EFFECT: Auth Status Check. Loading:",
      isLoading,
      "Authenticated:",
      isAuthenticated,
    );
    // isAuthLoadingが解決し、かつisAuthenticatedがtrueであればリダイレクト
    if (!isLoading && isAuthenticated) {
      console.log("PAGE_EFFECT: Redirecting to / (via useEffect)");
      router.replace("/"); // replaceを使って履歴を残さないようにする
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>認証状態を確認中...</p>
      </div>
    );
  }

  // 既に認証済みの場合、useEffectでリダイレクトされるのを待つ
  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);
    console.log("PAGE_HANDLE: Submission started.");

    if (!email || !password) {
      setApiError("メールアドレスとパスワードを入力してください。");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("PAGE_HANDLE: Calling actual login function from useAuth...");

      // 1. ログイン処理の実行
      await login({ email, password });

      // 2. 成功後の処理: useAuth内部でメール認証へのリダイレクトが行われなかった場合
      //    (つまり、認証済みとしてトップページへ移動する場合) はここで明示的にリダイレクトする
      console.log(
        "PAGE_HANDLE: Login successful. Immediately redirecting to /",
      );
      // 🔥 修正: ログイン成功後、router.push("/") を実行
      router.push("/");
    } catch (error: any) {
      console.error("PAGE_HANDLE: Login failed in catch block.", error);

      let errorMessage = "ログインに失敗しました。再試行してください。";

      // Axios エラー (Laravel API 失敗) の処理を追加
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = `APIエラー: ${error.response.data.message}`;
      } else if (error.code) {
        console.log(
          `PAGE_HANDLE: Detected Firebase Auth error code: ${error.code}`,
        );
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMessage = "メールアドレスまたはパスワードが正しくありません。";
            break;
          case "auth/invalid-email":
            errorMessage = "メールアドレスの形式が正しくありません。";
            break;
          case "auth/too-many-requests":
            errorMessage = "短時間にログインが集中しています。";
            break;
          default:
            errorMessage = `ログインに失敗しました: ${error.message}`;
        }
      }

      console.log(`PAGE_HANDLE: Displaying API Error message: ${errorMessage}`);
      setApiError(errorMessage);
    } finally {
      // ログイン成功時にリダイレクト処理が行われるため、
      // 成功時は setIsSubmitting(false) が実行される前にページ遷移する
      if (apiError) {
        setIsSubmitting(false);
      }
      console.log("PAGE_HANDLE: Submission process finished.");
    }
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-2xl mx-auto z-10 mt-20 mb-8">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        ログイン
      </h2>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-150 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "ログイン中..." : "ログインする"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/register"
          className="text-sm text-blue-500 hover:text-blue-700 transition duration-150 font-medium"
        >
          会員登録はこちら
        </Link>
      </div>
    </div>
  );
}
