(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
/* ============================================================
   Context
============================================================ */ const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
/* ============================================================
   Helper
============================================================ */ function loginWithLaravel(idToken, name) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/api/login_or_register", {
        id_token: idToken,
        name
    }, {
        withCredentials: true
    }).then((r)=>r.data);
}
function createSanctumApiClient(token) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
        baseURL: "/api",
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
function AuthProvider({ children }) {
    _s();
    const [firebaseUser, setFirebaseUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [auth, setAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Firebase Auth インスタンス
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isRegistering, setIsRegistering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    /* ============================================================
     ★ Point 1：Firebase 初期化は SSR では行わない
============================================================ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const _auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseAuth"])(); // ← window がある環境のみで動く
            setAuth(_auth);
        }
    }["AuthProvider.useEffect"], []);
    /* ============================================================
     ★ Point 2：localStorage の永続化は client でのみ復元
============================================================ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const savedToken = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");
            if (savedToken) setToken(savedToken);
            if (savedUser) setUser(JSON.parse(savedUser));
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    /* ============================================================
     ★ Point 3：Firebase Auth State Listener（client only）
============================================================ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!auth) return;
            const unsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onIdTokenChanged"])(auth, {
                "AuthProvider.useEffect.unsub": async (u)=>{
                    setFirebaseUser(u);
                    if (isRegistering) return;
                    if (u && !token) {
                        const idToken = await u.getIdToken(true);
                        const result = await loginWithLaravel(idToken);
                        setToken(result.token);
                        setUser(result.user);
                        localStorage.setItem("token", result.token);
                        localStorage.setItem("user", JSON.stringify(result.user));
                    }
                }
            }["AuthProvider.useEffect.unsub"]);
            return ({
                "AuthProvider.useEffect": ()=>unsub()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        auth,
        token,
        isRegistering
    ]);
    /* ============================================================
     Axios Client
============================================================ */ const apiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[apiClient]": ()=>{
            if (!token) return null;
            const instance = createSanctumApiClient(token);
            instance.interceptors.response.use({
                "AuthProvider.useMemo[apiClient]": (res)=>res
            }["AuthProvider.useMemo[apiClient]"], {
                "AuthProvider.useMemo[apiClient]": async (error)=>{
                    const original = error.config;
                    if (error.response?.status === 401 && !original._retry && firebaseUser) {
                        original._retry = true;
                        const newIdToken = await firebaseUser.getIdToken(true);
                        const result = await loginWithLaravel(newIdToken);
                        setToken(result.token);
                        setUser(result.user);
                        localStorage.setItem("token", result.token);
                        localStorage.setItem("user", JSON.stringify(result.user));
                        original.headers.Authorization = `Bearer ${result.token}`;
                        return instance(original);
                    }
                    return Promise.reject(error);
                }
            }["AuthProvider.useMemo[apiClient]"]);
            return instance;
        }
    }["AuthProvider.useMemo[apiClient]"], [
        token,
        firebaseUser
    ]);
    /* ============================================================
     LOGIN
============================================================ */ const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async ({ email, password })=>{
            if (!auth) throw new Error("Auth not initialized");
            const cred = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, email, password);
            const idToken = await cred.user.getIdToken(true);
            const result = await loginWithLaravel(idToken);
            setToken(result.token);
            setUser(result.user);
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
        }
    }["AuthProvider.useCallback[login]"], [
        auth
    ]);
    /* ============================================================
     REGISTER
============================================================ */ const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[register]": async (params)=>{
            if (!auth) throw new Error("Auth not initialized");
            setIsRegistering(true);
            try {
                const cred = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(auth, params.email, params.password);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(cred.user, {
                    displayName: params.name
                });
                const idToken = await cred.user.getIdToken(true);
                const result = await loginWithLaravel(idToken, params.name);
                setToken(result.token);
                setUser(result.user);
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));
                return {
                    needsEmailVerification: result.needsEmailVerification
                };
            } finally{
                setIsRegistering(false);
            }
        }
    }["AuthProvider.useCallback[register]"], [
        auth
    ]);
    /* ============================================================
     LOGOUT
============================================================ */ const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            if (!auth) return;
            await auth.signOut();
            setFirebaseUser(null);
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }["AuthProvider.useCallback[logout]"], [
        auth
    ]);
    /* ============================================================
     EXPORT VALUE
============================================================ */ const value = {
        user,
        firebaseUser,
        token,
        apiClient,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        reloadAuthToken: async ()=>{
            if (!firebaseUser) return;
            const idToken = await firebaseUser.getIdToken(true);
            const result = await loginWithLaravel(idToken);
            setToken(result.token);
            setUser(result.user);
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/hooks/useSanctumAuth.tsx",
        lineNumber: 304,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "/xozwK9VCugtxXo/DuGT0KYY6co=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
function useApiClient() {
    _s2();
    const { apiClient } = useAuth();
    if (!apiClient) throw new Error("API client is not ready");
    return apiClient;
}
_s2(useApiClient, "glNiNy7lvstw0bOvuXs5y39jxxs=", false, function() {
    return [
        useAuth
    ];
});
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ======================================
// 画像タイプ Enum
// ======================================
__turbopack_context__.s([
    "BASE",
    ()=>BASE,
    "IMAGE_TYPE",
    ()=>IMAGE_TYPE,
    "getImageUrl",
    ()=>getImageUrl,
    "onImageError",
    ()=>onImageError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var IMAGE_TYPE = /*#__PURE__*/ function(IMAGE_TYPE) {
    IMAGE_TYPE["USER"] = "user";
    IMAGE_TYPE["ITEM"] = "item";
    IMAGE_TYPE["OTHER"] = "other";
    return IMAGE_TYPE;
}({});
const BASE = ("TURBOPACK compile-time value", "") || "https://laravel.test";
const getImageUrl = (path, _type, cacheBuster)=>{
    if (!path) return "https://placehold.co/300x300?text=No+Image";
    // Laravel が返した public URL / public path はそのまま使う
    if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
        return cacheBuster ? `${path}?v=${cacheBuster}` : path;
    }
    // 想定外（保険）
    return cacheBuster ? `/${path}?v=${cacheBuster}` : `/${path}`;
};
const onImageError = (e, name)=>{
    const img = e.target;
    img.onerror = null;
    img.src = `https://placehold.co/300x300?text=${name}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(main)/item/[items_id]/W-ItemDetailView.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "brandBlock": "W-ItemDetailView-module__jxxsBG__brandBlock",
  "brandLabel": "W-ItemDetailView-module__jxxsBG__brandLabel",
  "brandValue": "W-ItemDetailView-module__jxxsBG__brandValue",
  "card": "W-ItemDetailView-module__jxxsBG__card",
  "categoryLabel": "W-ItemDetailView-module__jxxsBG__categoryLabel",
  "categoryList": "W-ItemDetailView-module__jxxsBG__categoryList",
  "categoryRow": "W-ItemDetailView-module__jxxsBG__categoryRow",
  "categoryTag": "W-ItemDetailView-module__jxxsBG__categoryTag",
  "commentCount": "W-ItemDetailView-module__jxxsBG__commentCount",
  "commentCountText": "W-ItemDetailView-module__jxxsBG__commentCountText",
  "commentDate": "W-ItemDetailView-module__jxxsBG__commentDate",
  "commentHeader": "W-ItemDetailView-module__jxxsBG__commentHeader",
  "commentIcon": "W-ItemDetailView-module__jxxsBG__commentIcon",
  "commentIconBlock": "W-ItemDetailView-module__jxxsBG__commentIconBlock",
  "commentItem": "W-ItemDetailView-module__jxxsBG__commentItem",
  "commentList": "W-ItemDetailView-module__jxxsBG__commentList",
  "commentText": "W-ItemDetailView-module__jxxsBG__commentText",
  "commentUserImage": "W-ItemDetailView-module__jxxsBG__commentUserImage",
  "commentUserName": "W-ItemDetailView-module__jxxsBG__commentUserName",
  "commentUserRow": "W-ItemDetailView-module__jxxsBG__commentUserRow",
  "conditionLabel": "W-ItemDetailView-module__jxxsBG__conditionLabel",
  "conditionRow": "W-ItemDetailView-module__jxxsBG__conditionRow",
  "conditionValue": "W-ItemDetailView-module__jxxsBG__conditionValue",
  "errorBox": "W-ItemDetailView-module__jxxsBG__errorBox",
  "errorBoxSmall": "W-ItemDetailView-module__jxxsBG__errorBoxSmall",
  "errorTitle": "W-ItemDetailView-module__jxxsBG__errorTitle",
  "explainText": "W-ItemDetailView-module__jxxsBG__explainText",
  "favoriteActive": "W-ItemDetailView-module__jxxsBG__favoriteActive",
  "favoriteBlock": "W-ItemDetailView-module__jxxsBG__favoriteBlock",
  "favoriteBtn": "W-ItemDetailView-module__jxxsBG__favoriteBtn",
  "favoriteCount": "W-ItemDetailView-module__jxxsBG__favoriteCount",
  "favoriteIcon": "W-ItemDetailView-module__jxxsBG__favoriteIcon",
  "image": "W-ItemDetailView-module__jxxsBG__image",
  "imageArea": "W-ItemDetailView-module__jxxsBG__imageArea",
  "infoArea": "W-ItemDetailView-module__jxxsBG__infoArea",
  "itemTitle": "W-ItemDetailView-module__jxxsBG__itemTitle",
  "item_detail_contents": "W-ItemDetailView-module__jxxsBG__item_detail_contents",
  "item_detail_wrapper": "W-ItemDetailView-module__jxxsBG__item_detail_wrapper",
  "loadingText": "W-ItemDetailView-module__jxxsBG__loadingText",
  "loadingWrapper": "W-ItemDetailView-module__jxxsBG__loadingWrapper",
  "needLoginText": "W-ItemDetailView-module__jxxsBG__needLoginText",
  "noComments": "W-ItemDetailView-module__jxxsBG__noComments",
  "notFoundBox": "W-ItemDetailView-module__jxxsBG__notFoundBox",
  "notFoundText": "W-ItemDetailView-module__jxxsBG__notFoundText",
  "price": "W-ItemDetailView-module__jxxsBG__price",
  "priceAfter": "W-ItemDetailView-module__jxxsBG__priceAfter",
  "priceBlock": "W-ItemDetailView-module__jxxsBG__priceBlock",
  "priceSoldOut": "W-ItemDetailView-module__jxxsBG__priceSoldOut",
  "priceYen": "W-ItemDetailView-module__jxxsBG__priceYen",
  "reactionRow": "W-ItemDetailView-module__jxxsBG__reactionRow",
  "section": "W-ItemDetailView-module__jxxsBG__section",
  "sectionTitle": "W-ItemDetailView-module__jxxsBG__sectionTitle",
  "spin": "W-ItemDetailView-module__jxxsBG__spin",
  "spinner": "W-ItemDetailView-module__jxxsBG__spinner",
  "submitBtn": "W-ItemDetailView-module__jxxsBG__submitBtn",
  "textarea": "W-ItemDetailView-module__jxxsBG__textarea",
});
}),
"[project]/app/(main)/item/[items_id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ItemDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/src/services/itemService'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/(main)/item/[items_id]/W-ItemDetailView.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function ItemDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { apiClient, isAuthenticated, isLoading: isAuthLoading, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const isRefreshing = false;
    const itemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[itemId]": ()=>{
            const raw = params.items_id;
            if (!raw) return null;
            const id = Array.isArray(raw) ? raw[0] : raw;
            const n = Number(id);
            return isNaN(n) ? null : n;
        }
    }["ItemDetailPage.useMemo[itemId]"], [
        params.items_id
    ]);
    const { item, comments, isFavorited, favoritesCount, isLoading, isError, mutate } = useItemDetailSWR(itemId, apiClient);
    const totalLoading = isAuthLoading || isLoading || isRefreshing;
    const itemErrors = [];
    const error = isError;
    // コメント投稿
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentErrors, setCommentErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSubmittingComment, setIsSubmittingComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const navigateToPurchase = ()=>{
        if (!item) return;
        // ここは実際の購入ページのパスに合わせて変えてOK
        // 例: /purchase/9 みたいなページなら
        router.push(`/purchase/${item.id}`);
    // もし「カート画面に飛ばしたい」なら:
    // router.push(`/cart?item_id=${item.id}`);
    };
    const isOwner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[isOwner]": ()=>{
            if (!isAuthenticated || !item) return false;
            return user?.id === item.user_id;
        }
    }["ItemDetailPage.useMemo[isOwner]"], [
        isAuthenticated,
        item,
        user
    ]);
    const canInteract = isAuthenticated && !isOwner;
    const isSoldOut = item?.remain === 0;
    /* ローディング -------------------------------- */ if (totalLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingWrapper,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingText,
                    children: isAuthLoading ? "認証状態を確認中..." : ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "商品情報を読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 76,
            columnNumber: 7
        }, this);
    }
    /* エラー -------------------------------- */ if (isError || itemErrors && itemErrors.length > 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorBox,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorTitle,
                    children: "データの取得エラー"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: String(error)
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this),
                itemErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: err
                    }, index, false, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this);
    }
    /* 見つからない -------------------------------- */ if (!item) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].notFoundBox,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].notFoundText,
                children: "商品が見つかりませんでした。"
            }, void 0, false, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 105,
            columnNumber: 7
        }, this);
    }
    /* カテゴリー整形 -------------------------------- */ const itemCategories = Array.isArray(item.category) ? item.category : (()=>{
        try {
            const parsed = JSON.parse(item.category);
            return Array.isArray(parsed) ? parsed : [
                item.category
            ];
        } catch (_) {
            return [
                item.category
            ];
        }
    })();
    /* お気に入り登録/解除 -------------------------------- */ const submitFavorite = async ()=>{
        if (!item) return;
        if (!isAuthenticated) return router.push("/login");
        const endpoint = `/items/${item.id}/favorite`;
        try {
            await apiClient?.request({
                method: isFavorited ? "DELETE" : "POST",
                url: endpoint
            });
            await mutate(); // 再取得
        } catch (e) {
            console.error("Favorite toggle failed:", e);
        }
    };
    /* コメント投稿 -------------------------------- */ const submitComment = async ()=>{
        if (!item) return;
        if (!newComment.trim()) {
            setCommentErrors([
                "コメントを入力してください"
            ]);
            return;
        }
        if (!isAuthenticated) return router.push("/login");
        setIsSubmittingComment(true);
        setCommentErrors([]);
        try {
            const res = await apiClient?.post("/comment", {
                item_id: item.id,
                comment: newComment
            });
            if (res?.data?.comment) {
                mutate(); // コメントリストを再取得
                setNewComment("");
            }
        } catch (e) {
            console.error("Comment failed:", e);
            setCommentErrors([
                "コメント投稿に失敗しました"
            ]);
        } finally{
            setIsSubmittingComment(false);
        }
    };
    /* JSX ----------------------------------------- */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item_detail_wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item_detail_contents,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageArea,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item.item_image, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].ITEM),
                            onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name),
                            alt: "商品写真",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].infoArea,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemTitle,
                                children: item.name
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brandBlock,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brandLabel,
                                        children: "ブランド名"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brandValue,
                                        children: item.brand || "未登録"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceBlock,
                                children: isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceSoldOut,
                                    children: "SOLD OUT"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceYen,
                                            children: "¥"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 205,
                                            columnNumber: 19
                                        }, this),
                                        item.price ? item.price.toLocaleString() : "---",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceAfter,
                                            children: " (税込)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 204,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].reactionRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteBlock,
                                        children: [
                                            canInteract ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: submitFavorite,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteBtn,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteIcon} ${isFavorited ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteActive : ""}`,
                                                    children: isFavorited ? "❤️" : "🤍"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 216,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disabledHeart,
                                                children: "🤍"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 229,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteCount,
                                                children: favoritesCount
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentIconBlock,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentIcon,
                                                children: "💬"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentCount,
                                                children: comments.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 237,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "item_detail_form pt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (isOwner) {
                                            router.push("/mypage");
                                        } else if (!isAuthenticated) {
                                            router.push("/login");
                                        } else {
                                            navigateToPurchase();
                                        }
                                    },
                                    disabled: isSoldOut && !isOwner || totalLoading,
                                    className: `w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${!isSoldOut ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"} disabled:bg-gray-400 disabled:opacity-70`,
                                    children: isOwner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "マイページへ移動する"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 19
                                    }, this) : !isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "ログインして購入"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 263,
                                        columnNumber: 19
                                    }, this) : !isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "カートへ"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "SOLD OUT"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 267,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 243,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].section,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                        children: "商品説明"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].explainText,
                                        children: item.explain
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].section,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                        children: "商品情報"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryLabel,
                                                children: "カテゴリー"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryList,
                                                children: itemCategories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryTag,
                                                        children: category
                                                    }, index, false, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 283,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].conditionRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].conditionLabel,
                                        children: "商品の状態"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].conditionValue,
                                        children: item.condition || "未登録"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].section,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "コメント"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 304,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentCountText,
                                                children: [
                                                    "(",
                                                    comments.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 305,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this),
                                    comments.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentList,
                                        children: comments.map((comment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentUserRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(comment.user.user_image || null, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].USER),
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentUserImage,
                                                                onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, comment.user.name)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                lineNumber: 315,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentUserName,
                                                                children: comment.user.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                lineNumber: 324,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 314,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentText,
                                                        children: comment.comment
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentDate,
                                                        children: [
                                                            "投稿日時:",
                                                            " ",
                                                            new Date(comment.created_at).toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, comment.id, true, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 313,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 311,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].noComments,
                                        children: "まだコメントはありません。"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 339,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].section,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                        children: "商品へのコメント"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 345,
                                        columnNumber: 15
                                    }, this),
                                    commentErrors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorBoxSmall,
                                        children: commentErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: err
                                            }, index, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 350,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 348,
                                        columnNumber: 17
                                    }, this),
                                    isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: newComment,
                                                onChange: (e)=>setNewComment(e.target.value),
                                                rows: 5,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].textarea
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 357,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].submitBtn,
                                                onClick: submitComment,
                                                disabled: isSubmittingComment,
                                                children: isSubmittingComment ? "投稿中..." : "コメントを送信する"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].submitBtn,
                                        onClick: ()=>router.push("/login"),
                                        style: {
                                            cursor: "pointer"
                                        },
                                        children: "ログインしてコメントする"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 344,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 176,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
_s(ItemDetailPage, "K62UMoK6d/KVEbiKtb6Twvrlync=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        useItemDetailSWR
    ];
});
_c = ItemDetailPage;
var _c;
__turbopack_context__.k.register(_c, "ItemDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_2e0502a2._.js.map