module.exports = [
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/utils/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// プレースホルダー画像URL
__turbopack_context__.s([
    "PLACEHOLDER_IMAGE_URL",
    ()=>PLACEHOLDER_IMAGE_URL,
    "getImageUrl",
    ()=>getImageUrl,
    "onImageError",
    ()=>onImageError
]);
const PLACEHOLDER_IMAGE_URL = "https://placehold.co/300x300/e0e0e0/333?text=No+Image";
// Next.jsの環境変数からASSET_BASE_URLを取得 (今回はAPI_BASE_URLと同じとして扱う)
// 実際のNext.js環境では静的アセットはパブリックディレクトリに置くことが多いですが、
// Laravel側のStorageを参照する設定を再現します。
const ASSET_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
const getImageUrl = (path, imageRefreshKey)=>{
    if (!path) {
        return PLACEHOLDER_IMAGE_URL;
    }
    if (path.startsWith("http")) {
        return path;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const baseUrl = ASSET_BASE_URL.endsWith("/") ? ASSET_BASE_URL.slice(0, -1) : ASSET_BASE_URL;
    const normalizedPath = path.startsWith("/") ? path.substring(1) : path;
    // キャッシュバスターとして imageRefreshKey の値を付加
    const cacheBuster = `?t=${imageRefreshKey}`;
    // Laravelのストレージパス (例: https://laravel.test/storage/items/image.jpg) に対応させる
    return `${baseUrl}/storage/${normalizedPath}${cacheBuster}`;
};
const onImageError = (e, itemName)=>{
    const target = e.target;
    target.onerror = null;
    const placeholderText = itemName ? itemName.replace(/\s/g, "+") : "Error";
    // エラーハンドリング時にプレースホルダーに切り替える
    target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-ssr] (ecmascript)"); // 認証フックをインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/utils.ts [app-ssr] (ecmascript)"); // ユーティリティ関数をインポート
"use client";
;
;
;
;
;
;
;
;
// 環境変数からAPI URLを取得
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
function Home() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { user, token, isLoading: isAuthLoading, isLoggingOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])(); // 認証状態を取得
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageRefreshKey, setImageRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // =======================================================
    // Computed (useMemoで代替)
    // =======================================================
    // 現在のタブ ('all' または 'mylist')
    const currentTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return searchParams.get("tab") === "mylist" ? "mylist" : "all";
    }, [
        searchParams
    ]);
    // 現在の検索クエリ
    const currentSearchQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return searchParams.get("all_item_search") || "";
    }, [
        searchParams
    ]);
    // ページ全体のローディング状態
    const isPageLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // ログアウト処理中が最優先
        if (isLoggingOut) return true;
        // 商品データロード中
        if (loading) return true;
        // マイリスト表示時、かつ、まだ認証状態が確定していない
        if (currentTab === "mylist" && isAuthLoading) {
            return true;
        }
        return false;
    }, [
        isLoggingOut,
        loading,
        currentTab,
        isAuthLoading
    ]);
    // テンプレートのログインメッセージ表示に使用
    const isUserLoggedOutComputed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // 認証が解決済み(isAuthLoading=false)で、かつユーザーが存在しない場合に「ログアウト状態」と判断
        return !isAuthLoading && !user;
    }, [
        isAuthLoading,
        user
    ]);
    // =======================================================
    // データフェッチロジック
    // =======================================================
    const fetchItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (tab, search, currentToken)=>{
        const isAuthenticatedByHook = !!user;
        // ログアウト処理中はAPIコールを完全にブロック
        if (isLoggingOut) {
            console.log("[Skip Fetch] Logging out, skipping fetch.");
            setItems([]);
            setLoading(false);
            return;
        }
        // マイリストタブかつ未ログインの場合、フェッチをスキップし、UIでメッセージを表示
        if (tab === "mylist" && !isAuthenticatedByHook) {
            console.log("[Skip Fetch] Not logged in and accessing mylist.");
            setItems([]);
            setLoading(false);
            setImageRefreshKey((prev)=>prev + 1); // キーを更新
            return;
        }
        setLoading(true);
        console.log(`[Fetch] Auth Check: ${isAuthenticatedByHook}. Token Present: ${!!currentToken}. Fetching items: tab=${tab}, search=${search}`);
        const apiUrl = `${API_BASE_URL}/api/items`; // APIエンドポイントは/api/itemsを想定
        // --- リクエストヘッダーの設定 ---
        const headers = {
            "Content-Type": "application/json"
        };
        // ★★★ ログインしていてトークンがあれば、Authorizationヘッダーを設定 ★★★
        if (currentToken) {
            // Firebase ID TokenをBearerとして付与
            headers["Authorization"] = `Bearer ${currentToken}`;
            console.log("[Fetch] Including 'Authorization: Bearer' header with Firebase ID Token.");
        }
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(apiUrl, {
                params: {
                    tab: tab,
                    all_item_search: search
                },
                headers: headers
            });
            const responseData = response.data;
            // Nuxtの構造に合わせ、responseData.itemsからデータを取得する前提
            if (responseData && Array.isArray(responseData.items)) {
                setItems(responseData.items);
                setImageRefreshKey((prev)=>prev + 1);
            } else {
                console.warn("APIレスポンスの構造が不正です:", responseData);
                setItems([]);
            }
        } catch (e) {
            console.error("商品の取得中に予期せぬエラーが発生しました:", e);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(e) && e.response && e.response.status === 401 && tab === "mylist") {
                // マイリストの取得中に認証エラー(401)が発生した場合、強制ログアウト
                console.error("401 Unauthorized during mylist fetch. User token might be expired.");
            // ログアウト処理後、useAuthフックがリダイレクトを処理
            // logout();
            }
            setItems([]);
        } finally{
            setLoading(false);
        }
    }, [
        user,
        isLoggingOut,
        API_BASE_URL
    ]);
    // =======================================================
    // Effect / Watcher (useAuthフックの `user` と `token` が変更されたとき)
    // =======================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // 認証状態の解決を待ち、解決後、またはトークンが変更されたときにフェッチを実行
        if (!isAuthLoading) {
            console.log(`[useEffect] Auth Status Resolved/Changed. Token: ${!!token}. Re-fetching...`);
            fetchItems(currentTab, currentSearchQuery, token);
        }
    // currentTab, currentSearchQuery も依存配列に入れるべきだが、
    // useSearchParams() は Next.jsでは再レンダリングを自動でトリガーするため、
    // 認証状態の変化のみをここで監視し、クエリ変化は次のuseEffectで監視する
    }, [
        isAuthLoading,
        token,
        fetchItems,
        currentTab,
        currentSearchQuery
    ]);
    // =======================================================
    // Effect / Watcher (URLクエリの変更を監視)
    // =======================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // URLクエリ（タブや検索）が変更された場合、認証状態が確定していればフェッチを実行
        // isAuthLoadingのチェックは、初回ロード時の重複フェッチを防ぐため
        if (!isAuthLoading) {
            console.log(`[useEffect] URL Query Changed. Re-fetching items: tab=${currentTab}, search=${currentSearchQuery}`);
            fetchItems(currentTab, currentSearchQuery, token);
        }
    }, [
        currentTab,
        currentSearchQuery,
        isAuthLoading,
        token,
        fetchItems
    ]);
    // =======================================================
    // レンダリング
    // =======================================================
    // ログアウトボタンのラッパー
    const AuthButton = ()=>{
        const { isAuthenticated, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
        if (isAuthenticated) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: logout,
                disabled: isLoggingOut,
                className: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 disabled:bg-red-300",
                children: isLoggingOut ? "ログアウト中..." : "ログアウト"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 200,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: "/login",
            className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150",
            children: "ログイン"
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 210,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-f67c9bb42bba62e9" + " " + "main_contents",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-f67c9bb42bba62e9" + " " + "flex justify-end p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthButton, {
                    className: "jsx-f67c9bb42bba62e9"
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            isPageLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-f67c9bb42bba62e9" + " " + "flex justify-center items-center h-48",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f67c9bb42bba62e9" + " " + "animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-f67c9bb42bba62e9" + " " + "ml-4 text-lg text-gray-400",
                        children: isLoggingOut ? "ログアウト処理中..." : currentTab === "mylist" && isAuthLoading ? "認証状態を確認中..." : "商品を読み込み中..."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-f67c9bb42bba62e9" + " " + ((isPageLoading ? "hidden" : "") || ""),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f67c9bb42bba62e9" + " " + "main_select",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: {
                                    pathname: "/",
                                    query: {
                                        tab: "all",
                                        all_item_search: currentSearchQuery || undefined
                                    }
                                },
                                className: [
                                    "recs",
                                    {
                                        active: currentTab === "all"
                                    }
                                ].join(" ").replace("false", "").trim(),
                                children: "すべて"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: {
                                    pathname: "/",
                                    query: {
                                        tab: "mylist",
                                        all_item_search: currentSearchQuery || undefined
                                    }
                                },
                                className: [
                                    "mylists",
                                    {
                                        active: currentTab === "mylist"
                                    }
                                ].join(" ").replace("false", "").trim(),
                                children: "マイリスト"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search...",
                                defaultValue: currentSearchQuery,
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        const newQuery = e.currentTarget.value;
                                        // EnterでURLクエリを更新
                                        router.push(`/?tab=${currentTab}&all_item_search=${newQuery}`);
                                    }
                                },
                                className: "jsx-f67c9bb42bba62e9" + " " + "ml-auto px-3 py-1 border border-gray-300 rounded-md text-gray-900"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f67c9bb42bba62e9" + " " + "items_select",
                        children: items.length > 0 ? items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f67c9bb42bba62e9" + " " + "items_select_all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/item/${item.id}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-f67c9bb42bba62e9" + " " + "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getImageUrl"])(item.item_image, imageRefreshKey),
                                                    alt: item.name,
                                                    onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name),
                                                    className: "jsx-f67c9bb42bba62e9" + " " + "w-full aspect-square object-cover block rounded-lg shadow-md"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 21
                                                }, this),
                                                item.remain === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-f67c9bb42bba62e9" + " " + "sold-text",
                                                    children: "SOLD"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 295,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-f67c9bb42bba62e9" + " " + "item-info",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-f67c9bb42bba62e9" + " " + "item-name text-gray-100",
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-f67c9bb42bba62e9" + " " + "item-price font-bold text-red-400 text-lg mt-1",
                                                    children: [
                                                        "¥",
                                                        item.price ? item.price.toLocaleString() : "---"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 305,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 294,
                                    columnNumber: 17
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 293,
                                columnNumber: 15
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-f67c9bb42bba62e9" + " " + "text-center w-full py-10 text-gray-500",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-f67c9bb42bba62e9",
                                children: currentTab === "mylist" && isUserLoggedOutComputed ? "マイリストを見るにはログインしてください。" : "該当する商品が見つかりませんでした。"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 316,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 315,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "f67c9bb42bba62e9",
                children: ".main_contents.jsx-f67c9bb42bba62e9{max-width:1400px;margin:0 auto;padding:0 20px}.main_select.jsx-f67c9bb42bba62e9{border-bottom:3px solid #4b5563;justify-content:flex-start;align-items:center;gap:50px;height:80px;padding-left:100px;display:flex;position:relative}.recs.jsx-f67c9bb42bba62e9,.mylists.jsx-f67c9bb42bba62e9{color:#9ca3af;box-sizing:border-box;border-bottom:3px solid #0000;padding-bottom:15px;font-size:1.2rem;font-weight:700;text-decoration:none;transition:all .3s}.recs.jsx-f67c9bb42bba62e9:hover,.mylists.jsx-f67c9bb42bba62e9:hover{color:#d1d5db}.recs.active.jsx-f67c9bb42bba62e9,.mylists.active.jsx-f67c9bb42bba62e9{color:#ef4444;border-bottom:3px solid #ef4444}.items_select.jsx-f67c9bb42bba62e9{flex-wrap:wrap;justify-content:flex-start;gap:40px;padding:80px 0;display:flex}.items_select_all.jsx-f67c9bb42bba62e9{box-sizing:border-box;flex-direction:column;flex:0 0 calc(25% - 30px);display:flex;position:relative}@media (width<=1024px){.items_select_all.jsx-f67c9bb42bba62e9{flex:0 0 calc(33.33% - 26.67px)}}@media (width<=640px){.items_select_all.jsx-f67c9bb42bba62e9{flex:0 0 calc(50% - 20px)}.main_select.jsx-f67c9bb42bba62e9{justify-content:flex-start;gap:30px;padding-left:20px}}.items_select.jsx-f67c9bb42bba62e9 img.jsx-f67c9bb42bba62e9{box-shadow:0 4px 6px #0000004d}.item-info.jsx-f67c9bb42bba62e9{min-height:40px}.item-name.jsx-f67c9bb42bba62e9{color:#e5e7eb}.items_select_all.jsx-f67c9bb42bba62e9 .sold-text.jsx-f67c9bb42bba62e9{z-index:10;color:#f87171;pointer-events:none;background-color:#1f2937e6;border:4px solid #f87171;border-radius:8px;padding:8px 16px;font-size:1.5rem;font-weight:900;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)rotate(-10deg);box-shadow:0 0 10px #00000080}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7f0089b5._.js.map