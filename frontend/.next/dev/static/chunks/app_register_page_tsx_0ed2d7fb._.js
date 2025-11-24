(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/register/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/firebase-diagnostic-page.jsx  (or pages/firebase-diagnostic-page.jsx)
__turbopack_context__.s([
    "default",
    ()=>FirebaseDiagnosticPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
/* --- small inline icon --- */ const AlertTriangleIcon = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ...props,
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "w-6 h-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            }, void 0, false, {
                fileName: "[project]/app/register/page.tsx",
                lineNumber: 29,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "9",
                x2: "12",
                y2: "13"
            }, void 0, false, {
                fileName: "[project]/app/register/page.tsx",
                lineNumber: 30,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "17",
                x2: "12.01",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/app/register/page.tsx",
                lineNumber: 31,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/register/page.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = AlertTriangleIcon;
const StatusItem = ({ label, status, detail, isCritical = false })=>{
    const colorClass = isCritical ? "border-red-600 text-red-800 bg-red-100 font-bold" : "border-gray-400 text-gray-700 bg-gray-50";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: `p-4 rounded-lg border-2 ${colorClass} transition-all duration-300`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/register/page.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            isCritical && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertTriangleIcon, {
                                className: "w-5 h-5 text-red-600"
                            }, void 0, false, {
                                fileName: "[project]/app/register/page.tsx",
                                lineNumber: 47,
                                columnNumber: 26
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `font-bold text-sm ${isCritical ? "text-red-600" : "text-gray-500"}`,
                                children: status
                            }, void 0, false, {
                                fileName: "[project]/app/register/page.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/register/page.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/register/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            detail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-xs mt-2 break-all ${isCritical ? "text-red-700" : "text-gray-500"}`,
                children: detail
            }, void 0, false, {
                fileName: "[project]/app/register/page.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/register/page.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = StatusItem;
function FirebaseDiagnosticPage() {
    _s();
    const [statuses, setStatuses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        appId: {
            status: "未確認",
            detail: "",
            isCritical: false
        },
        config: {
            status: "未確認",
            detail: "",
            isCritical: false
        },
        authToken: {
            status: "未確認",
            detail: "",
            isCritical: false
        },
        init: {
            status: "未確認",
            detail: "",
            isCritical: false
        },
        auth: {
            status: "未確認",
            detail: "",
            isCritical: false
        },
        firestore: {
            status: "未確認",
            detail: "",
            isCritical: false
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FirebaseDiagnosticPage.useEffect": ()=>{
            // 1) build config from NEXT_PUBLIC_ env
            const cfg = {
                apiKey: ("TURBOPACK compile-time value", "AIzaSyC4YCgTTKw1WS3Zg7niARhN5uV_szcxg8U") ?? "",
                authDomain: ("TURBOPACK compile-time value", "takayuki-2025-ver-1.firebaseapp.com") ?? "",
                projectId: ("TURBOPACK compile-time value", "takayuki-2025-ver-1") ?? "",
                storageBucket: ("TURBOPACK compile-time value", "takayuki-2025-ver-1.appspot.com") ?? "",
                messagingSenderId: ("TURBOPACK compile-time value", "755907716529") ?? "",
                appId: ("TURBOPACK compile-time value", "1:755907716529:web:49eba1d86d1e1934948990") ?? ""
            };
            // set __app_id fallback for legacy diagnostic compatibility
            try {
                const appId = cfg.appId || "default-app-id";
                window.__app_id = appId;
                setStatuses({
                    "FirebaseDiagnosticPage.useEffect": (s)=>({
                            ...s,
                            appId: {
                                status: cfg.appId ? "読み取り成功" : "代替処理",
                                detail: cfg.appId ? `appId=${cfg.appId}` : `未定義。アプリケーションIDは「${appId}」としてフォールバック。`,
                                isCritical: false
                            }
                        })
                }["FirebaseDiagnosticPage.useEffect"]);
            } catch (e) {
            // ignore
            }
            // 2) inject __firebase_config for compatibility with old diagnostics
            if (cfg.apiKey && cfg.authDomain && cfg.projectId) {
                try {
                    window.__firebase_config = JSON.stringify(cfg);
                    setStatuses({
                        "FirebaseDiagnosticPage.useEffect": (s)=>({
                                ...s,
                                config: {
                                    status: "読み取り成功",
                                    detail: "process.env から Firebase 設定を注入しました。",
                                    isCritical: false
                                }
                            })
                    }["FirebaseDiagnosticPage.useEffect"]);
                } catch (e) {
                    setStatuses({
                        "FirebaseDiagnosticPage.useEffect": (s)=>({
                                ...s,
                                config: {
                                    status: "失敗/欠落",
                                    detail: `__firebase_config 注入に失敗: ${String(e)}`,
                                    isCritical: true
                                }
                            })
                    }["FirebaseDiagnosticPage.useEffect"]);
                }
            } else {
                setStatuses({
                    "FirebaseDiagnosticPage.useEffect": (s)=>({
                            ...s,
                            config: {
                                status: "失敗/欠落",
                                detail: "NEXT_PUBLIC_FIREBASE_* が不足しています。env を確認してください。",
                                isCritical: true
                            }
                        })
                }["FirebaseDiagnosticPage.useEffect"]);
            }
            // 3) optional initial token from env (if you set one for testing)
            const initialToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN ?? null;
            if (initialToken) {
                window.__initial_auth_token = initialToken;
                setStatuses({
                    "FirebaseDiagnosticPage.useEffect": (s)=>({
                            ...s,
                            authToken: {
                                status: "読み取り成功",
                                detail: "NEXT_PUBLIC_INITIAL_AUTH_TOKEN からトークンを読み取りました（テスト用）",
                                isCritical: false
                            }
                        })
                }["FirebaseDiagnosticPage.useEffect"]);
            } else {
                setStatuses({
                    "FirebaseDiagnosticPage.useEffect": (s)=>({
                            ...s,
                            authToken: {
                                status: "代替処理",
                                detail: "トークンなし。代わりに匿名認証を試行します。",
                                isCritical: false
                            }
                        })
                }["FirebaseDiagnosticPage.useEffect"]);
            }
            // 4) initialize Firebase using standard Next.js env approach
            ({
                "FirebaseDiagnosticPage.useEffect": async ()=>{
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    // validate config
                    if (!cfg.apiKey || !cfg.authDomain) {
                        setStatuses({
                            "FirebaseDiagnosticPage.useEffect": (s)=>({
                                    ...s,
                                    init: {
                                        status: "失敗/欠落",
                                        detail: "Firebase config が不十分です。apiKey/authDomain が必要です。",
                                        isCritical: true
                                    }
                                })
                        }["FirebaseDiagnosticPage.useEffect"]);
                        return;
                    }
                    try {
                        const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length === 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(cfg) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])();
                        setStatuses({
                            "FirebaseDiagnosticPage.useEffect": (s)=>({
                                    ...s,
                                    init: {
                                        status: "読み取り成功",
                                        detail: "Firebase App が初期化されました。",
                                        isCritical: false
                                    }
                                })
                        }["FirebaseDiagnosticPage.useEffect"]);
                        // Auth
                        const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
                        // Sign-in: prefer custom token if provided, otherwise anonymous
                        try {
                            if (initialToken) {
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithCustomToken"])(auth, initialToken);
                                setStatuses({
                                    "FirebaseDiagnosticPage.useEffect": (s)=>({
                                            ...s,
                                            auth: {
                                                status: "読み取り成功",
                                                detail: "Custom Token でサインインに成功しました。",
                                                isCritical: false
                                            }
                                        })
                                }["FirebaseDiagnosticPage.useEffect"]);
                            } else {
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInAnonymously"])(auth);
                                setStatuses({
                                    "FirebaseDiagnosticPage.useEffect": (s)=>({
                                            ...s,
                                            auth: {
                                                status: "読み取り成功",
                                                detail: "匿名サインインに成功しました。",
                                                isCritical: false
                                            }
                                        })
                                }["FirebaseDiagnosticPage.useEffect"]);
                            }
                            // observe auth state for extra confirmation
                            const unsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(auth, {
                                "FirebaseDiagnosticPage.useEffect.unsub": (user)=>{
                                    if (user) {
                                        setStatuses({
                                            "FirebaseDiagnosticPage.useEffect.unsub": (s)=>({
                                                    ...s,
                                                    auth: {
                                                        status: "認証済み",
                                                        detail: `uid=${user.uid} (${user.isAnonymous ? "anonymous" : "authenticated"})`,
                                                        isCritical: false
                                                    }
                                                })
                                        }["FirebaseDiagnosticPage.useEffect.unsub"]);
                                    } else {
                                        setStatuses({
                                            "FirebaseDiagnosticPage.useEffect.unsub": (s)=>({
                                                    ...s,
                                                    auth: {
                                                        status: "未認証",
                                                        detail: "ユーザーはサインインしていません。",
                                                        isCritical: true
                                                    }
                                                })
                                        }["FirebaseDiagnosticPage.useEffect.unsub"]);
                                    }
                                }
                            }["FirebaseDiagnosticPage.useEffect.unsub"]);
                            // Firestore: basic get to ensure library is available
                            try {
                                const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
                                // don't perform reads/writes here; just check that object exists
                                if (db) {
                                    setStatuses({
                                        "FirebaseDiagnosticPage.useEffect": (s)=>({
                                                ...s,
                                                firestore: {
                                                    status: "読み取り成功",
                                                    detail: "Firestore インスタンスを取得しました。",
                                                    isCritical: false
                                                }
                                            })
                                    }["FirebaseDiagnosticPage.useEffect"]);
                                }
                            } catch (e) {
                                setStatuses({
                                    "FirebaseDiagnosticPage.useEffect": (s)=>({
                                            ...s,
                                            firestore: {
                                                status: "失敗/欠落",
                                                detail: `Firestore の取得に失敗: ${String(e)}`,
                                                isCritical: true
                                            }
                                        })
                                }["FirebaseDiagnosticPage.useEffect"]);
                            }
                            // cleanup on unmount
                            return ({
                                "FirebaseDiagnosticPage.useEffect": ()=>{
                                    try {
                                        unsub();
                                    } catch (e) {
                                    // ignore
                                    }
                                }
                            })["FirebaseDiagnosticPage.useEffect"];
                        } catch (authErr) {
                            setStatuses({
                                "FirebaseDiagnosticPage.useEffect": (s)=>({
                                        ...s,
                                        auth: {
                                            status: "失敗/欠落",
                                            detail: `認証に失敗しました: ${String(authErr)}`,
                                            isCritical: true
                                        }
                                    })
                            }["FirebaseDiagnosticPage.useEffect"]);
                        }
                    } catch (initErr) {
                        setStatuses({
                            "FirebaseDiagnosticPage.useEffect": (s)=>({
                                    ...s,
                                    init: {
                                        status: "失敗/欠落",
                                        detail: `初期化中にエラー: ${String(initErr)}`,
                                        isCritical: true
                                    }
                                })
                        }["FirebaseDiagnosticPage.useEffect"]);
                    }
                }
            })["FirebaseDiagnosticPage.useEffect"]();
        }
    }["FirebaseDiagnosticPage.useEffect"], []);
    const overallError = statuses.config.isCritical || statuses.init.isCritical || statuses.auth.isCritical;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-start justify-center bg-gray-50 p-8 font-inter",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-extrabold text-gray-900 mt-3",
                            children: "Firebase 環境診断ツール（next.js 16）"
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 mt-1",
                            children: "process.env から読み取り、Firebase の初期化・認証・Firestore の取得まで試行します。"
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 327,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/register/page.tsx",
                    lineNumber: 323,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `p-5 rounded-xl font-bold text-white text-center mb-8 ${overallError ? "bg-red-600" : "bg-green-600"}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertTriangleIcon, {
                                className: "w-6 h-6 mr-3 text-white"
                            }, void 0, false, {
                                fileName: "[project]/app/register/page.tsx",
                                lineNumber: 339,
                                columnNumber: 13
                            }, this),
                            overallError ? "エラーが発生しました。詳細を確認してください。" : "Firebase は正常に動作しています。"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/register/page.tsx",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/register/page.tsx",
                    lineNumber: 333,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-semibold text-gray-700 mb-4 border-b pb-2",
                    children: "1. グローバル変数の読み込み"
                }, void 0, false, {
                    fileName: "[project]/app/register/page.tsx",
                    lineNumber: 346,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-3 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                            label: "__app_id",
                            status: statuses.appId.status,
                            detail: statuses.appId.detail,
                            isCritical: statuses.appId.isCritical
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                            label: "__firebase_config (JSON)",
                            status: statuses.config.status,
                            detail: statuses.config.detail,
                            isCritical: statuses.config.isCritical
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 356,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                            label: "__initial_auth_token",
                            status: statuses.authToken.status,
                            detail: statuses.authToken.detail,
                            isCritical: statuses.authToken.isCritical
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 362,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/register/page.tsx",
                    lineNumber: 349,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-semibold text-gray-700 mb-4 border-b pb-2",
                    children: "2. Firebase サービスの初期化と認証"
                }, void 0, false, {
                    fileName: "[project]/app/register/page.tsx",
                    lineNumber: 370,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-3 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                            label: "Firebase App / Firestore 初期化",
                            status: statuses.init.status,
                            detail: statuses.init.detail,
                            isCritical: statuses.init.isCritical
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                            label: "ユーザー認証状態 (Auth)",
                            status: statuses.auth.status,
                            detail: statuses.auth.detail,
                            isCritical: statuses.auth.isCritical
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 380,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                            label: "Firestore",
                            status: statuses.firestore.status,
                            detail: statuses.firestore.detail,
                            isCritical: statuses.firestore.isCritical
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 386,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/register/page.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, this),
                statuses.config.isCritical && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-500 p-4 rounded-xl text-white mt-6 font-mono text-sm border-2 border-red-800 shadow-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold block text-lg mb-2",
                            children: "発生した根本原因のエラー:"
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 396,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "break-all font-bold",
                            children: statuses.config.detail
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 399,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-3 text-sm",
                            children: [
                                "**【重要】** このツールは process.env (NEXT_PUBLIC_*) から読み取って初期化します。",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/register/page.tsx",
                                    lineNumber: 405,
                                    columnNumber: 15
                                }, this),
                                "`.env` を変更したら dev サーバーを再起動してください。",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/register/page.tsx",
                                    lineNumber: 407,
                                    columnNumber: 15
                                }, this),
                                "（例: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                    children: "NPM"
                                }, void 0, false, {
                                    fileName: "[project]/app/register/page.tsx",
                                    lineNumber: 408,
                                    columnNumber: 19
                                }, this),
                                " なら ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                    children: "npm run dev"
                                }, void 0, false, {
                                    fileName: "[project]/app/register/page.tsx",
                                    lineNumber: 408,
                                    columnNumber: 39
                                }, this),
                                " 再起動）"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/register/page.tsx",
                            lineNumber: 402,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/register/page.tsx",
                    lineNumber: 395,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/register/page.tsx",
            lineNumber: 322,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/register/page.tsx",
        lineNumber: 321,
        columnNumber: 5
    }, this);
}
_s(FirebaseDiagnosticPage, "i3Jv7QiC531eUFmGCOrClEm5UEQ=");
_c2 = FirebaseDiagnosticPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AlertTriangleIcon");
__turbopack_context__.k.register(_c1, "StatusItem");
__turbopack_context__.k.register(_c2, "FirebaseDiagnosticPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_register_page_tsx_0ed2d7fb._.js.map