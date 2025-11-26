(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/firebase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFirebaseApp",
    ()=>getFirebaseApp,
    "getFirebaseAuth",
    ()=>getFirebaseAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
"use client";
;
;
// ---------------------------------------------------------
// 1. Firebase Config（環境変数から読み込む）
// ---------------------------------------------------------
// Next.jsの環境変数を参照する場合、process.env.NEXT_PUBLIC_xxx を使用します。
// ! は non-null assertion operator で、値が必ず存在する前提で進めます。
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyC4YCgTTKw1WS3Zg7niARhN5uV_szcxg8U"),
    authDomain: ("TURBOPACK compile-time value", "takayuki-2025-ver-1.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "takayuki-2025-ver-1"),
    storageBucket: ("TURBOPACK compile-time value", "takayuki-2025-ver-1.appspot.com"),
    messagingSenderId: ("TURBOPACK compile-time value", "755907716529"),
    appId: ("TURBOPACK compile-time value", "1:755907716529:web:49eba1d86d1e1934948990")
};
// ---------------------------------------------------------
// 2. Firebase App 初期化（Singletonパターン）
// ---------------------------------------------------------
let app = null;
const getFirebaseApp = ()=>{
    // サーバーサイドレンダリング (SSR) の実行を防ぎます
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!app) {
        app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length === 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])();
    }
    return app;
};
// ---------------------------------------------------------
// 3. Firebase Auth 初期化（Singletonパターン）
// ---------------------------------------------------------
let authInstance = null;
const getFirebaseAuth = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!authInstance) {
        const _app = getFirebaseApp();
        if (!_app) return null;
        authInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(_app);
    }
    return authInstance;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useFirebaseInit.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFirebaseInit",
    ()=>useFirebaseInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
// lib/firebase.tsからシングルトン関数をインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useFirebaseInit = ()=>{
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        app: null,
        auth: null,
        userId: null,
        isReady: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFirebaseInit.useEffect": ()=>{
            let unsubscribe = null;
            let authStateResolved = false;
            const initFirebase = {
                "useFirebaseInit.useEffect.initFirebase": async ()=>{
                    try {
                        // 1. AppとAuthサービスを取得
                        const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseApp"])();
                        const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseAuth"])();
                        if (!app || !auth) {
                            console.warn("[AuthInit] Firebase objects are not available (SSR or failed initialization).");
                            setState({
                                "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                        ...s,
                                        isReady: true
                                    })
                            }["useFirebaseInit.useEffect.initFirebase"]); // 失敗してもブロック解除
                            return;
                        }
                        setState({
                            "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                    ...s,
                                    app,
                                    auth
                                })
                        }["useFirebaseInit.useEffect.initFirebase"]);
                        // 2. 認証状態の監視
                        unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(auth, {
                            "useFirebaseInit.useEffect.initFirebase": async (user)=>{
                                // 初回発火時、またはセッション復元時に isReady を true に設定
                                if (!authStateResolved) {
                                    authStateResolved = true;
                                    // ★★★ 修正のポイント: 匿名サインインのロジックを完全に削除 ★★★
                                    if (!user) {
                                        console.log("[AuthInit] User is null. Proceeding without sign-in attempt.");
                                    }
                                    const currentUser = auth.currentUser;
                                    setState({
                                        "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                                ...s,
                                                userId: currentUser?.uid ?? null,
                                                isReady: true
                                            })
                                    }["useFirebaseInit.useEffect.initFirebase"]);
                                    console.log(`[AuthInit] Initial state resolved. UserID: ${currentUser?.uid ?? "None"}. isReady=true.`);
                                } else {
                                    // 状態変更時のユーザーID更新（例: サインアウト、サインインの完了）
                                    setState({
                                        "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                                ...s,
                                                userId: user?.uid ?? null
                                            })
                                    }["useFirebaseInit.useEffect.initFirebase"]);
                                }
                            }
                        }["useFirebaseInit.useEffect.initFirebase"]);
                    } catch (error) {
                        console.error("[AuthInit] Firebase initialization/sign-in failed:", error);
                        // エラーが発生した場合も、isReadyをtrueにしてアプリのブロックを解除
                        if (!authStateResolved) {
                            setState({
                                "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                        ...s,
                                        isReady: true
                                    })
                            }["useFirebaseInit.useEffect.initFirebase"]);
                        }
                    }
                }
            }["useFirebaseInit.useEffect.initFirebase"];
            initFirebase();
            return ({
                "useFirebaseInit.useEffect": ()=>{
                    // クリーンアップ
                    if (unsubscribe) unsubscribe();
                }
            })["useFirebaseInit.useEffect"];
        }
    }["useFirebaseInit.useEffect"], []);
    return state;
};
_s(useFirebaseInit, "ZHpEEPtqm0F4c05fAQ0WAV1PfdY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useLaravelSession.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "completeLaravelLogin",
    ()=>completeLaravelLogin,
    "useLaravelSession",
    ()=>useLaravelSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// --- 設定 ---
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
const completeLaravelLogin = async (idToken, name)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const payload = {
        id_token: idToken,
        ...name && {
            name: name
        }
    };
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/api/register_or_login`, payload, {
            withCredentials: true
        });
        const { token, user: backendUser } = res.data;
        if (token && backendUser) {
            console.log("[Sanctum] Successful token exchange and session established.");
            return {
                token,
                user: backendUser
            };
        } else {
            throw new Error("Sanctum token exchange failed: Missing token or user data.");
        }
    } catch (error) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response) {
            console.error(`[Sanctum ERROR] completeLaravelLogin API failed. Status: ${error.response.status}`, "Data:", error.response.data);
            const status = error.response.status;
            const detail = JSON.stringify(error.response.data);
            throw new Error(`Laravel API Error (${status}): ${detail}`);
        } else {
            console.error("[Sanctum ERROR] completeLaravelLogin failed:", error);
            throw error;
        }
    }
};
const useLaravelSession = (user, auth, checkLaravelSession)=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [laravelAuthenticated, setLaravelAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [initialCheckComplete, setInitialCheckComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isVerificationRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLaravelSession.useCallback[isVerificationRedirect]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const params = new URLSearchParams(window.location.search);
            return params.get("verified") === "true";
        }
    }["useLaravelSession.useCallback[isVerificationRedirect]"], []);
    // トークンを強制的にリロードするヘルパー
    const forceTokenRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLaravelSession.useCallback[forceTokenRefresh]": async (currentUser)=>{
            const idToken = await currentUser.getIdToken(true);
            console.log("[Firebase] Forced ID Token refresh successful during sync.");
            return idToken;
        }
    }["useLaravelSession.useCallback[forceTokenRefresh]"], []);
    /**
   * 認証状態の同期を試行し、必要に応じてリダイレクト処理を行う
   */ const syncAndRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLaravelSession.useCallback[syncAndRedirect]": async ()=>{
            console.log("[Sanctum Sync] Starting sync check...");
            let finalAuthStatus = false;
            try {
                // ログアウト状態
                if (!user || !auth) {
                    const sessionData = await checkLaravelSession();
                    finalAuthStatus = sessionData.authenticated;
                    console.log(`[Sanctum Sync] FINAL CHECK COMPLETE (Logged Out). laravelAuthenticated: ${finalAuthStatus}`);
                    return; // ここで return しても finally は実行される
                }
                let sessionData = await checkLaravelSession();
                finalAuthStatus = sessionData.authenticated; // 最終的な認証ステータスを格納する変数
                // 匿名ユーザー
                if (user.isAnonymous) {
                    if (sessionData.authenticated) {
                        console.warn("[Sanctum] Anonymous user found with active Laravel session. Forcing Firebase logout.");
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                        finalAuthStatus = false;
                    } else {
                        finalAuthStatus = false; // 匿名ユーザーは未認証扱い
                    }
                } else if (!sessionData.authenticated) {
                    console.log("[Sanctum] Non-anonymous user present but session missing. Attempting auto-login...");
                    try {
                        // ログイン成功時にIDトークンを強制リフレッシュし、Laravelに送信
                        const { user: backendUser } = await completeLaravelLogin(await forceTokenRefresh(user));
                        finalAuthStatus = true; // ログイン成功
                        // リダイレクト処理
                        if (!backendUser.email_verified_at) {
                            router.push("/email/verify");
                        } else {
                            const currentPath = window.location.pathname;
                            if (currentPath === "/login" || currentPath === "/register" || currentPath === "/email/verify" || isVerificationRedirect()) {
                                router.replace("/mypage/profile");
                            }
                        }
                    } catch (error) {
                        console.error("[Sanctum] Auto-login attempt failed. Forcing Firebase logout.");
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                        finalAuthStatus = false; // ログイン失敗
                    }
                } else {
                    finalAuthStatus = true; // 既に認証済み
                    // IDトークンを強制リフレッシュして、有効性を確保
                    await forceTokenRefresh(user);
                    const backendUser = sessionData.user;
                    if (backendUser && !backendUser.email_verified_at) {
                        router.push("/email/verify");
                    } else {
                        if (isVerificationRedirect()) {
                            console.log("Session verified, cleaning up URL parameter.");
                            router.replace(window.location.pathname);
                        }
                    }
                }
            } catch (error) {
                console.error("[Sanctum Sync] An error occurred during sync:", error);
                // エラー発生時は安全策として認証を解除
                finalAuthStatus = false;
            } finally{
                // 🔥 修正の核心: 全てのロジックが完了した後、最終的な状態を同時に更新する
                // 1. 最終的な認証ステータスを設定
                setLaravelAuthenticated(finalAuthStatus);
                // 2. 認証ステータスを設定した直後に完了フラグを設定
                //    (成功/失敗/エラーに関わらず、必ずロード状態を解除)
                setInitialCheckComplete(true);
                console.log(`[Sanctum Sync] FINAL CHECK COMPLETE. laravelAuthenticated: ${finalAuthStatus}`);
            }
        }
    }["useLaravelSession.useCallback[syncAndRedirect]"], [
        user,
        auth,
        checkLaravelSession,
        router,
        forceTokenRefresh,
        isVerificationRedirect
    ]);
    // 依存配列から laravelAuthenticated を削除。このフックは認証状態の決定者であり、自身を依存すべきではない。
    // Firebase user/auth/ready の状態変化時に同期を実行
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLaravelSession.useEffect": ()=>{
            // user が null/User オブジェクトのどちらかに定まり、auth が存在し、
            // まだ初回チェックが完了していない場合のみ実行
            if (user !== undefined && auth && initialCheckComplete === false) {
                syncAndRedirect();
            }
        }
    }["useLaravelSession.useEffect"], [
        user,
        auth,
        syncAndRedirect,
        initialCheckComplete
    ]);
    return {
        laravelAuthenticated,
        initialCheckComplete
    };
};
_s(useLaravelSession, "Vtb48IWSLTE2x3xtP7dDS7DZ6e0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useAuth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useApiClient",
    ()=>useApiClient,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)"); // AxiosInstanceをインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFirebaseInit.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useLaravelSession.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// --- 設定 ---
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const { auth, userId, isReady } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- Laravel/Sanctum 関連のヘルパー関数 ---
    const fetchCsrfCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[fetchCsrfCookie]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                // Axiosのグローバル設定が withCredentials=true であることを保証
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/sanctum/csrf-cookie`);
                console.log("[Sanctum] CSRF cookie fetched.");
            } catch (error) {
                console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
            }
        }
    }["AuthProvider.useCallback[fetchCsrfCookie]"], []);
    const checkLaravelSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[checkLaravelSession]": async ()=>{
            try {
                // グローバルAxiosを使用してセッションチェック（Authorizationヘッダーは不要）
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/auth/check`);
                return res.data;
            } catch  {
                return {
                    authenticated: false
                };
            }
        }
    }["AuthProvider.useCallback[checkLaravelSession]"], []);
    // --------------------------------------------------
    // 外部フックの利用
    const { laravelAuthenticated, initialCheckComplete } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLaravelSession"])(user, auth, checkLaravelSession);
    // --- 状態監視 useEffect ---
    // 1. Firebase user 変化 → token 更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!auth || !isReady) return;
            // onAuthStateChangedはコンポーネントがマウントされている限りアクティブ
            const unsub = auth.onAuthStateChanged({
                "AuthProvider.useEffect.unsub": async (currentUser)=>{
                    setUser(currentUser);
                    if (currentUser) {
                        try {
                            // トークン取得を試行
                            const idToken = await currentUser.getIdToken();
                            setToken(idToken);
                        } catch (error) {
                            console.error("[Firebase] Failed to get ID Token:", error);
                            setToken(null);
                        }
                    } else {
                        setToken(null);
                    }
                }
            }["AuthProvider.useEffect.unsub"]);
            return ({
                "AuthProvider.useEffect": ()=>unsub()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        auth,
        isReady
    ]);
    // 2. 初回 CSRF Cookie 取得 (リロード時にセッション確立のために必要)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // 💡 リロード時にすぐ実行されるように、このフックは残します。
            fetchCsrfCookie();
        }
    }["AuthProvider.useEffect"], [
        fetchCsrfCookie
    ]);
    // 3. 🚨 削除: グローバルな axios.defaults の設定は削除し、カスタムインスタンスに移行します。
    // 以前のロジック:
    /*
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log("[Axios Config] Set Authorization header with new token.");
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log("[Axios Config] Cleared Authorization header.");
    }
  }, [token]);
  */ // 4. グローバルな withCredentials 設定は CSRF 取得時に移し、ここでは削除
    // 以前のロジック:
    /*
  useEffect(() => {
     axios.defaults.withCredentials = true;
  }, []);
  */ // --- カスタム Axios インスタンスの生成 ---
    const apiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[apiClient]": ()=>{
            if (!token) {
                console.log("[API Client] Token is missing. Returning null client.");
                return null;
            }
            console.log("[API Client] Creating new Axios instance with Authorization header.");
            // ★ トークンが存在するときのみカスタムインスタンスを生成
            const instance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
                baseURL: API_BASE_URL,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });
            return instance;
        }
    }["AuthProvider.useMemo[apiClient]"], [
        token
    ]);
    // --- useMemo で状態を集約 (省略) ---
    const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isAuthenticated]": ()=>{
            const isAuth = initialCheckComplete && !!user && !user.isAnonymous && laravelAuthenticated === true;
            console.log(`[AUTH STATE] isAuthenticated computed: ${isAuth}. (initialCheckComplete: ${initialCheckComplete}, laravelAuthenticated: ${laravelAuthenticated}, user present: ${!!user})`);
            return isAuth;
        }
    }["AuthProvider.useMemo[isAuthenticated]"], [
        initialCheckComplete,
        user,
        laravelAuthenticated
    ]);
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isLoading]": ()=>{
            const loading = !isReady || !initialCheckComplete;
            console.log(`[AUTH STATE] isLoading computed: ${loading}. (isReady: ${isReady}, initialCheckComplete: ${initialCheckComplete})`);
            return loading;
        }
    }["AuthProvider.useMemo[isLoading]"], [
        isReady,
        initialCheckComplete
    ]);
    // --- 認証アクション (省略) ---
    // Login (省略)
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async ({ email, password, name })=>{
            if (!auth) throw new Error("Auth service unavailable.");
            // 1. CSRF Cookie を取得 (ログイン前に必ず)
            await fetchCsrfCookie();
            // 2. Firebase ログイン
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, email, password);
            console.log("[Firebase] Sign-in successful. Proceeding to Sanctum...");
            // 3. IDトークンを取得し、Laravel側にセッションを確立
            const idToken = await userCredential.user.getIdToken();
            // ★ トークンを即座にステートに設定
            setToken(idToken);
            // ログインリクエストはトークンを設定した後に行う
            const { user: backendUser } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken, name);
            // 4. メール認証が必要な場合のみリダイレクト
            if (!backendUser.email_verified_at) {
                router.push("/email/verify");
            }
        // 成功時 (メール認証不要) は、LoginPage.tsxがリダイレクトを制御する
        }
    }["AuthProvider.useCallback[login]"], [
        auth,
        fetchCsrfCookie,
        router
    ]);
    // Logout (省略)
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async (redirectPath = "/")=>{
            if (!auth) return;
            setIsLoggingOut(true);
            try {
                // Laravel側セッションの破棄（明示的なAPIコールが最善だが、ここではFirebase側のみ）
                // Firebaseからのサインアウト
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                // トークンをクリア
                setToken(null);
                router.push(redirectPath);
            } catch (e) {
                console.error("Logout failed:", e);
            } finally{
                setIsLoggingOut(false);
            }
        }
    }["AuthProvider.useCallback[logout]"], [
        auth,
        router
    ]);
    // reloadAuthToken (省略)
    const reloadAuthToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[reloadAuthToken]": async ()=>{
            if (user) {
                console.log("[Firebase] Forcing ID Token refresh...");
                try {
                    const idToken = await user.getIdToken(true);
                    setToken(idToken); // ステート更新により、apiClientが再生成される
                    // リフレッシュされたトークンでLaravelセッションを再確立
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken);
                } catch (error) {
                    console.error("[Firebase] Failed to refresh ID Token:", error);
                    throw error;
                }
            } else {
                throw new Error("User not found for token refresh.");
            }
        }
    }["AuthProvider.useCallback[reloadAuthToken]"], [
        user
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            auth,
            userId,
            isAuthenticated,
            isLoading,
            isLoggingOut,
            token,
            apiClient,
            login,
            logout,
            reloadAuthToken
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/hooks/useAuth.tsx",
        lineNumber: 273,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "CNF9Y8byVfgiOE/lBNFbVxTM2Gw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLaravelSession"]
    ];
});
_c = AuthProvider;
const useApiClient = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx || !ctx.apiClient) {
        // 認証情報がないか、認証済みクライアントがまだ準備できていない（トークンがない）
        // このエラーは、認証が必要なページで api が null の場合に発生します。
        // その場合、ページ側で isLoading や isAuthenticated をチェックする必要があります。
        // ★ 認証なしでもアクセスできるAPIにはグローバルAxiosを使用し、
        // 認証が必要なAPIには apiClient を使用するようにフロントエンドのコードを修正する必要があります。
        throw new Error("Authenticated API client is not available. Ensure you are within AuthProvider and the user is authenticated.");
    }
    return ctx.apiClient;
};
_s1(useApiClient, "/dMy7t63NXD4eYACoT93CePwGrg=");
const useAuth = ()=>{
    _s2();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    // apiClient を提供する useAuth フック（既存のものを保持）
    return ctx;
};
_s2(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-client] (ecmascript)");
"use client";
;
;
function Providers({ children }) {
    // AuthProviderはuseContextやuseStateを使用するため、このクライアントコンポーネント内で実行される必要があります。
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/components/Providers.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_737741cc._.js.map