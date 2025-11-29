"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useSanctumAuth";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getIdToken,
} from "firebase/auth";

// API BASE URL をインポート
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 💡 レスポンスの型を定義
interface LaravelRegisterResponse {
  message: string;
  needs_email_verification: boolean; // Laravel APIが返す想定のフラグ
  user?: any; // 他のユーザー情報など
  error?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { auth, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ★★★ 修正箇所: 競合状態を防ぐため、処理が始まっていることを示す新しいステートを追加 ★★★
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 認証状態の監視とリダイレクトは、AuthProviderに一任するため、ここでは一時的にコメントアウト
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <p>認証状態を確認中...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ★★★ 修正箇所: 処理中に再度実行されないようガード句を追加 ★★★
    if (isProcessing) return;

    setApiError("");
    setIsSubmitting(true);
    setIsProcessing(true); // 処理開始

    try {
      if (!auth) throw new Error("Auth service unavailable");
      // ★★★ 名前欠落修正1: API_BASE_URLのチェックを追加 ★★★
      if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

      // 1. Firebase 認証を実行
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // profile 更新（名前）
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Firebase ID Token を取得（Laravel に送る）
      const idToken = await getIdToken(userCredential.user);

      // 2. Laravel API に登録（必須！！！）
      // ★★★ 名前欠落修正2: エンドポイントを /api/login_or_register に統一 ★★★
      const res = await fetch(`${API_BASE_URL}/api/login_or_register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken,
          name, // nameキーはここで確実に送信される (空文字でも送信)
          email,
        }),
        credentials: "include",
      });

      const data: LaravelRegisterResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Laravel registration failed");
      }

      // 3. Laravel API のレスポンスをチェックしてリダイレクト先を決定
      if (data.needs_email_verification) {
        // メール未認証が必要な場合、認証ページへ
        router.push("/email/verify");
      } else {
        // それ以外の場合、トップページへ
        router.push("/");
      }
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
      setIsProcessing(false); // 処理完了
    }
  };

  // -------------------------
  // コンポーネントのレンダリング
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

      {/* ★★★ 修正箇所: isProcessingがtrueの間はフォーム全体を無効化し、二重操作を防ぐ ★★★ */}
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
            disabled={isProcessing} // isSubmittingではなくisProcessingを使用
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
            disabled={isProcessing} // isSubmittingではなくisProcessingを使用
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
            disabled={isProcessing} // isSubmittingではなくisProcessingを使用
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
            disabled={isProcessing} // isSubmittingではなくisProcessingを使用
          />
        </div>

        {/* 登録ボタン */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing} // isSubmittingではなくisProcessingを使用
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
