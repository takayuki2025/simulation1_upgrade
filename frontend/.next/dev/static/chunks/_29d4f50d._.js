(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(auth)/email/verify/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VerifyEmailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// Next.js Router
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
// Axiosの型定義（AxiosError）のみをインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/axios/index.js [app-client] (ecmascript) <locals>");
// カスタムフックから認証状態とAPIクライアントを取得
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// --- ユーティリティ: エラーハンドリングのための型述語 ---
// 💡 catchブロックのerrorを安全に扱うためのプロフェッショナルな解決策
const isErrorWithMessage = (error)=>{
    return typeof error === "object" && error !== null && "message" in error && typeof error.message === "string";
};
const toErrorMessage = (error)=>{
    if (isErrorWithMessage(error)) {
        return error.message;
    }
    return String(error);
};
// --------------------------------------------------------
// 定数: 認証状態をチェックする間隔（ミリ秒）
const CHECK_INTERVAL_MS = 3000; // 3秒ごとにチェック
// 認証完了後のリダイレクト先
const POST_VERIFY_REDIRECT_ROUTE = "/mypage/profile?verified=true";
function VerifyEmailPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // useAuthから必要な情報を取得
    const { user, auth, isLoading, reloadAuthToken, apiClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [statusMessage, setStatusMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isReloading, setIsReloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ---------------------------------------------
    // 副作用: 認証状態の監視とリダイレクト (変更なし)
    // ---------------------------------------------
    const checkVerificationStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VerifyEmailPage.useCallback[checkVerificationStatus]": ()=>{
            if (intervalRef.current !== null) return;
            console.log("未認証状態: 3秒ごとにFirebaseユーザーをリロードします。");
            const id = window.setInterval({
                "VerifyEmailPage.useCallback[checkVerificationStatus].id": async ()=>{
                    if (auth?.currentUser) {
                        try {
                            await auth.currentUser.reload();
                            console.log("Firebase user reloaded. Checking verification status...");
                        } catch (error) {
                            console.warn("Firebase user reload failed:", error);
                        }
                    }
                }
            }["VerifyEmailPage.useCallback[checkVerificationStatus].id"], CHECK_INTERVAL_MS);
            intervalRef.current = id;
            return id;
        }
    }["VerifyEmailPage.useCallback[checkVerificationStatus]"], [
        auth
    ]);
    const clearCheckInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VerifyEmailPage.useCallback[clearCheckInterval]": ()=>{
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
                console.log("✅ 認証チェックインターバルを停止しました。");
            }
        }
    }["VerifyEmailPage.useCallback[clearCheckInterval]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VerifyEmailPage.useEffect": ()=>{
            if (isLoading || isReloading) return;
            // URLパラメータからのトークン取得と処理
            const params = new URLSearchParams(window.location.search);
            const isVerifiedFromRedirect = params.get("verified") === "true";
            // Laravelからの認証成功リダイレクトを検知した場合
            if (isVerifiedFromRedirect) {
                clearCheckInterval();
                router.replace(pathname);
                if (!isReloading) {
                    setIsReloading(true);
                    console.log("Laravel認証リダイレクトを検知。Sanctumセッション確立のため reloadAuthToken を実行します。");
                    reloadAuthToken().then({
                        "VerifyEmailPage.useEffect": ()=>{
                            console.log("✅ トークンとプロフィール情報のリフレッシュに成功。");
                            router.replace(POST_VERIFY_REDIRECT_ROUTE);
                        }
                    }["VerifyEmailPage.useEffect"]).catch({
                        "VerifyEmailPage.useEffect": (error)=>{
                            console.error("リダイレクト後のSanctumセッション確立に失敗:", error);
                            // 💡 toErrorMessageを使用
                            setStatusMessage(`認証情報の更新に失敗しました。再度ログインしてください。 (${toErrorMessage(error)})`);
                        }
                    }["VerifyEmailPage.useEffect"]).finally({
                        "VerifyEmailPage.useEffect": ()=>{
                            setIsReloading(false);
                        }
                    }["VerifyEmailPage.useEffect"]);
                }
                return;
            }
            // 未ログイン（Firebaseのuserオブジェクトがない状態） → login へ
            if (!user) {
                clearCheckInterval();
                console.log("未ログイン状態を検知。/loginへリダイレクト。");
                router.replace("/login");
                return;
            }
            // すでにメール認証済み（userが存在し、emailVerifiedがtrue）
            if (user.emailVerified) {
                clearCheckInterval();
                if (!isReloading) {
                    setIsReloading(true);
                    console.log("Firebaseメール認証完了。Sanctumセッション確立のため reloadAuthToken を実行します。");
                    reloadAuthToken().then({
                        "VerifyEmailPage.useEffect": ()=>{
                            console.log("✅ トークンとプロフィール情報のリフレッシュに成功。");
                            router.replace(POST_VERIFY_REDIRECT_ROUTE);
                        }
                    }["VerifyEmailPage.useEffect"]).catch({
                        "VerifyEmailPage.useEffect": (error)=>{
                            console.error("Sanctumセッション確立/トークンリフレッシュに失敗:", error);
                            // 💡 toErrorMessageを使用
                            setStatusMessage(`認証情報の更新に失敗しました。再度ログインしてください。 (${toErrorMessage(error)})`);
                        }
                    }["VerifyEmailPage.useEffect"]).finally({
                        "VerifyEmailPage.useEffect": ()=>{
                            setIsReloading(false);
                        }
                    }["VerifyEmailPage.useEffect"]);
                }
                return;
            }
            // 未認証でこのページに留まる場合: 認証状態を定期的にチェックするインターバルを開始
            if (!user.emailVerified && intervalRef.current === null) {
                checkVerificationStatus();
            }
            return ({
                "VerifyEmailPage.useEffect": ()=>{
                    clearCheckInterval();
                }
            })["VerifyEmailPage.useEffect"];
        }
    }["VerifyEmailPage.useEffect"], [
        isLoading,
        user,
        router,
        checkVerificationStatus,
        clearCheckInterval,
        reloadAuthToken,
        isReloading,
        pathname
    ]);
    // Still loading
    if (isLoading || isReloading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gray-100",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-3 text-gray-700",
                    children: isReloading ? "認証情報を確定中..." : "認証状態を確認中..."
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(auth)/email/verify/page.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, this);
    }
    // 認証済みだと useEffect で移動するので return null
    if (!user || user.emailVerified) return null;
    // ---------------------------------------------
    // 認証メール再送 (Laravel API 利用)
    // ---------------------------------------------
    const handleResend = async ()=>{
        if (!apiClient) {
            setStatusMessage("エラー: APIクライアントが初期化されていません。");
            return;
        }
        setIsSending(true);
        setStatusMessage(null);
        try {
            // Sanctum Token を使って、Laravelのメール再送エンドポイントを叩く
            await apiClient.post("/api/email/verification-notification");
            setStatusMessage("新しい認証メールを送信しました。メールボックスを確認してください。");
        } catch (error) {
            console.error("Failed to resend email verification via Laravel API:", error);
            // 💡 プロフェッショナルなエラー処理: AxiosError -> 型述語を使った標準エラー
            let errorMessage = "不明なエラーです。";
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                // AxiosErrorの場合、レスポンス内のLaravelエラーメッセージを優先
                errorMessage = error.response?.data?.message || error.message;
            } else {
                // それ以外の場合、汎用ヘルパー関数を使用
                errorMessage = toErrorMessage(error);
            }
            setStatusMessage(`認証メールの再送に失敗しました。時間をおいてお試しください。 (${errorMessage})`);
        } finally{
            setIsSending(false);
        }
    };
    // ---------------------------------------------
    // レンダリング (変更なし)
    // ---------------------------------------------
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
                    lineNumber: 246,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 text-gray-700 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl font-medium",
                            children: "ご登録ありがとうございます！"
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/email/verify/page.tsx",
                            lineNumber: 251,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base",
                            children: [
                                "以下のメールアドレス宛に**認証メール**を送付しました。",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-lg text-blue-700",
                                    children: user.email ?? "メールアドレス不明"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/email/verify/page.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-yellow-50 border border-yellow-300 rounded-md shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base font-semibold text-red-600",
                                    children: "メール内のリンクをクリックして認証を完了してください。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm mt-1 text-gray-600",
                                    children: "認証が完了すると、このページは自動的に移動します。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/email/verify/page.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 250,
                    columnNumber: 9
                }, this),
                statusMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 p-3 bg-green-100 text-green-700 rounded text-sm font-medium text-center border border-green-300",
                    children: statusMessage
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 270,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "http://localhost:8025",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-block px-6 py-2 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800 transition duration-150 shadow-md text-sm",
                        children: "👨‍💻 開発用: メールボックスを確認 (MailHog)"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/email/verify/page.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 276,
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
                        disabled: isSending || isReloading,
                        className: "w-full bg-indigo-600 text-white py-3 rounded-md font-bold text-lg hover:bg-indigo-700 transition duration-150 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed",
                        children: isSending ? "送信中..." : isReloading ? "認証情報の確定中..." : "認証メールを再送する"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/email/verify/page.tsx",
                        lineNumber: 295,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 288,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(auth)/email/verify/page.tsx",
            lineNumber: 245,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(auth)/email/verify/page.tsx",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
_s(VerifyEmailPage, "PFQJIEHWxGACiopocgHBeKJpwYQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
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

//# sourceMappingURL=_29d4f50d._.js.map