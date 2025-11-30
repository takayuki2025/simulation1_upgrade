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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
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
        ...name !== undefined ? {
            name: name
        } : {}
    };
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/api/login_or_register`, payload, {
            withCredentials: true
        });
        // 💡 【修正】成功時の処理を追加し、必ず値を返すようにする
        const { token, user: backendUser } = res.data;
        if (token && backendUser) {
            return {
                token,
                user: backendUser
            }; // ✅ 成功時はここで return
        } else {
            // APIがデータの一部を返さなかった場合
            throw new Error("Sanctum token exchange failed: Missing token or user data in response.");
        }
    } catch (error) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response) {
            const status = error.response.status;
            const detail = JSON.stringify(error.response.data);
            console.error(`[LOGIN_API_ERROR] Laravel API Error (${status}): ${detail}`, `Endpoint: ${API_BASE_URL}/api/login_or_register`, `Payload Keys: ${Object.keys(payload).join(", ")}`);
            throw new Error(`Laravel API Error (${status}): ${detail}`); // 💡 throwで終了
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.request) {
            console.error("[NETWORK_ERROR] Request made but no response received (possible timeout or network issue).", error.message);
            throw new Error(`Network Error: ${error.message}`); // 💡 throwで終了
        } else {
            console.error("[UNKNOWN_LOGIN_ERROR] Unknown error during login:", error);
            throw error; // 💡 throwで終了
        }
    }
// ⚠️ try/catchブロックの後に処理は到達しないため、ts(2355)は解消される
};
const checkLaravelSession = async ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/auth/check`);
        return res.data;
    } catch (e) {
        const error = e;
        if (error.response?.status === 401) {
            // 401 Unauthorized の場合
            return {
                authenticated: false,
                message: "Unauthenticated by server.",
                status_code_override: 401
            };
        }
        // その他のエラー
        console.error("[checkLaravelSession] Error:", error);
        return {
            authenticated: false
        };
    }
};
const useLaravelSession = (user, auth, checkLaravelSession, setLaravelAuthenticated, setInitialCheckComplete, setBackendUser)=>{
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
    /**
   * 💡 セッション確立後にリダイレクトをチェックするロジックに特化
   */ const syncAndRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLaravelSession.useCallback[syncAndRedirect]": async ()=>{
            // 💡 ログアウト状態や匿名ユーザーの場合は何もしない
            if (!user || !auth || user.isAnonymous) {
                setInitialCheckComplete(true);
                return;
            }
            try {
                // 💡 サーバーにセッション状態を問い合わせ、結果をAuthProviderにフィードバック
                const sessionData = await checkLaravelSession();
                setLaravelAuthenticated(sessionData.authenticated);
                if (sessionData.authenticated && sessionData.user) {
                    setBackendUser(sessionData.user);
                    // メール認証チェックとURLクリーンアップ
                    const backendUser = sessionData.user;
                    if (backendUser && !backendUser.email_verified_at) {
                        router.push("/email/verify");
                    } else if (isVerificationRedirect()) {
                        // 認証完了後のURLクリーンアップ
                        router.replace(window.location.pathname);
                    }
                } else {
                    // セッションがない場合はログアウト状態として扱う
                    setBackendUser(null);
                }
            } catch (error) {
                console.error("[Sanctum Sync] An error occurred during sync:", error);
                setLaravelAuthenticated(false);
                setBackendUser(null);
            } finally{
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
        setInitialCheckComplete,
        setBackendUser
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLaravelSession.useEffect": ()=>{
            // Firebaseユーザーが設定された後、Laravelセッションの同期とリダイレクトチェックを開始
            if (user !== undefined && auth) {
                syncAndRedirect();
            }
        // 💡 依存配列
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
"[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
// 💡 実際のパスに修正してください
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFirebaseInit.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
// 💡 実際のパスに修正してください
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
const initialAuthContext = {
    user: null,
    auth: null,
    userId: null,
    backendUser: null,
    isAuthenticated: false,
    isLoading: true,
    isLoggingOut: false,
    isRefreshing: false,
    token: null,
    apiClient: null,
    login: ()=>Promise.reject("Context not initialized"),
    logout: ()=>Promise.reject("Context not initialized"),
    reloadAuthToken: ()=>Promise.reject("Context not initialized"),
    setBackendUserStatus: ()=>{},
    initialCheckComplete: false
};
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
    // --- Laravel Session State ---
    const [laravelAuthenticated, setLaravelAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [initialCheckComplete, setInitialCheckComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- Interceptor 制御のための Ref ---
    const refreshPromiseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const failedQueueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const interceptorSetupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // 💡 Axiosの基本インスタンスをuseMemoで定義（インターセプターなし）
    const baseApiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[baseApiClient]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.baseURL = API_BASE_URL;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Accept = "application/json";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
        }
    }["AuthProvider.useMemo[baseApiClient]"], []);
    // --- A. ヘルパー関数定義 ---
    const fetchCsrfCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[fetchCsrfCookie]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/sanctum/csrf-cookie`);
            } catch (error) {
                console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
            }
        }
    }["AuthProvider.useCallback[fetchCsrfCookie]"], []);
    // --- B. 認証アクション定義 ---
    /**
   * 💡 ログアウト処理
   */ const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async (redirectPath = "/", shouldRedirect = true)=>{
            if (!auth) return;
            setIsLoggingOut(true);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                delete __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Authorization;
                setToken(null);
                setUser(null);
                setBackendUser(null);
                setLaravelAuthenticated(false);
                setInitialCheckComplete(true); // ログアウト時も完了とする
                // 💡 shouldRedirect が true の場合のみリダイレクトを実行
                if (shouldRedirect) {
                    router.push(redirectPath);
                }
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
                    const idToken = await user.getIdToken(true);
                    // 💡 リフレッシュ処理の前に CSRF Cookie を取得
                    await fetchCsrfCookie();
                    const { token: newToken, user: refreshedBackendUser } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    setBackendUser(refreshedBackendUser);
                    setToken(newToken);
                    return {
                        ...refreshedBackendUser,
                        token: newToken
                    };
                } catch (error) {
                    console.error("[Sanctum Refresh] Failed to complete token exchange:", error);
                    throw error;
                }
            } else {
                throw new Error("User not found for token refresh.");
            }
        }
    }["AuthProvider.useCallback[reloadAuthToken]"], [
        user,
        fetchCsrfCookie
    ]);
    /**
   * 💡 ログイン処理の核。
   */ const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async ({ email, password, name })=>{
            if (!auth) throw new Error("Auth service unavailable.");
            await fetchCsrfCookie();
            // 1. Firebase 認証を実行
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            // 2. Laravel側でSanctumセッションを確立
            const { user: newBackendUser, token: newToken } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken, name);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            setBackendUser(newBackendUser);
            setToken(newToken);
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
            const isAuth = initialCheckComplete && !!user && !user.isAnonymous && laravelAuthenticated === true && !!backendUser;
            return isAuth;
        }
    }["AuthProvider.useMemo[isAuthenticated]"], [
        initialCheckComplete,
        user,
        laravelAuthenticated,
        backendUser
    ]);
    /**
   * 💡 ローディング状態の計算を強化
   */ const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isLoading]": ()=>{
            const loading = !isReady || !initialCheckComplete || !!user && !backendUser && laravelAuthenticated;
            return loading;
        }
    }["AuthProvider.useMemo[isLoading]"], [
        isReady,
        initialCheckComplete,
        user,
        backendUser,
        laravelAuthenticated
    ]);
    /**
   * 💡 isRefreshing の計算。
   */ const isRefreshing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isRefreshing]": ()=>{
            return !!refreshPromiseRef.current;
        }
    }["AuthProvider.useMemo[isRefreshing]"], [
        refreshPromiseRef.current
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
                    // 認証フロー開始時にリセット
                    setLaravelAuthenticated(false);
                    setBackendUser(null);
                    setInitialCheckComplete(false); // 初期チェック未完了に戻す
                    let success = false;
                    let finalBackendUser = null;
                    let finalToken = null;
                    if (currentUser) {
                        try {
                            const idToken = await currentUser.getIdToken();
                            if (idToken) {
                                await fetchCsrfCookie();
                                const { user: newBackendUser, token: newToken } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useLaravelSession$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeLaravelLogin"])(idToken);
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                                finalBackendUser = newBackendUser;
                                finalToken = newToken;
                                success = true;
                            } else {
                                throw new Error("Failed to get Firebase ID Token.");
                            }
                        } catch (error) {
                            console.error("[Auth Check] Session sync failed. Initiating cleanup and redirect to login.", error);
                            // 🚨 修正: 認証失敗時は、確実にログインページにリダイレクトさせる (デッドロック回避)
                            await logout("/login", true);
                        // success は false のまま
                        } finally{
                            // ★★★ 状態の最終確定をまとめて行う ★★★
                            if (success) {
                                setBackendUser(finalBackendUser);
                                setToken(finalToken);
                                setLaravelAuthenticated(true);
                            } else {
                                // 失敗した場合、logout() で既にクリアされた状態を維持
                                setBackendUser(null);
                                setToken(null);
                                setLaravelAuthenticated(false);
                            }
                            // 🚨 最後に必ず初期チェック完了を設定する (デッドロック解除)
                            setInitialCheckComplete(true);
                        }
                    } else {
                        // ログアウト時 (currentUser === null)
                        delete __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Authorization;
                        setToken(null);
                        setBackendUser(null);
                        setLaravelAuthenticated(false);
                        setInitialCheckComplete(true); // ログアウト時も完了
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
        fetchCsrfCookie,
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
   * 責務 3: 💡 アプリケーション全体での認証状態に基づいたリダイレクト制御
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // 認証情報が確定するまでリダイレクトを遅延
            if (isLoading || !initialCheckComplete) return;
            if (isAuthenticated) {
                const isEmailUnverified = backendUser && !backendUser.email_verified_at;
                const exemptPaths = [
                    "/email/verify",
                    "/logout"
                ];
                if (isEmailUnverified) {
                    if (!exemptPaths.includes(pathname)) {
                        router.push("/email/verify");
                    }
                } else {
                    if (pathname === "/email/verify") {
                        router.push("/");
                    }
                }
            } else {
            // 未認証時の制御（ここでは省略）
            }
        }
    }["AuthProvider.useEffect"], [
        isLoading,
        initialCheckComplete,
        isAuthenticated,
        backendUser,
        pathname,
        router
    ]);
    // --- D. apiClient の生成と Interceptor の実装（変更なし） ---
    /**
   * 💡 Axios Interceptorの実装とAPI Clientの生成。
   */ const apiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[apiClient]": ()=>{
            const instance = baseApiClient;
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
                    // 成功・失敗に関わらず Ref をリセット
                    refreshPromiseRef.current = null;
                    failedQueueRef.current = [];
                }
            }["AuthProvider.useMemo[apiClient].processQueue"];
            // Axios Interceptor の実装
            if (!interceptorSetupRef.current) {
                instance.interceptors.response.use({
                    "AuthProvider.useMemo[apiClient]": (response)=>response
                }["AuthProvider.useMemo[apiClient]"], {
                    "AuthProvider.useMemo[apiClient]": async (error)=>{
                        const originalRequest = error.config;
                        // 💡 リフレッシュロジックは 401 Unauthorized にのみ反応させる
                        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                            originalRequest._retry = true;
                            if (!refreshPromiseRef.current) {
                                if (!user) {
                                    // 💡 ユーザーなしの場合、リダイレクト付きでログアウト
                                    await logout("/", true);
                                    return Promise.reject(error);
                                }
                                // ★ リフレッシュ処理を開始し、Ref に Promise を保持させる
                                refreshPromiseRef.current = reloadAuthToken();
                                try {
                                    const { token: newToken } = await refreshPromiseRef.current;
                                    processQueue(null, newToken);
                                    if (originalRequest.headers) {
                                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                    }
                                    return instance(originalRequest);
                                } catch (refreshError) {
                                    processQueue(refreshError, null);
                                    // 💡 リフレッシュ失敗の場合、リダイレクト付きでログアウト
                                    await logout("/", true);
                                    return Promise.reject(refreshError);
                                }
                            } else {
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
                interceptorSetupRef.current = true;
            }
            return instance;
        }
    }["AuthProvider.useMemo[apiClient]"], [
        baseApiClient,
        logout,
        reloadAuthToken,
        user
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
            isRefreshing,
            token,
            apiClient,
            login,
            logout,
            reloadAuthToken,
            setBackendUserStatus,
            initialCheckComplete
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/hooks/useSanctumAuth.tsx",
        lineNumber: 477,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "iley00kGKkrXpdFmK/6LvUcVu6c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    return ctx;
};
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
const useApiClient = ()=>{
    _s2();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx.apiClient) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
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
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)");
"use client";
;
;
function Providers({ children }) {
    // AuthProviderはuseContextやuseStateを使用するため、このクライアントコンポーネント内で実行される必要があります。
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
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

//# sourceMappingURL=_c2176df6._.js.map