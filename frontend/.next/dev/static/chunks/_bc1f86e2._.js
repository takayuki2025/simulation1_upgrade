(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/infrastructure/auth/TokenStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenStorage",
    ()=>TokenStorage
]);
const ACCESS = "access_token";
const REFRESH = "refresh_token";
const TokenStorage = {
    save (tokens) {
        localStorage.setItem(ACCESS, tokens.accessToken);
        localStorage.setItem(REFRESH, tokens.refreshToken);
    },
    load () {
        return {
            accessToken: localStorage.getItem(ACCESS) || "",
            refreshToken: localStorage.getItem(REFRESH) || ""
        };
    },
    clear () {
        localStorage.removeItem(ACCESS);
        localStorage.removeItem(REFRESH);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/deviceId.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDeviceId",
    ()=>getDeviceId
]);
function getDeviceId() {
    let d = localStorage.getItem("device_id");
    if (!d) {
        d = crypto.randomUUID();
        localStorage.setItem("device_id", d);
    }
    return d;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/application/auth/AuthService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthService",
    ()=>AuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/infrastructure/auth/TokenStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$deviceId$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/deviceId.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
;
;
;
class AuthService {
    firebase;
    laravel;
    constructor(firebase, laravel){
        this.firebase = firebase;
        this.laravel = laravel;
    }
    async register(name, email, password) {
        const user = await this.firebase.register(email, password);
        // Firebase displayName を設定
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(user, {
            displayName: name
        });
        // 認証メール送信
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendEmailVerification"])(user);
        return {
            needsEmailVerification: true
        };
    }
    async login(email, password) {
        const firebaseUser = await this.firebase.login(email, password);
        return await this.issueLaravelTokens(firebaseUser);
    }
    async issueLaravelTokens(firebaseUser) {
        const firebaseToken = await this.firebase.getIdToken(firebaseUser);
        const deviceId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$deviceId$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceId"])();
        const tokens = await this.laravel.loginWithFirebaseToken(firebaseToken, deviceId);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenStorage"].save(tokens);
        return await this.laravel.me();
    }
    async logout() {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenStorage"].clear();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/infrastructure/auth/FirebaseAuthClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseAuthClient",
    ()=>FirebaseAuthClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
;
class FirebaseAuthClient {
    auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])();
    async register(email, password) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(this.auth, email, password);
        return result.user;
    }
    async login(email, password) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(this.auth, email, password);
        return result.user;
    }
    async getIdToken(user) {
        return user.getIdToken(true);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/infrastructure/auth/LaravelAuthApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LaravelAuthApi",
    ()=>LaravelAuthApi
]);
class LaravelAuthApi {
    client;
    constructor(client){
        this.client = client;
    }
    async loginWithFirebaseToken(firebaseToken, deviceId) {
        const res = await this.client.post("/auth/login", {
            firebase_token: firebaseToken,
            device_id: deviceId
        });
        return {
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
            tokenType: "Bearer",
            expiresIn: res.data.expires_in
        };
    }
    async refresh(refreshToken, deviceId) {
        const res = await this.client.post("/auth/refresh", {
            refresh_token: refreshToken,
            device_id: deviceId
        });
        return {
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
            tokenType: "Bearer",
            expiresIn: res.data.expires_in
        };
    }
    async me() {
        const res = await this.client.get("/me");
        return res.data;
    }
    async logout() {
        await this.client.post("/auth/logout");
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/infrastructure/auth/HttpClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHttpClient",
    ()=>createHttpClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/infrastructure/auth/TokenStorage.ts [app-client] (ecmascript)");
;
;
function createHttpClient(on401) {
    const client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
        baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL,
        withCredentials: false
    });
    client.interceptors.request.use({
        "createHttpClient.use": (config)=>{
            const { accessToken } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenStorage"].load();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        }
    }["createHttpClient.use"]);
    client.interceptors.response.use({
        "createHttpClient.use": (res)=>res
    }["createHttpClient.use"], {
        "createHttpClient.use": async (error)=>{
            if (error?.response?.status === 401) {
                await on401(); // Refresh を Application Service に委譲
            }
            throw error;
        }
    }["createHttpClient.use"]);
    return client;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/application/auth/TokenRefreshService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenRefreshService",
    ()=>TokenRefreshService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/infrastructure/auth/TokenStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$deviceId$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/deviceId.ts [app-client] (ecmascript)");
;
;
class TokenRefreshService {
    api;
    constructor(api){
        this.api = api;
    }
    async refresh() {
        const { refreshToken } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenStorage"].load();
        if (!refreshToken) return null;
        const deviceId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$deviceId$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceId"])();
        const tokens = await this.api.refresh(refreshToken, deviceId);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$TokenStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenStorage"].save(tokens);
        return await this.api.me();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/ui/auth/AuthProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$application$2f$auth$2f$AuthService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/application/auth/AuthService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$FirebaseAuthClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/infrastructure/auth/FirebaseAuthClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$LaravelAuthApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/infrastructure/auth/LaravelAuthApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$HttpClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/infrastructure/auth/HttpClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$application$2f$auth$2f$TokenRefreshService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/application/auth/TokenRefreshService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // -------------------------------------------------------------
    // ✔ サービスの初期化は useMemo で1回だけ実行（DDDにおける Singleton 代わり）
    // -------------------------------------------------------------
    const { authService, laravelApi, refreshService } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo": ()=>{
            const firebase = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$FirebaseAuthClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseAuthClient"]();
            const httpClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$HttpClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHttpClient"])({
                "AuthProvider.useMemo.httpClient": async ()=>{
                    const refreshed = await refresh.refresh();
                    if (refreshed) {
                        setUser(refreshed);
                    } else {
                        setUser(null);
                    }
                }
            }["AuthProvider.useMemo.httpClient"]);
            const laravel = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$infrastructure$2f$auth$2f$LaravelAuthApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LaravelAuthApi"](httpClient);
            const auth = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$application$2f$auth$2f$AuthService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthService"](firebase, laravel);
            const refresh = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$application$2f$auth$2f$TokenRefreshService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenRefreshService"](laravel);
            return {
                authService: auth,
                laravelApi: laravel,
                refreshService: refresh
            };
        }
    }["AuthProvider.useMemo"], []);
    // -------------------------------------------------------------
    // 🔥 初回ロード（/me 復元）
    // -------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            ({
                "AuthProvider.useEffect": async ()=>{
                    try {
                        const u = await laravelApi.me();
                        setUser(u);
                    } catch  {
                        setUser(null);
                    } finally{
                        setIsLoading(false);
                    }
                }
            })["AuthProvider.useEffect"]();
        }
    }["AuthProvider.useEffect"], [
        laravelApi
    ]);
    // -------------------------------------------------------------
    // 認証操作
    // -------------------------------------------------------------
    async function register({ name, email, password }) {
        return authService.register(name, email, password);
    }
    async function login({ email, password }) {
        setIsLoading(true);
        const u = await authService.login(email, password);
        setUser(u);
        setIsLoading(false);
    }
    async function logout() {
        await authService.logout();
        setUser(null);
    }
    async function reloadUser() {
        try {
            const u = await laravelApi.me();
            setUser(u);
        } catch  {
            setUser(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated: !!user,
            isLoading,
            register,
            login,
            logout,
            reloadUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/ui/auth/AuthProvider.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "anGPeUM7LTooDlmfKZOF95YKUmU=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/client-wrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/auth/AuthProvider.tsx [app-client] (ecmascript)");
"use client";
;
;
function ClientWrapper({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/client-wrapper.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
_c = ClientWrapper;
var _c;
__turbopack_context__.k.register(_c, "ClientWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_bc1f86e2._.js.map