(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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
// ======================================
//  API ベースURL
// ======================================
const BASE = ("TURBOPACK compile-time value", "https://laravel.test") || "https://laravel.test";
const getImageUrl = (path, type = "other", cacheBuster)=>{
    if (!path) return "https://placehold.co/300x300?text=No+Image";
    // 外部 URL の場合はそのまま
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return cacheBuster ? `${path}?v=${cacheBuster}` : path;
    }
    // 種類に応じてパスを決定
    let prefix = "";
    switch(type){
        case "user":
            prefix = "/storage/user_images";
            break;
        case "item":
            prefix = "/storage/item_images";
            break;
        default:
            prefix = "/storage/other";
    }
    // ✨ ここが重要：BASE を使わない（Nginx が返すため）
    const url = `${prefix}/${path}`;
    return cacheBuster ? `${url}?v=${cacheBuster}` : url;
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
"[project]/app/(main)/item/[items_id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ItemDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/utils.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './ItemDetailView.module.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
    const { user, apiClient, isAuthenticated, isLoading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    /* ---------- state ---------- */ const [item, setItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isFavorited, setIsFavorited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [favoritesCount, setFavoritesCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [itemErrors, setItemErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentErrors, setCommentErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSubmittingComment, setIsSubmittingComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const commentAbortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hasFetchedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    /* ---------- itemId ---------- */ const itemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[itemId]": ()=>{
            const raw = params.items_id;
            if (!raw) return null;
            const idString = Array.isArray(raw) ? raw[0] : raw;
            if (!idString) return null;
            const parsed = Number(idString);
            return Number.isNaN(parsed) ? null : parsed;
        }
    }["ItemDetailPage.useMemo[itemId]"], [
        params.items_id
    ]);
    /* ---------- computed ---------- */ const isOwner = isAuthenticated && user?.id === item?.user_id;
    const canInteract = isAuthenticated && !isOwner;
    const isSoldOut = (item?.remain ?? 0) < 1;
    const itemCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[itemCategories]": ()=>{
            if (!item?.category) return [];
            try {
                const parsed = JSON.parse(item.category);
                return Array.isArray(parsed) ? parsed : [
                    item.category
                ];
            } catch  {
                return [
                    item.category
                ];
            }
        }
    }["ItemDetailPage.useMemo[itemCategories]"], [
        item
    ]);
    const fullItemImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[fullItemImageUrl]": ()=>{
            const img = item?.item_image ?? null; // undefined → null
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(img, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].ITEM, 0);
        }
    }["ItemDetailPage.useMemo[fullItemImageUrl]"], [
        item?.item_image
    ]);
    /* ============================
     API: Fetch Item Detail
============================ */ const fetchItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ItemDetailPage.useCallback[fetchItem]": async (id)=>{
            setIsLoading(true);
            setError("");
            setItemErrors([]);
            try {
                let data;
                if (isAuthenticated && apiClient) {
                    const res = await apiClient.get(`/item/${id}`);
                    data = res.data;
                } else {
                    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${("TURBOPACK compile-time value", "https://laravel.test")}/api/item/${id}`);
                    data = res.data;
                }
                if (!data.item) {
                    setError("商品情報が取得できませんでした。");
                    return;
                }
                setItem(data.item);
                setIsFavorited(data.is_favorited);
                setFavoritesCount(data.favorites_count);
                setComments(data.comments);
            } catch (e) {
                console.error(e);
                setError("商品情報の取得に失敗しました。");
            } finally{
                setIsLoading(false);
            }
        }
    }["ItemDetailPage.useCallback[fetchItem]"], [
        apiClient,
        isAuthenticated
    ]);
    /* ============================
     Effect: Load Item
============================ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ItemDetailPage.useEffect": ()=>{
            if (!itemId) {
                setError("商品IDが不正です");
                setIsLoading(false);
                return;
            }
            if (authLoading) return;
            if (hasFetchedRef.current) return;
            hasFetchedRef.current = true;
            fetchItem(itemId);
        }
    }["ItemDetailPage.useEffect"], [
        itemId,
        authLoading,
        fetchItem
    ]);
    /* ============================
     Favorite
============================ */ const submitFavorite = async ()=>{
        if (!item) return;
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (isOwner) {
            setItemErrors([
                "ご自身の商品です。"
            ]);
            return;
        }
        const before = isFavorited;
        setIsFavorited(!before);
        setFavoritesCount((p)=>before ? p - 1 : p + 1);
        try {
            await apiClient?.request({
                method: before ? "DELETE" : "POST",
                url: `/items/${item.id}/favorite`
            });
        } catch  {
            setIsFavorited(before);
            setFavoritesCount((p)=>before ? p + 1 : p - 1);
        }
    };
    /* ============================
     Comment
============================ */ const submitComment = async ()=>{
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (!item) return;
        if (!newComment.trim()) {
            setCommentErrors([
                "コメントを入力してください"
            ]);
            return;
        }
        if (commentAbortControllerRef.current) {
            commentAbortControllerRef.current.abort();
        }
        const controller = new AbortController();
        commentAbortControllerRef.current = controller;
        setIsSubmittingComment(true);
        setCommentErrors([]);
        try {
            const res = await apiClient?.post("/comment", {
                item_id: item.id,
                comment: newComment
            }, {
                signal: controller.signal
            });
            const posted = res?.data.comment;
            if (posted) {
                setComments((prev)=>[
                        ...prev,
                        {
                            id: posted.id,
                            comment: posted.comment,
                            created_at: posted.created_at,
                            user: posted.user ?? {
                                id: user.id,
                                name: user.name,
                                user_image: user.user_image || null
                            }
                        }
                    ]);
                setNewComment("");
            }
        } catch (e) {
            if (e.code !== "ERR_CANCELED") {
                setCommentErrors([
                    "コメント投稿に失敗しました"
                ]);
            }
        } finally{
            setIsSubmittingComment(false);
            commentAbortControllerRef.current = null;
        }
    };
    /* ============================
     Navigation
============================ */ const navigateToPurchase = ()=>{
        if (isOwner) return router.push("/mypage");
        if (isAuthenticated && item) return router.push(`/purchase/${item.id}`);
        return router.push("/login");
    };
    const loading = isLoading || authLoading;
    /* ============================
     Render
============================ */ if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mt-20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "読み込み中..."
            }, void 0, false, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 283,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 282,
            columnNumber: 7
        }, this);
    }
    if (error || itemErrors.length > 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mt-20 text-red-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                    lineNumber: 291,
                    columnNumber: 9
                }, this),
                itemErrors.map((e, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: e
                    }, idx, false, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 290,
            columnNumber: 7
        }, this);
    }
    if (!item) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mt-20 text-gray-500",
            children: "商品が見つかりませんでした"
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 301,
            columnNumber: 7
        }, this);
    }
    /* ============================
     Main View
============================ */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: styles.itemDetailWrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: styles.itemDetailContents,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: styles.card,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: styles.imageArea,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: fullItemImageUrl,
                            className: styles.mainImage,
                            onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name)
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                            lineNumber: 316,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 315,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: styles.infoArea,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: styles.itemName,
                                children: item.name
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 325,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: styles.itemBrandValue,
                                children: item.brand ?? "未登録"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 327,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.priceBox,
                                children: isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: styles.priceSoldOut,
                                    children: "SOLD OUT"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 331,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: styles.priceValue,
                                    children: [
                                        "¥",
                                        item.price?.toLocaleString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 333,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 329,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: submitFavorite,
                                className: styles.favoriteButton,
                                disabled: !canInteract,
                                children: [
                                    isFavorited ? "❤️" : "🤍",
                                    " ",
                                    favoritesCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: navigateToPurchase,
                                className: styles.purchaseButton,
                                children: isOwner ? "マイページへ" : isSoldOut ? "SOLD OUT" : isAuthenticated ? "カートへ" : "ログインして購入"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 349,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.explainBox,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: item.explain
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 364,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 363,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.categoryBox,
                                children: itemCategories.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: styles.categoryTag,
                                        children: c
                                    }, i, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.commentHistory,
                                children: comments.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: styles.commentItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: c.user.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 380,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: c.comment
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 381,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, c.id, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 379,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this),
                            isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.commentForm,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: newComment,
                                        onChange: (e)=>setNewComment(e.target.value),
                                        className: styles.commentTextarea
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 389,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: submitComment,
                                        disabled: isSubmittingComment,
                                        className: styles.commentButton,
                                        children: "投稿する"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 394,
                                        columnNumber: 17
                                    }, this),
                                    commentErrors.map((err, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm",
                                            children: err
                                        }, idx, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 402,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 388,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center text-red-500 mt-4",
                                children: "ログインしてコメントする"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 408,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 324,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 313,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 312,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
        lineNumber: 311,
        columnNumber: 5
    }, this);
}
_s(ItemDetailPage, "NcgjfTKpZ8n+1KuAkbl04DevsGQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ItemDetailPage;
var _c;
__turbopack_context__.k.register(_c, "ItemDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_2cf56879._.js.map