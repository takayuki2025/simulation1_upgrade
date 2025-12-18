(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/useItemDetailSWR.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useItemDetailSWR",
    ()=>useItemDetailSWR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/auth/useAuth.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
const useItemDetailSWR = (itemId)=>{
    _s();
    const { apiClient, isLoading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const shouldFetch = typeof itemId === "number" && !authLoading;
    const fetcher = async (url)=>{
        // 🔐 ログイン済み → apiClient（Bearer 付き）
        if (apiClient) {
            const res = await apiClient.get(url.replace("/api", ""));
            return res.data;
        }
        // 👤 未ログイン → 通常 axios
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(url);
        return res.data;
    };
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(shouldFetch ? `/api/item/${itemId}` : null, fetcher);
    return {
        item: data?.item ?? null,
        comments: data?.comments ?? [],
        isFavorited: data?.isFavorited ?? false,
        favoritesCount: data?.favoritesCount ?? 0,
        isLoading: isLoading || authLoading,
        isError: error,
        mutate
    };
};
_s(useItemDetailSWR, "qGkU2gM+IslHVUkvUaGjMuCqWnE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
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
// IMAGE TYPE（fallback 用）
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
// Backend Base URL
// ======================================
const BACKEND_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BACKEND_URL ?? "https://localhost";
// ======================================
// Fallback Images（実在パス）
// ======================================
const DEFAULT_USER_IMAGE = `${BACKEND_BASE_URL}/pictures_user/default-profile2.jpg`;
const DEFAULT_ITEM_IMAGE = `${BACKEND_BASE_URL}/storage/pictures/no-image.png`;
function getImageUrl(path, type = "other") {
    // --- 未設定 ---
    if (!path) {
        if (type === "user") return DEFAULT_USER_IMAGE;
        return DEFAULT_ITEM_IMAGE;
    }
    // --- 完全 URL ---
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    // --- /storage から始まる ---
    if (path.startsWith("/storage/")) {
        return `${BACKEND_BASE_URL}${path}`;
    }
    // --- pictures_user（storage 不要） ---
    if (path.startsWith("pictures_user/")) {
        return `${BACKEND_BASE_URL}/${path}`;
    }
    // --- item_images / pictures は storage 配下 ---
    if (path.startsWith("item_images/") || path.startsWith("pictures/")) {
        return `${BACKEND_BASE_URL}/storage/${path}`;
    }
    // --- その他（保険） ---
    return `${BACKEND_BASE_URL}/${path}`;
}
const onImageError = (e)=>{
    const img = e.currentTarget;
    img.onerror = null;
    img.src = "https://placehold.co/300x300?text=No+Image";
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$config$2d$context$2d$12s$2d$Dh3trQsc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__j__as__mutate$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/_internal/config-context-12s-Dh3trQsc.mjs [app-client] (ecmascript) <export j as mutate>");
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
;
function ItemDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
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
     Optimistic UI State
  ========================= */ const [localFavorited, setLocalFavorited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [localCount, setLocalCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /* =========================
     Comment Local State
  ========================= */ const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentErrors, setCommentErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSubmittingComment, setIsSubmittingComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isAuthenticated = auth.isAuthenticated;
    const user = auth.user;
    const isOwner = isAuthenticated && user?.id === item?.user_id;
    const canInteract = isAuthenticated && !isOwner;
    const isSoldOut = item?.remain === 0;
    /* =========================
     表示用 Reaction 状態
  ========================= */ const displayedFavorited = localFavorited !== null ? localFavorited : isFavorited;
    const displayedCount = localCount !== null ? localCount : favoritesCount;
    /* =========================
     Favorite Command
  ========================= */ const submitFavorite = async ()=>{
        if (!item) return;
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        const next = !displayedFavorited;
        // optimistic update
        setLocalFavorited(next);
        setLocalCount((prev)=>(prev ?? favoritesCount) + (next ? 1 : -1));
        try {
            await auth.apiClient(`/items/${item.id}/favorite`, {
                method: next ? "POST" : "DELETE"
            });
            // 🔥 両方同期
            mutate(); // item detail
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$config$2d$context$2d$12s$2d$Dh3trQsc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__j__as__mutate$3e$__["mutate"])((key)=>Array.isArray(key) && key[0] === "favorite-items");
        } catch  {
            setLocalFavorited(isFavorited);
            setLocalCount(favoritesCount);
        }
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
            await auth.apiClient.post("/comment", {
                item_id: item.id,
                comment: newComment
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
     Guard
  ========================= */ if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingText,
            children: "商品情報を読み込み中..."
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 144,
            columnNumber: 12
        }, this);
    }
    if (isError || !item) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].notFoundText,
            children: "商品が見つかりませんでした。"
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 148,
            columnNumber: 12
        }, this);
    }
    const itemCategories = Array.isArray(item.category) ? item.category : [];
    /* =========================
     JSX（省略なし）
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
                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item.item_image),
                            onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name),
                            alt: "商品写真",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 161,
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
                                lineNumber: 173,
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
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brandValue,
                                        children: item.brand || "未登録"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceBlock,
                                children: isSoldOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceSoldOut,
                                    children: "SOLD OUT"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceYen,
                                            children: "¥"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 187,
                                            columnNumber: 19
                                        }, this),
                                        item.price?.toLocaleString(),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceAfter,
                                            children: " (税込)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                            lineNumber: 189,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 182,
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
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteIcon} ${displayedFavorited ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteActive : ""}`,
                                                    children: displayedFavorited ? "❤️" : "🤍"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 198,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disabledHeart,
                                                children: "🤍"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 211,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favoriteCount,
                                                children: displayedCount
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 196,
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
                                                lineNumber: 218,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentCount,
                                                children: comments.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 219,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 195,
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
                                    disabled: isSoldOut && !isOwner || isLoading,
                                    className: `w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${!isSoldOut ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`,
                                    children: isOwner ? "マイページへ移動する" : !isAuthenticated ? "ログインして購入" : isSoldOut ? "SOLD OUT" : "カートへ"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 224,
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
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].explainText,
                                        children: item.explain
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 253,
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
                                        lineNumber: 260,
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
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryList,
                                                children: itemCategories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryTag,
                                                        children: category
                                                    }, index, false, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 266,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].conditionRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].conditionLabel,
                                                children: "商品の状態"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 274,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].conditionValue,
                                                children: item.condition || "未登録"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 259,
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
                                                lineNumber: 284,
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
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 283,
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
                                                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(comment.user.user_image, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].USER),
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentUserImage,
                                                                onError: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"]
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                lineNumber: 295,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentUserName,
                                                                children: comment.user.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                                lineNumber: 303,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].commentText,
                                                        children: comment.comment
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                        lineNumber: 308,
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
                                                        lineNumber: 310,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, comment.id, true, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 293,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 291,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].noComments,
                                        children: "まだコメントはありません。"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 318,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 282,
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
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this),
                                    commentErrors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorBoxSmall,
                                        children: commentErrors.map((err, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: err
                                            }, index, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 329,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                        lineNumber: 327,
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
                                                lineNumber: 336,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$item$2f5b$items_id$5d2f$W$2d$ItemDetailView$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].submitBtn,
                                                onClick: submitComment,
                                                disabled: isSubmittingComment,
                                                children: isSubmittingComment ? "投稿中..." : "コメントを送信する"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                                lineNumber: 343,
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
                                        lineNumber: 352,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                                lineNumber: 323,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                        lineNumber: 171,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
                lineNumber: 159,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
            lineNumber: 158,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(main)/item/[items_id]/page.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}
_s(ItemDetailPage, "pZV+BVgoamS8A4SBxVkllEtJlFs=", false, function() {
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
"[project]/node_modules/swr/dist/_internal/config-context-12s-Dh3trQsc.mjs [app-client] (ecmascript) <export j as mutate>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mutate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$config$2d$context$2d$12s$2d$Dh3trQsc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["j"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$config$2d$context$2d$12s$2d$Dh3trQsc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/_internal/config-context-12s-Dh3trQsc.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_cd6bdec4._.js.map