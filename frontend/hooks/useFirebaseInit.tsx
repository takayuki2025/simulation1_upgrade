"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User, Auth } from "firebase/auth";
import { FirebaseApp } from "firebase/app";

// lib/firebase.tsからシングルトン関数をインポート
import { getFirebaseApp, getFirebaseAuth } from "@/lib/firebase";

// Firebaseの状態インターフェース
interface FirebaseState {
    app: FirebaseApp | null;
    auth: Auth | null;
    userId: string | null;
  // isReady: Firebaseの認証状態が完全に解決されたか
    isReady: boolean;
}

export const useFirebaseInit = (): FirebaseState => {
    const [state, setState] = useState<FirebaseState>({
    app: null,
    auth: null,
    userId: null,
    isReady: false, // 初期状態は未準備
    });

    useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let authStateResolved = false;

    const initFirebase = async () => {
        try {
        // 1. AppとAuthサービスを取得
        const app = getFirebaseApp();
        const auth = getFirebaseAuth();

        if (!app || !auth) {
            console.warn(
            "[AuthInit] Firebase objects are not available (SSR or failed initialization)."
            );
          setState((s) => ({ ...s, isReady: true })); // 失敗してもブロック解除
            return;
        }

        setState((s) => ({ ...s, app, auth }));

        // 2. 認証状態の監視
        unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
          // 初回発火時、またはセッション復元時に isReady を true に設定
            if (!authStateResolved) {
            authStateResolved = true;

            // ★★★ 修正のポイント: 匿名サインインのロジックを完全に削除 ★★★
            if (!user) {
                console.log(
                "[AuthInit] User is null. Proceeding without sign-in attempt."
                );
            }

            const currentUser = auth.currentUser;
            setState((s) => ({
                ...s,
                userId: currentUser?.uid ?? null,
              isReady: true, // これでアプリのレンダリングブロックが解除されます
            }));
            console.log(
                `[AuthInit] Initial state resolved. UserID: ${
                currentUser?.uid ?? "None"
                }. isReady=true.`
            );
            } else {
            // 状態変更時のユーザーID更新（例: サインアウト、サインインの完了）
            setState((s) => ({ ...s, userId: user?.uid ?? null }));
            }
        });
        } catch (error) {
        console.error(
            "[AuthInit] Firebase initialization/sign-in failed:",
            error
        );
        // エラーが発生した場合も、isReadyをtrueにしてアプリのブロックを解除
        if (!authStateResolved) {
            setState((s) => ({ ...s, isReady: true }));
        }
        }
    };

    initFirebase();

    return () => {
      // クリーンアップ
        if (unsubscribe) unsubscribe();
    };
    }, []);

    return state;
};
