"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/ui/auth/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================================
  // 認証済みならホームへ
  // ================================
  useEffect(() => {
    console.log(
      "[LoginPage] isLoading=",
      isLoading,
      "isAuthenticated=",
      isAuthenticated,
    );
    if (!isLoading && isAuthenticated) {
      console.log("[LoginPage] redirect fired");
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        認証状態を確認中...
      </div>
    );
  }

  if (isAuthenticated) return null;

  // ================================
  // ログイン送信処理
  // ================================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // AuthProvider が user をセットする。
      // isAuthenticated が true になると上の useEffect が router.replace("/") を実行
    } catch {
      setApiError("ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-xl p-8 mx-auto mt-20 mb-8 bg-white rounded-xl shadow-xl">
      <h2 className="mb-6 text-3xl font-bold text-center border-b pb-3">
        ログイン
      </h2>

      {apiError && (
        <div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-lg font-semibold text-white bg-red-600 rounded-lg"
        >
          {isSubmitting ? "ログイン中..." : "ログインする"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/register" className="text-sm text-blue-500">
          会員登録はこちら
        </Link>
      </div>
    </div>
  );
}
