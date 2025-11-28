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
_s(useFirebaseInit, "1hP2lAxALG/GLfd/s6rsfTKsQuU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useLaravelSession.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkLaravelSession",
    ()=>checkLaravelSession,
    "completeLaravelLogin",
    ()=>completeLaravelLogin,
    "useLaravelSession",
    ()=>useLaravelSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>"); // ★修正: signOutをインポート
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
            return {
                token,
                user: backendUser
            };
        } else {
            throw new Error("Sanctum token exchange failed: Missing token or user data.");
        }
    } catch (error) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response) {
            const status = error.response.status;
            const detail = JSON.stringify(error.response.data);
            throw new Error(`Laravel API Error (${status}): ${detail}`);
        } else {
            throw error;
        }
    }
};
const checkLaravelSession = async ()=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/auth/check`);
        return res.data;
    } catch  {
        return {
            authenticated: false
        };
    }
};
const useLaravelSession = (user, auth, checkLaravelSession, setLaravelAuthenticated, setInitialCheckComplete)=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isVerificationRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLaravelSession.useCallback[isVerificationRedirect]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const params = new URLSearchParams(window.location.search);
            return params.get("verified") === "true" || params.get("token") !== null;
        }
    }["useLaravelSession.useCallback[isVerificationRedirect]"], []);
    const syncAndRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLaravelSession.useCallback[syncAndRedirect]": async ()=>{
            let finalAuthStatus = false;
            try {
                const sessionData = await checkLaravelSession();
                finalAuthStatus = sessionData.authenticated;
                // 1. ログアウト状態 or 匿名ユーザーの場合の処理
                if (!user || !auth || user.isAnonymous) {
                    // 💡 匿名ユーザーだがLaravelセッションがある場合、Firebase側を強制ログアウト（状態のクリーンアップ）
                    if (user?.isAnonymous && sessionData.authenticated && auth) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth); // ★修正: インポートしたsignOutを使用
                        finalAuthStatus = false;
                    }
                    // ログアウト状態はここで状態を確定させる
                    setLaravelAuthenticated(finalAuthStatus);
                    setInitialCheckComplete(true);
                    return;
                } else if (!sessionData.authenticated) {
                    return;
                } else {
                    // 💡 既にセッションが確立されている場合は確定させる
                    setLaravelAuthenticated(finalAuthStatus);
                    setInitialCheckComplete(true);
                    // メール認証チェックとURLクリーンアップ（リダイレクト補助ロジック）
                    const backendUser = sessionData.user;
                    if (backendUser && !backendUser.email_verified_at) {
                        router.push("/email/verify");
                    } else if (isVerificationRedirect()) {
                        router.replace(window.location.pathname);
                    }
                }
            } catch (error) {
                console.error("[Sanctum Sync] An error occurred during sync:", error);
                setLaravelAuthenticated(false);
                setInitialCheckComplete(true);
            }
        }
    }["useLaravelSession.useCallback[syncAndRedirect]"], [
        user,
        auth,
        checkLaravelSession,
        router,
        isVerificationRedirect,
        setLaravelAuthenticated,
        setInitialCheckComplete
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLaravelSession.useEffect": ()=>{
            if (user !== undefined && auth) {
                syncAndRedirect();
            }
        }
    }["useLaravelSession.useEffect"], [
        user,
        auth,
        syncAndRedirect
    ]);
    return {};
};
_s(useLaravelSession, "TSDuaJGZnzU1lyj5GIDJQS1P5mA=", false, function() {
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
// Firebase Authの主要なインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
// AxiosとAxiosInterceptorのための型インポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
// 💡 依存関係: Firebase初期化とLaravelセッション関連のヘルパー
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFirebaseInit.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useLaravelSession.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
// 🚨 修正箇所: createContextの初期値として、AuthContextTypeの全プロパティを実装したダミーオブジェクトを提供します。
const initialAuthContext = {
    user: null,
    auth: null,
    userId: null,
    backendUser: null,
    isAuthenticated: false,
    isLoading: true,
    isLoggingOut: false,
    token: null,
    apiClient: null,
    // 💡 関数プロパティのダミー実装
    login: ()=>Promise.reject("Context not initialized"),
    logout: ()=>Promise.reject("Context not initialized"),
    reloadAuthToken: ()=>Promise.reject("Context not initialized"),
    setBackendUserStatus: ()=>{}
};
// 💡 Contextの初期化を AuthContextType の非Nullable型で行う
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(initialAuthContext);
function AuthProvider({ children }) {
    _s();
    const { auth, userId, isReady } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // --- Core State ---
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [backendUser, setBackendUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isBackendUserLoading, setIsBackendUserLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- Laravel Session State (統合管理) ---
    const [laravelAuthenticated, setLaravelAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [initialCheckComplete, setInitialCheckComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- トークンリフレッシュ/キューイングのためのRef (Interceptorの排他制御) ---
    const refreshPromiseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const failedQueueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    // --- useLaravelSession の利用 (状態監視のヘルパー) ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLaravelSession"])(user, auth, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkLaravelSession"], setLaravelAuthenticated, setInitialCheckComplete);
    // --- B. 認証アクション定義 ---
    /**
   * 💡 CSRF Cookieの取得。Sanctum認証に必要な前提処理。
   */ const fetchCsrfCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[fetchCsrfCookie]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/sanctum/csrf-cookie`);
            } catch (error) {
                console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
            }
        }
    }["AuthProvider.useCallback[fetchCsrfCookie]"], []);
    /**
   * 💡 ログアウト処理
   */ const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async (redirectPath = "/")=>{
            if (!auth) return;
            setIsLoggingOut(true);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                setToken(null);
                setUser(null);
                setBackendUser(null);
                // ログアウト時はLaravel認証状態もリセット
                setLaravelAuthenticated(false);
                setInitialCheckComplete(true);
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
    /**
   * 💡 認証トークン失効時（401エラー時）のリカバリーロジック。
   */ const reloadAuthToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[reloadAuthToken]": async ()=>{
            if (user) {
                try {
                    // Firebase ID Token を強制的にリフレッシュ
                    const idToken = await user.getIdToken(true);
                    setToken(idToken);
                    // 💡 トークン交換: 新しいID Tokenを使ってLaravelセッションを更新し、新しいSanctumトークンを取得
                    const { token: newToken, user: refreshedBackendUser } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken);
                    setBackendUser(refreshedBackendUser);
                    return {
                        ...refreshedBackendUser,
                        token: newToken
                    }; // 新しいSanctumトークンを返す
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
    /**
   * 💡 ログイン処理の核。Firebase認証 -> Laravelセッション確立を一連で実行する。
   */ const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async ({ email, password, name })=>{
            if (!auth) throw new Error("Auth service unavailable.");
            await fetchCsrfCookie();
            // 1. Firebase 認証を実行
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            setToken(idToken); // 一旦ID Tokenをセット
            // 2. Laravel側でSanctumセッションを確立 (ID Token -> Sanctum Tokenへの交換)
            const { user: newBackendUser, token: newToken } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken, name);
            setBackendUser(newBackendUser);
            setToken(newToken); // 確実にAPIで使用するSanctumトークンをセット
            // 3. 認証状態を確定
            setLaravelAuthenticated(true);
            setInitialCheckComplete(true);
            // 4. リダイレクト
            if (!newBackendUser.email_verified_at) {
                router.push("/email/verify");
            } else {
                router.push("/");
            }
        }
    }["AuthProvider.useCallback[login]"], [
        auth,
        fetchCsrfCookie,
        router
    ]);
    // --- C. 状態監視と同期 (useEffect) ---
    /**
   * 責務 1: Firebaseの認証状態変更の監視 (`onAuthStateChanged`)
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!auth || !isReady) return;
            const unsub = auth.onAuthStateChanged({
                "AuthProvider.useEffect.unsub": async (currentUser)=>{
                    setUser(currentUser);
                    if (currentUser) {
                        setIsBackendUserLoading(true);
                        try {
                            const idToken = await currentUser.getIdToken();
                            setToken(idToken);
                            if (idToken) {
                                try {
                                    // 💡 認証の核（リロード時）: ID Tokenを使ってLaravelセッションを確立し直す
                                    const { user: newBackendUser, token: newToken } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken);
                                    setBackendUser(newBackendUser);
                                    setToken(newToken); // 新しいSanctumトークンをセット
                                    // ★★★ 状態の最終確定 ★★★
                                    setLaravelAuthenticated(true);
                                    setInitialCheckComplete(true);
                                } catch (profileError) {
                                    console.error("[Profile] Critical: Failed to load backend profile. Initiating logout.", profileError);
                                    await logout();
                                }
                            }
                        } catch (error) {
                            console.error("[Firebase] Failed to get ID Token. Initiating logout.", error);
                            await logout();
                        } finally{
                            setIsBackendUserLoading(false);
                        }
                    } else {
                        // ログアウト時
                        setToken(null);
                        setBackendUser(null);
                        setLaravelAuthenticated(false);
                        setInitialCheckComplete(true);
                    }
                }
            }["AuthProvider.useEffect.unsub"]);
            return ({
                "AuthProvider.useEffect": ()=>unsub()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        auth,
        isReady,
        logout
    ]);
    /**
   * 責務 2: CSRF Cookieの初期取得
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            fetchCsrfCookie();
        }
    }["AuthProvider.useEffect"], [
        fetchCsrfCookie
    ]);
    /**
   * 責務 3: メール認証後のリダイレクト処理
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const queryParams = new URLSearchParams(window.location.search);
            const newToken = queryParams.get("token");
            const isVerifiedRedirect = queryParams.get("verified") === "true";
            if (newToken && isVerifiedRedirect) {
                router.replace(pathname, {
                    scroll: false
                });
            }
        }
    }["AuthProvider.useEffect"], [
        pathname,
        router
    ]);
    // --- D. apiClient の生成と Interceptor の実装（核心部分） ---
    /**
   * 💡 Axios Interceptorの実装とAPI Clientの生成。
   */ const apiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[apiClient]": ()=>{
            if (!token) {
                return null;
            }
            const instance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
                baseURL: API_BASE_URL,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });
            // キュー内のリクエストを処理するヘルパー関数
            const processQueue = {
                "AuthProvider.useMemo[apiClient].processQueue": (error, newToken = null)=>{
                    failedQueueRef.current.forEach({
                        "AuthProvider.useMemo[apiClient].processQueue": (prom)=>{
                            if (error) {
                                prom.reject(error);
                            } else if (newToken && prom.originalRequest.headers) {
                                prom.originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                prom.resolve(instance(prom.originalRequest));
                            }
                        }
                    }["AuthProvider.useMemo[apiClient].processQueue"]);
                    failedQueueRef.current = [];
                }
            }["AuthProvider.useMemo[apiClient].processQueue"];
            // Axios Interceptor の実装
            instance.interceptors.response.use({
                "AuthProvider.useMemo[apiClient]": (response)=>response
            }["AuthProvider.useMemo[apiClient]"], {
                "AuthProvider.useMemo[apiClient]": async (error)=>{
                    const originalRequest = error.config;
                    // 401エラー（未認証/トークン切れ）で、かつリトライされていないリクエストの場合
                    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                        originalRequest._retry = true;
                        if (!refreshPromiseRef.current) {
                            // 💡 ロック取得: トークンリフレッシュを開始
                            refreshPromiseRef.current = reloadAuthToken();
                            try {
                                const { token: newToken } = await refreshPromiseRef.current;
                                processQueue(null, newToken);
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                refreshPromiseRef.current = null;
                                return instance(originalRequest);
                            } catch (refreshError) {
                                // リフレッシュ失敗時はキューを失敗させ、ログアウト
                                processQueue(refreshError, null);
                                refreshPromiseRef.current = null;
                                await logout();
                                return Promise.reject(refreshError);
                            }
                        } else {
                            // 💡 リフレッシュ処理が進行中の場合、このリクエストをキューに追加
                            return new Promise({
                                "AuthProvider.useMemo[apiClient]": (resolve, reject)=>{
                                    failedQueueRef.current.push({
                                        resolve,
                                        reject,
                                        originalRequest
                                    });
                                }
                            }["AuthProvider.useMemo[apiClient]"]);
                        }
                    }
                    return Promise.reject(error);
                }
            }["AuthProvider.useMemo[apiClient]"]);
            return instance;
        }
    }["AuthProvider.useMemo[apiClient]"], [
        token,
        logout,
        reloadAuthToken
    ]);
    const setBackendUserStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[setBackendUserStatus]": (user)=>{
            setBackendUser(user);
        }
    }["AuthProvider.useCallback[setBackendUserStatus]"], []);
    // --- E. 状態の計算 (useMemo) ---
    /**
   * 💡 最終的な認証状態の計算。
   */ const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isAuthenticated]": ()=>{
            const isAuth = initialCheckComplete && !!user && !user.isAnonymous && laravelAuthenticated === true;
            return isAuth;
        }
    }["AuthProvider.useMemo[isAuthenticated]"], [
        initialCheckComplete,
        user,
        laravelAuthenticated
    ]);
    /**
   * 💡 ローディング状態の計算。
   */ const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isLoading]": ()=>{
            const loading = !isReady || !initialCheckComplete || isBackendUserLoading;
            return loading;
        }
    }["AuthProvider.useMemo[isLoading]"], [
        isReady,
        initialCheckComplete,
        isBackendUserLoading
    ]);
    // --- F. Context Provider ---
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            auth,
            userId,
            backendUser,
            isAuthenticated,
            isLoading,
            isLoggingOut,
            token,
            apiClient,
            login,
            logout,
            reloadAuthToken,
            setBackendUserStatus
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/hooks/useAuth.tsx",
        lineNumber: 435,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "xD/pc1hjTLqMqFvW/5PckbfTwkY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLaravelSession"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    // 💡 initialAuthContext を初期値にしたため、null チェックは必須ではありませんが、安全のため残すこともできます。
    // if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
const useApiClient = ()=>{
    _s2();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    // 💡 Contextが初期化されていることは保証されるため、ここで ctx が null かどうかはチェックしません。
    if (!ctx.apiClient) {
        throw new Error("Authenticated API client is not available. Check if the user is authenticated and loading is complete.");
    }
    return ctx.apiClient;
};
_s2(useApiClient, "/dMy7t63NXD4eYACoT93CePwGrg=");
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
        columnNumber: 12
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