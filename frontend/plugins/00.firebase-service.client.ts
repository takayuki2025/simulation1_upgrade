import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { defineNuxtPlugin, useRuntimeConfig } from "#app";

// このファイルは末尾の `.client` により、クライアントサイドでのみ実行されます。
// そのため、明示的な `if (process.server)` チェックは不要ですが、念のため残しておきます。

export default defineNuxtPlugin((nuxtApp) => {
  // ★★★ 生死判定ログ（最優先で表示されるはず） ★★★
  // このログが出れば、正しいファイルが実行されたことが証明されます。
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
      // measurementId はオプションなので含めません
    };

    // 実行時設定値の強制ログ
    console.group("⚙️ [Firebase Config Check] Runtime Configの値:");
    console.log(
      `  - API Key Found (Should be true): ${!!firebaseConfig.apiKey}`
    );
    console.log(
      "  - Full Config:",
      JSON.parse(JSON.stringify(firebaseConfig, null, 2))
    );
    console.groupEnd();

    // 1. APIキーの存在チェック (必須)
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
      console.error(
        "CRITICAL: Firebase API Keyが未設定または無効です。初期化をスキップします2。"
      );

      // Nuxt Appに null を注入 (Piniaで参照されるため)
      nuxtApp.provide("firebaseAuth", null);
      return;
    }

    // 2. Firebase Appの初期化
    const app = initializeApp(firebaseConfig);

    // 3. Authインスタンスの取得
    const auth = getAuth(app);

    console.log(
      "✅ [SUCCESS] Firebase Authインスタンスが正常に初期化されました。"
    );

    // 4. AuthインスタンスをNuxt Appに注入
    // Piniaストアが `nuxtApp.$firebaseAuth` としてアクセスできるようになります。
    nuxtApp.provide("firebaseAuth", auth);
  } catch (error: any) {
    // 5. 初期化中のエラーをキャッチ
    console.error(
      `❌ CRITICAL: Firebase Initialization Failed: ${error.message}`,
      error
    );
    nuxtApp.provide("firebaseAuth", null);
  }
});
