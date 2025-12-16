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
"[project]/app/(main)/purchase/[items_id]/W-Purchase-Confirm.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "addressBox": "W-Purchase-Confirm-module__XIHVLG__addressBox",
  "addressHeader": "W-Purchase-Confirm-module__XIHVLG__addressHeader",
  "errorText": "W-Purchase-Confirm-module__XIHVLG__errorText",
  "itemCard": "W-Purchase-Confirm-module__XIHVLG__itemCard",
  "itemImage": "W-Purchase-Confirm-module__XIHVLG__itemImage",
  "itemName": "W-Purchase-Confirm-module__XIHVLG__itemName",
  "itemPrice": "W-Purchase-Confirm-module__XIHVLG__itemPrice",
  "linkBtn": "W-Purchase-Confirm-module__XIHVLG__linkBtn",
  "loadingBox": "W-Purchase-Confirm-module__XIHVLG__loadingBox",
  "pageTitle": "W-Purchase-Confirm-module__XIHVLG__pageTitle",
  "purchaseBox": "W-Purchase-Confirm-module__XIHVLG__purchaseBox",
  "purchaseBtn": "W-Purchase-Confirm-module__XIHVLG__purchaseBtn",
  "radio": "W-Purchase-Confirm-module__XIHVLG__radio",
  "section": "W-Purchase-Confirm-module__XIHVLG__section",
  "sectionTitle": "W-Purchase-Confirm-module__XIHVLG__sectionTitle",
  "warnText": "W-Purchase-Confirm-module__XIHVLG__warnText",
  "wrapper": "W-Purchase-Confirm-module__XIHVLG__wrapper",
});
}),
"[project]/app/(main)/purchase/[items_id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PurchaseConfirmPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/auth/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$useItemDetailSWR$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/useItemDetailSWR.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/(main)/purchase/[items_id]/W-Purchase-Confirm.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function PurchaseConfirmPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const { isAuthenticated, isLoading: isAuthLoading, user, apiClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    /* =========================
     🧩 itemId 解決
  ========================= */ const itemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PurchaseConfirmPage.useMemo[itemId]": ()=>{
            const raw = params.items_id;
            const id = Array.isArray(raw) ? raw[0] : raw;
            const n = Number(id);
            return Number.isNaN(n) ? null : n;
        }
    }["PurchaseConfirmPage.useMemo[itemId]"], [
        params.items_id
    ]);
    /* =========================
     📦 Item Detail
  ========================= */ const { item, isLoading: isItemLoading, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$useItemDetailSWR$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useItemDetailSWR"])(itemId);
    /* =========================
     💳 支払い方法
  ========================= */ const [payment, setPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const canPurchase = isAuthenticated && !!item && item.remain > 0 && payment !== "" && !!user?.address;
    /* =========================
     🧠 ローディング判定
  ========================= */ const isPageLoading = isAuthLoading || isItemLoading;
    /* =========================
     🧾 Purchase Action
  ========================= */ const submitPurchase = async ()=>{
        if (!canPurchase || !item || !apiClient) return;
        try {
            if (payment === "card") {
                const res = await apiClient.post("/purchase/card", {
                    item_id: item.id
                });
                if (res.data?.stripe_url) {
                    window.location.href = res.data.stripe_url;
                    return;
                }
                throw new Error("Stripe URL が取得できませんでした");
            }
            if (payment === "convenience") {
                await apiClient.post("/purchase/convenience", {
                    item_id: item.id
                });
                router.push("/thanks/buy");
            }
        } catch (e) {
            console.error("purchase error:", e);
            alert("購入処理に失敗しました");
        }
    };
    /* =========================
     🛑 Guard
  ========================= */ if (isPageLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingBox,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                }, void 0, false, {
                    fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this);
    }
    if (isError || !item) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorText,
            children: "商品が見つかりませんでした。"
        }, void 0, false, {
            fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
            lineNumber: 101,
            columnNumber: 12
        }, this);
    }
    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }
    /* =========================
     🎨 UI
  ========================= */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pageTitle,
                children: "購入内容の確認"
            }, void 0, false, {
                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemCard,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item.item_image),
                        alt: item.name,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemImage
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemInfo,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemName,
                                children: item.name
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemPrice,
                                children: [
                                    "¥",
                                    item.price.toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].section,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                        children: "支払い方法"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].radio,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                value: "convenience",
                                checked: payment === "convenience",
                                onChange: ()=>setPayment("convenience")
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this),
                            "コンビニ払い"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].radio,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                value: "card",
                                checked: payment === "card",
                                onChange: ()=>setPayment("card")
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            "クレジットカード（Stripe）"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].section,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].addressHeader,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                children: "配送先"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].linkBtn,
                                onClick: ()=>router.push(`/purchase/address/${item.id}/${user.id}`),
                                children: "変更する"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    user?.address ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].addressBox,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "〒",
                                    user.post_number
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: user.address
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this),
                            user.building && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: user.building
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                                lineNumber: 173,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].warnText,
                        children: "配送先住所が未登録です"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].purchaseBox,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: submitPurchase,
                    disabled: !canPurchase,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$purchase$2f5b$items_id$5d2f$W$2d$Purchase$2d$Confirm$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].purchaseBtn,
                    children: "購入する"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/purchase/[items_id]/page.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_s(PurchaseConfirmPage, "FqxbtOXQdqe0ck0ZzoQV9vH/38k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$useItemDetailSWR$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useItemDetailSWR"]
    ];
});
_c = PurchaseConfirmPage;
var _c;
__turbopack_context__.k.register(_c, "PurchaseConfirmPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_93157fe7._.js.map