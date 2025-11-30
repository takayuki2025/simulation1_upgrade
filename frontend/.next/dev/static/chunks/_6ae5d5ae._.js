(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IMAGE_TYPE",
    ()=>IMAGE_TYPE,
    "PLACEHOLDER_IMAGE_URL",
    ()=>PLACEHOLDER_IMAGE_URL,
    "getImageUrl",
    ()=>getImageUrl,
    "onImageError",
    ()=>onImageError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
const PLACEHOLDER_IMAGE_URL = "https://placehold.co/300x300/e0e0e0/333?text=No+Image";
// プロフィール画像がない場合のデフォルトパス
const DEFAULT_PROFILE_IMAGE_PATH = "storage/images/default-profile2.jpg";
// Next.jsの環境変数からASSET_BASE_URLを取得 (API_BASE_URLと同じと仮定)
const ASSET_BASE_URL = API_BASE_URL;
const IMAGE_TYPE = {
    // 0: 商品画像 (デフォルトのプレースホルダーを使用)
    ITEM: 0,
    // 1: ユーザー画像 (デフォルトのプロフィール画像を使用)
    USER: 1
};
const getImageUrl = (path, imageType, cacheKey = 0)=>{
    // 1. パスがない場合の処理
    if (!path) {
        if (imageType === IMAGE_TYPE.USER) {
            // ユーザー画像の場合は専用のデフォルト画像を返す
            return `${API_BASE_URL?.replace(/\/$/, "")}/${DEFAULT_PROFILE_IMAGE_PATH}`;
        }
        // 商品画像の場合は汎用のプレースホルダーを返す
        return PLACEHOLDER_IMAGE_URL;
    }
    // 2. 既にフルURL (Laravelのアクセサで変換済み) の場合はそのまま返す
    if (path.startsWith("http")) {
        console.log("DEBUG_IMG: Path starts with http (Absolute URL), returning:", path);
        // キャッシュバスターを付与
        const cacheBuster = cacheKey > 0 ? `?t=${cacheKey}` : "";
        return `${path}${cacheBuster}`;
    }
    // 3. フルURLでない場合 (フォールバック)
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // --- フォールバックの結合処理 ---
    // ASSET_BASE_URLから末尾のスラッシュを削除
    const baseUrl = ASSET_BASE_URL.endsWith("/") ? ASSET_BASE_URL.slice(0, -1) : ASSET_BASE_URL;
    let cleanPath = path;
    // パスの先頭にあるスラッシュやバックスラッシュを削除
    cleanPath = cleanPath.replace(/^[/\\]+/, "");
    // 💡 パスが 'storage/' で始まっていない場合は補完 (Laravelのシンボリックリンク構造対応)
    // 例外: API側で既に 'storage/...' が含まれたパスが渡ってくる場合があるため、補完は最小限にする
    if (!cleanPath.startsWith("storage/") && !cleanPath.startsWith("images/")) {
        cleanPath = `storage/${cleanPath}`;
    }
    const cacheBuster = cacheKey > 0 ? `?t=${cacheKey}` : "";
    // ベースURLとクリーンアップされたパスを結合
    const finalUrl = `${baseUrl}/${cleanPath}${cacheBuster}`;
    console.log(`DEBUG_IMG: Base: ${baseUrl}, Final Path: /${cleanPath}, Result: ${finalUrl} (Fallback)`);
    return finalUrl;
};
const onImageError = (e, name)=>{
    const target = e.target;
    // エラーが何度も発生しないように、イベントハンドラを無効化
    target.onerror = null;
    const placeholderText = name ? name.replace(/\s/g, "+") : "Error";
    // エラーハンドリング時に名前入りのプレースホルダーに切り替える
    // サイズは画像の用途に応じて調整できるように、ここでは汎用の300x300を使用
    target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(main)/mypage/profile/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSanctumAuth.tsx [app-client] (ecmascript)"); // 認証と認証済みAxiosクライアントの提供元
// 汎用ヘルパー関数のインポート (ご自身のプロジェクトのパスに合わせてください)
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// =======================================================
// グローバル変数
// =======================================================
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
function ProfilePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // 1. 認証フック
    const { user: authUser, isAuthenticated, isLoading: isAuthLoading, logout, reloadAuthToken, apiClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // -------------------- State --------------------
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
    const fileInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // -------------------- Computed Value (useMemo) --------------------
    const isVerificationRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProfilePage.useMemo[isVerificationRedirect]": ()=>{
            return searchParams.get("verified") === "true";
        }
    }["ProfilePage.useMemo[isVerificationRedirect]"], [
        searchParams
    ]);
    /**
   * 画像URLを useMemo でメモ化し、キャッシュバスターとしてタイムスタンプを渡す。
   * user.user_image の変更時のみ再計算される。
   */ const profileImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProfilePage.useMemo[profileImageUrl]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(user?.user_image ?? null, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IMAGE_TYPE"].USER, Date.now());
        }
    }["ProfilePage.useMemo[profileImageUrl]"], [
        user?.user_image
    ]);
    // ----------------------------------------------------------------
    // 1. データ初期化ヘルパー
    // ----------------------------------------------------------------
    /**
   * APIから取得したユーザーデータでフォームと状態を初期化する。
   */ const initializeUserData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePage.useCallback[initializeUserData]": (apiData)=>{
            // APIレスポンスが { user: {...} } の形式か、{ id: 1, name: "..." } の形式かを自動判定
            const sourceData = apiData?.user || apiData;
            setUser({
                "ProfilePage.useCallback[initializeUserData]": (current)=>{
                    if (JSON.stringify(current) !== JSON.stringify(sourceData)) {
                        console.log("✅ [InitData] user State を更新しました。");
                        return sourceData;
                    }
                    return current;
                }
            }["ProfilePage.useCallback[initializeUserData]"]);
            if (sourceData) {
                setForm({
                    name: sourceData.name || "",
                    post_number: sourceData.post_number || "",
                    address: sourceData.address || "",
                    building: sourceData.building || ""
                });
            }
        }
    }["ProfilePage.useCallback[initializeUserData]"], []);
    // ----------------------------------------------------------------
    // 2. データ取得ロジック
    // ----------------------------------------------------------------
    /**
   * サーバーからプロフィールデータを取得する関数。
   */ const fetchUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePage.useCallback[fetchUserProfile]": async (isRetry = false)=>{
            if (!apiClient) return;
            if (!isRetry) setIsFetching(true);
            try {
                const response = await apiClient.get("/api/mypage/profile");
                const responseData = response.data;
                initializeUserData(responseData);
                console.log("✅ [Fetch] プロフィールデータ取得に成功。");
                if (isRetry) {
                    setIsRecovering(false);
                    setSuccessMessage("認証情報を回復し、データを再取得しました。");
                }
                setIsLoading(false);
            } catch (err) {
                console.error("プロフィールデータのロードに失敗しました:", err);
                const status = err.response ? err.response.status : null;
                if (status === 401) {
                    if (isRetry) {
                        await logout();
                        return;
                    }
                    setSuccessMessage("認証情報を更新中...");
                    setIsRecovering(true);
                    try {
                        await reloadAuthToken();
                        setSuccessMessage("認証情報を更新しました。データを再取得します。");
                        await fetchUserProfile(true);
                    } catch (reloadError) {
                        await logout();
                        setSuccessMessage("セッションが切れました。再度ログインが必要です。");
                    }
                    return;
                }
                setSuccessMessage(`データのロード中に予期せぬエラーが発生しました。(Status: ${status || "不明"})`);
                setIsLoading(false);
            } finally{
                if (!isRetry) {
                    setIsFetching(false);
                }
            }
        }
    }["ProfilePage.useCallback[fetchUserProfile]"], [
        apiClient,
        initializeUserData,
        logout,
        reloadAuthToken
    ]);
    // ----------------------------------------------------------------
    // 3. 認証状態とデータフェッチの監視
    // ----------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfilePage.useEffect": ()=>{
            if (isAuthLoading || isRecovering) return;
            if (!isAuthenticated) {
                if (isVerificationRedirect) {
                    return;
                }
                if (authUser === null) {
                    router.replace("/login");
                }
                return;
            }
            const needsInitialFetch = isAuthenticated && apiClient && !user && !isFetching;
            if (needsInitialFetch) {
                fetchUserProfile(false);
                return;
            }
            if (user && isAuthenticated && !isFetching && isLoading) {
                setIsLoading(false);
            }
        }
    }["ProfilePage.useEffect"], [
        isAuthLoading,
        isAuthenticated,
        router,
        fetchUserProfile,
        user,
        isVerificationRedirect,
        isRecovering,
        authUser,
        apiClient,
        isFetching,
        isLoading,
        initializeUserData
    ]);
    // ----------------------------------------------------------------
    // 4. 画像アップロード処理
    // ----------------------------------------------------------------
    const handleImageUpload = async (event)=>{
        const file = event.target.files?.[0];
        if (!file || !user || !apiClient) return;
        setImageError("");
        setSuccessMessage("");
        setIsLoading(true);
        const formData = new FormData();
        formData.append("user_image", file);
        try {
            const response = await apiClient.post("/api/upload2", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const responseData = response.data;
            // ★★★ 修正箇所：response.data.user からユーザー情報を抽出する ★★★
            const updatedUser = responseData.user;
            // デバッグ用コンソール出力（確認後削除可）
            console.log("NEW_IMAGE_PATH (Corrected):", updatedUser.user_image);
            // user ステートを新しい情報で更新
            setUser(updatedUser);
            setSuccessMessage("画像をアップロードしました。");
        } catch (error) {
            console.error("【ERROR】画像アップロードに失敗しました:", error);
            const status = error.response ? error.response.status : null;
            if (status === 401) {
                await logout();
                return;
            }
            if (status === 422) {
                setImageError(error.response.data?.errors?.user_image?.[0] || "無効なファイルです。");
            } else {
                setImageError(`アップロードに失敗しました (ステータス: ${status || "不明"})。`);
            }
        } finally{
            setIsLoading(false);
            if (fileInput.current) {
                fileInput.current.value = "";
            }
        }
    };
    // ----------------------------------------------------------------
    // 5. プロフィール情報更新処理
    // --------------------------------------------------------------
    const handleProfileUpdate = async (e)=>{
        e.preventDefault();
        setProfileErrors({});
        setSuccessMessage("");
        if (!user || !apiClient) return;
        setIsLoading(true);
        try {
            const response = await apiClient.patch("/api/mypage/profile_update", form);
            const updatedUser = response.data;
            setSuccessMessage("プロフィール情報を更新しました！");
            initializeUserData(updatedUser);
        } catch (error) {
            const statusCode = error.response ? error.response.status : "不明";
            console.error(`【ERROR】プロフィール更新に失敗しました (ステータス: ${statusCode})。`, error);
            if (statusCode === 401) {
                await logout();
                return;
            }
            if (statusCode === 422) {
                setProfileErrors(error.response.data.errors);
            } else {
                setSuccessMessage(`更新に失敗しました。(Status: ${statusCode}) 再度お試しください。`);
            }
        } finally{
            setIsLoading(false);
        }
    };
    // ----------------------------------------------------------------
    // 6. ローディング・未認証時の表示
    // ----------------------------------------------------------------
    if (isAuthLoading || isLoading && !user || isRecovering) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "login_page max-w-[1400px] mx-auto pt-5 pb-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "title",
                    children: "プロフィール設定"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 345,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 347,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-gray-500 mt-3",
                            children: isAuthLoading ? "認証状態を確認中 / セッションを再確立中..." : isRecovering ? "⚠️ 認証情報を回復中です..." : "データをロード中です..."
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 348,
                            columnNumber: 11
                        }, this),
                        isVerificationRedirect && isFetching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-blue-500 mt-2",
                            children: "メール認証の状態を確認中です。しばらくお待ちください。"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 356,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 346,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
            lineNumber: 344,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated || !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "login_page max-w-[1400px] mx-auto pt-5 pb-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "title",
                    children: "プロフィール設定"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 368,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl text-red-500",
                            children: "認証エラー、またはユーザー情報がロードできませんでした。"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 370,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-md text-gray-500 mt-2",
                            children: "ログインページへ移動しています..."
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
            lineNumber: 367,
            columnNumber: 7
        }, this);
    }
    // ----------------------------------------------------------------
    // 7. メインレンダリング (UI)
    // ----------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-f27e8f3c17414dc1" + " " + "login_page max-w-[1400px] mx-auto pt-5 pb-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "jsx-f27e8f3c17414dc1" + " " + "title",
                children: "プロフィール設定"
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-f27e8f3c17414dc1" + " " + "form-wrapper",
                children: [
                    successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f27e8f3c17414dc1" + " " + "alert-success2",
                        children: successMessage
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 394,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: (e)=>e.preventDefault(),
                        className: "jsx-f27e8f3c17414dc1" + " " + "item_sell_contents_box_line",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f27e8f3c17414dc1" + " " + "image_name",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f27e8f3c17414dc1" + " " + "image_button_row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                // キャッシュバスター付きURL
                                                src: profileImageUrl,
                                                alt: "プロフィール画像",
                                                className: "jsx-f27e8f3c17414dc1" + " " + "user_image_css"
                                            }, user?.user_image || "default", false, {
                                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                                lineNumber: 404,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>fileInput.current?.click(),
                                                disabled: isLoading,
                                                className: "jsx-f27e8f3c17414dc1" + " " + "upload_submit",
                                                children: "画像を選択する"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                                lineNumber: 412,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 403,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        name: "user_image",
                                        ref: fileInput,
                                        style: {
                                            display: "none"
                                        },
                                        onChange: handleImageUpload,
                                        accept: "image/*",
                                        className: "jsx-f27e8f3c17414dc1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 421,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f27e8f3c17414dc1" + " " + "user_image_error_message",
                                children: imageError
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 430,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleProfileUpdate,
                        className: "jsx-f27e8f3c17414dc1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f27e8f3c17414dc1" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "name",
                                        className: "jsx-f27e8f3c17414dc1" + " " + "label_form_1",
                                        children: "ユーザー名"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "name",
                                        type: "text",
                                        name: "name",
                                        value: form.name,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    name: e.target.value
                                                })),
                                        className: "jsx-f27e8f3c17414dc1" + " " + "name_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 440,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f27e8f3c17414dc1" + " " + "profile__error",
                                        children: profileErrors.name ? profileErrors.name[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 450,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 436,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f27e8f3c17414dc1" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "post_number",
                                        className: "jsx-f27e8f3c17414dc1" + " " + "label_form_2",
                                        children: "郵便番号 (8桁、ハイフンあり)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 457,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "post_number",
                                        type: "text",
                                        name: "post_number",
                                        value: form.post_number,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    post_number: e.target.value
                                                })),
                                        placeholder: "例: 100-0001",
                                        maxLength: 8,
                                        className: "jsx-f27e8f3c17414dc1" + " " + "email_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 460,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f27e8f3c17414dc1" + " " + "profile__error",
                                        children: profileErrors.post_number ? profileErrors.post_number[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 472,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 456,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f27e8f3c17414dc1" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "address",
                                        className: "jsx-f27e8f3c17414dc1" + " " + "label_form_3",
                                        children: "住所"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 479,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "address",
                                        type: "text",
                                        name: "address",
                                        value: form.address,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    address: e.target.value
                                                })),
                                        placeholder: "手動で入力してください",
                                        className: "jsx-f27e8f3c17414dc1" + " " + "password_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 482,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f27e8f3c17414dc1" + " " + "profile__error",
                                        children: profileErrors.address ? profileErrors.address[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 493,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f27e8f3c17414dc1" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "building",
                                        className: "jsx-f27e8f3c17414dc1" + " " + "label_form_4",
                                        children: "建物名"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 500,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "building",
                                        type: "text",
                                        name: "building",
                                        value: form.building,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    building: e.target.value
                                                })),
                                        className: "jsx-f27e8f3c17414dc1" + " " + "password_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 503,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f27e8f3c17414dc1" + " " + "profile__error",
                                        children: profileErrors.building ? profileErrors.building[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 513,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 499,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f27e8f3c17414dc1" + " " + "submit",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "submit",
                                    value: "更新する",
                                    disabled: isLoading,
                                    className: "jsx-f27e8f3c17414dc1" + " " + "submit_form"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                    lineNumber: 519,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 434,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "f27e8f3c17414dc1",
                children: ".login_page.jsx-f27e8f3c17414dc1{text-align:center}.title.jsx-f27e8f3c17414dc1{color:#4f46e5;margin-bottom:2rem;font-size:2rem;font-weight:700}.form-wrapper.jsx-f27e8f3c17414dc1{text-align:center;display:inline-block}.alert-success2.jsx-f27e8f3c17414dc1{color:#065f46;background-color:#d1fae5;border:1px solid #34d399;border-radius:.5rem;margin-bottom:1.5rem;padding:1rem}.profile__error.jsx-f27e8f3c17414dc1,.user_image_error_message.jsx-f27e8f3c17414dc1{color:#f55;text-align:left;width:400px;margin:-5px auto 5px;padding-left:5px;font-size:15px}.user_image_error_message.jsx-f27e8f3c17414dc1{text-align:center;position:relative;bottom:20px}.item_sell_contents_box_line.jsx-f27e8f3c17414dc1{margin-bottom:0;padding-bottom:0;display:block}.image_name.jsx-f27e8f3c17414dc1{justify-content:center;align-items:center;padding-top:35px;padding-bottom:60px;display:flex;position:relative}.image_button_row.jsx-f27e8f3c17414dc1{align-items:center;gap:30px;display:flex;position:relative;right:50px}.user_image_css.jsx-f27e8f3c17414dc1{object-fit:cover;object-position:center;border-radius:50%;width:100px;height:100px;position:static;overflow:hidden}.upload_submit.jsx-f27e8f3c17414dc1{color:#f55;cursor:pointer;white-space:nowrap;background-color:#fff;border:1px solid #f55;border-radius:5px;margin:0;padding:5px 10px;font-weight:700;position:static}.form-group.jsx-f27e8f3c17414dc1{text-align:center;width:400px;margin:0 auto}.label_form_1.jsx-f27e8f3c17414dc1,.label_form_2.jsx-f27e8f3c17414dc1,.label_form_3.jsx-f27e8f3c17414dc1,.label_form_4.jsx-f27e8f3c17414dc1{text-align:left;font-weight:700;display:block;position:relative;left:0}.label_form_2.jsx-f27e8f3c17414dc1,.label_form_3.jsx-f27e8f3c17414dc1,.label_form_4.jsx-f27e8f3c17414dc1{margin-top:30px}.name_form.jsx-f27e8f3c17414dc1,.email_form.jsx-f27e8f3c17414dc1,.password_form.jsx-f27e8f3c17414dc1{box-sizing:border-box;border:1px solid #d1d5db;border-radius:3px;width:400px;height:30px;margin-bottom:10px;padding:0 10px}.submit.jsx-f27e8f3c17414dc1{margin-top:10px}.submit_form.jsx-f27e8f3c17414dc1{color:#fff;cursor:pointer;background-color:#f55;border:#f55;border-radius:5px;width:400px;height:40px;margin:30px auto;font-weight:700;transition:background-color .1s;position:relative;top:20px}.submit_form.jsx-f27e8f3c17414dc1:hover{background-color:#e54c4c}.submit_form.jsx-f27e8f3c17414dc1:disabled{cursor:not-allowed;background-color:#9ca3af}"
            }, void 0, false, void 0, this)
        ]
    }, authUser?.uid || "unauthenticated", true, {
        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
        lineNumber: 386,
        columnNumber: 5
    }, this);
}
_s(ProfilePage, "fdQomkHKqXfCSKp3ohX8lyf1sls=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSanctumAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ProfilePage;
var _c;
__turbopack_context__.k.register(_c, "ProfilePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)");
var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {
        'default': e
    };
}
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
/*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/ function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var isProd = typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && ("TURBOPACK compile-time value", "development") === "production";
var isString = function(o) {
    return Object.prototype.toString.call(o) === "[object String]";
};
var StyleSheet = /*#__PURE__*/ function() {
    function StyleSheet(param) {
        var ref = param === void 0 ? {} : param, _name = ref.name, name = _name === void 0 ? "stylesheet" : _name, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? isProd : _optimizeForSpeed;
        invariant$1(isString(name), "`name` must be a string");
        this._name = name;
        this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
        invariant$1(typeof optimizeForSpeed === "boolean", "`optimizeForSpeed` must be a boolean");
        this._optimizeForSpeed = optimizeForSpeed;
        this._serverSheet = undefined;
        this._tags = [];
        this._injected = false;
        this._rulesCount = 0;
        var node = typeof window !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
        this._nonce = node ? node.getAttribute("content") : null;
    }
    var _proto = StyleSheet.prototype;
    _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
        invariant$1(typeof bool === "boolean", "`setOptimizeForSpeed` accepts a boolean");
        invariant$1(this._rulesCount === 0, "optimizeForSpeed cannot be when rules have already been inserted");
        this.flush();
        this._optimizeForSpeed = bool;
        this.inject();
    };
    _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
        return this._optimizeForSpeed;
    };
    _proto.inject = function inject() {
        var _this = this;
        invariant$1(!this._injected, "sheet already injected");
        this._injected = true;
        if (typeof window !== "undefined" && this._optimizeForSpeed) {
            this._tags[0] = this.makeStyleTag(this._name);
            this._optimizeForSpeed = "insertRule" in this.getSheet();
            if (!this._optimizeForSpeed) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.");
                }
                this.flush();
                this._injected = true;
            }
            return;
        }
        this._serverSheet = {
            cssRules: [],
            insertRule: function(rule, index) {
                if (typeof index === "number") {
                    _this._serverSheet.cssRules[index] = {
                        cssText: rule
                    };
                } else {
                    _this._serverSheet.cssRules.push({
                        cssText: rule
                    });
                }
                return index;
            },
            deleteRule: function(index) {
                _this._serverSheet.cssRules[index] = null;
            }
        };
    };
    _proto.getSheetForTag = function getSheetForTag(tag) {
        if (tag.sheet) {
            return tag.sheet;
        }
        // this weirdness brought to you by firefox
        for(var i = 0; i < document.styleSheets.length; i++){
            if (document.styleSheets[i].ownerNode === tag) {
                return document.styleSheets[i];
            }
        }
    };
    _proto.getSheet = function getSheet() {
        return this.getSheetForTag(this._tags[this._tags.length - 1]);
    };
    _proto.insertRule = function insertRule(rule, index) {
        invariant$1(isString(rule), "`insertRule` accepts only strings");
        if (typeof window === "undefined") {
            if (typeof index !== "number") {
                index = this._serverSheet.cssRules.length;
            }
            this._serverSheet.insertRule(rule, index);
            return this._rulesCount++;
        }
        if (this._optimizeForSpeed) {
            var sheet = this.getSheet();
            if (typeof index !== "number") {
                index = sheet.cssRules.length;
            }
            // this weirdness for perf, and chrome's weird bug
            // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                return -1;
            }
        } else {
            var insertionPoint = this._tags[index];
            this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
        }
        return this._rulesCount++;
    };
    _proto.replaceRule = function replaceRule(index, rule) {
        if (this._optimizeForSpeed || typeof window === "undefined") {
            var sheet = typeof window !== "undefined" ? this.getSheet() : this._serverSheet;
            if (!rule.trim()) {
                rule = this._deletedRulePlaceholder;
            }
            if (!sheet.cssRules[index]) {
                // @TBD Should we throw an error?
                return index;
            }
            sheet.deleteRule(index);
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                // In order to preserve the indices we insert a deleteRulePlaceholder
                sheet.insertRule(this._deletedRulePlaceholder, index);
            }
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "old rule at index `" + index + "` not found");
            tag.textContent = rule;
        }
        return index;
    };
    _proto.deleteRule = function deleteRule(index) {
        if (typeof window === "undefined") {
            this._serverSheet.deleteRule(index);
            return;
        }
        if (this._optimizeForSpeed) {
            this.replaceRule(index, "");
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "rule at index `" + index + "` not found");
            tag.parentNode.removeChild(tag);
            this._tags[index] = null;
        }
    };
    _proto.flush = function flush() {
        this._injected = false;
        this._rulesCount = 0;
        if (typeof window !== "undefined") {
            this._tags.forEach(function(tag) {
                return tag && tag.parentNode.removeChild(tag);
            });
            this._tags = [];
        } else {
            // simpler on server
            this._serverSheet.cssRules = [];
        }
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        if (typeof window === "undefined") {
            return this._serverSheet.cssRules;
        }
        return this._tags.reduce(function(rules, tag) {
            if (tag) {
                rules = rules.concat(Array.prototype.map.call(_this.getSheetForTag(tag).cssRules, function(rule) {
                    return rule.cssText === _this._deletedRulePlaceholder ? null : rule;
                }));
            } else {
                rules.push(null);
            }
            return rules;
        }, []);
    };
    _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
        if (cssString) {
            invariant$1(isString(cssString), "makeStyleTag accepts only strings as second parameter");
        }
        var tag = document.createElement("style");
        if (this._nonce) tag.setAttribute("nonce", this._nonce);
        tag.type = "text/css";
        tag.setAttribute("data-" + name, "");
        if (cssString) {
            tag.appendChild(document.createTextNode(cssString));
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        if (relativeToTag) {
            head.insertBefore(tag, relativeToTag);
        } else {
            head.appendChild(tag);
        }
        return tag;
    };
    _createClass(StyleSheet, [
        {
            key: "length",
            get: function get() {
                return this._rulesCount;
            }
        }
    ]);
    return StyleSheet;
}();
function invariant$1(condition, message) {
    if (!condition) {
        throw new Error("StyleSheet: " + message + ".");
    }
}
function hash(str) {
    var _$hash = 5381, i = str.length;
    while(i){
        _$hash = _$hash * 33 ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */ return _$hash >>> 0;
}
var stringHash = hash;
var sanitize = function(rule) {
    return rule.replace(/\/style/gi, "\\/style");
};
var cache = {};
/**
 * computeId
 *
 * Compute and memoize a jsx id from a basedId and optionally props.
 */ function computeId(baseId, props) {
    if (!props) {
        return "jsx-" + baseId;
    }
    var propsToString = String(props);
    var key = baseId + propsToString;
    if (!cache[key]) {
        cache[key] = "jsx-" + stringHash(baseId + "-" + propsToString);
    }
    return cache[key];
}
/**
 * computeSelector
 *
 * Compute and memoize dynamic selectors.
 */ function computeSelector(id, css) {
    var selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
    // Sanitize SSR-ed CSS.
    // Client side code doesn't need to be sanitized since we use
    // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
    if (typeof window === "undefined") {
        css = sanitize(css);
    }
    var idcss = id + css;
    if (!cache[idcss]) {
        cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
    }
    return cache[idcss];
}
function mapRulesToStyle(cssRules, options) {
    if (options === void 0) options = {};
    return cssRules.map(function(args) {
        var id = args[0];
        var css = args[1];
        return /*#__PURE__*/ React__default["default"].createElement("style", {
            id: "__" + id,
            // Avoid warnings upon render with a key
            key: "__" + id,
            nonce: options.nonce ? options.nonce : undefined,
            dangerouslySetInnerHTML: {
                __html: css
            }
        });
    });
}
var StyleSheetRegistry = /*#__PURE__*/ function() {
    function StyleSheetRegistry(param) {
        var ref = param === void 0 ? {} : param, _styleSheet = ref.styleSheet, styleSheet = _styleSheet === void 0 ? null : _styleSheet, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? false : _optimizeForSpeed;
        this._sheet = styleSheet || new StyleSheet({
            name: "styled-jsx",
            optimizeForSpeed: optimizeForSpeed
        });
        this._sheet.inject();
        if (styleSheet && typeof optimizeForSpeed === "boolean") {
            this._sheet.setOptimizeForSpeed(optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    }
    var _proto = StyleSheetRegistry.prototype;
    _proto.add = function add(props) {
        var _this = this;
        if (undefined === this._optimizeForSpeed) {
            this._optimizeForSpeed = Array.isArray(props.children);
            this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        if (typeof window !== "undefined" && !this._fromServer) {
            this._fromServer = this.selectFromServer();
            this._instancesCounts = Object.keys(this._fromServer).reduce(function(acc, tagName) {
                acc[tagName] = 0;
                return acc;
            }, {});
        }
        var ref = this.getIdAndRules(props), styleId = ref.styleId, rules = ref.rules;
        // Deduping: just increase the instances count.
        if (styleId in this._instancesCounts) {
            this._instancesCounts[styleId] += 1;
            return;
        }
        var indices = rules.map(function(rule) {
            return _this._sheet.insertRule(rule);
        }) // Filter out invalid rules
        .filter(function(index) {
            return index !== -1;
        });
        this._indices[styleId] = indices;
        this._instancesCounts[styleId] = 1;
    };
    _proto.remove = function remove(props) {
        var _this = this;
        var styleId = this.getIdAndRules(props).styleId;
        invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
        this._instancesCounts[styleId] -= 1;
        if (this._instancesCounts[styleId] < 1) {
            var tagFromServer = this._fromServer && this._fromServer[styleId];
            if (tagFromServer) {
                tagFromServer.parentNode.removeChild(tagFromServer);
                delete this._fromServer[styleId];
            } else {
                this._indices[styleId].forEach(function(index) {
                    return _this._sheet.deleteRule(index);
                });
                delete this._indices[styleId];
            }
            delete this._instancesCounts[styleId];
        }
    };
    _proto.update = function update(props, nextProps) {
        this.add(nextProps);
        this.remove(props);
    };
    _proto.flush = function flush() {
        this._sheet.flush();
        this._sheet.inject();
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function(styleId) {
            return [
                styleId,
                _this._fromServer[styleId]
            ];
        }) : [];
        var cssRules = this._sheet.cssRules();
        return fromServer.concat(Object.keys(this._indices).map(function(styleId) {
            return [
                styleId,
                _this._indices[styleId].map(function(index) {
                    return cssRules[index].cssText;
                }).join(_this._optimizeForSpeed ? "" : "\n")
            ];
        }) // filter out empty rules
        .filter(function(rule) {
            return Boolean(rule[1]);
        }));
    };
    _proto.styles = function styles(options) {
        return mapRulesToStyle(this.cssRules(), options);
    };
    _proto.getIdAndRules = function getIdAndRules(props) {
        var css = props.children, dynamic = props.dynamic, id = props.id;
        if (dynamic) {
            var styleId = computeId(id, dynamic);
            return {
                styleId: styleId,
                rules: Array.isArray(css) ? css.map(function(rule) {
                    return computeSelector(styleId, rule);
                }) : [
                    computeSelector(styleId, css)
                ]
            };
        }
        return {
            styleId: computeId(id),
            rules: Array.isArray(css) ? css : [
                css
            ]
        };
    };
    /**
   * selectFromServer
   *
   * Collects style tags from the document with id __jsx-XXX
   */ _proto.selectFromServer = function selectFromServer() {
        var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
        return elements.reduce(function(acc, element) {
            var id = element.id.slice(2);
            acc[id] = element;
            return acc;
        }, {});
    };
    return StyleSheetRegistry;
}();
function invariant(condition, message) {
    if (!condition) {
        throw new Error("StyleSheetRegistry: " + message + ".");
    }
}
var StyleSheetContext = /*#__PURE__*/ React.createContext(null);
StyleSheetContext.displayName = "StyleSheetContext";
function createStyleRegistry() {
    return new StyleSheetRegistry();
}
function StyleRegistry(param) {
    var configuredRegistry = param.registry, children = param.children;
    var rootRegistry = React.useContext(StyleSheetContext);
    var ref = React.useState({
        "StyleRegistry.useState[ref]": function() {
            return rootRegistry || configuredRegistry || createStyleRegistry();
        }
    }["StyleRegistry.useState[ref]"]), registry = ref[0];
    return /*#__PURE__*/ React__default["default"].createElement(StyleSheetContext.Provider, {
        value: registry
    }, children);
}
function useStyleRegistry() {
    return React.useContext(StyleSheetContext);
}
// Opt-into the new `useInsertionEffect` API in React 18, fallback to `useLayoutEffect`.
// https://github.com/reactwg/react-18/discussions/110
var useInsertionEffect = React__default["default"].useInsertionEffect || React__default["default"].useLayoutEffect;
var defaultRegistry = typeof window !== "undefined" ? createStyleRegistry() : undefined;
function JSXStyle(props) {
    var registry = defaultRegistry ? defaultRegistry : useStyleRegistry();
    // If `registry` does not exist, we do nothing here.
    if (!registry) {
        return null;
    }
    if (typeof window === "undefined") {
        registry.add(props);
        return null;
    }
    useInsertionEffect({
        "JSXStyle.useInsertionEffect": function() {
            registry.add(props);
            return ({
                "JSXStyle.useInsertionEffect": function() {
                    registry.remove(props);
                }
            })["JSXStyle.useInsertionEffect"];
        // props.children can be string[], will be striped since id is identical
        }
    }["JSXStyle.useInsertionEffect"], [
        props.id,
        String(props.dynamic)
    ]);
    return null;
}
JSXStyle.dynamic = function(info) {
    return info.map(function(tagInfo) {
        var baseId = tagInfo[0];
        var props = tagInfo[1];
        return computeId(baseId, props);
    }).join(" ");
};
exports.StyleRegistry = StyleRegistry;
exports.createStyleRegistry = createStyleRegistry;
exports.style = JSXStyle;
exports.useStyleRegistry = useStyleRegistry;
}),
"[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)").style;
}),
]);

//# sourceMappingURL=_6ae5d5ae._.js.map