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
                        // 2. 認証状態の監視 (Firebaseがローカルストレージからセッションを復元するまで待つ)
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
"[project]/hooks/useAuth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFirebaseInit.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// --- 設定 ---
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const { auth, userId, isReady } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [laravelAuthenticated, setLaravelAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [initialCheckComplete, setInitialCheckComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 初期チェック完了フラグ
    // Sanctum CSRF Cookieの取得
    const fetchCsrfCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[fetchCsrfCookie]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/sanctum/csrf-cookie`);
                console.log("[Sanctum] CSRF cookie fetched");
            } catch (error) {
                console.error("[Sanctum] Failed to fetch CSRF cookie:", error);
            }
        }
    }["AuthProvider.useCallback[fetchCsrfCookie]"], []);
    // Laravel セッションチェック API
    const checkLaravelSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[checkLaravelSession]": async ()=>{
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/auth/check`, {
                    withCredentials: true
                });
                return res.data; // { authenticated: boolean, user: { email_verified_at: string | null } } などを期待
            } catch  {
                return {
                    authenticated: false
                };
            }
        }
    }["AuthProvider.useCallback[checkLaravelSession]"], []);
    // Firebase ID TokenをLaravelに送り、Sanctumセッションを確立する
    const completeLaravelLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[completeLaravelLogin]": // ★修正2: name を引数に追加
        async (idToken, name)=>{
            try {
                // ★修正3: name をペイロードに追加
                const payload = {
                    id_token: idToken,
                    ...name && {
                        name: name
                    }
                };
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/api/register_or_login`, payload);
                // サーバーから返されたユーザー情報（メール認証状態）を取得
                const backendUser = res.data.user;
                if (res.data.token && backendUser) {
                    console.log("[Sanctum] Successful token exchange and session established.");
                    // 🚨 修正のポイント: サーバーからトークンが返されたらここでクライアント側のリダイレクト処理を行う 🚨
                    if (!backendUser.email_verified_at) {
                        console.log("[Redirect] Email not verified. Moving to verification notice page.");
                        // ★修正6: パスを "/verify-email-notice" に戻す
                        router.push("/email/verify");
                    } else {
                        console.log("[Redirect] Email verified. Moving to dashboard.");
                        router.push("/mypage");
                    }
                    return true; // 認証成功
                } else {
                    throw new Error("Sanctum token exchange failed: Missing token or user data.");
                }
            } catch (error) {
                console.error("[Sanctum] Token exchange error:", error);
                // 失敗時は再ログインを促すため、エラーをスロー
                throw error;
            }
        }
    }["AuthProvider.useCallback[completeLaravelLogin]"], [
        router
    ]);
    /**
   * 認証トークンを強制的にリロードする関数
   */ const reloadAuthToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[reloadAuthToken]": async ()=>{
            if (user) {
                console.log("[Firebase] Forcing ID Token refresh...");
                try {
                    const idToken = await user.getIdToken(true);
                    setToken(idToken);
                    // name はここでは渡さない (リフレッシュ目的のため)
                    await completeLaravelLogin(idToken);
                } catch (error) {
                    console.error("[Firebase] Failed to refresh ID Token:", error);
                }
            }
        }
    }["AuthProvider.useCallback[reloadAuthToken]"], [
        user,
        completeLaravelLogin
    ]);
    // Firebase user 変化 → token 更新 + Laravel セッション確認
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!auth || !isReady) return;
            const unsub = auth.onAuthStateChanged({
                "AuthProvider.useEffect.unsub": async (currentUser)=>{
                    setUser(currentUser);
                    let idToken = null;
                    let sessionData = {
                        authenticated: false
                    };
                    if (currentUser) {
                        try {
                            idToken = await currentUser.getIdToken();
                            setToken(idToken);
                        } catch  {
                            setToken(null);
                        }
                    } else {
                        setToken(null);
                    }
                    // 1. Firebaseユーザー変化のたび Laravel セッション確認
                    sessionData = await checkLaravelSession();
                    setLaravelAuthenticated(sessionData.authenticated);
                    // 2. Firebaseユーザーが存在し、IDトークンがあり、かつLaravel側で認証されていない場合
                    if (currentUser && idToken && !currentUser.isAnonymous && !sessionData.authenticated) {
                        console.log("[Sanctum] Non-anonymous user present but session missing. Attempting auto-login...");
                        try {
                            // name は auto-login の際は渡さない
                            const success = await completeLaravelLogin(idToken);
                            if (success) {
                                setLaravelAuthenticated(true);
                            }
                        } catch (error) {
                            console.error("[Sanctum] Auto-login attempt failed. Forcing Firebase logout.");
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                        }
                    } else if (currentUser && currentUser.isAnonymous && sessionData.authenticated) {
                        console.warn("[Sanctum] Anonymous user found with active Laravel session. Forcing logout.");
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                    }
                    setInitialCheckComplete(true);
                }
            }["AuthProvider.useEffect.unsub"]);
            return ({
                "AuthProvider.useEffect": ()=>unsub()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        auth,
        isReady,
        checkLaravelSession,
        completeLaravelLogin
    ]);
    // 初回 CSRF
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            fetchCsrfCookie();
        }
    }["AuthProvider.useEffect"], [
        fetchCsrfCookie
    ]);
    // isAuthenticated の正しい条件
    const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isAuthenticated]": ()=>{
            return initialCheckComplete && !!user && !user.isAnonymous && laravelAuthenticated === true;
        }
    }["AuthProvider.useMemo[isAuthenticated]"], [
        initialCheckComplete,
        user,
        laravelAuthenticated
    ]);
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isLoading]": ()=>!isReady || !initialCheckComplete
    }["AuthProvider.useMemo[isLoading]"], [
        isReady,
        initialCheckComplete
    ]);
    // Login
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": // ★修正4: credentials の型を AuthContextType に合わせて修正
        async ({ email, password, name })=>{
            if (!auth) throw new Error("Auth service unavailable.");
            await fetchCsrfCookie();
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, email, password);
            // Firebaseログイン成功後、IDトークンを使ってLaravel側にセッションを確立
            const idToken = await userCredential.user.getIdToken();
            // ★修正5: name を completeLaravelLogin に渡す
            await completeLaravelLogin(idToken, name);
            setLaravelAuthenticated(true);
        }
    }["AuthProvider.useCallback[login]"], [
        auth,
        fetchCsrfCookie,
        completeLaravelLogin
    ]);
    // Logout
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async (redirectPath = "/")=>{
            if (!auth) return;
            setIsLoggingOut(true);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                setLaravelAuthenticated(false);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            auth,
            userId,
            isAuthenticated,
            isLoading,
            isLoggingOut,
            token,
            login,
            logout,
            reloadAuthToken
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/hooks/useAuth.tsx",
        lineNumber: 272,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "flsLYHNIfAGskMfnSBBCPqjU8DI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_b6d500d9._.js.map