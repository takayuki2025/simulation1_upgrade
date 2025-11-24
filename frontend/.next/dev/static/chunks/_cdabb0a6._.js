(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/useApi.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useApi",
    ()=>useApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// axios の型を正しくインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-client] (ecmascript)"); // useAuthフックのパスを調整してください
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Next.jsの環境変数を使用
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
function useApi() {
    _s();
    // useAuth から logout と isLoggingOut を取得
    const { user, logout, isLoggingOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    /**
   * 認証済みのAPIリクエストを実行する汎用関数
   * @param url リクエストURL（API BASE URLからの相対パス）
   * @param config Axiosリクエスト設定
   * @returns APIレスポンスデータ
   */ const authenticatedFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useApi.useCallback[authenticatedFetch]": async (url, config = {})=>{
            if (isLoggingOut) {
                throw new Error("Logging out, cannot perform API request.");
            }
            // ユーザーオブジェクトが存在しない場合は即座に認証エラー
            if (!user) {
                console.error("[useApi] User object missing. Forcing logout.");
                await logout();
                throw new Error("User not authenticated.");
            }
            // --- 最新のFirebase ID Tokenを強制的に取得 ---
            let idToken;
            try {
                // getIdToken(true): キャッシュを無視して、Firebaseから強制的に最新のトークンを取得
                idToken = await user.getIdToken(true);
                console.log(`[useApi] Token acquired. Starts with: ${idToken.substring(0, 10)}...`);
            } catch (e) {
                console.error("[useApi] Failed to refresh/get ID Token. Forcing logout.", e);
                await logout();
                throw new Error("Failed to retrieve fresh authentication token.");
            }
            // ----------------------------------------
            // --- URLプレフィックスのロジック (現状維持) ---
            let apiPath = url.startsWith("/api/") ? url : `/api${url}`;
            apiPath = apiPath.replace(/\/\/+/g, "/");
            // ----------------------------------------
            // ★★★ 修正箇所: ヘッダーマージロジックを修正し、Authorizationを最後に設定 ★★★
            const baseHeaders = {
                "Content-Type": "application/json",
                Accept: "application/json"
            };
            // 1. デフォルトヘッダーと、configから渡されたヘッダーをマージ
            const mergedHeaders = {
                ...baseHeaders,
                ...config.headers
            };
            // 2. 最後に、トークンを確実に設定（他のヘッダーで上書きされないようにする）
            const finalHeaders = {
                ...mergedHeaders,
                Authorization: `Bearer ${idToken}`,
                "X-Firebase-Token": idToken
            };
            // 💡 修正点 2: delete演算子のエラー (ts(2790)) を解消するためにキャストを使用
            // 3. FormDataを使用する場合に Content-Type: undefined のエントリを削除する
            if (finalHeaders["Content-Type"] === undefined) {
                // 'as any' を使用して、型チェックを一時的に無効にする
                delete finalHeaders["Content-Type"];
            }
            const headers = finalHeaders; // 最終的なヘッダー
            // デバッグログ (★ここでAuthorizationヘッダーが正しく設定されているか確認)
            console.log("[useApi] Request Headers being sent:", headers);
            // ★★★ 修正箇所ここまで ★★★
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                    method: config.method || "GET",
                    url: `${API_BASE_URL}${apiPath}`,
                    // AxiosConfigのdataとbodyの扱いを統一
                    data: config.data || config.body,
                    params: config.params,
                    headers: headers,
                    withCredentials: true
                });
                return response.data;
            } catch (error) {
                // AxiosError の型ガード
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
                    const status = error.response?.status;
                    if (status === 401) {
                        console.error("[useApi] 401 Unauthorized detected. Throwing error for page recovery (reloadAuthToken).");
                        // ログアウトせず、エラーをスローして呼び出し元（ProfilePage.tsx）の catch に渡す
                        const customError = new Error(`API Request Failed with status 401`);
                        customError.status = 401;
                        customError.response = error.response;
                        throw customError;
                    }
                    // 401以外のエラーもカスタムエラーとしてスロー
                    const customError = new Error(`API Request Failed with status ${status || "Unknown"}`);
                    customError.status = status;
                    customError.response = error.response;
                    throw customError;
                }
                // ネットワークエラーなど (AxiosErrorではない場合)
                console.error("[useApi] Network or other unexpected error:", error);
                throw error;
            }
        }
    }["useApi.useCallback[authenticatedFetch]"], [
        user,
        logout,
        isLoggingOut
    ] // 依存配列
    );
    const updateProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useApi.useCallback[updateProfile]": async (data)=>{
            const response = await authenticatedFetch("/mypage/profile_update", {
                method: "PATCH",
                data: data
            });
            if (response && response.user) {
                return response.user;
            }
            throw new Error("Profile update failed: Invalid response structure.");
        }
    }["useApi.useCallback[updateProfile]"], [
        authenticatedFetch
    ]);
    const uploadImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useApi.useCallback[uploadImage]": async (formData, url = "/upload2")=>{
            // 画像アップロード時には、axiosのContent-Typeをundefinedに設定することで、
            // 適切なBoundaryを持つ multipart/form-data ヘッダーが自動で設定されるようにする
            const response = await authenticatedFetch(url, {
                method: "POST",
                data: formData,
                headers: {
                    "Content-Type": undefined
                }
            });
            if (response && response.user) {
                return response.user;
            }
            throw new Error("Image upload failed: Invalid response structure.");
        }
    }["useApi.useCallback[uploadImage]"], [
        authenticatedFetch
    ]);
    return {
        authenticatedFetch,
        updateProfile,
        uploadImage
    };
}
_s(useApi, "wr7ZUEWX5x16jX4DZs9HUfru4eo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(main)/mypage/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Mypage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
// ★ 以下のカスタムフックは、ご提示のプロファイル編集ページ (profile/page.tsx)
//    と共通のロジックを使用していると想定しています。
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-client] (ecmascript)"); // Next.jsのカスタム認証フック
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useApi.tsx [app-client] (ecmascript)"); // 認証済みリクエスト用カスタムフック
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// =======================================================
// Next.js クライアントコンポーネント
// =======================================================
// 環境変数からAPIベースURLを取得
// Next.jsでは process.env.NEXT_PUBLIC_... の形式
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
/**
 * アセットURLを生成する汎用ヘルパー関数
 * Nuxt 3 コンポーネントの getAssetUrl() ロジックを移植
 */ const getAssetUrl = (path, isProfileImage = false)=>{
    // 1. path が存在しない、または空の場合は、デフォルト画像を返す
    if (!path) {
        if (isProfileImage) {
            const DEFAULT_IMAGE_PATH = "storage/images/default-profile2.jpg";
            // ベースURLの末尾が / で終わるか、DEFAULT_IMAGE_PATHの先頭が / で始まるかを考慮
            return `${API_BASE_URL?.replace(/\/$/, "")}/${DEFAULT_IMAGE_PATH}`;
        }
        // 商品画像の場合はパスがないので空文字列を返す
        return "";
    }
    // 2. pathがURL形式（http:// または https:// で始まる）であれば、そのまま返す
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    // 3. パスが絶対URL形式でなく、/storage/などで始まっている場合
    const cleanBase = API_BASE_URL?.replace(/\/$/, "") || "";
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    // 例: [API_BASE_URL]/storage/images/item/xxx.jpg
    return `${cleanBase}/${cleanPath}`;
};
function Mypage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { user: authUser, isAuthenticated, isLoading: isAuthLoading, logout, reloadAuthToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { authenticatedFetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApi"])();
    // --- 状態管理 ---
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // 全体ローディング
    // URLクエリパラメータから現在のページ (sell/buy) を取得
    const page = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Mypage.useMemo[page]": ()=>{
            return searchParams.get("page") === "buy" ? "buy" : "sell";
        }
    }["Mypage.useMemo[page]"], [
        searchParams
    ]);
    // URLクエリパラメータからメール認証状態を取得 (Nuxt版ロジックを移植)
    const isVerificationRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Mypage.useMemo[isVerificationRedirect]": ()=>{
            return searchParams.get("verified") === "true";
        }
    }["Mypage.useMemo[isVerificationRedirect]"], [
        searchParams
    ]);
    // ----------------------------------------------------------------
    // 1. ユーザー情報取得ロジック
    // ----------------------------------------------------------------
    const fetchUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Mypage.useCallback[fetchUserProfile]": async ()=>{
            // 認証解決待ち、または既にロード済みの場合はスキップ
            if (isAuthLoading) return;
            // 未認証の場合はログインへリダイレクト
            if (!isAuthenticated) {
                if (isVerificationRedirect) {
                    console.log("Verification redirect detected. Waiting for session resolve.");
                    return; // メール認証リダイレクト中は待機
                }
                console.log("Unauthenticated detected. Redirecting to /login.");
                // ログアウト処理が完了していない場合は強制リダイレクト
                if (authUser === null) {
                    router.replace("/login");
                }
                return;
            }
            // 認証済みでユーザーデータがない場合のみフェッチ
            if (user) return; // 既にユーザーデータがあればフェッチしない
            setIsLoading(true);
            try {
                // APIから最新の完全なプロフィールデータを取得
                const response = await authenticatedFetch("/mypage/profile");
                if (response && response.user) {
                    setUser(response.user);
                    // メール認証後のクエリパラメータ処理
                    if (isVerificationRedirect) {
                        setSuccessMessage(`メール認証が完了しました！引き続きサービスをご利用いただけます。`);
                        // URLクエリから 'verified' を除去（replaceで実現）
                        router.replace(`/mypage?page=${page}`);
                    }
                }
            } catch (error) {
                console.error("プロフィールデータの取得に失敗しました:", error);
                const status = error.status || error.response && error.response.status;
                if (status === 401) {
                    // Nuxt版と同様、グローバルインターセプターまたはuseApiで401処理（トークンリフレッシュ/リダイレクト）を期待
                    // ここでは、カスタムフック任せとして、もし失敗したらログアウトを促す
                    console.log("401エラーを捕捉 (プロフィール取得)。");
                    await logout(); // 認証フックのログアウトを呼び出す
                } else {
                    setSuccessMessage("プロフィールデータのロードに失敗しました。");
                }
            } finally{
                setIsLoading(false);
            }
        }
    }["Mypage.useCallback[fetchUserProfile]"], [
        isAuthLoading,
        isAuthenticated,
        user,
        router,
        authUser,
        authenticatedFetch,
        logout,
        isVerificationRedirect,
        page
    ]);
    // ----------------------------------------------------------------
    // 2. 商品リスト取得ロジック
    // ----------------------------------------------------------------
    const fetchItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Mypage.useCallback[fetchItems]": async ()=>{
            // ユーザープロフィールのロードが完了していることを確認
            if (!user) {
                await fetchUserProfile();
                if (!user) return; // プロフィールロード失敗/未認証の場合は終了
            }
            setIsLoading(true);
            setItems([]);
            try {
                const endpoint = `/mypage/items?page=${page}`;
                // バックエンドから商品リストを取得する
                const response = await authenticatedFetch(endpoint);
                setItems(response.items || []);
            } catch (error) {
                console.error(`${page}商品の取得に失敗しました:`, error);
                const status = error.status || error.response && error.response.status;
                if (status === 401) {
                    console.log(`401エラーを捕捉 (アイテム取得)。`);
                    await logout();
                }
            // 商品取得エラーは致命的ではないため、ロード状態のみ解除
            } finally{
                setIsLoading(false);
            }
        }
    }["Mypage.useCallback[fetchItems]"], [
        user,
        page,
        authenticatedFetch,
        fetchUserProfile,
        logout
    ]);
    // ----------------------------------------------------------------
    // 3. useEffect による実行管理
    // ----------------------------------------------------------------
    // 初回ロード時: 認証チェックとプロフィールデータ取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mypage.useEffect": ()=>{
            fetchUserProfile();
        }
    }["Mypage.useEffect"], [
        fetchUserProfile
    ]);
    // page (クエリパラメータ) の変更時、または user データ取得完了時に商品リストをフェッチ
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mypage.useEffect": ()=>{
            // ユーザーデータがロードされ、認証済みであればアイテムをフェッチ
            if (user && isAuthenticated && !isAuthLoading) {
                fetchItems();
            }
        }
    }["Mypage.useEffect"], [
        page,
        user,
        isAuthenticated,
        isAuthLoading,
        fetchItems
    ]);
    // ユーティリティ: プロフィール編集ページへ遷移
    const goToProfileEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Mypage.useCallback[goToProfileEdit]": ()=>{
            router.push("/mypage/profile");
        }
    }["Mypage.useCallback[goToProfileEdit]"], [
        router
    ]);
    // ----------------------------------------------------------------
    // 4. レンダーロジック
    // ----------------------------------------------------------------
    // 認証解決待ち、または全体ロード中の表示
    if (isAuthLoading || isLoading && !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/page.tsx",
                    lineNumber: 248,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-3 text-gray-600",
                    children: isAuthLoading ? "認証状態を確認中..." : "データを読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/page.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/page.tsx",
            lineNumber: 247,
            columnNumber: 7
        }, this);
    }
    // 認証済みだがユーザーデータがない場合 (fetchUserProfileでリダイレクト失敗時など)
    if (!isAuthenticated || !user) {
        // 既に fetchUserProfile() 内でリダイレクトされているはずだが、念のため。
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xl text-red-500",
                children: "ユーザー情報がロードできませんでした。"
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 261,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(main)/mypage/page.tsx",
            lineNumber: 260,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-b71dba74520fd182" + " " + "profile_page",
        children: [
            successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-b71dba74520fd182" + " " + "validation-errors bg-green-100 border border-green-400 text-green-700",
                children: successMessage
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 272,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-b71dba74520fd182" + " " + "profile_header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b71dba74520fd182" + " " + "profile_header_1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: getAssetUrl(user.user_image, true),
                                alt: "プロフィール画像",
                                className: "jsx-b71dba74520fd182" + " " + "user_image_css"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "jsx-b71dba74520fd182" + " " + "user_name_css",
                                children: user.name
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b71dba74520fd182" + " " + "user_edit_css1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: goToProfileEdit,
                                    className: "jsx-b71dba74520fd182" + " " + "user_edit_css2",
                                    children: "プロフィールを編集"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/mypage/page.tsx",
                                    lineNumber: 288,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b71dba74520fd182" + " " + "profile_header_2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/mypage?page=sell",
                                className: `sell_items ${page === "sell" ? "active" : ""}`,
                                scroll: false,
                                children: "出品した商品"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/mypage?page=buy",
                                className: `buy_items ${page === "buy" ? "active" : ""}`,
                                scroll: false,
                                children: "購入した商品"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-b71dba74520fd182" + " " + "profile_content",
                children: [
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b71dba74520fd182" + " " + "text-center p-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b71dba74520fd182" + " " + "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-b71dba74520fd182" + " " + "text-gray-500 mt-3",
                                children: "商品リストを読み込み中..."
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 317,
                        columnNumber: 11
                    }, this),
                    !isLoading && items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b71dba74520fd182" + " " + "mt-8 text-center text-gray-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-b71dba74520fd182",
                            children: page === "sell" ? "出品した商品はありません。" : "購入した商品はありません。"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/page.tsx",
                            lineNumber: 325,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 324,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b71dba74520fd182" + " " + "items_select",
                        children: items.map((item)=>{
                            const displayItem = page === "buy" ? item.item : item;
                            // buy ページで item.item が null の場合はスキップ（異常データ）
                            if (page === "buy" && !displayItem) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b71dba74520fd182" + " " + "items_select_all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/item/${displayItem.id}`,
                                    className: "mypage_item_",
                                    children: [
                                        displayItem.item_image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: getAssetUrl(displayItem.item_image),
                                            alt: displayItem.name + "の商品写真",
                                            className: "jsx-b71dba74520fd182"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/mypage/page.tsx",
                                            lineNumber: 346,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-b71dba74520fd182" + " " + "no-image-placeholder",
                                            children: "No Image"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(main)/mypage/page.tsx",
                                            lineNumber: 351,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-b71dba74520fd182" + " " + "item-details",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "jsx-b71dba74520fd182",
                                                    children: displayItem.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/mypage/page.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 23
                                                }, this),
                                                displayItem.remain === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-b71dba74520fd182" + " " + "sold-text",
                                                    children: "sold"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/mypage/page.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(main)/mypage/page.tsx",
                                            lineNumber: 353,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(main)/mypage/page.tsx",
                                    lineNumber: 340,
                                    columnNumber: 19
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/app/(main)/mypage/page.tsx",
                                lineNumber: 339,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/mypage/page.tsx",
                        lineNumber: 332,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/mypage/page.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "b71dba74520fd182",
                children: '.profile_page.jsx-b71dba74520fd182{max-width:1400px;margin:0 auto}.profile_header.jsx-b71dba74520fd182{border-bottom:2px solid #5f5f5f;padding-bottom:20px}.user_image_css.jsx-b71dba74520fd182{object-fit:cover;object-position:center;border-radius:50%;width:90px;height:90px;position:relative;left:200px;overflow:hidden}.user_name_css.jsx-b71dba74520fd182{position:relative;left:220px}.user_edit_css1.jsx-b71dba74520fd182{margin-left:auto}.user_edit_css2.jsx-b71dba74520fd182{color:#f55;cursor:pointer;background-color:#fff;border:2px solid #f55;border-radius:5px;width:200px;height:35px;font-size:15px;font-weight:700;transition:background-color .2s,color .2s;position:relative;right:200px}.user_edit_css2.jsx-b71dba74520fd182:hover{background-color:#ffeaea}.items_select.jsx-b71dba74520fd182{grid-template-columns:repeat(4,1fr);gap:30px;padding:60px;display:grid}.items_select_all.jsx-b71dba74520fd182{flex-direction:column;width:100%;max-width:250px;display:flex}.items_select_all.jsx-b71dba74520fd182 a.jsx-b71dba74520fd182,.mypage_item_.jsx-b71dba74520fd182{color:#000;width:100%;height:auto;text-decoration:none;transition:opacity .2s;display:block}.items_select_all.jsx-b71dba74520fd182 a.jsx-b71dba74520fd182:hover{opacity:.8}.items_select.jsx-b71dba74520fd182 img.jsx-b71dba74520fd182{aspect-ratio:1;object-fit:cover;width:100%;display:block}.no-image-placeholder.jsx-b71dba74520fd182{aspect-ratio:1;color:#a0a0a0;background-color:#f0f0f0;border:1px dashed #ccc;justify-content:center;align-items:center;width:100%;font-size:16px;display:flex}.item-details.jsx-b71dba74520fd182{justify-content:space-between;align-items:center;gap:8px;margin-top:8px;display:flex}.items_select_all.jsx-b71dba74520fd182 label.jsx-b71dba74520fd182{text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:1.4;overflow:hidden}.sold-text.jsx-b71dba74520fd182{color:#ff4041;white-space:nowrap;font-size:14px;font-weight:700}.profile_header_1.jsx-b71dba74520fd182{text-align:center;align-items:center;height:200px;display:flex;position:relative}.profile_header_2.jsx-b71dba74520fd182{display:flex}.sell_items.jsx-b71dba74520fd182,.buy_items.jsx-b71dba74520fd182{color:#5f5f5f;padding-bottom:5px;font-weight:800;text-decoration:none;transition:color .2s;position:relative}.sell_items.jsx-b71dba74520fd182{left:70px}.buy_items.jsx-b71dba74520fd182{left:120px}.sell_items.jsx-b71dba74520fd182:hover,.buy_items.jsx-b71dba74520fd182:hover{color:#f88}.sell_items.active.jsx-b71dba74520fd182,.buy_items.active.jsx-b71dba74520fd182{color:#f55}.sell_items.active.jsx-b71dba74520fd182:after,.buy_items.active.jsx-b71dba74520fd182:after{content:"";background-color:#f55;border-radius:2px;width:100%;height:3px;position:absolute;bottom:-1px;left:0}.validation-errors.jsx-b71dba74520fd182{z-index:100;text-align:center;color:#155724;background-color:#d4edda;border:1px solid #c3e6cb;border-radius:8px;width:90%;max-width:400px;padding:10px;position:fixed;top:50px;left:50%;transform:translate(-50%);box-shadow:0 4px 6px -1px #0000001a}@media (width<=1024px){.items_select.jsx-b71dba74520fd182{grid-template-columns:repeat(3,1fr);gap:30px;padding:30px}.user_image_css.jsx-b71dba74520fd182,.user_name_css.jsx-b71dba74520fd182,.user_edit_css2.jsx-b71dba74520fd182{margin:0 10px;position:static}.profile_header_1.jsx-b71dba74520fd182{flex-wrap:wrap;justify-content:center;height:auto;padding:20px 0}.user_edit_css1.jsx-b71dba74520fd182{text-align:center;width:100%;margin:10px auto}.user_edit_css2.jsx-b71dba74520fd182{width:80%;max-width:200px}.sell_items.jsx-b71dba74520fd182,.buy_items.jsx-b71dba74520fd182{margin:0 20px;left:0}.profile_header_2.jsx-b71dba74520fd182{justify-content:center}}@media (width<=640px){.items_select.jsx-b71dba74520fd182{grid-template-columns:repeat(2,1fr);gap:20px;padding:20px 10px}.profile_page.jsx-b71dba74520fd182{padding:0 10px}.sell_items.jsx-b71dba74520fd182,.buy_items.jsx-b71dba74520fd182{margin:0 10px}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/mypage/page.tsx",
        lineNumber: 269,
        columnNumber: 5
    }, this);
}
_s(Mypage, "Xe1sNdJcmqtOFPze0/t6mpnQavo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApi"]
    ];
});
_c = Mypage;
var _c;
__turbopack_context__.k.register(_c, "Mypage");
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

//# sourceMappingURL=_cdabb0a6._.js.map