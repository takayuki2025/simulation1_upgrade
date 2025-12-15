module.exports = [
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
"[project]/src/services/itemService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useItemDetailSWR",
    ()=>useItemDetailSWR,
    "useItemsSWR",
    ()=>useItemsSWR,
    "useShopItemsSWR",
    ()=>useShopItemsSWR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
function useItemsSWR(tab, search, apiClient) {
    let url = "/item";
    if (tab === "mylist") {
        url = "/items/favorite";
    } else {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        url = `/item${params.toString() ? `?${params.toString()}` : ""}`;
    }
    const keyTag = apiClient ? "auth" : "public";
    const swrKey = [
        url,
        keyTag
    ];
    const swrFetcher = async ()=>{
        if (apiClient) {
            const response = await apiClient.get(url);
            return response.data;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/api${url}`);
        return response.data;
    };
    const swr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(swrKey, swrFetcher);
    return {
        items: swr.data?.items ?? [],
        isLoading: swr.isLoading,
        isError: swr.error,
        mutate: swr.mutate
    };
}
function useItemDetailSWR(itemId, apiClient) {
    const url = itemId ? `/item/${itemId}` : null;
    const keyTag = apiClient ? "auth" : "public";
    const swrKey = url ? [
        url,
        keyTag
    ] : null;
    const swrFetcher = async ()=>{
        if (!url) return null;
        if (apiClient) {
            const response = await apiClient.get(url);
            return response.data;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/api${url}`);
        return response.data;
    };
    const swr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(swrKey, swrFetcher);
    return {
        data: swr.data,
        item: swr.data?.item ?? null,
        comments: swr.data?.comments ?? [],
        isFavorited: swr.data?.is_favorited ?? false,
        favoritesCount: swr.data?.favorites_count ?? 0,
        isLoading: swr.isLoading,
        isError: swr.error,
        mutate: swr.mutate
    };
}
const useShopItemsSWR = (shopId, apiClient)=>{
    const url = shopId ? `/shops/${shopId}/items` : null;
    const key = url ? [
        url,
        apiClient ? "auth" : "public"
    ] : null;
    const fetcher = async ()=>{
        if (!url) return null;
        if (apiClient) {
            const res = await apiClient.get(url);
            return res.data;
        }
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/api${url}`);
        return res.data;
    };
    const swr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(key, fetcher);
    return {
        items: swr.data?.items ?? [],
        isLoading: swr.isLoading,
        isError: swr.error
    };
};
}),
"[project]/src/utils/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ======================================
// 画像タイプ Enum
// ======================================
__turbopack_context__.s([
    "BASE",
    ()=>BASE,
    "IMAGE_TYPE",
    ()=>IMAGE_TYPE,
    "getImageUrl",
    ()=>getImageUrl,
    "onImageError",
    ()=>onImageError
]);
var IMAGE_TYPE = /*#__PURE__*/ function(IMAGE_TYPE) {
    IMAGE_TYPE["USER"] = "user";
    IMAGE_TYPE["ITEM"] = "item";
    IMAGE_TYPE["OTHER"] = "other";
    return IMAGE_TYPE;
}({});
const BASE = ("TURBOPACK compile-time value", "") || "https://laravel.test";
const getImageUrl = (path, _type, cacheBuster)=>{
    if (!path) return "https://placehold.co/300x300?text=No+Image";
    // Laravel が返した public URL / public path はそのまま使う
    if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
        return cacheBuster ? `${path}?v=${cacheBuster}` : path;
    }
    // 想定外（保険）
    return cacheBuster ? `/${path}?v=${cacheBuster}` : `/${path}`;
};
const onImageError = (e, name)=>{
    const img = e.target;
    img.onerror = null;
    img.src = `https://placehold.co/300x300?text=${name}`;
};
}),
"[project]/app/(main)/W-Resource-Rich-Simulation-Center-Home.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__active",
  "cardLink": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__cardLink",
  "itemImage": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__itemImage",
  "itemImageWrapper": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__itemImageWrapper",
  "itemLink": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__itemLink",
  "item_info": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__item_info",
  "item_name": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__item_name",
  "item_price": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__item_price",
  "items_select": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__items_select",
  "items_select_all": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__items_select_all",
  "loadingBox": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__loadingBox",
  "loadingText": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__loadingText",
  "main_contents": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__main_contents",
  "main_select": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__main_select",
  "mylists": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__mylists",
  "no_items": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__no_items",
  "recs": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__recs",
  "shopButton": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__shopButton",
  "shopButtons": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__shopButtons",
  "sold_text": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__sold_text",
  "spin": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__spin",
  "spinner": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__spinner",
});
}),
"[project]/app/(main)/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$itemService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/itemService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/auth/useAuth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/(main)/W-Resource-Rich-Simulation-Center-Home.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
;
;
function Home() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, isLoading: isAuthLoading, apiClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const currentTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>searchParams.get("tab") === "mylist" ? "mylist" : "all", [
        searchParams
    ]);
    const currentSearchQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>searchParams.get("all_item_search") || "", [
        searchParams
    ]);
    const effectiveApiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (isAuthLoading) return null;
        if (isAuthenticated && apiClient) return apiClient;
        return null;
    }, [
        isAuthLoading,
        isAuthenticated,
        apiClient
    ]);
    const { items, isLoading: isItemsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$itemService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useItemsSWR"])(currentTab, currentSearchQuery, effectiveApiClient);
    const isPageLoading = isAuthLoading || isItemsLoading;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].main_contents,
        children: [
            isPageLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loadingBox,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spinner
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loadingText,
                        children: "読み込み中..."
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/page.tsx",
                lineNumber: 47,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].shopButtons,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop-a"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップA(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop-b"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップB(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop-c"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップC(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop-d"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップD(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/page.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            !isPageLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].main_select,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: {
                                    pathname: "/",
                                    query: {
                                        tab: "all",
                                        all_item_search: currentSearchQuery
                                    }
                                },
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recs} ${currentTab === "all" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""}`,
                                children: "すべて"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: {
                                    pathname: "/",
                                    query: {
                                        tab: "mylist"
                                    }
                                },
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mylists} ${currentTab === "mylist" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""}`,
                                children: "マイリスト"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].items_select,
                        children: items.length > 0 ? items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].items_select_all,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/item/${item.id}`,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cardLink,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].itemImageWrapper,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: item.item_image ?? undefined,
                                                    alt: item.name,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].itemImage,
                                                    onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 110,
                                                    columnNumber: 23
                                                }, this),
                                                item.remain === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sold_text,
                                                    children: "SOLD"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/page.tsx",
                                            lineNumber: 109,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].item_info,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].item_name,
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].item_price,
                                                    children: [
                                                        "¥",
                                                        item.price?.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/page.tsx",
                                            lineNumber: 121,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/page.tsx",
                                    lineNumber: 108,
                                    columnNumber: 19
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 107,
                                columnNumber: 17
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].no_items,
                            children: currentTab === "mylist" && !isAuthenticated ? "マイリストを見るにはログインが必要です。" : "該当する商品が見つかりませんでした。"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/page.tsx",
                            lineNumber: 131,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__879a95fb._.js.map