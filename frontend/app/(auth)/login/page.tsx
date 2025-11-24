"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------
  // 副作用: 認証済みならトップへリダイレクト
  // -------------------------
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>認証状態を確認中...</p>
      </div>
    );
  }

  if (isAuthenticated) return null; // リダイレクト済み

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setApiError("メールアドレスとパスワードを入力してください。");
      setIsSubmitting(false);
      return;
    }

    try {
      await login({ email, password });
      // 成功後は副作用でリダイレクト
    } catch (error: any) {
      let errorMessage = "ログインに失敗しました。再試行してください。";
      if (error.code) {
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
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
