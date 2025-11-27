module.exports = [
"[project]/app/(main)/item/[item_id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
// 💡 プロジェクトの認証フックのパスに合わせてください
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// =======================================================
// グローバル変数/ヘルパー関数
// =======================================================
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
// **
//  * アセットURLを生成する汎用ヘルパー関数
//  * 💡 Laravelのストレージパス構造に合わせて「/storage」を挿入するロジックを追加
//  */
const getAssetUrl = (path, isProfileImage = false)=>{
    if (!path) {
        return isProfileImage ? "https://placehold.co/40x40/D1D5DB/1F2937?text=U" : "https://placehold.co/450x450/D1D5DB/1F2937?text=No+Image";
    }
    // 外部URLであればそのまま返す
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    // 1. ベースURLをクリーンにする (例: http://localhost:8000/)
    const cleanBase = API_BASE_URL?.replace(/\/$/, "") || "";
    // 2. パスをクリーンにする (先頭の / を削除)
    let cleanPath = path.startsWith("/") ? path.substring(1) : path;
    // 3. Laravelのストレージパス構造に対応させる
    //    （API_BASE_URLがAPIルートではなく、ドメインルートであることを前提）
    if (!cleanPath.startsWith("storage/") && !cleanPath.startsWith("storage\\")) {
        // パスに "storage/" が含まれていない場合のみ追加
        cleanPath = `storage/${cleanPath}`;
    }
    // 4. 正しいフルURLを返す (例: http://localhost:8000/storage/images/...)
    return `${cleanBase}/${cleanPath}`;
};
// 画像ロードエラーハンドラー
const onImageError = (e, isProfileImage = false)=>{
    const target = e.target;
    target.onerror = null;
    if (isProfileImage) {
        target.src = getAssetUrl(null, true);
    } else {
        target.src = getAssetUrl(null, false);
    }
};
function ItemDetailPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    console.log("RENDERING: ItemDetailPage starting to render.");
    // 💡 データフェッチが一度試行されたことを記録するRef
    const hasFetchedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ----------------------------------------------------------------
    // Computed Properties: itemId (ID取得キーを修正)
    // ----------------------------------------------------------------
    const itemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // 💡 修正: フォルダ名 [item_id] に合わせて params.item_id を使用
        const idParam = params.item_id;
        const idString = Array.isArray(idParam) ? idParam[0] : idParam;
        // 💡 デバッグログ: Next.jsから受け取った生パラメータを確認
        console.log("DEBUG_ID: params.item_id (raw) =", idParam);
        // IDがないか、空文字の場合は null を返す
        if (!idString || typeof idString !== "string" || idString.trim() === "") {
            return null;
        }
        const parsedId = parseInt(idString);
        // パース結果が NaN や 0 以下の場合は、IDが無効であることを示すマーカー -1 を返す
        if (isNaN(parsedId) || parsedId <= 0) {
            return -1; // 無効なID形式を示すマーカー
        }
        // 💡 デバッグログ: 正常なIDを確認
        console.log("DEBUG_ID: itemId (parsed) =", parsedId);
        return parsedId;
    }, [
        params.item_id
    ]); // 💡 依存配列も params.item_id に変更
    const { user, isAuthenticated, apiClient: rawApiClient, isLoading: isAuthLoading, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const extendedUser = user;
    const [item, setItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFavorited, setIsFavorited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [favoritesCount, setFavoritesCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // 💡 初期値をtrueに維持。認証ロード完了後にフェッチを開始する。
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [itemErrors, setItemErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentErrors, setCommentErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // ----------------------------------------------------------------
    // ヘルパー関数: fetcher (useCallback)
    // ----------------------------------------------------------------
    const fetcher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (endpoint, method = "GET", data)=>{
        const client = rawApiClient;
        if (method !== "GET" && !client) {
            throw new Error("Authentication required for this action.");
        }
        const finalClient = isAuthenticated && client ? client : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
        try {
            let response;
            const url = `${API_BASE_URL}${endpoint}`;
            if (method === "POST" || method === "DELETE") {
                response = await client[method.toLowerCase()](url, data);
            } else {
                response = await finalClient.get(url, {
                    params: data
                });
            }
            return response.data;
        } catch (error) {
            console.error("fetcher error:", error);
            throw error;
        }
    }, [
        rawApiClient,
        isAuthenticated
    ]);
    // ----------------------------------------------------------------
    // Computed Properties (useMemoで代替)
    // ----------------------------------------------------------------
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
                item.category
            ];
        } catch (e) {
            return [
                item.category
            ];
        }
    }, [
        item
    ]);
    const fullItemImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return getAssetUrl(item?.item_image, false);
    }, [
        item?.item_image
    ]);
    // ----------------------------------------------------------------
    // データフェッチロジック (useCallbackでラップ)
    // ----------------------------------------------------------------
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (id)=>{
        setIsLoading(true);
        setError("");
        setItemErrors([]);
        try {
            const data = await fetcher(// 💡 修正: Laravelのルート /api/item/{item_id} に合わせる
            `/api/item/${id}`, "GET");
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
            const errMsg = e.response?.data?.message || "データの取得中にエラーが発生しました。";
            setError(errMsg);
        } finally{
            console.log("FETCH_STATUS: Loading state about to be set to false.");
            setIsLoading(false);
        }
    }, [
        fetcher
    ] // fetcher が変更された場合のみ再生成
    );
    // ----------------------------------------------------------------
    // Effect / Watcher (無限ループ対策済みの最終ロジック)
    // ----------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // 1. データ取得が一度試行されたら、いかなる理由でもすぐに停止する
        if (hasFetchedRef.current) {
            // itemがロード済みならローディング表示は終了
            if (item) {
                setIsLoading(false);
            }
            return;
        }
        // 2. 認証ロード中であれば待機
        if (isAuthLoading) {
            console.log("EFFECT_STATUS: Waiting for Auth to finish loading.");
            return;
        }
        // 3. IDが完全に無効な場合 (null または -1) は、エラーを設定して処理を終了
        if (itemId === null || itemId === -1) {
            let errorMessage = "商品IDが指定されていません。";
            if (itemId === -1) {
                errorMessage = "無効な商品IDの形式です。";
            }
            console.log("EFFECT_STATUS: Invalid ID detected after Auth load. Stopping loop.");
            setError(errorMessage);
            setIsLoading(false);
            hasFetchedRef.current = true; // エラー処理実行済みとしてフラグを立てる
            return;
        }
        // 4. 全ての条件をクリアした場合、フェッチをトリガー
        console.log("EFFECT_STATUS: fetchData triggered for ID:", itemId);
        hasFetchedRef.current = true; // 実行フラグを立てる
        fetchData(itemId);
    }, [
        itemId,
        isAuthLoading,
        fetchData
    ]); // 💡 itemを依存配列から削除
    // ----------------------------------------------------------------
    // 機能ロジック (変更なし)
    // ----------------------------------------------------------------
    const submitFavorite = async ()=>{
        if (!item || !isAuthenticated) {
            router.push("/login");
            return;
        }
        if (!rawApiClient) {
            alert("ログインセッションが無効です。再度ログインしてください。");
            await logout();
            return;
        }
        const isCurrentlyFavorited = isFavorited;
        setIsFavorited(!isCurrentlyFavorited);
        setFavoritesCount((prev)=>isCurrentlyFavorited ? prev - 1 : prev + 1);
        try {
            const endpoint = isCurrentlyFavorited ? `/api/favorite/${item.id}` : `/api/favorite`;
            if (isCurrentlyFavorited) {
                await fetcher(endpoint, "DELETE");
            } else {
                await fetcher(endpoint, "POST", {
                    item_id: item.id
                });
            }
        } catch (e) {
            console.error("お気に入り操作中にエラーが発生しました:", e);
            setIsFavorited((prev)=>!prev);
            setFavoritesCount((prev)=>isCurrentlyFavorited ? prev + 1 : prev - 1);
            const errMsg = e.response?.data?.message || "お気に入り操作中に予期せぬエラーが発生しました。";
            setItemErrors([
                errMsg
            ]);
        }
    };
    const submitComment = async ()=>{
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
            await logout();
            return;
        }
        try {
            const response = await fetcher("/api/comment", "POST", {
                item_id: item.id,
                comment: newComment
            });
            if (response.comment) {
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
                setNewComment("");
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
    const navigateToPurchase = ()=>{
        if (isOwner) {
            router.push("/mypage");
        } else if (isAuthenticated && item) {
            router.push(`/purchase/${item.id}`);
        } else {
            router.push("/login");
        }
    };
    // ----------------------------------------------------------------
    // レンダリング (変更なし)
    // ----------------------------------------------------------------
    if (isAuthLoading || isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-48 my-20 w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                    lineNumber: 444,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-4 text-xl font-semibold text-gray-600",
                    children: isAuthLoading ? "認証状態を確認中..." : "商品情報を読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                    lineNumber: 445,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
            lineNumber: 443,
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
                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                    lineNumber: 455,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                    lineNumber: 456,
                    columnNumber: 9
                }, this),
                itemErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: err
                    }, index, false, {
                        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                        lineNumber: 458,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
            lineNumber: 454,
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
                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                lineNumber: 467,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
            lineNumber: 466,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-7798e157fb484b35" + " " + "item_detail_wrapper bg-gray-100 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-7798e157fb484b35" + " " + "item_detail_contents",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-7798e157fb484b35" + " " + "flex flex-wrap lg:flex-nowrap w-full max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-7798e157fb484b35" + " " + "item_detail_image p-4 lg:p-8 w-full lg:w-1/2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: fullItemImageUrl,
                                alt: "商品写真",
                                onError: (e)=>onImageError(e, false),
                                className: "jsx-7798e157fb484b35" + " " + "item_detail_image1 w-full h-auto object-cover rounded-lg shadow-md"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                lineNumber: 480,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                            lineNumber: 479,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-7798e157fb484b35" + " " + "information p-4 lg:p-8 w-full lg:w-1/2 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_name",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-7798e157fb484b35" + " " + "text-3xl font-extrabold text-gray-800",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                        lineNumber: 491,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 490,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_brand text-sm text-gray-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-7798e157fb484b35" + " " + "item_detail_brand_1 font-semibold",
                                            children: "ブランド名"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 497,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-7798e157fb484b35" + " " + "item_detail_brand_2",
                                            children: item.brand || "未登録"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 498,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 496,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_price",
                                    children: isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-7798e157fb484b35" + " " + "text-3xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded inline-block",
                                        children: "SOLD OUT"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                        lineNumber: 503,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-7798e157fb484b35" + " " + "text-3xl font-bold text-gray-900",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-7798e157fb484b35" + " " + "price_after text-xl font-normal",
                                                children: "¥"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 508,
                                                columnNumber: 19
                                            }, this),
                                            item.price ? item.price.toLocaleString() : "---",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-7798e157fb484b35" + " " + "price_after text-lg font-normal",
                                                children: [
                                                    " ",
                                                    "(税込)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 510,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                        lineNumber: 507,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 501,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "space-y-6 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-7798e157fb484b35" + " " + "flex items-center space-x-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-7798e157fb484b35" + " " + "flex items-center",
                                                    children: [
                                                        canInteract ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: submitFavorite,
                                                            type: "button",
                                                            className: "jsx-7798e157fb484b35" + " " + "text-3xl transition-transform transform hover:scale-110 active:scale-90 p-0 m-0 leading-none focus:outline-none",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7798e157fb484b35" + " " + `heart_icon text-4xl ${isFavorited ? "text-red-500" : ""}`,
                                                                children: isFavorited ? "❤️" : "🤍"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                lineNumber: 529,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 524,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-7798e157fb484b35" + " " + "text-3xl text-gray-400 leading-none",
                                                            children: "🤍"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-7798e157fb484b35" + " " + "text-xl ml-2 font-semibold text-gray-600",
                                                            children: favoritesCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-7798e157fb484b35" + " " + "flex items-center",
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
                                                            className: "jsx-7798e157fb484b35" + " " + "text-gray-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M21 11.5a8.38 8.38 0 0 1-.6 3.2 12.16 12.16 0 0 1-1.9 2.5c-.8 1.1-1.7 2-2.8 2.5a5.77 5.77 0 0 1-3.6 0c-1.1-.5-2.1-1.4-2.8-2.5a12.16 12.16 0 0 1-1.9-2.5 8.38 8.38 0 0 1-.6-3.2",
                                                                    className: "jsx-7798e157fb484b35"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                    lineNumber: 561,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z",
                                                                    className: "jsx-7798e157fb484b35"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                    lineNumber: 562,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M8 10h8",
                                                                    className: "jsx-7798e157fb484b35"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                    lineNumber: 563,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 549,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-7798e157fb484b35" + " " + "text-xl ml-2 font-semibold text-gray-600",
                                                            children: comments.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 566,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 520,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-7798e157fb484b35" + " " + "item_detail_form pt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: navigateToPurchase,
                                                disabled: isSoldOut && !isOwner,
                                                className: "jsx-7798e157fb484b35" + " " + `w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${!isSoldOut ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`,
                                                children: isOwner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-7798e157fb484b35",
                                                    children: "マイページへ移動する"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 584,
                                                    columnNumber: 21
                                                }, this) : isAuthenticated && !isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-7798e157fb484b35",
                                                    children: "購入手続きへ"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 21
                                                }, this) : isAuthenticated && isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-7798e157fb484b35",
                                                    children: "SOLD OUT"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 588,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-7798e157fb484b35",
                                                    children: "ログインして購入"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 574,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 573,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 518,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_explain mt-8 border-t border-gray-200 pt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-7798e157fb484b35" + " " + "text-xl font-bold text-gray-800 mb-2",
                                            children: "商品説明"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 598,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "jsx-7798e157fb484b35" + " " + "explain_word text-gray-700 whitespace-pre-wrap",
                                            children: item.explain
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 599,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 597,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_category mt-8 border-t border-gray-200 pt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-7798e157fb484b35",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-7798e157fb484b35" + " " + "text-xl font-bold text-gray-800 mb-2",
                                                children: "商品情報"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 607,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-7798e157fb484b35" + " " + "flex flex-col space-y-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-7798e157fb484b35" + " " + "flex items-center space-x-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-7798e157fb484b35" + " " + "w-24 text-gray-600 font-medium",
                                                            children: "カテゴリー"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 612,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "jsx-7798e157fb484b35" + " " + "flex flex-wrap gap-2",
                                                            children: itemCategories.length > 0 ? itemCategories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-7798e157fb484b35" + " " + "px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full",
                                                                    children: category
                                                                }, index, false, {
                                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                    lineNumber: 616,
                                                                    columnNumber: 27
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-7798e157fb484b35" + " " + "text-gray-500",
                                                                children: "カテゴリーは登録されていません。"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                lineNumber: 624,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 613,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 611,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 610,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                        lineNumber: 606,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 605,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_condition mt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-7798e157fb484b35" + " " + "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-7798e157fb484b35" + " " + "w-24 text-gray-600 font-medium",
                                                children: "商品の状態"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 635,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-7798e157fb484b35" + " " + "text-gray-700 font-semibold",
                                                children: item.condition || "未登録"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 636,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                        lineNumber: 634,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 633,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_comment_history mt-10 border-t border-gray-200 pt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-7798e157fb484b35" + " " + "comment_count_flex flex justify-between items-center mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "jsx-7798e157fb484b35" + " " + "text-xl font-bold text-gray-800",
                                                    children: "コメント"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-7798e157fb484b35" + " " + "comments_count text-gray-500",
                                                    children: [
                                                        "(",
                                                        comments.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 646,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 644,
                                            columnNumber: 15
                                        }, this),
                                        comments && comments.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-7798e157fb484b35" + " " + "max-h-80 overflow-y-auto pr-2 pt-2 space-y-4",
                                            children: comments.map((comment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-7798e157fb484b35" + " " + "comment border-b border-gray-100 pb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-7798e157fb484b35" + " " + "comment_name_image flex items-center space-x-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: getAssetUrl(comment.user.user_image, true),
                                                                    alt: "プロフィール画像",
                                                                    onError: (e)=>onImageError(e, true),
                                                                    className: "jsx-7798e157fb484b35" + " " + "user_image_css w-10 h-10 rounded-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                    lineNumber: 659,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-7798e157fb484b35" + " " + "comment_name font-semibold text-gray-800",
                                                                    children: comment.user.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                                    lineNumber: 665,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 658,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-7798e157fb484b35" + " " + "comment-text ml-10 mt-1 text-gray-700 whitespace-pre-wrap",
                                                            children: comment.comment
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 669,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            className: "jsx-7798e157fb484b35" + " " + "text-xs ml-10 text-gray-500 block mt-1",
                                                            children: [
                                                                "投稿日時:",
                                                                " ",
                                                                new Date(comment.created_at).toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                            lineNumber: 672,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, comment.id, true, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 652,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-7798e157fb484b35" + " " + "mt-4 ml-5 text-gray-500 text-sm",
                                            children: "まだコメントはありません。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 680,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-7798e157fb484b35" + " " + "item_detail_comment_form mt-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-7798e157fb484b35" + " " + "comment_word text-xl font-bold text-gray-800 mb-4",
                                            children: "商品へのコメント"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 688,
                                            columnNumber: 15
                                        }, this),
                                        commentErrors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-7798e157fb484b35" + " " + "bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "jsx-7798e157fb484b35",
                                                children: commentErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "jsx-7798e157fb484b35" + " " + "text-sm",
                                                        children: err
                                                    }, index, false, {
                                                        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                        lineNumber: 697,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 695,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 694,
                                            columnNumber: 17
                                        }, this),
                                        isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: (e)=>{
                                                e.preventDefault();
                                                submitComment();
                                            },
                                            className: "jsx-7798e157fb484b35" + " " + "comment_form space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: newComment,
                                                    onChange: (e)=>setNewComment(e.target.value),
                                                    rows: 5,
                                                    placeholder: "コメントを入力してください",
                                                    className: "jsx-7798e157fb484b35" + " " + "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-700"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 713,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    className: "jsx-7798e157fb484b35" + " " + "w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200",
                                                    children: "コメントを送信する"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                    lineNumber: 720,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 706,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-7798e157fb484b35" + " " + "text-center p-4 border border-dashed rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                onClick: ()=>router.push("/login"),
                                                className: "jsx-7798e157fb484b35" + " " + "text-red-600 font-semibold cursor-pointer hover:underline",
                                                children: "ログインしてコメントする"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                                lineNumber: 729,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                            lineNumber: 728,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                                    lineNumber: 687,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                            lineNumber: 489,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                    lineNumber: 477,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
                lineNumber: 476,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "7798e157fb484b35",
                children: ".item_detail_contents.jsx-7798e157fb484b35{flex-wrap:wrap;justify-content:center;max-width:1400px;margin:0 auto;padding:20px;display:flex}.item_detail_image.jsx-7798e157fb484b35{width:50%;min-width:300px;max-width:450px;padding:50px}.item_detail_image1.jsx-7798e157fb484b35{aspect-ratio:1;object-fit:cover;object-position:center;width:100%;height:auto}.information.jsx-7798e157fb484b35{width:50%;min-width:300px;max-width:450px;padding:50px}.information.jsx-7798e157fb484b35 h2.jsx-7798e157fb484b35,.information.jsx-7798e157fb484b35 h3.jsx-7798e157fb484b35,.information.jsx-7798e157fb484b35 p.jsx-7798e157fb484b35{position:static;margin-left:0!important}.item_detail_brand.jsx-7798e157fb484b35{align-items:center;margin-top:10px;display:flex}.item_detail_brand_1.jsx-7798e157fb484b35{font-size:14px;font-weight:700}.item_detail_brand_2.jsx-7798e157fb484b35{font-size:14px;font-weight:600;position:relative;left:50px}.item_detail_price.jsx-7798e157fb484b35{margin-top:10px;margin-bottom:20px}.item_detail_price.jsx-7798e157fb484b35 h2.jsx-7798e157fb484b35{font-size:26px}.price_after.jsx-7798e157fb484b35{font-size:19px;font-weight:500}.explain_word.jsx-7798e157fb484b35{word-break:break-all;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word;margin-left:20px;font-size:14px;font-weight:600;line-height:1.6}.comments_count.jsx-7798e157fb484b35{margin-left:10px;font-size:14px;font-weight:400;position:relative;top:0}.comment.jsx-7798e157fb484b35{word-break:break-all;overflow-wrap:break-word;border-top:1px dashed #ccc;max-width:320px;margin-top:15px;padding-top:10px}.comment-text.jsx-7798e157fb484b35{white-space:pre-wrap;word-wrap:break-word;margin-left:50px;font-size:14px;font-weight:600;line-height:1.6}.comment_name_image.jsx-7798e157fb484b35{align-items:center;margin-bottom:5px;display:flex}.user_image_css.jsx-7798e157fb484b35{object-fit:cover;object-position:center;border-radius:50%;width:40px;height:40px;position:relative;left:0;overflow:hidden}.comment_name.jsx-7798e157fb484b35{font-size:17px;font-weight:700;position:relative;left:10px}.item_detail_comment_form.jsx-7798e157fb484b35 h2.jsx-7798e157fb484b35{margin-bottom:10px;font-size:18px;position:relative;top:8px}@media (width<=768px){.item_detail_image.jsx-7798e157fb484b35,.information.jsx-7798e157fb484b35{width:100%;max-width:100%;min-width:unset;padding:20px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/item/[item_id]/page.tsx",
        lineNumber: 475,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/compiled/client-only/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/node_modules/styled-jsx/dist/index/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.r("[project]/node_modules/next/dist/compiled/client-only/index.js [app-ssr] (ecmascript)");
var React = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
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
var isProd = typeof process !== "undefined" && process.env && ("TURBOPACK compile-time value", "development") === "production";
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
        var node = ("TURBOPACK compile-time value", "undefined") !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
        this._nonce = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
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
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && this._optimizeForSpeed) //TURBOPACK unreachable
        ;
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
        if ("TURBOPACK compile-time truthy", 1) {
            if (typeof index !== "number") {
                index = this._serverSheet.cssRules.length;
            }
            this._serverSheet.insertRule(rule, index);
            return this._rulesCount++;
        }
        //TURBOPACK unreachable
        ;
        var sheet;
        var insertionPoint;
    };
    _proto.replaceRule = function replaceRule(index, rule) {
        if (this._optimizeForSpeed || ("TURBOPACK compile-time value", "undefined") === "undefined") {
            var sheet = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : this._serverSheet;
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
        } else //TURBOPACK unreachable
        {
            var tag;
        }
        return index;
    };
    _proto.deleteRule = function deleteRule(index) {
        if ("TURBOPACK compile-time truthy", 1) {
            this._serverSheet.deleteRule(index);
            return;
        }
        //TURBOPACK unreachable
        ;
        var tag;
    };
    _proto.flush = function flush() {
        this._injected = false;
        this._rulesCount = 0;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            // simpler on server
            this._serverSheet.cssRules = [];
        }
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        if ("TURBOPACK compile-time truthy", 1) {
            return this._serverSheet.cssRules;
        }
        //TURBOPACK unreachable
        ;
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
    if ("TURBOPACK compile-time truthy", 1) {
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
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && !this._fromServer) //TURBOPACK unreachable
        ;
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
    var ref = React.useState(function() {
        return rootRegistry || configuredRegistry || createStyleRegistry();
    }), registry = ref[0];
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
var defaultRegistry = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
function JSXStyle(props) {
    var registry = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : useStyleRegistry();
    // If `registry` does not exist, we do nothing here.
    if (!registry) {
        return null;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        registry.add(props);
        return null;
    }
    //TURBOPACK unreachable
    ;
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
"[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/styled-jsx/dist/index/index.js [app-ssr] (ecmascript)").style;
}),
];

//# sourceMappingURL=_8469112a._.js.map