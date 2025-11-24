"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// ---------------------------------------------------------
// 1. Firebase Config（環境変数から読み込む）
// ---------------------------------------------------------
// Next.jsの環境変数を参照する場合、process.env.NEXT_PUBLIC_xxx を使用します。
// ! は non-null assertion operator で、値が必ず存在する前提で進めます。
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ---------------------------------------------------------
// 2. Firebase App 初期化（Singletonパターン）
// ---------------------------------------------------------
let app: FirebaseApp | null = null;
/**
 * Firebase Appインスタンスを取得します。なければ初期化します。
 * @returns FirebaseAppインスタンス
 */
export const getFirebaseApp = (): FirebaseApp | null => {
  // サーバーサイドレンダリング (SSR) の実行を防ぎます
  if (typeof window === "undefined") return null;

  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return app;
};

// ---------------------------------------------------------
// 3. Firebase Auth 初期化（Singletonパターン）
// ---------------------------------------------------------
let authInstance: Auth | null = null;
/**
 * Firebase Authインスタンスを取得します。
 * @returns Authインスタンス
 */
export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === "undefined") return null;

  if (!authInstance) {
    const _app = getFirebaseApp();
    if (!_app) return null;

    authInstance = getAuth(_app);
  }

  return authInstance;
};
