(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(auth)/email/verify/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VerifyEmailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/axios/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const CHECK_INTERVAL_MS = 3000;
const AFTER_SUCCESS_REDIRECT = "/mypage/profile?verified=true";
function VerifyEmailPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { user, firebaseUser, reloadAuthToken, apiClient, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [statusMessage, setStatusMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFinalizing, setIsFinalizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isResending, setIsResending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const verifyUrl = searchParams.get("redirect");
    /* ============================================================
     Step 1: Laravel verifyURL にジャンプ
  ============================================================ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VerifyEmailPage.useEffect": ()=>{
            if (verifyUrl) {
                window.location.href = verifyUrl;
            }
        }
    }["VerifyEmailPage.useEffect"], [
        verifyUrl
    ]);
    /* ============================================================
     Step 2: Firebase の emailVerified をポーリング
  ============================================================ */ const beginPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VerifyEmailPage.useCallback[beginPolling]": ()=>{
            if (intervalRef.current !== null) return;
            intervalRef.current = window.setInterval({
                "VerifyEmailPage.useCallback[beginPolling]": async ()=>{
                    try {
                        await firebaseUser?.reload();
                    } catch  {}
                }
            }["VerifyEmailPage.useCallback[beginPolling]"], CHECK_INTERVAL_MS);
        }
    }["VerifyEmailPage.useCallback[beginPolling]"], [
        firebaseUser
    ]);
    const stopPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VerifyEmailPage.useCallback[stopPolling]": ()=>{
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }["VerifyEmailPage.useCallback[stopPolling]"], []);
    /* ============================================================
     Step 3: 最終確定（Laravel Token 再発行）
  ============================================================ */ const finalize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VerifyEmailPage.useCallback[finalize]": async ()=>{
            if (isFinalizing) return;
            setIsFinalizing(true);
            setStatusMessage(null);
            try {
                console.log("🔥 [VerifyEmail] Finalizing → reloadAuthToken()");
                await reloadAuthToken(); // ← 最重要（Sanctum Token 再発行 & Laravel user 更新）
                router.replace(AFTER_SUCCESS_REDIRECT);
            } catch (err) {
                console.error("Verify finalize error:", err);
                setStatusMessage("認証の確定に失敗しました。再ログインしてください。");
            } finally{
                setIsFinalizing(false);
            }
        }
    }["VerifyEmailPage.useCallback[finalize]"], [
        reloadAuthToken,
        router,
        isFinalizing
    ]);
    /* ============================================================
     Step 4: 状態監視
  ============================================================ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VerifyEmailPage.useEffect": ()=>{
            if (isLoading) return;
            // Firebase または Laravel のどちらか verified → OK
            if (firebaseUser?.emailVerified || user?.emailVerified) {
                stopPolling();
                finalize();
                return;
            }
            // 未 verified → ポーリング
            beginPolling();
            return ({
                "VerifyEmailPage.useEffect": ()=>stopPolling()
            })["VerifyEmailPage.useEffect"];
        }
    }["VerifyEmailPage.useEffect"], [
        isLoading,
        user,
        firebaseUser,
        beginPolling,
        stopPolling,
        finalize
    ]);
    /* ============================================================
     認証メール再送 API（Laravel 標準ルート）
  ============================================================ */ const handleResend = async ()=>{
        if (!apiClient) {
            setStatusMessage("API クライアントが初期化されていません。");
            return;
        }
        setIsResending(true);
        setStatusMessage(null);
        try {
            await apiClient.post("/email/verification-notification"); // ← Laravel 標準
            setStatusMessage("新しい認証メールを送信しました。");
        } catch (err) {
            let msg = "メール再送に失敗しました。";
            if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                msg = err.response?.data?.message || err.message;
            } else {
                msg = String(err);
            }
            setStatusMessage(msg);
        } finally{
            setIsResending(false);
        }
    };
    if (isLoading || isFinalizing) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gray-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-600"
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-3 text-lg text-gray-700",
                    children: isFinalizing ? "認証を確定しています..." : "読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 129,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(auth)/email/verify/page.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex justify-center items-start pt-20 bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-xl p-8 bg-white rounded-lg shadow-xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-3xl font-extrabold text-indigo-600 mb-6 border-b-2 pb-3 text-center",
                    children: "💌 メール認証のお願い"
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xl text-center text-gray-700",
                    children: "ご登録ありがとうございます！"
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-2 text-center text-gray-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-blue-700",
                            children: user?.email
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/email/verify/page.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this),
                        " ",
                        "宛に認証メールを送信しました。"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this),
                statusMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 p-3 bg-green-100 border border-green-300 text-green-700 text-center rounded",
                    children: statusMessage
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 153,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "http://localhost:8025",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-block px-6 py-2 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800 transition",
                        children: "開発用: MailHog を開く"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/email/verify/page.tsx",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: (e)=>{
                        e.preventDefault();
                        handleResend();
                    },
                    className: "mt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isResending,
                        className: "w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400",
                        children: isResending ? "送信中..." : "認証メールを再送する"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/email/verify/page.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(auth)/email/verify/page.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(auth)/email/verify/page.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_s(VerifyEmailPage, "L1gwAm3CmYXGML1e33nRQu2UROM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = VerifyEmailPage;
var _c;
__turbopack_context__.k.register(_c, "VerifyEmailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/axios/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Axios",
    ()=>Axios,
    "AxiosError",
    ()=>AxiosError,
    "AxiosHeaders",
    ()=>AxiosHeaders,
    "Cancel",
    ()=>Cancel,
    "CancelToken",
    ()=>CancelToken,
    "CanceledError",
    ()=>CanceledError,
    "HttpStatusCode",
    ()=>HttpStatusCode,
    "VERSION",
    ()=>VERSION,
    "all",
    ()=>all,
    "formToJSON",
    ()=>formToJSON,
    "getAdapter",
    ()=>getAdapter,
    "isAxiosError",
    ()=>isAxiosError,
    "isCancel",
    ()=>isCancel,
    "mergeConfig",
    ()=>mergeConfig,
    "spread",
    ()=>spread,
    "toFormData",
    ()=>toFormData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const { Axios, AxiosError, CanceledError, isCancel, CancelToken, VERSION, all, Cancel, isAxiosError, spread, toFormData, AxiosHeaders, HttpStatusCode, formToJSON, getAdapter, mergeConfig } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
;
}),
]);

//# sourceMappingURL=_f6eb8fdd._.js.map