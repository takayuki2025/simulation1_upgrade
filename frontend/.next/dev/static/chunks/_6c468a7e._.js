(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/useApi.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useApi",
    ()=>useApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// axios の型を正しくインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-client] (ecmascript)"); // useAuthフックのパスを調整してください
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Next.jsの環境変数を使用
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
function useApi() {
    _s();
    // useAuth からユーザー情報、ログアウト関数、ログアウト状態を取得
    const { user, logout, isLoggingOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    /**
   * 認証済みのAPIリクエストを実行する汎用関数 (Firebase ID Tokenを自動付与)
   * @param url リクエストURL（/api/ から始まる相対パスを推奨）
   * @param config Axiosリクエスト設定
   * @returns APIレスポンスデータ
   */ const authenticatedFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useApi.useCallback[authenticatedFetch]": async (url, config = {})=>{
            if (isLoggingOut) {
                throw new Error("Logging out, cannot perform API request.");
            }
            // ユーザーオブジェクトが存在しない場合は、認証セッションがないためログアウト処理へ
            if (!user) {
                console.error("[useApi] User object missing. Forcing logout.");
                // await logout(); // Home.tsx側で認証状態を見てスキップするため、ここではログアウトを強制しない場合もある
                throw new Error("User not authenticated.");
            }
            // --- 最新のFirebase ID Tokenを強制的に取得 (トークン失効対策) ---
            let idToken;
            try {
                // getIdToken(true): キャッシュを無視して、Firebaseから強制的に最新のトークンを取得
                idToken = await user.getIdToken(true);
            } catch (e) {
                console.error("[useApi] Failed to refresh/get ID Token. Forcing logout.", e);
                await logout(); // トークン取得失敗は致命的エラーのためログアウト
                throw new Error("Failed to retrieve fresh authentication token.");
            }
            // ----------------------------------------
            // --- APIパスの整形 ---
            // /api/ プレフィックスを保証し、重複するスラッシュを削除
            let apiPath = url.startsWith("/api/") ? url : `/api${url}`;
            apiPath = apiPath.replace(/\/\/+/g, "/");
            // ----------------------------------------
            // --- ヘッダーの構築 ---
            const baseHeaders = {
                "Content-Type": "application/json",
                Accept: "application/json"
            };
            // 1. デフォルトヘッダーと、configから渡されたヘッダーをマージ
            const mergedHeaders = {
                ...baseHeaders,
                ...config.headers
            };
            // 2. 最後に、認証トークンを確実に設定 (上書きされないように最後に配置)
            const finalHeaders = {
                ...mergedHeaders,
                Authorization: `Bearer ${idToken}`,
                "X-Firebase-Token": idToken
            };
            // 💡 修正点 2: FormDataを使用する場合の 'Content-Type' 削除ロジック
            // Content-Type: undefined のエントリを削除し、Axios/ブラウザに自動で multipart/form-data の設定をさせる
            if (finalHeaders["Content-Type"] === undefined) {
                // TypeScriptエラー回避のため 'as any' で一時的に型チェックを無効にする
                delete finalHeaders["Content-Type"];
            }
            const headers = finalHeaders;
            // --- Axiosリクエストの実行 ---
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                    method: config.method || "GET",
                    url: `${API_BASE_URL}${apiPath}`,
                    // config.data または config.body のいずれかをリクエストボディとして使用
                    data: config.data || config.body,
                    params: config.params,
                    headers: headers,
                    withCredentials: true
                });
                return response.data;
            } catch (error) {
                // --- エラーハンドリング ---
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
                    const status = error.response?.status;
                    if (status === 401) {
                        console.error("[useApi] 401 Unauthorized detected. Token likely expired on backend.");
                        // ログアウトせず、エラーをスローして呼び出し元でリカバリ（必要に応じてリロードやリトライ）させる
                        const customError = new Error(`API Request Failed with status 401`);
                        customError.status = 401;
                        customError.response = error.response;
                        throw customError;
                    }
                    // 401以外のエラーもカスタムエラーとしてスロー
                    const customError = new Error(`API Request Failed with status ${status || "Unknown"}`);
                    customError.status = status;
                    customError.response = error.response;
                    throw customError;
                }
                // ネットワークエラーなど
                console.error("[useApi] Network or other unexpected error:", error);
                throw error;
            }
        }
    }["useApi.useCallback[authenticatedFetch]"], [
        user,
        logout,
        isLoggingOut
    ] // 依存配列: user/logout/isLoggingOut が変わったら関数を再生成
    );
    // --- プロファイル更新専用ラッパー ---
    const updateProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useApi.useCallback[updateProfile]": async (data)=>{
            const response = await authenticatedFetch("/mypage/profile_update", {
                method: "PATCH",
                data: data
            });
            if (response && response.user) {
                return response.user;
            }
            throw new Error("Profile update failed: Invalid response structure.");
        }
    }["useApi.useCallback[updateProfile]"], [
        authenticatedFetch
    ] // 依存配列
    );
    // --- 画像アップロード専用ラッパー ---
    const uploadImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useApi.useCallback[uploadImage]": async (formData, url = "/upload2")=>{
            // FormDataを送信する際、Content-Type: undefined とすることで、
            // Axiosが自動的に適切な 'multipart/form-data' ヘッダーを生成する
            const response = await authenticatedFetch(url, {
                method: "POST",
                data: formData,
                headers: {
                    "Content-Type": undefined
                }
            });
            if (response && response.user) {
                return response.user;
            }
            throw new Error("Image upload failed: Invalid response structure.");
        }
    }["useApi.useCallback[uploadImage]"], [
        authenticatedFetch
    ] // 依存配列
    );
    return {
        authenticatedFetch,
        updateProfile,
        uploadImage
    };
}
_s(useApi, "wr7ZUEWX5x16jX4DZs9HUfru4eo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const PLACEHOLDER_IMAGE_URL = "https://placehold.co/300x300/e0e0e0/333?text=No+Image";
// Next.jsの環境変数からASSET_BASE_URLを取得 (今回はAPI_BASE_URLと同じとして扱う)
// 実際のNext.js環境では静的アセットはパブリックディレクトリに置くことが多いですが、
// Laravel側のStorageを参照する設定を再現します。
const ASSET_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
const getImageUrl = (path, imageRefreshKey)=>{
    if (!path) {
        return PLACEHOLDER_IMAGE_URL;
    }
    // 既にフルURLであればそのまま返す (このケースでは二重結合は起きないはず)
    if (path.startsWith("http")) {
        console.log("DEBUG_IMG: Path starts with http, returning:", path);
        return path;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // --- ここから結合処理 ---
    const baseUrl = ASSET_BASE_URL.endsWith("/") ? ASSET_BASE_URL.slice(0, -1) : ASSET_BASE_URL;
    let cleanPath = path;
    // 💡 修正強化: 二重の結合を招く可能性のある文字列を徹底的に削除
    // データベースの値は「storage/item_images/...」なので、まずこれを削る
    if (cleanPath.startsWith("storage/")) {
        cleanPath = cleanPath.substring("storage/".length);
    }
    // 念のため、URLのプロトコル部分が残っていないかチェックし、削除
    if (cleanPath.includes("https://") || cleanPath.includes("http://")) {
        console.error("DEBUG_IMG: Path still contains protocol! Data is corrupted:", cleanPath);
        // ここでクリーンアップ処理を行うべきですが、一旦エラーを表示
        // 緊急措置として、フルURL全体をファイルパスとして誤って連結するのを防ぎます
        // 🚨 暫定的な強制クリーンアップ (本来は不要)
        const parts = cleanPath.split("storage/").pop();
        cleanPath = parts || "";
    }
    const normalizedPath = cleanPath.startsWith("/") ? cleanPath.substring(1) : cleanPath;
    const cacheBuster = `?t=${imageRefreshKey}`;
    // 結合する要素をコンソールに出力して確認
    const finalUrl = `${baseUrl}/storage/${normalizedPath}${cacheBuster}`;
    console.log(`DEBUG_IMG: Base: ${baseUrl}, Final Path: /storage/${normalizedPath}, Result: ${finalUrl}`);
    return finalUrl;
};
const onImageError = (e, itemName)=>{
    const target = e.target;
    target.onerror = null;
    const placeholderText = itemName ? itemName.replace(/\s/g, "+") : "Error";
    // エラーハンドリング時にプレースホルダーに切り替える
    target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(main)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
// 💡 useAuth と useApi をインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useApi.tsx [app-client] (ecmascript)");
// 💡 getImageUrl, onImageError はプロジェクト内の実際のパスに修正してください
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
// 環境変数
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
// グローバルなaxiosは、認証が不要なリクエストでのみ使用されます。
// 認証が必要なリクエストは useApi の authenticatedFetch を使用します。
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
function Home() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // 1. 認証フックから必要な状態を取得
    const { user, isLoading: isAuthLoading, isLoggingOut, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // 2. APIフックから認証済みフェッチ関数を取得
    const { authenticatedFetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApi"])();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // APIフェッチ中のローディング
    // 画像URLのキャッシュ打破用キー (画像更新時の表示反映用)
    const [imageRefreshKey, setImageRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // =======================================================
    // Computed (useMemoで代替)
    // =======================================================
    // 現在のタブ状態 ('all' または 'mylist')
    const currentTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[currentTab]": ()=>{
            return searchParams.get("tab") === "mylist" ? "mylist" : "all";
        }
    }["Home.useMemo[currentTab]"], [
        searchParams
    ]);
    // 現在の検索クエリ
    const currentSearchQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[currentSearchQuery]": ()=>{
            return searchParams.get("all_item_search") || "";
        }
    }["Home.useMemo[currentSearchQuery]"], [
        searchParams
    ]);
    // ページ全体のローディング状態の判定
    const isPageLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[isPageLoading]": ()=>{
            // ログアウト処理中、認証状態の解決中、商品データロード中のいずれかが true ならロード中
            return isLoggingOut || isAuthLoading || loading;
        }
    }["Home.useMemo[isPageLoading]"], [
        isLoggingOut,
        isAuthLoading,
        loading
    ]);
    // テンプレートのログインメッセージ表示に使用
    const isUserLoggedOutComputed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[isUserLoggedOutComputed]": ()=>{
            // 認証が解決済み(isAuthLoading=false)で、かつユーザーが存在しない場合に「ログアウト状態」と判断
            return !isAuthLoading && !user;
        }
    }["Home.useMemo[isUserLoggedOutComputed]"], [
        isAuthLoading,
        user
    ]);
    // =======================================================
    // データフェッチロジック (useCallbackでラップ)
    // =======================================================
    /**
   * 商品データをAPIから取得する関数
   */ const fetchItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Home.useCallback[fetchItems]": async (tab, search)=>{
            // ログアウト処理中はフェッチをスキップ
            if (isLoggingOut) {
                console.log("[Skip Fetch] Logging out, skipping fetch.");
                setItems([]);
                setLoading(false);
                return;
            }
            // マイリストタブかつ未ログインの場合、フェッチをスキップし、空のリストを表示
            if (tab === "mylist" && !isAuthenticated) {
                console.log("[Skip Fetch] Not logged in and accessing mylist.");
                setItems([]);
                setLoading(false);
                setImageRefreshKey({
                    "Home.useCallback[fetchItems]": (prev)=>prev + 1
                }["Home.useCallback[fetchItems]"]);
                return;
            }
            setLoading(true);
            const apiUrl = `/api/items`;
            const params = {
                tab: tab,
                all_item_search: search
            };
            // 💡 認証クライアントとグローバルAxiosの選択ロジックを再構築
            const useAuthClient = tab === "mylist" || isAuthenticated;
            console.log(`[Fetch] Client type: ${useAuthClient ? "Authenticated" : "Unauthenticated"}. Fetching items: tab=${tab}, search=${search}`);
            try {
                let responseData;
                if (useAuthClient) {
                    // ★★★ マイリスト または ログイン済みで 'すべて' タブの場合 (認証済みリクエスト) ★★★
                    // useApiのauthenticatedFetchは、相対パスと設定を受け取る
                    responseData = await authenticatedFetch(apiUrl, {
                        method: "GET",
                        params: params
                    });
                } else {
                    // ★★★ 未ログインで 'すべて' タブの場合 (非認証リクエスト) ★★★
                    // グローバルaxiosを使用し、完全なURLを指定
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}${apiUrl}`, {
                        params: params
                    });
                    responseData = response.data;
                }
                if (responseData && Array.isArray(responseData.items)) {
                    setItems(responseData.items);
                    setImageRefreshKey({
                        "Home.useCallback[fetchItems]": (prev)=>prev + 1
                    }["Home.useCallback[fetchItems]"]); // 画像リフレッシュ
                } else {
                    console.warn("APIレスポンスの構造が不正です:", responseData);
                    setItems([]);
                }
            } catch (e) {
                // 認証エラーなどで authenticatedFetch がエラーをスローした場合もここでキャッチ
                console.error("商品の取得中に予期せぬエラーが発生しました:", e);
                setItems([]);
            } finally{
                setLoading(false);
            }
        }
    }["Home.useCallback[fetchItems]"], // 依存配列に authenticatedFetch を追加し、useAuth の状態変更によってトークンが更新される度に再実行できるようにする
    [
        isAuthenticated,
        isLoggingOut,
        authenticatedFetch
    ]);
    // =======================================================
    // Effect / Watcher (認証状態とURLクエリの統合監視)
    // =======================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            // 認証状態の解決を待つ
            if (isAuthLoading) {
                console.log("[Skip] Waiting for authentication to resolve.");
                setItems([]);
                return;
            }
            // 認証が解決した後、またはクエリ/認証状態が変わったときにフェッチを実行
            console.log(`[Fetch Triggered] Auth Resolved/Query Changed. Re-fetching items.`);
            fetchItems(currentTab, currentSearchQuery);
        }
    }["Home.useEffect"], [
        currentTab,
        currentSearchQuery,
        isAuthLoading,
        fetchItems
    ]);
    // =======================================================
    // レンダリング
    // =======================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-4e0e618d58474dad" + " " + "main_contents",
        children: [
            isPageLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-4e0e618d58474dad" + " " + "flex justify-center items-center h-48",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4e0e618d58474dad" + " " + "animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-4e0e618d58474dad" + " " + "ml-4 text-lg text-gray-400",
                        children: isLoggingOut ? "ログアウト処理中..." : isAuthLoading ? "認証状態を確認中..." : "商品を読み込み中..."
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/page.tsx",
                lineNumber: 198,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-4e0e618d58474dad" + " " + ((isPageLoading ? "hidden" : "") || ""),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4e0e618d58474dad" + " " + "main_select",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4e0e618d58474dad" + " " + "items_select",
                        children: items.length > 0 ? items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-4e0e618d58474dad" + " " + "items_select_all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/items/${item.id}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-4e0e618d58474dad" + " " + "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item.item_image, imageRefreshKey),
                                                    alt: item.name,
                                                    onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name),
                                                    className: "jsx-4e0e618d58474dad" + " " + "w-full aspect-square object-cover block rounded-lg shadow-md"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 21
                                                }, this),
                                                item.remain === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-4e0e618d58474dad" + " " + "sold-text",
                                                    children: "SOLD"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/page.tsx",
                                            lineNumber: 255,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-4e0e618d58474dad" + " " + "item-info",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-4e0e618d58474dad" + " " + "item-name text-gray-100",
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-4e0e618d58474dad" + " " + "item-price font-bold text-red-400 text-lg mt-1",
                                                    children: [
                                                        "¥",
                                                        item.price ? item.price.toLocaleString() : "---"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/page.tsx",
                                            lineNumber: 265,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/page.tsx",
                                    lineNumber: 254,
                                    columnNumber: 17
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 252,
                                columnNumber: 15
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-4e0e618d58474dad" + " " + "text-center w-full py-10 text-gray-500",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-4e0e618d58474dad",
                                children: currentTab === "mylist" && isUserLoggedOutComputed ? "マイリストを見るにはログインしてください。" : currentTab === "all" && isAuthLoading ? "認証状態を確認中..." // 認証ロード中は認証状態を確認中を表示
                                 : "該当する商品が見つかりませんでした。"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/page.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/page.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "4e0e618d58474dad",
                children: ".main_contents.jsx-4e0e618d58474dad{max-width:1400px;margin:0 auto;padding:0 20px}.main_select.jsx-4e0e618d58474dad{border-bottom:3px solid #4b5563;justify-content:flex-start;align-items:center;gap:50px;height:80px;padding-left:100px;display:flex;position:relative}.recs.jsx-4e0e618d58474dad,.mylists.jsx-4e0e618d58474dad{color:#9ca3af;box-sizing:border-box;border-bottom:3px solid #0000;padding-bottom:15px;font-size:1.2rem;font-weight:700;text-decoration:none;transition:all .3s}.recs.jsx-4e0e618d58474dad:hover,.mylists.jsx-4e0e618d58474dad:hover{color:#d1d5db}.recs.active.jsx-4e0e618d58474dad,.mylists.active.jsx-4e0e618d58474dad{color:#ef4444;border-bottom:3px solid #ef4444}.items_select.jsx-4e0e618d58474dad{flex-wrap:wrap;justify-content:flex-start;gap:40px;padding:80px 0;display:flex}.items_select_all.jsx-4e0e618d58474dad{box-sizing:border-box;flex-direction:column;flex:0 0 calc(25% - 30px);display:flex;position:relative}@media (width<=1024px){.items_select_all.jsx-4e0e618d58474dad{flex:0 0 calc(33.33% - 26.67px)}}@media (width<=640px){.items_select_all.jsx-4e0e618d58474dad{flex:0 0 calc(50% - 20px)}.main_select.jsx-4e0e618d58474dad{justify-content:flex-start;gap:30px;padding-left:20px}}.items_select.jsx-4e0e618d58474dad img.jsx-4e0e618d58474dad{box-shadow:0 4px 6px #0000004d}.item-info.jsx-4e0e618d58474dad{min-height:40px}.item-name.jsx-4e0e618d58474dad{color:#000}.items_select_all.jsx-4e0e618d58474dad .sold-text.jsx-4e0e618d58474dad{z-index:10;color:#f87171;pointer-events:none;background-color:#1f2937e6;border:4px solid #f87171;border-radius:8px;padding:8px 16px;font-size:1.5rem;font-weight:900;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)rotate(-10deg);box-shadow:0 0 10px #00000080}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/page.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
_s(Home, "nw9HICtt77+F7nOy096ABJHV4cQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApi"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)");
var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {
        'default': e
    };
}
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
/*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/ function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var isProd = typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && ("TURBOPACK compile-time value", "development") === "production";
var isString = function(o) {
    return Object.prototype.toString.call(o) === "[object String]";
};
var StyleSheet = /*#__PURE__*/ function() {
    function StyleSheet(param) {
        var ref = param === void 0 ? {} : param, _name = ref.name, name = _name === void 0 ? "stylesheet" : _name, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? isProd : _optimizeForSpeed;
        invariant$1(isString(name), "`name` must be a string");
        this._name = name;
        this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
        invariant$1(typeof optimizeForSpeed === "boolean", "`optimizeForSpeed` must be a boolean");
        this._optimizeForSpeed = optimizeForSpeed;
        this._serverSheet = undefined;
        this._tags = [];
        this._injected = false;
        this._rulesCount = 0;
        var node = typeof window !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
        this._nonce = node ? node.getAttribute("content") : null;
    }
    var _proto = StyleSheet.prototype;
    _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
        invariant$1(typeof bool === "boolean", "`setOptimizeForSpeed` accepts a boolean");
        invariant$1(this._rulesCount === 0, "optimizeForSpeed cannot be when rules have already been inserted");
        this.flush();
        this._optimizeForSpeed = bool;
        this.inject();
    };
    _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
        return this._optimizeForSpeed;
    };
    _proto.inject = function inject() {
        var _this = this;
        invariant$1(!this._injected, "sheet already injected");
        this._injected = true;
        if (typeof window !== "undefined" && this._optimizeForSpeed) {
            this._tags[0] = this.makeStyleTag(this._name);
            this._optimizeForSpeed = "insertRule" in this.getSheet();
            if (!this._optimizeForSpeed) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.");
                }
                this.flush();
                this._injected = true;
            }
            return;
        }
        this._serverSheet = {
            cssRules: [],
            insertRule: function(rule, index) {
                if (typeof index === "number") {
                    _this._serverSheet.cssRules[index] = {
                        cssText: rule
                    };
                } else {
                    _this._serverSheet.cssRules.push({
                        cssText: rule
                    });
                }
                return index;
            },
            deleteRule: function(index) {
                _this._serverSheet.cssRules[index] = null;
            }
        };
    };
    _proto.getSheetForTag = function getSheetForTag(tag) {
        if (tag.sheet) {
            return tag.sheet;
        }
        // this weirdness brought to you by firefox
        for(var i = 0; i < document.styleSheets.length; i++){
            if (document.styleSheets[i].ownerNode === tag) {
                return document.styleSheets[i];
            }
        }
    };
    _proto.getSheet = function getSheet() {
        return this.getSheetForTag(this._tags[this._tags.length - 1]);
    };
    _proto.insertRule = function insertRule(rule, index) {
        invariant$1(isString(rule), "`insertRule` accepts only strings");
        if (typeof window === "undefined") {
            if (typeof index !== "number") {
                index = this._serverSheet.cssRules.length;
            }
            this._serverSheet.insertRule(rule, index);
            return this._rulesCount++;
        }
        if (this._optimizeForSpeed) {
            var sheet = this.getSheet();
            if (typeof index !== "number") {
                index = sheet.cssRules.length;
            }
            // this weirdness for perf, and chrome's weird bug
            // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                return -1;
            }
        } else {
            var insertionPoint = this._tags[index];
            this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
        }
        return this._rulesCount++;
    };
    _proto.replaceRule = function replaceRule(index, rule) {
        if (this._optimizeForSpeed || typeof window === "undefined") {
            var sheet = typeof window !== "undefined" ? this.getSheet() : this._serverSheet;
            if (!rule.trim()) {
                rule = this._deletedRulePlaceholder;
            }
            if (!sheet.cssRules[index]) {
                // @TBD Should we throw an error?
                return index;
            }
            sheet.deleteRule(index);
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                // In order to preserve the indices we insert a deleteRulePlaceholder
                sheet.insertRule(this._deletedRulePlaceholder, index);
            }
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "old rule at index `" + index + "` not found");
            tag.textContent = rule;
        }
        return index;
    };
    _proto.deleteRule = function deleteRule(index) {
        if (typeof window === "undefined") {
            this._serverSheet.deleteRule(index);
            return;
        }
        if (this._optimizeForSpeed) {
            this.replaceRule(index, "");
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "rule at index `" + index + "` not found");
            tag.parentNode.removeChild(tag);
            this._tags[index] = null;
        }
    };
    _proto.flush = function flush() {
        this._injected = false;
        this._rulesCount = 0;
        if (typeof window !== "undefined") {
            this._tags.forEach(function(tag) {
                return tag && tag.parentNode.removeChild(tag);
            });
            this._tags = [];
        } else {
            // simpler on server
            this._serverSheet.cssRules = [];
        }
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        if (typeof window === "undefined") {
            return this._serverSheet.cssRules;
        }
        return this._tags.reduce(function(rules, tag) {
            if (tag) {
                rules = rules.concat(Array.prototype.map.call(_this.getSheetForTag(tag).cssRules, function(rule) {
                    return rule.cssText === _this._deletedRulePlaceholder ? null : rule;
                }));
            } else {
                rules.push(null);
            }
            return rules;
        }, []);
    };
    _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
        if (cssString) {
            invariant$1(isString(cssString), "makeStyleTag accepts only strings as second parameter");
        }
        var tag = document.createElement("style");
        if (this._nonce) tag.setAttribute("nonce", this._nonce);
        tag.type = "text/css";
        tag.setAttribute("data-" + name, "");
        if (cssString) {
            tag.appendChild(document.createTextNode(cssString));
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        if (relativeToTag) {
            head.insertBefore(tag, relativeToTag);
        } else {
            head.appendChild(tag);
        }
        return tag;
    };
    _createClass(StyleSheet, [
        {
            key: "length",
            get: function get() {
                return this._rulesCount;
            }
        }
    ]);
    return StyleSheet;
}();
function invariant$1(condition, message) {
    if (!condition) {
        throw new Error("StyleSheet: " + message + ".");
    }
}
function hash(str) {
    var _$hash = 5381, i = str.length;
    while(i){
        _$hash = _$hash * 33 ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */ return _$hash >>> 0;
}
var stringHash = hash;
var sanitize = function(rule) {
    return rule.replace(/\/style/gi, "\\/style");
};
var cache = {};
/**
 * computeId
 *
 * Compute and memoize a jsx id from a basedId and optionally props.
 */ function computeId(baseId, props) {
    if (!props) {
        return "jsx-" + baseId;
    }
    var propsToString = String(props);
    var key = baseId + propsToString;
    if (!cache[key]) {
        cache[key] = "jsx-" + stringHash(baseId + "-" + propsToString);
    }
    return cache[key];
}
/**
 * computeSelector
 *
 * Compute and memoize dynamic selectors.
 */ function computeSelector(id, css) {
    var selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
    // Sanitize SSR-ed CSS.
    // Client side code doesn't need to be sanitized since we use
    // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
    if (typeof window === "undefined") {
        css = sanitize(css);
    }
    var idcss = id + css;
    if (!cache[idcss]) {
        cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
    }
    return cache[idcss];
}
function mapRulesToStyle(cssRules, options) {
    if (options === void 0) options = {};
    return cssRules.map(function(args) {
        var id = args[0];
        var css = args[1];
        return /*#__PURE__*/ React__default["default"].createElement("style", {
            id: "__" + id,
            // Avoid warnings upon render with a key
            key: "__" + id,
            nonce: options.nonce ? options.nonce : undefined,
            dangerouslySetInnerHTML: {
                __html: css
            }
        });
    });
}
var StyleSheetRegistry = /*#__PURE__*/ function() {
    function StyleSheetRegistry(param) {
        var ref = param === void 0 ? {} : param, _styleSheet = ref.styleSheet, styleSheet = _styleSheet === void 0 ? null : _styleSheet, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? false : _optimizeForSpeed;
        this._sheet = styleSheet || new StyleSheet({
            name: "styled-jsx",
            optimizeForSpeed: optimizeForSpeed
        });
        this._sheet.inject();
        if (styleSheet && typeof optimizeForSpeed === "boolean") {
            this._sheet.setOptimizeForSpeed(optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    }
    var _proto = StyleSheetRegistry.prototype;
    _proto.add = function add(props) {
        var _this = this;
        if (undefined === this._optimizeForSpeed) {
            this._optimizeForSpeed = Array.isArray(props.children);
            this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        if (typeof window !== "undefined" && !this._fromServer) {
            this._fromServer = this.selectFromServer();
            this._instancesCounts = Object.keys(this._fromServer).reduce(function(acc, tagName) {
                acc[tagName] = 0;
                return acc;
            }, {});
        }
        var ref = this.getIdAndRules(props), styleId = ref.styleId, rules = ref.rules;
        // Deduping: just increase the instances count.
        if (styleId in this._instancesCounts) {
            this._instancesCounts[styleId] += 1;
            return;
        }
        var indices = rules.map(function(rule) {
            return _this._sheet.insertRule(rule);
        }) // Filter out invalid rules
        .filter(function(index) {
            return index !== -1;
        });
        this._indices[styleId] = indices;
        this._instancesCounts[styleId] = 1;
    };
    _proto.remove = function remove(props) {
        var _this = this;
        var styleId = this.getIdAndRules(props).styleId;
        invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
        this._instancesCounts[styleId] -= 1;
        if (this._instancesCounts[styleId] < 1) {
            var tagFromServer = this._fromServer && this._fromServer[styleId];
            if (tagFromServer) {
                tagFromServer.parentNode.removeChild(tagFromServer);
                delete this._fromServer[styleId];
            } else {
                this._indices[styleId].forEach(function(index) {
                    return _this._sheet.deleteRule(index);
                });
                delete this._indices[styleId];
            }
            delete this._instancesCounts[styleId];
        }
    };
    _proto.update = function update(props, nextProps) {
        this.add(nextProps);
        this.remove(props);
    };
    _proto.flush = function flush() {
        this._sheet.flush();
        this._sheet.inject();
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function(styleId) {
            return [
                styleId,
                _this._fromServer[styleId]
            ];
        }) : [];
        var cssRules = this._sheet.cssRules();
        return fromServer.concat(Object.keys(this._indices).map(function(styleId) {
            return [
                styleId,
                _this._indices[styleId].map(function(index) {
                    return cssRules[index].cssText;
                }).join(_this._optimizeForSpeed ? "" : "\n")
            ];
        }) // filter out empty rules
        .filter(function(rule) {
            return Boolean(rule[1]);
        }));
    };
    _proto.styles = function styles(options) {
        return mapRulesToStyle(this.cssRules(), options);
    };
    _proto.getIdAndRules = function getIdAndRules(props) {
        var css = props.children, dynamic = props.dynamic, id = props.id;
        if (dynamic) {
            var styleId = computeId(id, dynamic);
            return {
                styleId: styleId,
                rules: Array.isArray(css) ? css.map(function(rule) {
                    return computeSelector(styleId, rule);
                }) : [
                    computeSelector(styleId, css)
                ]
            };
        }
        return {
            styleId: computeId(id),
            rules: Array.isArray(css) ? css : [
                css
            ]
        };
    };
    /**
   * selectFromServer
   *
   * Collects style tags from the document with id __jsx-XXX
   */ _proto.selectFromServer = function selectFromServer() {
        var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
        return elements.reduce(function(acc, element) {
            var id = element.id.slice(2);
            acc[id] = element;
            return acc;
        }, {});
    };
    return StyleSheetRegistry;
}();
function invariant(condition, message) {
    if (!condition) {
        throw new Error("StyleSheetRegistry: " + message + ".");
    }
}
var StyleSheetContext = /*#__PURE__*/ React.createContext(null);
StyleSheetContext.displayName = "StyleSheetContext";
function createStyleRegistry() {
    return new StyleSheetRegistry();
}
function StyleRegistry(param) {
    var configuredRegistry = param.registry, children = param.children;
    var rootRegistry = React.useContext(StyleSheetContext);
    var ref = React.useState({
        "StyleRegistry.useState[ref]": function() {
            return rootRegistry || configuredRegistry || createStyleRegistry();
        }
    }["StyleRegistry.useState[ref]"]), registry = ref[0];
    return /*#__PURE__*/ React__default["default"].createElement(StyleSheetContext.Provider, {
        value: registry
    }, children);
}
function useStyleRegistry() {
    return React.useContext(StyleSheetContext);
}
// Opt-into the new `useInsertionEffect` API in React 18, fallback to `useLayoutEffect`.
// https://github.com/reactwg/react-18/discussions/110
var useInsertionEffect = React__default["default"].useInsertionEffect || React__default["default"].useLayoutEffect;
var defaultRegistry = typeof window !== "undefined" ? createStyleRegistry() : undefined;
function JSXStyle(props) {
    var registry = defaultRegistry ? defaultRegistry : useStyleRegistry();
    // If `registry` does not exist, we do nothing here.
    if (!registry) {
        return null;
    }
    if (typeof window === "undefined") {
        registry.add(props);
        return null;
    }
    useInsertionEffect({
        "JSXStyle.useInsertionEffect": function() {
            registry.add(props);
            return ({
                "JSXStyle.useInsertionEffect": function() {
                    registry.remove(props);
                }
            })["JSXStyle.useInsertionEffect"];
        // props.children can be string[], will be striped since id is identical
        }
    }["JSXStyle.useInsertionEffect"], [
        props.id,
        String(props.dynamic)
    ]);
    return null;
}
JSXStyle.dynamic = function(info) {
    return info.map(function(tagInfo) {
        var baseId = tagInfo[0];
        var props = tagInfo[1];
        return computeId(baseId, props);
    }).join(" ");
};
exports.StyleRegistry = StyleRegistry;
exports.createStyleRegistry = createStyleRegistry;
exports.style = JSXStyle;
exports.useStyleRegistry = useStyleRegistry;
}),
"[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)").style;
}),
]);

//# sourceMappingURL=_6c468a7e._.js.map