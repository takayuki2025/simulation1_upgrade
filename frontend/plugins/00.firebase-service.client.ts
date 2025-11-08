import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { defineNuxtPlugin, useRuntimeConfig } from "#app";

// このファイルは末尾の `.client` により、クライアントサイドでのみ実行されます。

export default defineNuxtPlugin((nuxtApp) => {
  // ★★★ 生死判定ログ（最優先で表示されるはず） ★★★
  console.log("🔥 [PLUG-IN STATUS] 00.firebase-service.client.ts が実行開始。");

  if (process.server) {
    return;
  }

  try {
    const config = useRuntimeConfig();

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
    };

    // 実行時設定値の強制ログ
    console.group("⚙️ [Firebase Config Check] Runtime Configの値:");
    console.log(
      `  - API Key Found (Should be true): ${!!firebaseConfig.apiKey}`
    );
    // Config全体は機密情報が含まれるため、ここではコメントアウトまたは一部のみ表示を推奨
    // console.log("  - Full Config:", JSON.parse(JSON.stringify(firebaseConfig, null, 2)));
    console.groupEnd();

    // 1. APIキーの存在チェック (必須)
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
      console.error(
        "CRITICAL: Firebase API Keyが未設定または無効です。初期化をスキップします。"
      );
      nuxtApp.provide("firebaseAuth", null);
      return;
    }

    // 2. Firebase Appの初期化
    const app = initializeApp(firebaseConfig);

    // 3. Authインスタンスの取得
    const auth = getAuth(app);

    console.log(
      "✅ [SUCCESS] Firebase Authインスタンスが正常に初期化されました。Auth Instance:",
      auth
    );

    // 4. AuthインスタンスをNuxt Appに注入
    nuxtApp.provide("firebaseAuth", auth);

    // 💡 注入成功チェックのログを追加: ここが true ならプラグイン側の問題ではない
    const injectedAuth = (nuxtApp as any).$firebaseAuth;
    console.log(
      `✨ [INJECTION CHECK] $firebaseAuth 注入成功? (trueなら成功): ${!!injectedAuth}`
    );
  } catch (error: any) {
    // 5. 初期化中のエラーをキャッチ
    console.error(
      `❌ CRITICAL: Firebase Initialization Failed: ${error.message}`,
      error
    );
    nuxtApp.provide("firebaseAuth", null);
  }
});
