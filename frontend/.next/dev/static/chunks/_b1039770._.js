(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/itemService.ts [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/services/itemService.ts'\n\n'import', and 'export' cannot be used outside of module code");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/utils/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var IMAGE_TYPE = /*#__PURE__*/ function(IMAGE_TYPE) {
    IMAGE_TYPE["USER"] = "user";
    IMAGE_TYPE["ITEM"] = "item";
    IMAGE_TYPE["OTHER"] = "other";
    return IMAGE_TYPE;
}({});
const BASE = ("TURBOPACK compile-time value", "https://laravel.test") || "https://laravel.test";
const getImageUrl = (path, type = "other", cacheBuster)=>{
    if (!path) return "https://placehold.co/300x300?text=No+Image";
    // 外部 URL ならそのまま返す
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return cacheBuster ? `${path}?v=${cacheBuster}` : path;
    }
    // 種類別の prefix
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
"[project]/app/(main)/W-Resource-Rich-Simulation-Center-Home.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__active",
  "itemImage": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__itemImage",
  "itemImageWrapper": "W-Resource-Rich-Simulation-Center-Home-module__Ua7JVG__itemImageWrapper",
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
"[project]/app/(main)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$itemService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/itemService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/(main)/W-Resource-Rich-Simulation-Center-Home.module.css [app-client] (css module)"); // ← ★ CSS Modules 読み込み
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
function Home() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { apiClient, isAuthenticated, isLoading: isAuthLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const currentTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[currentTab]": ()=>searchParams.get("tab") === "mylist" ? "mylist" : "all"
    }["Home.useMemo[currentTab]"], [
        searchParams
    ]);
    const currentSearchQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[currentSearchQuery]": ()=>searchParams.get("all_item_search") || ""
    }["Home.useMemo[currentSearchQuery]"], [
        searchParams
    ]);
    const effectiveApiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[effectiveApiClient]": ()=>{
            if (isAuthenticated && apiClient) return apiClient;
            return null;
        }
    }["Home.useMemo[effectiveApiClient]"], [
        isAuthenticated,
        apiClient
    ]);
    const { items, isLoading: isItemsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$itemService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useItemsSWR"])(currentTab, currentSearchQuery, isAuthLoading ? null : effectiveApiClient);
    const isPageLoading = isAuthLoading || isItemsLoading;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].main_contents,
        children: [
            isPageLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingBox,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingText,
                        children: "読み込み中..."
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/page.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].shopButtons,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop_a"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップA(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop_b"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップB(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop_c"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップC(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/shops/shop_d"),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].shopButton,
                        children: "ショップD(テスト用リンク)"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/page.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            !isPageLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].main_select,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: {
                                    pathname: "/",
                                    query: {
                                        tab: "all",
                                        all_item_search: currentSearchQuery
                                    }
                                },
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].recs} ${currentTab === "all" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                                children: "すべて"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: {
                                    pathname: "/",
                                    query: {
                                        tab: "mylist"
                                    }
                                },
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mylists} ${currentTab === "mylist" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                                children: "マイリスト"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].items_select,
                        children: items.length > 0 ? items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].items_select_all,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/item/${item.id}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemImageWrapper,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item.item_image),
                                                    alt: item.name,
                                                    onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name),
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemImage
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 23
                                                }, this),
                                                item.remain === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sold_text,
                                                    children: "SOLD"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/page.tsx",
                                            lineNumber: 115,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item_info,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item_name,
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item_price,
                                                    children: [
                                                        "¥",
                                                        item.price?.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(main)/page.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/page.tsx",
                                            lineNumber: 128,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/page.tsx",
                                    lineNumber: 114,
                                    columnNumber: 19
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/app/(main)/page.tsx",
                                lineNumber: 113,
                                columnNumber: 17
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$W$2d$Resource$2d$Rich$2d$Simulation$2d$Center$2d$Home$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].no_items,
                            children: currentTab === "mylist" && !isAuthenticated ? "マイリストを見るにはログインが必要です。" : "該当する商品が見つかりませんでした。"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/page.tsx",
                            lineNumber: 138,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/page.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/page.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(Home, "/p+/a6xR/xa6t4g7uthN51rndWw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$itemService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useItemsSWR"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_b1039770._.js.map