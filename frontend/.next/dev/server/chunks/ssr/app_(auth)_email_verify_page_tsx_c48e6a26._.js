module.exports = [
"[project]/app/(auth)/email/verify/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VerifyEmailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
// 💡 useAuth から reloadAuthToken を取得します
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
// 💡 定数: 認証状態をチェックする間隔（ミリ秒）
const CHECK_INTERVAL_MS = 3000; // 3秒ごとにチェック
// 💡 認証完了後のリダイレクト先 (ItemSellPageへの競合を避ける)
const POST_VERIFY_REDIRECT_ROUTE = "/mypage/profile?verified=true";
function VerifyEmailPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // ★ 修正: useAuth から reloadAuthToken を取得
    const { user, auth, isLoading, reloadAuthToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [statusMessage, setStatusMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isReloading, setIsReloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // ★ 追加: トークン再取得中
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ---------------------------------------------
    // 副作用: 認証状態の監視とリダイレクト
    // ---------------------------------------------
    // インターバルを開始/クリアする関数を定義 (前回の修正版)
    const checkVerificationStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (intervalRef.current !== null) return;
        console.log("未認証状態: 3秒ごとにFirebaseユーザーをリロードします。");
        const id = window.setInterval(async ()=>{
            if (auth?.currentUser) {
                try {
                    await auth.currentUser.reload();
                    console.log("Firebase user reloaded. Checking verification status...");
                } catch (error) {
                    console.warn("Firebase user reload failed:", error);
                }
            }
        }, CHECK_INTERVAL_MS);
        intervalRef.current = id;
        return id;
    }, [
        auth
    ]);
    // クリーンアップ処理を共通化
    const clearCheckInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log("✅ 認証チェックインターバルを停止しました。");
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // 1. 認証状態が解決するまで待つ or トークン再取得中は待つ
        if (isLoading || isReloading) return;
        // 2. 未ログイン（Firebaseのuserオブジェクトがない状態） → login へ
        if (!user) {
            clearCheckInterval();
            console.log("未ログイン状態を検知。/loginへリダイレクト。");
            router.replace("/login");
            return;
        }
        // 3. すでにメール認証済み（userが存在し、emailVerifiedがtrue）
        if (user.emailVerified) {
            clearCheckInterval();
            // ★★★ 最重要修正箇所 ★★★
            // Firebase認証完了後、SanctumセッションとBackendUserの状態を強制的に最新化
            if (!isReloading) {
                setIsReloading(true);
                console.log("Firebaseメール認証完了。Sanctumセッション確立のため reloadAuthToken を実行します。");
                reloadAuthToken().then(()=>{
                    console.log("✅ トークンとプロフィール情報のリフレッシュに成功。");
                    // 状態が完全に更新された後、安全なルートへリダイレクト
                    router.replace(POST_VERIFY_REDIRECT_ROUTE);
                }).catch((error)=>{
                    // リロード失敗時はエラーメッセージを表示するか、ログアウト
                    console.error("Sanctumセッション確立/トークンリフレッシュに失敗:", error);
                    setStatusMessage("認証情報の更新に失敗しました。再度ログインしてください。");
                // 💡 エラー処理: ログアウト処理を入れるのも手ですが、ここでは表示に留めます
                }).finally(()=>{
                    setIsReloading(false);
                });
            }
            return;
        }
        // ★★★ 修正箇所終わり ★★★
        // 4. 未認証でこのページに留まる場合: 認証状態を定期的にチェックするインターバルを開始
        if (!user.emailVerified && intervalRef.current === null) {
            checkVerificationStatus();
        }
        return ()=>{
        // クリーンアップはクリアCheckIntervalに任せる
        };
    }, [
        isLoading,
        user,
        router,
        checkVerificationStatus,
        clearCheckInterval,
        reloadAuthToken,
        isReloading
    ]);
    // Still loading
    if (isLoading || isReloading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gray-100",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-3 text-gray-700",
                    children: isReloading ? "認証情報を確定中..." : "認証状態を確認中..."
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(auth)/email/verify/page.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this);
    }
    // 認証済みだと useEffect で移動するので return null
    if (!user || user.emailVerified) return null;
    // ---------------------------------------------
    // 認証メール再送 (ロジックは変更なし)
    // ---------------------------------------------
    const handleResend = async ()=>{
    // ... (省略)
    };
    // ---------------------------------------------
    // レンダリング (変更なし)
    // ---------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex justify-center items-start pt-20 bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-xl p-8 bg-white rounded-lg shadow-xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-3xl font-extrabold text-indigo-600 mb-6 border-b-2 pb-3 text-center",
                    children: "💌 メール認証のお願い"
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 text-gray-700 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl font-medium",
                            children: "ご登録ありがとうございます！"
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/email/verify/page.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base",
                            children: [
                                "以下のメールアドレス宛に**認証メール**を送付しました。",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-lg text-blue-700",
                                    children: user.email ?? "メールアドレス不明"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/email/verify/page.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-yellow-50 border border-yellow-300 rounded-md shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base font-semibold text-red-600",
                                    children: "メール内のリンクをクリックして認証を完了してください。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm mt-1 text-gray-600",
                                    children: "認証が完了すると、このページは自動的に移動します。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/email/verify/page.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                statusMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 p-3 bg-green-100 text-green-700 rounded text-sm font-medium text-center border border-green-300",
                    children: statusMessage
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 181,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "http://localhost:8025",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-block px-6 py-2 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800 transition duration-150 shadow-md text-sm",
                        children: "👨‍💻 開発用: メールボックスを確認 (MailHog)"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/email/verify/page.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 187,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: (e)=>{
                        e.preventDefault();
                        handleResend();
                    },
                    className: "mt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isSending || isReloading,
                        className: "w-full bg-indigo-600 text-white py-3 rounded-md font-bold text-lg hover:bg-indigo-700 transition duration-150 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed",
                        children: isSending ? "送信中..." : isReloading ? "認証情報の確定中..." : "認証メールを再送する"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/email/verify/page.tsx",
                        lineNumber: 206,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/email/verify/page.tsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(auth)/email/verify/page.tsx",
            lineNumber: 156,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(auth)/email/verify/page.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_%28auth%29_email_verify_page_tsx_c48e6a26._.js.map