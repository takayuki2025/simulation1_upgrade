module.exports = [
"[project]/utils/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IMAGE_TYPE",
    ()=>IMAGE_TYPE,
    "PLACEHOLDER_IMAGE_URL",
    ()=>PLACEHOLDER_IMAGE_URL,
    "getImageUrl",
    ()=>getImageUrl,
    "onImageError",
    ()=>onImageError
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
const PLACEHOLDER_IMAGE_URL = "https://placehold.co/300x300/e0e0e0/333?text=No+Image";
// プロフィール画像がない場合のデフォルトパス
const DEFAULT_PROFILE_IMAGE_PATH = "storage/images/default-profile2.jpg";
// Next.jsの環境変数からASSET_BASE_URLを取得 (API_BASE_URLと同じと仮定)
const ASSET_BASE_URL = API_BASE_URL;
const IMAGE_TYPE = {
    // 0: 商品画像 (デフォルトのプレースホルダーを使用)
    ITEM: 0,
    // 1: ユーザー画像 (デフォルトのプロフィール画像を使用)
    USER: 1
};
const getImageUrl = (path, imageType, cacheKey = 0)=>{
    // 1. パスがない場合の処理
    if (!path) {
        if (imageType === IMAGE_TYPE.USER) {
            // ユーザー画像の場合は専用のデフォルト画像を返す
            return `${API_BASE_URL?.replace(/\/$/, "")}/${DEFAULT_PROFILE_IMAGE_PATH}`;
        }
        // 商品画像の場合は汎用のプレースホルダーを返す
        return PLACEHOLDER_IMAGE_URL;
    }
    // 2. 既にフルURL (Laravelのアクセサで変換済み) の場合はそのまま返す
    if (path.startsWith("http")) {
        console.log("DEBUG_IMG: Path starts with http (Absolute URL), returning:", path);
        // キャッシュバスターを付与
        const cacheBuster = cacheKey > 0 ? `?t=${cacheKey}` : "";
        return `${path}${cacheBuster}`;
    }
    // 3. フルURLでない場合 (フォールバック)
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // --- フォールバックの結合処理 ---
    // ASSET_BASE_URLから末尾のスラッシュを削除
    const baseUrl = ASSET_BASE_URL.endsWith("/") ? ASSET_BASE_URL.slice(0, -1) : ASSET_BASE_URL;
    let cleanPath = path;
    // パスの先頭にあるスラッシュやバックスラッシュを削除
    cleanPath = cleanPath.replace(/^[/\\]+/, "");
    // 💡 パスが 'storage/' で始まっていない場合は補完 (Laravelのシンボリックリンク構造対応)
    // 例外: API側で既に 'storage/...' が含まれたパスが渡ってくる場合があるため、補完は最小限にする
    if (!cleanPath.startsWith("storage/") && !cleanPath.startsWith("images/")) {
        cleanPath = `storage/${cleanPath}`;
    }
    const cacheBuster = cacheKey > 0 ? `?t=${cacheKey}` : "";
    // ベースURLとクリーンアップされたパスを結合
    const finalUrl = `${baseUrl}/${cleanPath}${cacheBuster}`;
    console.log(`DEBUG_IMG: Base: ${baseUrl}, Final Path: /${cleanPath}, Result: ${finalUrl} (Fallback)`);
    return finalUrl;
};
const onImageError = (e, name)=>{
    const target = e.target;
    // エラーが何度も発生しないように、イベントハンドラを無効化
    target.onerror = null;
    const placeholderText = name ? name.replace(/\s/g, "+") : "Error";
    // エラーハンドリング時に名前入りのプレースホルダーに切り替える
    // サイズは画像の用途に応じて調整できるように、ここでは汎用の300x300を使用
    target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};
}),
"[project]/app/(main)/item/[items_id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ItemDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
// 認証フックのインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-ssr] (ecmascript)");
// 💡 【修正】汎用化された画像ヘルパーをインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
// 💡 ライフサイクル診断ログ: コンポーネントがいつ再レンダリングされたかを確認
console.log("DIAGNOSTICS: ItemDetailPage RE-RENDERED.");
// =======================================================
// グローバル設定 & ユーティリティ
// =======================================================
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
// 認証情報付きリクエストをaxios全体で許可
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
// ----------------------------------------------------------------
// ユーティリティ: エラーハンドリングのための型ガードとヘルパー
// ----------------------------------------------------------------
const getErrorMessage = (error)=>{
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
        const data = error.response?.data;
        if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
            return data.message;
        }
        // 404エラーの場合は、特に「ルートが見つからない」ことを明示
        if (error.response?.status === 404) {
            return `リクエストエラー: ルートが見つかりません (${error.config?.url})`;
        }
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
};
function ItemDetailPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    // 1. useAuth から必要な状態とアクションを取得
    const { user, isAuthenticated, isLoading: isAuthLoading, isRefreshing, isLoggingOut, apiClient, logout, backendUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    // 💡 データフェッチが一度試行されたことを記録するRef
    const hasFetchedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // 💡 コメント投稿リクエストのAbortControllerを保持するRef
    const commentAbortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ----------------------------------------------------------------
    // State & Computed Properties
    // ----------------------------------------------------------------
    const itemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const idParam = params.items_id;
        const idString = Array.isArray(idParam) ? idParam[0] : idParam;
        if (!idString || typeof idString !== "string" || idString.trim() === "") {
            return null;
        }
        const parsedId = parseInt(idString);
        return isNaN(parsedId) || parsedId <= 0 ? -1 : parsedId;
    }, [
        params.items_id
    ]);
    // 💡 backendUser を extendedUser の代替として使用
    const extendedUser = backendUser;
    const [item, setItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFavorited, setIsFavorited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [favoritesCount, setFavoritesCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [itemErrors, setItemErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentErrors, setCommentErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSubmittingComment, setIsSubmittingComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isOwner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return isAuthenticated && extendedUser?.id === item?.user_id;
    }, [
        isAuthenticated,
        extendedUser,
        item
    ]);
    const canInteract = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return isAuthenticated && extendedUser?.id !== item?.user_id;
    }, [
        isAuthenticated,
        extendedUser,
        item
    ]);
    const isSoldOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (item?.remain ?? 0) < 1;
    }, [
        item
    ]);
    const itemCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!item?.category) return [];
        try {
            const categories = JSON.parse(item.category);
            return Array.isArray(categories) ? categories : [
                String(item.category)
            ];
        } catch (e) {
            return [
                item.category
            ];
        }
    }, [
        item
    ]);
    // 💡 【修正】getImageUrl を使用し、画像タイプに IMAGE_TYPE.ITEM (0) を渡す
    const fullItemImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // 0 は商品画像タイプ、キャッシュキー 0 はバスターなしを意味
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getImageUrl"])(item?.item_image || null, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].ITEM, 0);
    }, [
        item?.item_image
    ]);
    // ----------------------------------------------------------------
    // データフェッチヘルパー (useCallback)
    // ----------------------------------------------------------------
    const authenticatedFetchWithRetry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (config)=>{
        if (isAuthLoading || isLoggingOut || !apiClient) {
            throw new Error("Authentication or client not ready (isAuthLoading/isLoggingOut/apiClient check failed).");
        }
        return await apiClient.request(config);
    }, [
        isAuthLoading,
        isLoggingOut,
        apiClient
    ]);
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (id)=>{
        setIsLoading(true);
        setError("");
        setItemErrors([]);
        const endpoint = `/api/item/${id}`;
        try {
            let data;
            if (isAuthenticated && apiClient) {
                const response = await authenticatedFetchWithRetry({
                    method: "GET",
                    url: endpoint
                });
                data = response.data;
            } else {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}${endpoint}`);
                data = response.data;
            }
            if (data.item) {
                setItem(data.item);
                setIsFavorited(data.is_favorited ?? false);
                setFavoritesCount(data.favorites_count ?? 0);
                setComments(data.comments ?? []);
            } else if (data.errors && data.errors.length > 0) {
                setItemErrors(data.errors);
                setError(data.errors[0]);
            } else {
                setError("商品情報が見つかりませんでした。");
            }
        } catch (e) {
            console.error("データの取得中に予期せぬエラーが発生しました。", e);
            let errMsg = getErrorMessage(e);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(e) && !e.response?.data?.message) {
                errMsg = "データの取得中にエラーが発生しました。";
            }
            setError(errMsg);
        } finally{
            setIsLoading(false);
        }
    }, [
        isAuthenticated,
        apiClient,
        authenticatedFetchWithRetry
    ]);
    // ----------------------------------------------------------------
    // Effect / Watcher
    // ----------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (itemId === null || itemId === -1) {
            let errorMessage = itemId === -1 ? "無効な商品IDの形式です。" : "商品IDが指定されていません。";
            setError(errorMessage);
            setIsLoading(false);
            hasFetchedRef.current = true;
            return;
        }
        if (hasFetchedRef.current && item !== null) {
            setIsLoading(false);
            return;
        }
        if (isAuthLoading) {
            return;
        }
        hasFetchedRef.current = true;
        fetchData(itemId);
    }, [
        itemId,
        isAuthLoading,
        fetchData,
        item
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (commentAbortControllerRef.current) {
                commentAbortControllerRef.current.abort();
                commentAbortControllerRef.current = null;
            }
        };
    }, []);
    // ----------------------------------------------------------------
    // 機能ロジック
    // ----------------------------------------------------------------
    const submitFavorite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!item || !isAuthenticated) {
            if (!isAuthenticated) router.push("/login");
            return;
        }
        if (isOwner) {
            setItemErrors([
                "ご自身の商品の操作はできません。"
            ]);
            return;
        }
        if (isAuthLoading || isRefreshing) {
            setItemErrors([
                "認証情報の同期中です。しばらくお待ちください..."
            ]);
            return;
        }
        const isCurrentlyFavorited = isFavorited;
        setIsFavorited(!isCurrentlyFavorited);
        setFavoritesCount((prev)=>isCurrentlyFavorited ? prev - 1 : prev + 1);
        try {
            // 💡 【修正】お気に入りエンドポイントの URL 形式を統一
            const endpoint = `/api/items/${item.id}/favorite`;
            const config = isCurrentlyFavorited ? {
                method: "DELETE",
                url: endpoint
            } : {
                method: "POST",
                url: endpoint
            };
            await authenticatedFetchWithRetry(config);
        } catch (e) {
            console.error("お気に入り操作中にエラーが発生しました:", e);
            // 失敗した場合は状態を元に戻す
            setIsFavorited((prev)=>!prev);
            setFavoritesCount((prev)=>isCurrentlyFavorited ? prev + 1 : prev - 1);
            let errMsg = getErrorMessage(e);
            setItemErrors([
                errMsg
            ]);
        }
    }, [
        item,
        isAuthenticated,
        isFavorited,
        authenticatedFetchWithRetry,
        router,
        isOwner,
        isAuthLoading,
        isRefreshing
    ]);
    /**
   * コメント投稿処理
   */ const submitComment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // 💡 新しいガード句: 既に送信中であれば即座に終了 (二重実行の防御)
        if (isSubmittingComment) {
            console.log("DEBUG: Already submitting, blocking new request.");
            return;
        }
        // 1. 既存のコントローラーがあれば、新しいリクエストを開始する前にキャンセルを試みる
        if (commentAbortControllerRef.current) {
            console.log("DEBUG: Cancelling previous comment submission to prevent duplicate.");
            commentAbortControllerRef.current.abort();
            commentAbortControllerRef.current = null;
        }
        setCommentErrors([]);
        setIsSubmittingComment(true);
        // 2. 新しいコントローラーを作成し、Refに保持
        const controller = new AbortController();
        commentAbortControllerRef.current = controller;
        console.log("DEBUG: submitComment function started.");
        console.log("DEBUG: isAuthenticated =", isAuthenticated);
        console.log("DEBUG: isAuthLoading =", isAuthLoading);
        console.log("DEBUG: isRefreshing =", isRefreshing);
        // --- ガード句 ---
        if (!isAuthenticated) {
            router.push("/login");
            setIsSubmittingComment(false);
            commentAbortControllerRef.current = null;
            return;
        }
        if (!item) {
            setCommentErrors([
                "商品情報が読み込まれていません。"
            ]);
            setIsSubmittingComment(false);
            commentAbortControllerRef.current = null;
            return;
        }
        if (newComment.trim() === "") {
            setCommentErrors([
                "コメントを入力してください"
            ]);
            setIsSubmittingComment(false);
            commentAbortControllerRef.current = null;
            return;
        }
        // 💡 認証状態の矛盾を確実に捉えて中断する (extendedUser のチェック)
        if (!extendedUser || !extendedUser.id) {
            console.error("DIAGNOSTICS_ERROR: Authentication Mismatch. isAuthenticated=true but extendedUser is null.");
            setCommentErrors([
                "ユーザー情報が取得できませんでした。セッションが不安定です。再度ログインしてください。"
            ]);
            setIsSubmittingComment(false);
            commentAbortControllerRef.current = null;
            return;
        }
        // --- ガード句終了 ---
        try {
            // 5. コメント投稿リクエストを実行 (signalを追加)
            const response = await authenticatedFetchWithRetry({
                method: "POST",
                url: "/api/comment",
                data: {
                    item_id: item.id,
                    comment: newComment
                },
                signal: controller.signal
            });
            // 6. 成功時の処理
            if (response.data.comment) {
                const resComment = response.data.comment;
                const newCommentData = {
                    id: resComment.id,
                    comment: resComment.comment,
                    created_at: resComment.created_at,
                    user: resComment.user || {
                        id: extendedUser.id,
                        name: extendedUser.name,
                        user_image: extendedUser.user_image
                    }
                };
                setComments((prev)=>[
                        ...prev,
                        newCommentData
                    ]);
                setNewComment("");
            } else {
                throw new Error("コメントの投稿に成功しましたが、データ更新に失敗しました。");
            }
            setIsSubmittingComment(false);
        } catch (e) {
            // 💡 キャンセルエラーの判定と処理 (ここでキャンセルを捕捉)
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(e) && e.code === "ERR_CANCELED") {
                if (commentAbortControllerRef.current !== controller) {
                    console.log("DIAGNOSTICS: Cancel reason: Previous request aborted by new submission (Scenario 1 - NORMAL).");
                    return;
                }
                console.log("DIAGNOSTICS: Cancel reason: Page Unmount or Token Refresh Failure (Scenario 2/3 - ABNORMAL).");
                setIsSubmittingComment(false);
                return;
            }
            // 致命的なエラーが発生した場合
            console.error("コメント投稿中にエラーが発生しました:", e);
            let errMsg = getErrorMessage(e);
            setCommentErrors([
                errMsg
            ]);
            // 🚨 致命的なエラー発生時は必ずローディング状態を解除
            setIsSubmittingComment(false);
            if (errMsg.includes("Authentication failed after retry")) {
                setCommentErrors([
                    "セッションの有効期限が切れました。再度ログインが必要です。"
                ]);
            }
        } finally{
            // 💡 成功またはエラーの完了時に、このリクエストのコントローラーがまだ Ref に残っている場合のみクリア
            if (commentAbortControllerRef.current === controller) {
                commentAbortControllerRef.current = null;
            }
        }
    }, [
        item,
        isAuthenticated,
        newComment,
        extendedUser,
        logout,
        authenticatedFetchWithRetry,
        router,
        isSubmittingComment
    ]);
    /**
   * 購入/マイページへの遷移
   */ const navigateToPurchase = ()=>{
        if (isOwner) {
            router.push("/mypage");
        } else if (isAuthenticated && item) {
            router.push(`/purchase/${item.id}`);
        } else {
            router.push("/login");
        }
    };
    // ----------------------------------------------------------------
    // レンダリング
    // ----------------------------------------------------------------
    const totalLoading = isAuthLoading || isLoading || isRefreshing;
    if (totalLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-48 my-20 w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 507,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-4 text-xl font-semibold text-gray-600",
                    children: isAuthLoading ? "認証状態を確認中..." : isRefreshing ? "認証情報を更新中..." : "商品情報を読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 508,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 506,
            columnNumber: 7
        }, this);
    }
    if (error || itemErrors && itemErrors.length > 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md my-10 w-full max-w-5xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-bold",
                    children: "データの取得エラー"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 522,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 523,
                    columnNumber: 9
                }, this),
                itemErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: err
                    }, index, false, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 525,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 521,
            columnNumber: 7
        }, this);
    }
    if (!item) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-20 w-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xl font-semibold text-gray-600",
                children: "商品が見つかりませんでした。"
            }, void 0, false, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 534,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 533,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-498f873c93d73e9a" + " " + "item_detail_wrapper bg-gray-100 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-498f873c93d73e9a" + " " + "item_detail_contents",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-498f873c93d73e9a" + " " + "flex flex-wrap lg:flex-nowrap w-full max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-498f873c93d73e9a" + " " + "item_detail_image p-4 lg:p-8 w-full lg:w-1/2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: fullItemImageUrl,
                                alt: "商品写真",
                                // 💡 【修正】onImageError をインポートしたものに置き換え
                                onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name),
                                className: "jsx-498f873c93d73e9a" + " " + "item_detail_image1 w-full h-auto object-cover rounded-lg shadow-md"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 547,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                            lineNumber: 546,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-498f873c93d73e9a" + " " + "information p-4 lg:p-8 w-full lg:w-1/2 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_name",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-498f873c93d73e9a" + " " + "text-3xl font-extrabold text-gray-800",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 559,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 558,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_brand text-sm text-gray-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-498f873c93d73e9a" + " " + "item_detail_brand_1 font-semibold",
                                            children: "ブランド名"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 565,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-498f873c93d73e9a" + " " + "item_detail_brand_2",
                                            children: item.brand || "未登録"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 566,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 564,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_price",
                                    children: isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-498f873c93d73e9a" + " " + "text-3xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded inline-block",
                                        children: "SOLD OUT"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 571,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-498f873c93d73e9a" + " " + "text-3xl font-bold text-gray-900",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-498f873c93d73e9a" + " " + "price_after text-xl font-normal",
                                                children: "¥"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 576,
                                                columnNumber: 19
                                            }, this),
                                            item.price ? item.price.toLocaleString() : "---",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-498f873c93d73e9a" + " " + "price_after text-lg font-normal",
                                                children: [
                                                    " ",
                                                    "(税込)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 578,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 575,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 569,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "space-y-6 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-498f873c93d73e9a" + " " + "flex items-center space-x-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-498f873c93d73e9a" + " " + "flex items-center",
                                                    children: [
                                                        canInteract ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: submitFavorite,
                                                            type: "button",
                                                            disabled: totalLoading || isSubmittingComment,
                                                            className: "jsx-498f873c93d73e9a" + " " + "text-3xl transition-transform transform hover:scale-110 active:scale-90 p-0 m-0 leading-none focus:outline-none disabled:opacity-50",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-498f873c93d73e9a" + " " + `heart_icon text-4xl ${isFavorited ? "text-red-500" : ""}`,
                                                                children: isFavorited ? "❤️" : "🤍"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                lineNumber: 598,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 592,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "text-3xl text-gray-400 leading-none",
                                                            children: "🤍"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 607,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "text-xl ml-2 font-semibold text-gray-600",
                                                            children: favoritesCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 611,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-498f873c93d73e9a" + " " + "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            width: "32",
                                                            height: "32",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.8",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            className: "jsx-498f873c93d73e9a" + " " + "text-gray-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M21 11.5a8.38 8.38 0 0 1-.6 3.2 12.16 12.16 0 0 1-1.9 2.5c-.8 1.1-1.7 2-2.8 2.5a5.77 5.77 0 0 1-3.6 0c-1.1-.5-2.1-1.4-2.8-2.5a12.16 12.16 0 0 1-1.9-2.5 8.38 8.38 0 0 1-.6-3.2",
                                                                    className: "jsx-498f873c93d73e9a"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                    lineNumber: 630,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z",
                                                                    className: "jsx-498f873c93d73e9a"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                    lineNumber: 631,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M8 10h8",
                                                                    className: "jsx-498f873c93d73e9a"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                    lineNumber: 632,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 618,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "text-xl ml-2 font-semibold text-gray-600",
                                                            children: comments.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 635,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 617,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 588,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-498f873c93d73e9a" + " " + "item_detail_form pt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: navigateToPurchase,
                                                disabled: isSoldOut && !isOwner || totalLoading,
                                                className: "jsx-498f873c93d73e9a" + " " + `w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${!isSoldOut ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"} disabled:bg-gray-400 disabled:opacity-70`,
                                                children: isOwner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-498f873c93d73e9a",
                                                    children: "マイページへ移動する"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 653,
                                                    columnNumber: 21
                                                }, this) : isAuthenticated && !isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-498f873c93d73e9a",
                                                    children: "カートへ"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 655,
                                                    columnNumber: 21
                                                }, this) : isAuthenticated && isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-498f873c93d73e9a",
                                                    children: "SOLD OUT"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-498f873c93d73e9a",
                                                    children: "ログインして購入"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 659,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 643,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 642,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 586,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_explain mt-8 border-t border-gray-200 pt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-498f873c93d73e9a" + " " + "text-xl font-bold text-gray-800 mb-2",
                                            children: "商品説明"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 667,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "jsx-498f873c93d73e9a" + " " + "explain_word text-gray-700 whitespace-pre-wrap",
                                            children: item.explain
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 668,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 666,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_category mt-8 border-t border-gray-200 pt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-498f873c93d73e9a",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-498f873c93d73e9a" + " " + "text-xl font-bold text-gray-800 mb-2",
                                                children: "商品情報"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 676,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-498f873c93d73e9a" + " " + "flex flex-col space-y-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-498f873c93d73e9a" + " " + "flex items-center space-x-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "w-24 text-gray-600 font-medium",
                                                            children: "カテゴリー"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 681,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "flex flex-wrap gap-2",
                                                            children: itemCategories.length > 0 ? itemCategories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-498f873c93d73e9a" + " " + "px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full",
                                                                    children: category
                                                                }, index, false, {
                                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                    lineNumber: 685,
                                                                    columnNumber: 27
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-498f873c93d73e9a" + " " + "text-gray-500",
                                                                children: "カテゴリーは登録されていません。"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                lineNumber: 693,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 682,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 680,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 679,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 675,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 674,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_condition mt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-498f873c93d73e9a" + " " + "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-498f873c93d73e9a" + " " + "w-24 text-gray-600 font-medium",
                                                children: "商品の状態"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 704,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-498f873c93d73e9a" + " " + "text-gray-700 font-semibold",
                                                children: item.condition || "未登録"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 705,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 703,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 702,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_comment_history mt-10 border-t border-gray-200 pt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-498f873c93d73e9a" + " " + "comment_count_flex flex justify-between items-center mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "jsx-498f873c93d73e9a" + " " + "text-xl font-bold text-gray-800",
                                                    children: "コメント"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 714,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-498f873c93d73e9a" + " " + "comments_count text-gray-500",
                                                    children: [
                                                        "(",
                                                        comments.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 715,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 713,
                                            columnNumber: 15
                                        }, this),
                                        comments && comments.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-498f873c93d73e9a" + " " + "max-h-80 overflow-y-auto pr-2 pt-2 space-y-4",
                                            children: comments.map((comment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-498f873c93d73e9a" + " " + "comment border-b border-gray-100 pb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "comment_name_image flex items-center space-x-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    // 💡 【修正】getImageUrl を使用し、ユーザー画像タイプ (1) を渡す
                                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getImageUrl"])(comment.user.user_image || null, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].USER, 0),
                                                                    alt: "プロフィール画像",
                                                                    // 💡 【修正】onImageError をインポートしたものに置き換え
                                                                    onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onImageError"])(e, comment.user.name),
                                                                    className: "jsx-498f873c93d73e9a" + " " + "user_image_css w-10 h-10 rounded-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                    lineNumber: 728,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-498f873c93d73e9a" + " " + "comment_name font-semibold text-gray-800",
                                                                    children: comment.user.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                    lineNumber: 740,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 727,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "comment-text ml-10 mt-1 text-gray-700 whitespace-pre-wrap",
                                                            children: comment.comment
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 744,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            className: "jsx-498f873c93d73e9a" + " " + "text-xs ml-10 text-gray-500 block mt-1",
                                                            children: [
                                                                "投稿日時:",
                                                                " ",
                                                                new Date(comment.created_at).toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                            lineNumber: 747,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, comment.id, true, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 723,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 721,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-498f873c93d73e9a" + " " + "mt-4 ml-5 text-gray-500 text-sm",
                                            children: "まだコメントはありません。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 755,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 712,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-498f873c93d73e9a" + " " + "item_detail_comment_form mt-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-498f873c93d73e9a" + " " + "comment_word text-xl font-bold text-gray-800 mb-4",
                                            children: "商品へのコメント"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 763,
                                            columnNumber: 15
                                        }, this),
                                        commentErrors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-498f873c93d73e9a" + " " + "bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "jsx-498f873c93d73e9a",
                                                children: commentErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "jsx-498f873c93d73e9a" + " " + "text-sm",
                                                        children: err
                                                    }, index, false, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 772,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 770,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 769,
                                            columnNumber: 17
                                        }, this),
                                        isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: (e)=>{
                                                e.preventDefault();
                                                submitComment();
                                            },
                                            className: "jsx-498f873c93d73e9a" + " " + "comment_form space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: newComment,
                                                    onChange: (e)=>setNewComment(e.target.value),
                                                    rows: 5,
                                                    placeholder: "コメントを入力してください",
                                                    disabled: isSubmittingComment || totalLoading,
                                                    className: "jsx-498f873c93d73e9a" + " " + "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-700"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 788,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    disabled: isSubmittingComment || totalLoading || newComment.trim() === "",
                                                    className: "jsx-498f873c93d73e9a" + " " + "w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-red-300",
                                                    children: isSubmittingComment ? "投稿中..." : "コメントを送信する"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 796,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 781,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-498f873c93d73e9a" + " " + "text-center p-4 border border-dashed rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                onClick: ()=>router.push("/login"),
                                                className: "jsx-498f873c93d73e9a" + " " + "text-red-600 font-semibold cursor-pointer hover:underline",
                                                children: "ログインしてコメントする"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 810,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 809,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 762,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                            lineNumber: 557,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 544,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 543,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "498f873c93d73e9a",
                children: ".item_detail_contents.jsx-498f873c93d73e9a{flex-wrap:wrap;justify-content:center;max-width:1400px;margin:0 auto;padding:20px;display:flex}.item_detail_image.jsx-498f873c93d73e9a{width:50%;min-width:300px;max-width:450px;padding:50px}.item_detail_image1.jsx-498f873c93d73e9a{aspect-ratio:1;object-fit:cover;object-position:center;width:100%;height:auto}.information.jsx-498f873c93d73e9a{width:50%;min-width:300px;max-width:450px;padding:50px}.explain_word.jsx-498f873c93d73e9a{word-break:break-all;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word;margin-left:20px;font-size:14px;font-weight:600;line-height:1.6}.comment.jsx-498f873c93d73e9a{word-break:break-all;overflow-wrap:break-word;border-top:1px dashed #ccc;max-width:320px;margin-top:15px;padding-top:10px}.comment-text.jsx-498f873c93d73e9a{white-space:pre-wrap;word-wrap:break-word;margin-left:50px;font-size:14px;font-weight:600;line-height:1.6}.user_image_css.jsx-498f873c93d73e9a{object-fit:cover;object-position:center;border-radius:50%;width:40px;height:40px;position:relative;left:0;overflow:hidden}@media (width<=768px){.item_detail_image.jsx-498f873c93d73e9a,.information.jsx-498f873c93d73e9a{width:100%;max-width:100%;min-width:unset;padding:20px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
        lineNumber: 542,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_a7edccab._.js.map