(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/useFirebaseInit.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFirebaseInit",
    ()=>useFirebaseInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Firebaseの初期化設定（process.envから読み込む）
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyC4YCgTTKw1WS3Zg7niARhN5uV_szcxg8U"),
    authDomain: ("TURBOPACK compile-time value", "takayuki-2025-ver-1.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "takayuki-2025-ver-1"),
    storageBucket: ("TURBOPACK compile-time value", "takayuki-2025-ver-1.appspot.com"),
    messagingSenderId: ("TURBOPACK compile-time value", "755907716529"),
    appId: ("TURBOPACK compile-time value", "1:755907716529:web:49eba1d86d1e1934948990")
};
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
                        // 1. AppとAuthサービスの初期化
                        const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) // as any は型チェックを一時的に回避するため
                         : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])();
                        const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
                        setState({
                            "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                    ...s,
                                    app,
                                    auth
                                })
                        }["useFirebaseInit.useEffect.initFirebase"]);
                        // 2. 認証状態の監視
                        // onAuthStateChangedは、ローカルストレージやCookieから認証状態を読み込み、
                        // 状態が確定した時に最初に発火します。
                        unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(auth, {
                            "useFirebaseInit.useEffect.initFirebase": (user)=>{
                                // 初回発火時のみ isReady を true に設定
                                if (!authStateResolved) {
                                    console.log("[AuthInit] Initial state resolved. Setting isReady=true.");
                                    authStateResolved = true;
                                    setState({
                                        "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                                ...s,
                                                userId: user?.uid ?? null,
                                                isReady: true
                                            })
                                    }["useFirebaseInit.useEffect.initFirebase"]);
                                } else {
                                    // 状態変更時のユーザーID更新（リロード後のセッション復元ではない）
                                    setState({
                                        "useFirebaseInit.useEffect.initFirebase": (s)=>({
                                                ...s,
                                                userId: user?.uid ?? null
                                            })
                                    }["useFirebaseInit.useEffect.initFirebase"]);
                                }
                            }
                        }["useFirebaseInit.useEffect.initFirebase"]);
                        // 3. 匿名サインインを試みる（既存ユーザーがいなければ）
                        // onAuthStateChangedが未認証を解決した後、匿名認証を試み、その結果をリスナーが拾う
                        if (!auth.currentUser) {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInAnonymously"])(auth);
                            console.log("[AuthInit] Signed in anonymously or session restored.");
                        }
                    } catch (error) {
                        console.error("[AuthInit] Firebase initialization failed:", error);
                        // エラーが発生した場合も、isReadyをtrueにしてアプリのブロックを解除する
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
                    if (unsubscribe) unsubscribe();
                }
            })["useFirebaseInit.useEffect"];
        }
    }["useFirebaseInit.useEffect"], []); // 依存配列は空でOK
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
// Firebaseのインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
// axiosのインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
// プロジェクト内のフック
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFirebaseInit.tsx [app-client] (ecmascript)");
// Next.jsのルーター
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// 環境変数からAPI URLを取得
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
// ★★★ 修正箇所: AxiosにCookie(クレデンシャル)を常に送信するよう設定 ★★★
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const { auth, userId, isReady } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])(); // ルーターを使用
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // トークン状態を追加
    // =======================================================
    // CSRF Cookieの取得ロジック (Sanctum連携に必須)
    // =======================================================
    const fetchCsrfCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[fetchCsrfCookie]": async ()=>{
            // API_BASE_URLが設定されていない場合はスキップ
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                // Laravel SanctumがCookieを設定するためのエンドポイントを叩く
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/sanctum/csrf-cookie`);
                console.log("[Sanctum Setup] CSRF Cookie fetched successfully.");
            } catch (error) {
                console.error("[Sanctum Setup] Failed to fetch CSRF cookie:", error);
            }
        }
    }["AuthProvider.useCallback[fetchCsrfCookie]"], []);
    // 1. Firebase Auth リスナー
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!auth) return;
            const unsubscribe = auth.onAuthStateChanged({
                "AuthProvider.useEffect.unsubscribe": (currentUser)=>{
                    setUser(currentUser);
                    // ユーザーが存在すれば、IDトークンを取得して状態に保存
                    if (currentUser) {
                        currentUser.getIdToken().then(setToken).catch({
                            "AuthProvider.useEffect.unsubscribe": ()=>setToken(null)
                        }["AuthProvider.useEffect.unsubscribe"]);
                    } else {
                        setToken(null);
                    }
                }
            }["AuthProvider.useEffect.unsubscribe"]);
            return ({
                "AuthProvider.useEffect": ()=>unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        auth
    ]);
    // 2. ★CSRF Cookieの初期取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // authが利用可能になったとき、またはコンポーネントマウント時に一度実行
            // Firebaseの初期化とは独立してCSRF Cookieを取得
            if ("TURBOPACK compile-time truthy", 1) {
                fetchCsrfCookie();
            }
        }
    }["AuthProvider.useEffect"], [
        fetchCsrfCookie
    ]);
    // 匿名ユーザーはログイン済みとみなさない
    const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isAuthenticated]": ()=>!!user && !user.isAnonymous
    }["AuthProvider.useMemo[isAuthenticated]"], [
        user
    ]);
    // isReady (Firebase初期化完了) が true かつ 認証状態の確認も完了したときを想定
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[isLoading]": ()=>!isReady
    }["AuthProvider.useMemo[isLoading]"], [
        isReady
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async ({ email, password })=>{
            if (!auth) throw new Error("Auth service is unavailable.");
            // ログイン前にCSRF Cookieが最新であることを確認（念のため再実行）
            await fetchCsrfCookie();
            // ログイン成功後、onAuthStateChanged が実行され user/token が更新される
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, email, password);
        }
    }["AuthProvider.useCallback[login]"], [
        auth,
        fetchCsrfCookie
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async (redirectPath = "/")=>{
            if (!auth) return;
            setIsLoggingOut(true);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
                // ログアウト処理後にSanctumセッションを破棄するAPIコールを追加することも検討
                // await axios.post(`${API_BASE_URL}/api/logout`);
                console.log(`Logout successful. Redirect to: ${redirectPath}`);
                // リダイレクト処理
                router.push(redirectPath);
            } catch (err) {
                console.error("Logout Error:", err);
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
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/hooks/useAuth.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "/5I42KyiNVMRPZu+iaGa+NHfQeQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFirebaseInit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFirebaseInit"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=hooks_c1a7cb42._.js.map