"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getIdToken,
} from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { auth, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <p>認証状態を確認中...</p>;
  }

  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);

    try {
      if (!auth) throw new Error("Auth service unavailable");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // profile 更新（名前）
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Firebase ID Token を取得（Laravel に送る）
      const idToken = await getIdToken(userCredential.user);

      // Laravel API に登録（必須！！！）
      const res = await fetch("https://laravel.test/api/firebase/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken,
          name,
          email,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Laravel registration failed");
      }

      // ログイン成功 → email/verify に移動
      router.push("/email/verify");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------
  // コンポーネントのレンダリング (ログインページのデザインを踏襲)
  // -------------------------
  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-2xl mx-auto z-10 mt-10 mb-8">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        会員登録
      </h2>

      {/* エラーメッセージ表示エリア */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. ユーザー名 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ユーザー名
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* 2. メールアドレス */}
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

        {/* 3. パスワード */}
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

        {/* 4. 確認用パスワード */}
        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            確認用パスワード
          </label>
          <input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* 登録ボタン */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-150 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </button>
        </div>
      </form>

      {/* ログインページへのリンク */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-blue-500 hover:text-blue-700 transition duration-150 font-medium"
        >
          ログインはこちら
        </Link>
      </div>
    </div>
  );
}
