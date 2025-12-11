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
const BASE = ("TURBOPACK compile-time value", "/api") || "https://laravel.test";
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
"[project]/app/(main)/mypage/W-Mypage.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active_tab": "W-Mypage-module__zxeXQG__active_tab",
  "alert_success": "W-Mypage-module__zxeXQG__alert_success",
  "inactive_tab": "W-Mypage-module__zxeXQG__inactive_tab",
  "item_details": "W-Mypage-module__zxeXQG__item_details",
  "items_select": "W-Mypage-module__zxeXQG__items_select",
  "items_select_all": "W-Mypage-module__zxeXQG__items_select_all",
  "profile_header": "W-Mypage-module__zxeXQG__profile_header",
  "profile_header_1": "W-Mypage-module__zxeXQG__profile_header_1",
  "profile_header_2": "W-Mypage-module__zxeXQG__profile_header_2",
  "profile_page": "W-Mypage-module__zxeXQG__profile_page",
  "user_image_css": "W-Mypage-module__zxeXQG__user_image_css",
  "user_name_large_shift": "W-Mypage-module__zxeXQG__user_name_large_shift",
});
}),
"[project]/app/(main)/mypage/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Mypage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/(main)/mypage/W-Mypage.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function Mypage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { user: authUser, isAuthenticated, isLoading: isAuthLoading, apiClient, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const page = searchParams.get("page") === "buy" ? "buy" : "sell";
    const isVerificationRedirect = searchParams.get("verified") === "true";
    const normalizeItem = (raw)=>{
        if (raw.item) {
            return {
                id: raw.item.id,
                name: raw.item.name,
                item_image: raw.item.item_image ?? null,
                remain: raw.item.remain
            };
        }
        return {
            id: raw.id,
            name: raw.name,
            item_image: raw.item_image ?? null,
            remain: raw.remain
        };
    };
    /* ============================
    プロフィール取得
  ============================ */ const fetchUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Mypage.useCallback[fetchUserProfile]": async ()=>{
            // ... 認証チェックは省略 ...
            if (!apiClient) return;
            setIsLoading(true);
            try {
                const res = await apiClient.get("/mypage/profile");
                // ★★★ 修正箇所 ★★★
                // APIが { user: {...} } 形式でなければ res.data を直接使用
                const profileData = res.data.user || res.data;
                setUser(profileData);
                if (isVerificationRedirect) {
                    setSuccessMessage("メール認証が完了しました！");
                    router.replace(`/mypage?page=${page}`);
                }
            } catch (e) {
                console.error("Failed to fetch profile:", e);
                if (e.response?.status === 401) await logout();
            } finally{
                setIsLoading(false);
            }
        }
    }["Mypage.useCallback[fetchUserProfile]"], [
        isAuthenticated,
        apiClient,
        page,
        isVerificationRedirect,
        logout,
        router
    ]);
    /* ============================
    アイテム取得
  ============================ */ const fetchItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Mypage.useCallback[fetchItems]": async ()=>{
            if (!user || !apiClient) return;
            setIsLoading(true);
            try {
                const endpoint = page === "sell" ? "/mypage/sell" : "/api/mypage/bought";
                const res = await apiClient.get(endpoint);
                const rawItems = res.data.items ?? [];
                setItems(rawItems.map(normalizeItem));
            } catch (e) {
                if (e.response?.status === 401) await logout();
            } finally{
                setIsLoading(false);
            }
        }
    }["Mypage.useCallback[fetchItems]"], [
        user,
        apiClient,
        page,
        logout
    ]);
    /* ============================
    useEffect
  ============================ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mypage.useEffect": ()=>{
            if (!isAuthLoading) fetchUserProfile();
        }
    }["Mypage.useEffect"], [
        isAuthLoading,
        fetchUserProfile
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mypage.useEffect": ()=>{
            if (user) fetchItems();
        }
    }["Mypage.useEffect"], [
        user,
        page,
        fetchItems
    ]);
    /* ============================
    UI： ローディング
  ============================ */ if (isAuthLoading || isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-64",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin h-10 w-10 border-t-4 border-red-500 rounded-full"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/page.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-4 text-gray-500",
                    children: "読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/page.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/page.tsx",
            lineNumber: 162,
            columnNumber: 7
        }, this);
    }
    /* ============================
    UI： 未認証
  ============================ */ if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xl text-red-500",
                children: "認証情報が確認できません。"
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 175,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/mypage/page.tsx",
            lineNumber: 174,
            columnNumber: 7
        }, this);
    }
    /* ============================
    UI： メイン
  ============================ */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile_page,
        children: [
            successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].alert_success,
                children: successMessage
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 186,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile_header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile_header_1,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(user.user_image ?? null, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].USER),
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].user_image_css,
                                onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, user.name)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: `text-2xl font-bold ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].user_name_large_shift}`,
                                children: user.name
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/mypage/profile"),
                                className: "ml-auto px-4 py-2 border border-red-500 text-red-500 rounded",
                                children: "プロフィールを編集"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile_header_2,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/mypage?page=sell",
                                className: page === "sell" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active_tab : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inactive_tab,
                                children: "出品した商品"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/mypage?page=buy",
                                className: `ml-8 ${page === "buy" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active_tab : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inactive_tab}`,
                                children: "購入した商品"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].items_select,
                children: items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "col-span-full text-center text-gray-500",
                    children: page === "sell" ? "出品した商品はありません。" : "購入した商品はありません。"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/page.tsx",
                    lineNumber: 235,
                    columnNumber: 11
                }, this) : items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].items_select_all,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/item/${item.id}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item.item_image ?? null, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].ITEM),
                                    alt: item.name,
                                    onError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onImageError"])(e, item.name)
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/mypage/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$W$2d$Mypage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item_details,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/mypage/page.tsx",
                                            lineNumber: 250,
                                            columnNumber: 19
                                        }, this),
                                        item.remain === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500 font-bold",
                                            children: "sold"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/mypage/page.tsx",
                                            lineNumber: 252,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/mypage/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(main)/mypage/page.tsx",
                            lineNumber: 243,
                            columnNumber: 15
                        }, this)
                    }, item.id, false, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 242,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/mypage/page.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_s(Mypage, "vqyMH9GF1RzE2Rx55E/T1vLUf7w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Mypage;
var _c;
__turbopack_context__.k.register(_c, "Mypage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_7fe2e067._.js.map