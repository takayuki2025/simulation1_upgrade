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
"[project]/app/(main)/items/[items_id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ItemDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
// 💡 認証フックとカスタムAPIフックをインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useApi.tsx [app-client] (ecmascript)");
// 💡 外部のutils/utils.tsから画像ヘルパーをインポート
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
// =======================================================
// グローバル変数
// =======================================================
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true; // グローバルaxios設定
function ItemDetailPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    // 💡 useAuth から必要な状態を取得
    const { user, isAuthenticated, isLoading: isAuthLoading, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // 💡 useApi から認証済みフェッチ関数を取得
    const { authenticatedFetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApi"])();
    console.log("RENDERING: ItemDetailPage starting to render.");
    // 💡 データフェッチが一度試行されたことを記録するRef (無限ループ防止)
    const hasFetchedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ----------------------------------------------------------------
    // Computed Properties: itemId
    // ----------------------------------------------------------------
    const itemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[itemId]": ()=>{
            // URLパラメータからIDを解析
            const idParam = params.items_id;
            const idString = Array.isArray(idParam) ? idParam[0] : idParam;
            if (!idString || typeof idString !== "string" || idString.trim() === "") {
                return null; // ID未指定
            }
            const parsedId = parseInt(idString);
            if (isNaN(parsedId) || parsedId <= 0) {
                return -1; // 無効なID形式
            }
            return parsedId;
        }
    }["ItemDetailPage.useMemo[itemId]"], [
        params.items_id
    ]);
    // userオブジェクトにuser_imageなどが含まれていることを期待し、型アサーション
    const extendedUser = user;
    const [item, setItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFavorited, setIsFavorited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [favoritesCount, setFavoritesCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // 認証ロード完了後にフェッチを開始するため初期値true
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [itemErrors, setItemErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentErrors, setCommentErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // ----------------------------------------------------------------
    // Computed Properties (useMemo)
    // ----------------------------------------------------------------
    // 商品の所有者であるか
    const isOwner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[isOwner]": ()=>{
            return isAuthenticated && extendedUser?.id === item?.user_id;
        }
    }["ItemDetailPage.useMemo[isOwner]"], [
        isAuthenticated,
        extendedUser,
        item
    ]);
    // お気に入り/購入操作が可能か (非所有者かつログイン済み)
    const canInteract = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[canInteract]": ()=>{
            return isAuthenticated && extendedUser?.id !== item?.user_id;
        }
    }["ItemDetailPage.useMemo[canInteract]"], [
        isAuthenticated,
        extendedUser,
        item
    ]);
    // 売り切れ状態か
    const isSoldOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[isSoldOut]": ()=>{
            return (item?.remain ?? 0) < 1;
        }
    }["ItemDetailPage.useMemo[isSoldOut]"], [
        item
    ]);
    // カテゴリ文字列を配列にパース
    const itemCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[itemCategories]": ()=>{
            if (!item?.category) return [];
            try {
                const categories = JSON.parse(item.category);
                return Array.isArray(categories) ? categories : [
                    item.category
                ];
            } catch (e) {
                return [
                    item.category
                ];
            }
        }
    }["ItemDetailPage.useMemo[itemCategories]"], [
        item
    ]);
    // 商品画像のフルURL
    const fullItemImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[fullItemImageUrl]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item?.item_image || null, 0);
        }
    }["ItemDetailPage.useMemo[fullItemImageUrl]"], [
        item?.item_image
    ]);
    // ----------------------------------------------------------------
    // データフェッチロジック (useCallbackでラップ)
    // ----------------------------------------------------------------
    /**
   * 商品詳細データをAPIから取得する関数
   * 💡 認証状態によってクライアントを使い分ける
   */ const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ItemDetailPage.useCallback[fetchData]": async (id)=>{
            setIsLoading(true);
            setError("");
            setItemErrors([]);
            const endpoint = `/api/items/${id}`;
            const url = `${API_BASE_URL}${endpoint}`;
            try {
                let data;
                // ログイン済みの場合、認証済みクライアントを使用し、お気に入り状態も取得する
                if (isAuthenticated) {
                    // 💡 認証済みGETリクエストは authenticatedFetch を使用
                    data = await authenticatedFetch(endpoint, {
                        method: "GET"
                    });
                } else {
                    // 未ログインの場合、グローバル axios を使用
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(url);
                    data = response.data;
                }
                if (data.item) {
                    setItem(data.item);
                    setIsFavorited(data.is_favorited);
                    setFavoritesCount(data.favorites_count);
                    setComments(data.comments);
                } else if (data.errors && data.errors.length > 0) {
                    setItemErrors(data.errors);
                    setError(data.errors[0]);
                } else {
                    setError("商品情報が見つかりませんでした。");
                }
            } catch (e) {
                console.error("データの取得中に予期せぬエラーが発生しました。", e);
                // エラーレスポンスがあればメッセージを取得
                const errMsg = e.response?.data?.message || "データの取得中にエラーが発生しました。";
                setError(errMsg);
            } finally{
                setIsLoading(false);
            }
        }
    }["ItemDetailPage.useCallback[fetchData]"], [
        isAuthenticated,
        authenticatedFetch
    ] // 認証状態と authenticatedFetch に依存
    );
    // ----------------------------------------------------------------
    // Effect / Watcher (無限ループ対策済みの最終ロジック)
    // ----------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ItemDetailPage.useEffect": ()=>{
            // 1. データ取得が一度試行されたら、いかなる理由でもすぐに停止
            if (hasFetchedRef.current) {
                // itemがロード済みならローディング表示は終了
                if (item) {
                    setIsLoading(false);
                }
                return;
            }
            // 2. 認証ロード中であれば待機
            if (isAuthLoading) {
                return;
            }
            // 3. IDが完全に無効な場合 (null または -1) は、エラーを設定して処理を終了
            if (itemId === null || itemId === -1) {
                let errorMessage = "商品IDが指定されていません。";
                if (itemId === -1) {
                    errorMessage = "無効な商品IDの形式です。";
                }
                setError(errorMessage);
                setIsLoading(false);
                hasFetchedRef.current = true; // エラー処理実行済みとしてフラグを立てる
                return;
            }
            // 4. 全ての条件をクリアした場合、フェッチをトリガー
            hasFetchedRef.current = true; // 実行フラグを立てる
            fetchData(itemId);
        }
    }["ItemDetailPage.useEffect"], [
        itemId,
        isAuthLoading,
        fetchData,
        item
    ]);
    // ----------------------------------------------------------------
    // 機能ロジック
    // ----------------------------------------------------------------
    /**
   * お気に入り追加/削除処理
   */ const submitFavorite = async ()=>{
        if (!item) return;
        // 未認証の場合はログインページへ誘導
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        const isCurrentlyFavorited = isFavorited;
        // 💡 UX向上のため、先にローカルで状態を更新
        setIsFavorited(!isCurrentlyFavorited);
        setFavoritesCount((prev)=>isCurrentlyFavorited ? prev - 1 : prev + 1);
        try {
            const endpoint = isCurrentlyFavorited ? `/api/favorite/${item.id}` // DELETE用エンドポイント
             : `/api/favorite`; // POST用エンドポイント
            if (isCurrentlyFavorited) {
                // 💡 認証済みDELETEリクエスト
                await authenticatedFetch(endpoint, {
                    method: "DELETE"
                });
            } else {
                // 💡 認証済みPOSTリクエスト
                await authenticatedFetch(endpoint, {
                    method: "POST",
                    data: {
                        item_id: item.id
                    }
                });
            }
        } catch (e) {
            console.error("お気に入り操作中にエラーが発生しました:", e);
            // 💡 エラーが発生した場合、ローカルの状態を元に戻す (ロールバック)
            setIsFavorited((prev)=>!prev);
            setFavoritesCount((prev)=>isCurrentlyFavorited ? prev + 1 : prev - 1);
            const errMsg = e.response?.data?.message || "お気に入り操作中に予期せぬエラーが発生しました。";
            setItemErrors([
                errMsg
            ]);
        }
    };
    /**
   * コメント投稿処理
   */ const submitComment = async ()=>{
        setCommentErrors([]);
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (!item) {
            setCommentErrors([
                "商品データが読み込まれていません。"
            ]);
            return;
        }
        if (newComment.trim() === "") {
            setCommentErrors([
                "コメントを入力してください"
            ]);
            return;
        }
        if (!extendedUser || !extendedUser.id) {
            setCommentErrors([
                "ユーザー情報が取得できませんでした。再度ログインしてください。"
            ]);
            await logout(); // ユーザー情報がない場合は強制ログアウト
            return;
        }
        try {
            // 💡 認証済みPOSTリクエスト
            const response = await authenticatedFetch("/api/comment", {
                method: "POST",
                data: {
                    item_id: item.id,
                    comment: newComment
                }
            });
            if (response.comment) {
                // 投稿成功後、ローカルのコメントリストを更新
                const newCommentData = {
                    id: response.comment.id,
                    comment: response.comment.comment,
                    created_at: response.comment.created_at,
                    user: {
                        id: extendedUser.id,
                        name: extendedUser.name,
                        user_image: extendedUser.user_image
                    }
                };
                setComments((prev)=>[
                        ...prev,
                        newCommentData
                    ]);
                setNewComment(""); // 入力フィールドをクリア
            } else {
                throw new Error("コメントの投稿に成功しましたが、データ更新に失敗しました。");
            }
        } catch (e) {
            console.error("コメント投稿中にエラーが発生しました:", e);
            const errMsg = e.response?.data?.message || "コメント投稿中に予期せぬエラーが発生しました。";
            setCommentErrors([
                errMsg
            ]);
        }
    };
    /**
   * 購入/マイページへの遷移
   */ const navigateToPurchase = ()=>{
        if (isOwner) {
            router.push("/mypage");
        } else if (isAuthenticated && item) {
            router.push(`/purchase/${item.id}`);
        } else {
            // 未認証ならログインページへ
            router.push("/login");
        }
    };
    // ----------------------------------------------------------------
    // レンダリング
    // ----------------------------------------------------------------
    if (isAuthLoading || isLoading) {
        // ローディング/認証確認中の表示
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-48 my-20 w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                    lineNumber: 381,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-4 text-xl font-semibold text-gray-600",
                    children: isAuthLoading ? "認証状態を確認中..." : "商品情報を読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                    lineNumber: 382,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
            lineNumber: 380,
            columnNumber: 7
        }, this);
    }
    if (error || itemErrors && itemErrors.length > 0) {
        // エラーメッセージの表示
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md my-10 w-full max-w-5xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-bold",
                    children: "データの取得エラー"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                    lineNumber: 393,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                    lineNumber: 394,
                    columnNumber: 9
                }, this),
                itemErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: err
                    }, index, false, {
                        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                        lineNumber: 396,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
            lineNumber: 392,
            columnNumber: 7
        }, this);
    }
    if (!item) {
        // 商品が見つからない場合の表示
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-20 w-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xl font-semibold text-gray-600",
                children: "商品が見つかりませんでした。"
            }, void 0, false, {
                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                lineNumber: 406,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
            lineNumber: 405,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-c7603b6afd9f8724" + " " + "item_detail_wrapper bg-gray-100 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-c7603b6afd9f8724" + " " + "item_detail_contents",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-c7603b6afd9f8724" + " " + "flex flex-wrap lg:flex-nowrap w-full max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-c7603b6afd9f8724" + " " + "item_detail_image p-4 lg:p-8 w-full lg:w-1/2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: fullItemImageUrl,
                                alt: "商品写真",
                                onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name),
                                className: "jsx-c7603b6afd9f8724" + " " + "item_detail_image1 w-full h-auto object-cover rounded-lg shadow-md"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                lineNumber: 419,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                            lineNumber: 418,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-c7603b6afd9f8724" + " " + "information p-4 lg:p-8 w-full lg:w-1/2 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_name",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-c7603b6afd9f8724" + " " + "text-3xl font-extrabold text-gray-800",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                        lineNumber: 430,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 429,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_brand text-sm text-gray-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "item_detail_brand_1 font-semibold",
                                            children: "ブランド名"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 436,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "item_detail_brand_2",
                                            children: item.brand || "未登録"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 437,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 435,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_price",
                                    children: isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-c7603b6afd9f8724" + " " + "text-3xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded inline-block",
                                        children: "SOLD OUT"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                        lineNumber: 442,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-c7603b6afd9f8724" + " " + "text-3xl font-bold text-gray-900",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-c7603b6afd9f8724" + " " + "price_after text-xl font-normal",
                                                children: "¥"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 447,
                                                columnNumber: 19
                                            }, this),
                                            item.price ? item.price.toLocaleString() : "---",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-c7603b6afd9f8724" + " " + "price_after text-lg font-normal",
                                                children: [
                                                    " ",
                                                    "(税込)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 449,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                        lineNumber: 446,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 440,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "space-y-6 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "flex items-center space-x-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-c7603b6afd9f8724" + " " + "flex items-center",
                                                    children: [
                                                        canInteract ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: submitFavorite,
                                                            type: "button",
                                                            className: "jsx-c7603b6afd9f8724" + " " + "text-3xl transition-transform transform hover:scale-110 active:scale-90 p-0 m-0 leading-none focus:outline-none",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-c7603b6afd9f8724" + " " + `heart_icon text-4xl ${isFavorited ? "text-red-500" : ""}`,
                                                                children: isFavorited ? "❤️" : "🤍"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "text-3xl text-gray-400 leading-none",
                                                            children: "🤍"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "text-xl ml-2 font-semibold text-gray-600",
                                                            children: favoritesCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 481,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-c7603b6afd9f8724" + " " + "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            width: "32",
                                                            height: "32",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.8",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            className: "jsx-c7603b6afd9f8724" + " " + "text-gray-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M21 11.5a8.38 8.38 0 0 1-.6 3.2 12.16 12.16 0 0 1-1.9 2.5c-.8 1.1-1.7 2-2.8 2.5a5.77 5.77 0 0 1-3.6 0c-1.1-.5-2.1-1.4-2.8-2.5a12.16 12.16 0 0 1-1.9-2.5 8.38 8.38 0 0 1-.6-3.2",
                                                                    className: "jsx-c7603b6afd9f8724"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                    lineNumber: 500,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z",
                                                                    className: "jsx-c7603b6afd9f8724"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                    lineNumber: 501,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M8 10h8",
                                                                    className: "jsx-c7603b6afd9f8724"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                    lineNumber: 502,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 488,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "text-xl ml-2 font-semibold text-gray-600",
                                                            children: comments.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 487,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 459,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "item_detail_form pt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: navigateToPurchase,
                                                disabled: isSoldOut && !isOwner,
                                                className: "jsx-c7603b6afd9f8724" + " " + `w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${!isSoldOut ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`,
                                                children: isOwner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-c7603b6afd9f8724",
                                                    children: "マイページへ移動する"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 21
                                                }, this) : isAuthenticated && !isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-c7603b6afd9f8724",
                                                    children: "購入手続きへ"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 21
                                                }, this) : isAuthenticated && isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-c7603b6afd9f8724",
                                                    children: "SOLD OUT"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 527,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-c7603b6afd9f8724",
                                                    children: "ログインして購入"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 513,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 512,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 457,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_explain mt-8 border-t border-gray-200 pt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "text-xl font-bold text-gray-800 mb-2",
                                            children: "商品説明"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 537,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "explain_word text-gray-700 whitespace-pre-wrap",
                                            children: item.explain
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 538,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 536,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_category mt-8 border-t border-gray-200 pt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-c7603b6afd9f8724",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-c7603b6afd9f8724" + " " + "text-xl font-bold text-gray-800 mb-2",
                                                children: "商品情報"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 546,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-c7603b6afd9f8724" + " " + "flex flex-col space-y-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-c7603b6afd9f8724" + " " + "flex items-center space-x-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "w-24 text-gray-600 font-medium",
                                                            children: "カテゴリー"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 551,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "flex flex-wrap gap-2",
                                                            children: itemCategories.length > 0 ? itemCategories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-c7603b6afd9f8724" + " " + "px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full",
                                                                    children: category
                                                                }, index, false, {
                                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                    lineNumber: 555,
                                                                    columnNumber: 27
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-c7603b6afd9f8724" + " " + "text-gray-500",
                                                                children: "カテゴリーは登録されていません。"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                lineNumber: 563,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 552,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 549,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                        lineNumber: 545,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 544,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_condition mt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-c7603b6afd9f8724" + " " + "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-c7603b6afd9f8724" + " " + "w-24 text-gray-600 font-medium",
                                                children: "商品の状態"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 574,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-c7603b6afd9f8724" + " " + "text-gray-700 font-semibold",
                                                children: item.condition || "未登録"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 575,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                        lineNumber: 573,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 572,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_comment_history mt-10 border-t border-gray-200 pt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "comment_count_flex flex justify-between items-center mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "jsx-c7603b6afd9f8724" + " " + "text-xl font-bold text-gray-800",
                                                    children: "コメント"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 584,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-c7603b6afd9f8724" + " " + "comments_count text-gray-500",
                                                    children: [
                                                        "(",
                                                        comments.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 585,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 15
                                        }, this),
                                        comments && comments.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "max-h-80 overflow-y-auto pr-2 pt-2 space-y-4",
                                            children: comments.map((comment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-c7603b6afd9f8724" + " " + "comment border-b border-gray-100 pb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "comment_name_image flex items-center space-x-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(comment.user.user_image || null, 0),
                                                                    alt: "プロフィール画像",
                                                                    onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, comment.user.name),
                                                                    className: "jsx-c7603b6afd9f8724" + " " + "user_image_css w-10 h-10 rounded-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                    lineNumber: 598,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-c7603b6afd9f8724" + " " + "comment_name font-semibold text-gray-800",
                                                                    children: comment.user.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                                    lineNumber: 604,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 597,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "comment-text ml-10 mt-1 text-gray-700 whitespace-pre-wrap",
                                                            children: comment.comment
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 608,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            className: "jsx-c7603b6afd9f8724" + " " + "text-xs ml-10 text-gray-500 block mt-1",
                                                            children: [
                                                                "投稿日時:",
                                                                " ",
                                                                new Date(comment.created_at).toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                            lineNumber: 611,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, comment.id, true, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 593,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 591,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "mt-4 ml-5 text-gray-500 text-sm",
                                            children: "まだコメントはありません。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 619,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 582,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-c7603b6afd9f8724" + " " + "item_detail_comment_form mt-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "comment_word text-xl font-bold text-gray-800 mb-4",
                                            children: "商品へのコメント"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 627,
                                            columnNumber: 15
                                        }, this),
                                        commentErrors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "jsx-c7603b6afd9f8724",
                                                children: commentErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "jsx-c7603b6afd9f8724" + " " + "text-sm",
                                                        children: err
                                                    }, index, false, {
                                                        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                        lineNumber: 636,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 634,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 633,
                                            columnNumber: 17
                                        }, this),
                                        isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: (e)=>{
                                                e.preventDefault();
                                                submitComment();
                                            },
                                            className: "jsx-c7603b6afd9f8724" + " " + "comment_form space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: newComment,
                                                    onChange: (e)=>setNewComment(e.target.value),
                                                    rows: 5,
                                                    placeholder: "コメントを入力してください",
                                                    className: "jsx-c7603b6afd9f8724" + " " + "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-700"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    className: "jsx-c7603b6afd9f8724" + " " + "w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200",
                                                    children: "コメントを送信する"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                    lineNumber: 659,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 645,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-c7603b6afd9f8724" + " " + "text-center p-4 border border-dashed rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                onClick: ()=>router.push("/login"),
                                                className: "jsx-c7603b6afd9f8724" + " " + "text-red-600 font-semibold cursor-pointer hover:underline",
                                                children: "ログインしてコメントする"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                                lineNumber: 668,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                            lineNumber: 667,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                                    lineNumber: 626,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                            lineNumber: 428,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                    lineNumber: 416,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "c7603b6afd9f8724",
                children: ".item_detail_contents.jsx-c7603b6afd9f8724{flex-wrap:wrap;justify-content:center;max-width:1400px;margin:0 auto;padding:20px;display:flex}.item_detail_image.jsx-c7603b6afd9f8724{width:50%;min-width:300px;max-width:450px;padding:50px}.item_detail_image1.jsx-c7603b6afd9f8724{aspect-ratio:1;object-fit:cover;object-position:center;width:100%;height:auto}.information.jsx-c7603b6afd9f8724{width:50%;min-width:300px;max-width:450px;padding:50px}.information.jsx-c7603b6afd9f8724 h2.jsx-c7603b6afd9f8724,.information.jsx-c7603b6afd9f8724 h3.jsx-c7603b6afd9f8724,.information.jsx-c7603b6afd9f8724 p.jsx-c7603b6afd9f8724{position:static;margin-left:0!important}.item_detail_brand.jsx-c7603b6afd9f8724{align-items:center;margin-top:10px;display:flex}.item_detail_brand_1.jsx-c7603b6afd9f8724{font-size:14px;font-weight:700}.item_detail_brand_2.jsx-c7603b6afd9f8724{font-size:14px;font-weight:600;position:relative;left:50px}.item_detail_price.jsx-c7603b6afd9f8724{margin-top:10px;margin-bottom:20px}.item_detail_price.jsx-c7603b6afd9f8724 h2.jsx-c7603b6afd9f8724{font-size:26px}.price_after.jsx-c7603b6afd9f8724{font-size:19px;font-weight:500}.explain_word.jsx-c7603b6afd9f8724{word-break:break-all;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word;margin-left:20px;font-size:14px;font-weight:600;line-height:1.6}.comments_count.jsx-c7603b6afd9f8724{margin-left:10px;font-size:14px;font-weight:400;position:relative;top:0}.comment.jsx-c7603b6afd9f8724{word-break:break-all;overflow-wrap:break-word;border-top:1px dashed #ccc;max-width:320px;margin-top:15px;padding-top:10px}.comment-text.jsx-c7603b6afd9f8724{white-space:pre-wrap;word-wrap:break-word;margin-left:50px;font-size:14px;font-weight:600;line-height:1.6}.comment_name_image.jsx-c7603b6afd9f8724{align-items:center;margin-bottom:5px;display:flex}.user_image_css.jsx-c7603b6afd9f8724{object-fit:cover;object-position:center;border-radius:50%;width:40px;height:40px;position:relative;left:0;overflow:hidden}.comment_name.jsx-c7603b6afd9f8724{font-size:17px;font-weight:700;position:relative;left:10px}.item_detail_comment_form.jsx-c7603b6afd9f8724 h2.jsx-c7603b6afd9f8724{margin-bottom:10px;font-size:18px;position:relative;top:8px}@media (width<=768px){.item_detail_image.jsx-c7603b6afd9f8724,.information.jsx-c7603b6afd9f8724{width:100%;max-width:100%;min-width:unset;padding:20px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/items/[items_id]/page.tsx",
        lineNumber: 414,
        columnNumber: 5
    }, this);
}
_s(ItemDetailPage, "SrzSDCkroFNzOOaIoXPN07m+Y3k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApi"]
    ];
});
_c = ItemDetailPage;
var _c;
__turbopack_context__.k.register(_c, "ItemDetailPage");
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

//# sourceMappingURL=_bb096a41._.js.map