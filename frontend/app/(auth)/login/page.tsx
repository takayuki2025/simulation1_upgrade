"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 🔥 Hexagonal: ここがアプリケーションサービス（useAuth）
import { useAuth } from "@/hooks/useSanctumAuth";

export default function LoginPage() {
  const router = useRouter();

  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------
  // 👀 認証済みならトップへリダイレクト
  // -------------------------
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // 🔄 読み込み表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>認証状態を確認中...</p>
      </div>
    );
  }

  // 🔄 認証済みなら画面を空にする
  if (isAuthenticated) return null;

  // --------------------------------------
  // 🎯 ログインボタンクリック
  // --------------------------------------
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setApiError("");
  setIsSubmitting(true);

  if (!email || !password) {
    setApiError("メールアドレスとパスワードを入力してください。");
    setIsSubmitting(false);
    return;
  }

  console.log("[LoginPage] Try login:", { email, passLen: password.length });

  try {
    // ✅ 修正後のコード: emailとpasswordを1つのオブジェクトとして渡す
    await login({ email: email.trim(), password: password });

    console.log("[LoginPage] Login success → redirect /");

    router.push("/");
  } catch (error: any) {
    console.error("[LoginPage] Login failed", error);

    const message =
      error?.message ||
      error?.response?.data?.message ||
      "ログインに失敗しました。もう一度お試しください。";

    setApiError(message);
  } finally {
    setIsSubmitting(false);
  }
};

  // --------------------------------------
  // 🎨 UI（デザインはそのまま）
  // --------------------------------------
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
        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* パスワード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg"
          >
            {isSubmitting ? "ログイン中..." : "ログインする"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link href="/register" className="text-sm text-blue-500">
          会員登録はこちら
        </Link>
      </div>
    </div>
  );
}
