import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth"; // Auth型をインポート
import { useRuntimeConfig } from "#app";

/**
 * Firebase App と Auth サービスを初期化し、Nuxt App に提供するプラグイン。
 * このプラグインは、Firebase App が既に初期化されていないことを保証します。
 */
export default defineNuxtPlugin((nuxtApp) => {
  // runtimeConfig から Firebase 設定を取得
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  // 1. 設定値の厳密なチェック
  const requiredKeys = ["apiKey", "authDomain", "projectId"];
  let missingKeys: string[] = [];

  for (const key of requiredKeys) {
    if (!firebaseConfig[key as keyof typeof firebaseConfig]) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) {
    console.error(
      `[FATAL FIREBASE ERROR] 以下の必須Firebase設定キーが見つかりません: ${missingKeys.join(
        ", "
      )}.`,
      "原因: nuxt.config.ts の publicRuntimeConfig または .env ファイルに設定が不足しています。"
    );
    // 設定が取得できない場合は、処理を中断して null を提供
    return { provide: { firebaseApp: null, firebaseAuth: null }, defer: true };
  }

  // ★★★ デバッグログ強化 (1): 実際にNuxtが読み込んだ設定値を出力 ★★★
  console.log("DEBUG(1): Loaded Firebase Config Check:");
  console.log(`  Project ID: ${firebaseConfig.projectId}`);
  console.log(`  Auth Domain: ${firebaseConfig.authDomain}`);
  console.log(
    `  API Key Prefix: ${firebaseConfig.apiKey?.substring(0, 10)}...`
  ); // API Keyは一部のみ表示
  console.log("-----------------------------------------");

  // 2. Firebase App の初期化 (複数回初期化を防ぐ)
  let firebaseApp: FirebaseApp | undefined;
  let firebaseAuth: Auth | null = null; // Authインスタンスを保持

  try {
    if (!getApps().length) {
      // アプリがまだ存在しない場合のみ初期化
      firebaseApp = initializeApp(firebaseConfig);
      console.log("Firebase App initialized successfully.");
    } else {
      // 既に存在するインスタンスを取得
      firebaseApp = getApp();
      console.log("Using existing Firebase App instance.");
    }

    // 3. Firebase Auth サービスの取得
    // 初期化に成功したFirebase AppからAuthインスタンスを取得
    firebaseAuth = getAuth(firebaseApp);
    console.log("Firebase Auth instance successfully obtained.");
  } catch (e) {
    console.error(
      "FIREBASE INIT CRITICAL ERROR: Firebase Appの初期化、またはAuthインスタンスの取得に失敗しました。",
      e
    );
    // エラーが発生した場合は、提供を中断
    return { provide: { firebaseApp: null, firebaseAuth: null }, defer: true };
  }

  // ★★★ デバッグログ強化 (2): 最終的な提供インスタンスの状態を出力 ★★★
  const authStatus = firebaseAuth ? "SUCCESS (Auth Object)" : "FAILURE (null)";
  console.log(`DEBUG(2): Final Auth Provision Status: ${authStatus}`);
  console.log(`DEBUG(2): Auth Object Type: ${typeof firebaseAuth}`);

  // 4. Nuxtのコンテキストに $firebaseAuth として提供
  // ★ 確実に取得できたインスタンス（またはエラー時はnull）を提供
  return {
    provide: {
      firebaseApp: firebaseApp,
      firebaseAuth: firebaseAuth, // これが stores/auth.ts で待っているインスタンス
    },
    // defer: true を使用して、初期化が完了するまで他のプラグインの実行を待機させます
    defer: true,
  };
});
