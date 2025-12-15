(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/useItemDetailSWR.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useItemDetailSWR",
    ()=>useItemDetailSWR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const fetcher = (url)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(url).then((res)=>res.data);
const useItemDetailSWR = (itemId)=>{
    _s();
    const shouldFetch = typeof itemId === "number";
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(shouldFetch ? `/api/item/${itemId}` : null, fetcher);
    return {
        item: data?.item ?? null,
        comments: data?.comments ?? [],
        isFavorited: data?.is_favorited ?? false,
        favoritesCount: data?.favorites_count ?? 0,
        isLoading,
        isError: error,
        mutate
    };
};
_s(useItemDetailSWR, "VRI3YSxoWYZ/jyoKeeIu/AvyMKw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
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
//  API ベースURL（使わないが一応保持）
// ======================================
const STORAGE_BASE_URL = ("TURBOPACK compile-time value", "https://localhost/storage") ?? "https://localhost/storage";
function getImageUrl(path) {
    if (!path) {
        return "/images/no-image.png";
    }
    // すでに完全URLならそのまま返す（移行期対応）
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    return `${STORAGE_BASE_URL}/${path}`;
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/auth/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$useItemDetailSWR$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/useItemDetailSWR.ts [app-client] (ecmascript)");
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
    const { isAuthenticated, user, token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    /* =========================
     itemId 解決
  ========================= */ const itemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ItemDetailPage.useMemo[itemId]": ()=>{
            const raw = params.items_id;
            if (!raw) return null;
            const id = Array.isArray(raw) ? raw[0] : raw;
            const n = Number(id);
            return Number.isNaN(n) ? null : n;
        }
    }["ItemDetailPage.useMemo[itemId]"], [
        params.items_id
    ]);
    /* =========================
     Query
  ========================= */ const { item, comments, isFavorited, favoritesCount, isLoading, isError, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$useItemDetailSWR$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useItemDetailSWR"])(itemId);
    /* =========================
     状態
  ========================= */ const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentErrors, setCommentErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSubmittingComment, setIsSubmittingComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isOwner = isAuthenticated && user?.id === item?.user_id;
    const canInteract = isAuthenticated && !isOwner;
    const isSoldOut = item?.remain === 0;
    const totalLoading = isLoading;
    /* =========================
     Favorite Command
  ========================= */ const submitFavorite = async ()=>{
        if (!item) return;
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        await fetch(`/api/items/${item.id}/favorite`, {
            method: isFavorited ? "DELETE" : "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        mutate();
    };
    /* =========================
     Comment Command
  ========================= */ const submitComment = async ()=>{
        if (!item) return;
        if (!newComment.trim()) {
            setCommentErrors([
                "コメントを入力してください"
            ]);
            return;
        }
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        setIsSubmittingComment(true);
        setCommentErrors([]);
        try {
            await fetch("/api/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    item_id: item.id,
                    comment: newComment
                })
            });
            setNewComment("");
            mutate();
        } catch  {
            setCommentErrors([
                "コメント投稿に失敗しました"
            ]);
        } finally{
            setIsSubmittingComment(false);
        }
    };
    const navigateToPurchase = ()=>{
        if (!item) return;
        router.push(`/purchase/${item.id}`);
    };
    /* =========================
     ガード
  ========================= */ if (totalLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingText,
            children: "商品情報を読み込み中..."
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 122,
            columnNumber: 12
        }, this);
    }
    if (isError || !item) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].notFoundText,
            children: "商品が見つかりませんでした。"
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 126,
            columnNumber: 12
        }, this);
    }
    const itemCategories = Array.isArray(item.category) ? item.category : [];
    /* =========================
     JSX（デザインそのまま）
  ========================= */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            lineNumber: 140,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 139,
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
                                lineNumber: 150,
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
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brandValue,
                                        children: item.brand || "未登録"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceBlock,
                                children: isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceSoldOut,
                                    children: "SOLD OUT"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceYen,
                                            children: "¥"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 162,
                                            columnNumber: 19
                                        }, this),
                                        item.price?.toLocaleString(),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceAfter,
                                            children: " (税込)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 161,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 157,
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
                                                    lineNumber: 177,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disabledHeart,
                                                children: "🤍"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 186,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteCount,
                                                children: favoritesCount
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 188,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 171,
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
                                                lineNumber: 192,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentCount,
                                                children: comments.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (isOwner) router.push("/mypage");
                                    else if (!isAuthenticated) router.push("/login");
                                    else navigateToPurchase();
                                },
                                disabled: isSoldOut && !isOwner || totalLoading,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].purchaseBtn,
                                children: isOwner ? "マイページへ移動する" : !isAuthenticated ? "ログインして購入" : isSoldOut ? "SOLD OUT" : "カートへ"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 198,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 137,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_s(ItemDetailPage, "SRWTUFBFDqYKcmAUqbj/ucpvX4A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$useItemDetailSWR$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useItemDetailSWR"]
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

//# sourceMappingURL=_60880a57._.js.map