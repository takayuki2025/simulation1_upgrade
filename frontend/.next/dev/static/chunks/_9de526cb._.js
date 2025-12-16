(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/app/(main)/mypage/profile/W-ProfilePage.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "alert-success2": "W-ProfilePage-module__Td8J0G__alert-success2",
  "email_form": "W-ProfilePage-module__Td8J0G__email_form",
  "form-group": "W-ProfilePage-module__Td8J0G__form-group",
  "form-wrapper": "W-ProfilePage-module__Td8J0G__form-wrapper",
  "image_button_row": "W-ProfilePage-module__Td8J0G__image_button_row",
  "image_name": "W-ProfilePage-module__Td8J0G__image_name",
  "item_sell_contents_box_line": "W-ProfilePage-module__Td8J0G__item_sell_contents_box_line",
  "label_form_1": "W-ProfilePage-module__Td8J0G__label_form_1",
  "label_form_2": "W-ProfilePage-module__Td8J0G__label_form_2",
  "label_form_3": "W-ProfilePage-module__Td8J0G__label_form_3",
  "label_form_4": "W-ProfilePage-module__Td8J0G__label_form_4",
  "login_page": "W-ProfilePage-module__Td8J0G__login_page",
  "name_form": "W-ProfilePage-module__Td8J0G__name_form",
  "password_form": "W-ProfilePage-module__Td8J0G__password_form",
  "profile__error": "W-ProfilePage-module__Td8J0G__profile__error",
  "submit": "W-ProfilePage-module__Td8J0G__submit",
  "submit_form": "W-ProfilePage-module__Td8J0G__submit_form",
  "title": "W-ProfilePage-module__Td8J0G__title",
  "upload_submit": "W-ProfilePage-module__Td8J0G__upload_submit",
  "user_image_css": "W-ProfilePage-module__Td8J0G__user_image_css",
  "user_image_error_message": "W-ProfilePage-module__Td8J0G__user_image_error_message",
});
}),
"[project]/app/(main)/mypage/profile/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/auth/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/(main)/mypage/profile/W-ProfilePage.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function ProfilePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { user: authUser, apiClient, isAuthenticated, isLoading: isAuthLoading, logout, reloadUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const isVerificationRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProfilePage.useMemo[isVerificationRedirect]": ()=>searchParams.get("verified") === "true"
    }["ProfilePage.useMemo[isVerificationRedirect]"], [
        searchParams
    ]);
    const [profileUser, setProfileUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        post_number: "",
        address: "",
        building: ""
    });
    const [profileErrors, setProfileErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [imageError, setImageError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isFetching, setIsFetching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRecovering, setIsRecovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const verificationHandledRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const profileImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProfilePage.useMemo[profileImageUrl]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(profileUser?.user_image ?? null, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].USER, Date.now());
        }
    }["ProfilePage.useMemo[profileImageUrl]"], [
        profileUser?.user_image
    ]);
    const initializeProfileFromResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePage.useCallback[initializeProfileFromResponse]": (src)=>{
            const data = src?.user ?? src;
            setProfileUser(data);
            setForm({
                name: data.name ?? "",
                post_number: data.post_number ?? "",
                address: data.address ?? "",
                building: data.building ?? ""
            });
        }
    }["ProfilePage.useCallback[initializeProfileFromResponse]"], []);
    const fetchUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePage.useCallback[fetchUserProfile]": async (isRetry = false)=>{
            if (!apiClient) return;
            if (!isRetry) {
                setIsFetching(true);
                setSuccessMessage("");
                setProfileErrors({});
            }
            try {
                const res = await apiClient.get("/mypage/profile");
                initializeProfileFromResponse(res.data);
                setIsLoading(false);
                setIsRecovering(false);
            } catch (err) {
                const axiosErr = err;
                const status = axiosErr.response?.status;
                if (status === 401) {
                    // 認証切れ → ログアウトしてログインページへ
                    await logout();
                    router.replace("/login");
                    return;
                }
                setIsLoading(false);
            } finally{
                if (!isRetry) setIsFetching(false);
            }
        }
    }["ProfilePage.useCallback[fetchUserProfile]"], [
        apiClient,
        initializeProfileFromResponse,
        logout,
        router
    ]);
    // メール認証完了後の再同期（verified=true で遷移してきた場合）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfilePage.useEffect": ()=>{
            if (!isVerificationRedirect) return;
            if (verificationHandledRef.current) return;
            verificationHandledRef.current = true;
            const run = {
                "ProfilePage.useEffect.run": async ()=>{
                    try {
                        setIsRecovering(true);
                        await reloadUser();
                    } finally{
                        setIsRecovering(false);
                    }
                }
            }["ProfilePage.useEffect.run"];
            run();
        }
    }["ProfilePage.useEffect"], [
        isVerificationRedirect,
        reloadUser
    ]);
    // 認証状態 & apiClient が揃ったらプロフィール取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfilePage.useEffect": ()=>{
            if (isAuthLoading || isRecovering) return;
            if (!isAuthenticated || !apiClient) {
                router.replace("/login");
                return;
            }
            if (!profileUser && !isFetching) {
                fetchUserProfile();
            }
        }
    }["ProfilePage.useEffect"], [
        isAuthLoading,
        isRecovering,
        isAuthenticated,
        apiClient,
        profileUser,
        isFetching,
        fetchUserProfile,
        router
    ]);
    // プロフィール画像アップロード
    const handleImageUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file || !apiClient) return;
        setImageError("");
        setIsLoading(true);
        const formData = new FormData();
        formData.append("user_image", file);
        try {
            const res = await apiClient.post("/profile/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            initializeProfileFromResponse(res.data);
            setSuccessMessage("画像を更新しました！");
        } catch (err) {
            const msg = err?.response?.data?.errors?.user_image?.[0] ?? "画像アップロードに失敗しました。";
            setImageError(msg);
        } finally{
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    // プロフィール更新
    const handleProfileUpdate = async (e)=>{
        e.preventDefault();
        if (!apiClient) return;
        setProfileErrors({});
        setIsLoading(true);
        try {
            const res = await apiClient.patch("/profile", form);
            initializeProfileFromResponse(res.data);
            setSuccessMessage("プロフィールを更新しました！");
        } catch (err) {
            const status = err.response?.status;
            if (status === 422) {
                setProfileErrors(err.response?.data?.errors ?? {});
            } else if (status === 401) {
                await logout();
                router.replace("/login");
            } else {
                setSuccessMessage("更新時にエラーが発生しました。");
            }
        } finally{
            setIsLoading(false);
        }
    };
    // ローディング状態
    if (isAuthLoading || isLoading || isRecovering) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].login_page} max-w-[1400px] mx-auto pt-5 pb-10`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                    children: "プロフィール設定"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 234,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 mt-3",
                            children: isRecovering ? "セッションを再同期しています..." : "読み込み中..."
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
            lineNumber: 233,
            columnNumber: 7
        }, this);
    }
    // 認証エラー
    if (!isAuthenticated || !profileUser) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].login_page} max-w-[1400px] mx-auto pt-5 pb-10`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                    children: "プロフィール設定"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "認証エラーが発生しました。ログインし直してください。"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 250,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
            lineNumber: 248,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].login_page} max-w-[1400px] mx-auto pt-5 pb-10`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                children: "プロフィール設定"
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["form-wrapper"],
                children: [
                    successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["alert-success2"],
                        children: successMessage
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: (e)=>e.preventDefault(),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item_sell_contents_box_line,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image_name,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image_button_row,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: profileImageUrl,
                                                alt: "プロフィール画像",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].user_image_css
                                            }, profileUser.user_image || "default", false, {
                                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                                lineNumber: 274,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].upload_submit,
                                                onClick: ()=>fileInputRef.current?.click(),
                                                disabled: isLoading,
                                                children: "画像を選択する"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                                lineNumber: 280,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        name: "user_image",
                                        ref: fileInputRef,
                                        style: {
                                            display: "none"
                                        },
                                        onChange: handleImageUpload,
                                        accept: "image/*"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 290,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].user_image_error_message,
                                children: imageError
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleProfileUpdate,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["form-group"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "name",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].label_form_1,
                                        children: "ユーザー名"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 307,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "name",
                                        type: "text",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].name_form,
                                        name: "name",
                                        value: form.name,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 310,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile__error,
                                        children: profileErrors.name ? profileErrors.name[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 306,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["form-group"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "post_number",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].label_form_2,
                                        children: "郵便番号 (8桁、ハイフンあり)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 327,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "post_number",
                                        type: "text",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].email_form,
                                        name: "post_number",
                                        value: form.post_number,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    post_number: e.target.value
                                                })),
                                        placeholder: "例: 100-0001",
                                        maxLength: 8
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile__error,
                                        children: profileErrors.post_number ? profileErrors.post_number[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["form-group"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "address",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].label_form_3,
                                        children: "住所"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 349,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "address",
                                        type: "text",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].password_form,
                                        name: "address",
                                        value: form.address,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    address: e.target.value
                                                })),
                                        placeholder: "手動で入力してください"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 352,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile__error,
                                        children: profileErrors.address ? profileErrors.address[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["form-group"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "building",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].label_form_4,
                                        children: "建物名"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "building",
                                        type: "text",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].password_form,
                                        name: "building",
                                        value: form.building,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    building: e.target.value
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].profile__error,
                                        children: profileErrors.building ? profileErrors.building[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 383,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].submit,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "submit",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$mypage$2f$profile$2f$W$2d$ProfilePage$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].submit_form,
                                    value: "更新する",
                                    disabled: isLoading
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                    lineNumber: 389,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 388,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this)
        ]
    }, authUser?.id || "unauthenticated", true, {
        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
        lineNumber: 256,
        columnNumber: 5
    }, this);
}
_s(ProfilePage, "eh6690Wz7y8QpGEdKgavIo80nsU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ProfilePage;
var _c;
__turbopack_context__.k.register(_c, "ProfilePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_9de526cb._.js.map