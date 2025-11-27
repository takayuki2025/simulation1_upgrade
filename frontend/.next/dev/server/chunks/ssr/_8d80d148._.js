module.exports = [
"[project]/hooks/useApi.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useApi",
    ()=>useApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// axios の型を正しくインポート
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-ssr] (ecmascript)"); // useAuthフックのパスを調整してください
"use client";
;
;
;
// Next.jsの環境変数を使用
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
function useApi() {
    // useAuth からユーザー情報、ログアウト関数、ログアウト状態を取得
    const { user, logout, isLoggingOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    /**
   * 認証済みのAPIリクエストを実行する汎用関数 (Firebase ID Tokenを自動付与)
   * @param url リクエストURL（/api/ から始まる相対パスを推奨）
   * @param config Axiosリクエスト設定
   * @returns APIレスポンスデータ
   */ const authenticatedFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (url, config = {})=>{
        if (isLoggingOut) {
            throw new Error("Logging out, cannot perform API request.");
        }
        // ユーザーオブジェクトが存在しない場合は、認証セッションがないためログアウト処理へ
        if (!user) {
            console.error("[useApi] User object missing. Forcing logout.");
            // await logout(); // Home.tsx側で認証状態を見てスキップするため、ここではログアウトを強制しない場合もある
            throw new Error("User not authenticated.");
        }
        // --- 最新のFirebase ID Tokenを強制的に取得 (トークン失効対策) ---
        let idToken;
        try {
            // getIdToken(true): キャッシュを無視して、Firebaseから強制的に最新のトークンを取得
            idToken = await user.getIdToken(true);
        } catch (e) {
            console.error("[useApi] Failed to refresh/get ID Token. Forcing logout.", e);
            await logout(); // トークン取得失敗は致命的エラーのためログアウト
            throw new Error("Failed to retrieve fresh authentication token.");
        }
        // ----------------------------------------
        // --- APIパスの整形 ---
        // /api/ プレフィックスを保証し、重複するスラッシュを削除
        let apiPath = url.startsWith("/api/") ? url : `/api${url}`;
        apiPath = apiPath.replace(/\/\/+/g, "/");
        // ----------------------------------------
        // --- ヘッダーの構築 ---
        const baseHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        // 1. デフォルトヘッダーと、configから渡されたヘッダーをマージ
        const mergedHeaders = {
            ...baseHeaders,
            ...config.headers
        };
        // 2. 最後に、認証トークンを確実に設定 (上書きされないように最後に配置)
        const finalHeaders = {
            ...mergedHeaders,
            Authorization: `Bearer ${idToken}`,
            "X-Firebase-Token": idToken
        };
        // 💡 修正点 2: FormDataを使用する場合の 'Content-Type' 削除ロジック
        // Content-Type: undefined のエントリを削除し、Axios/ブラウザに自動で multipart/form-data の設定をさせる
        if (finalHeaders["Content-Type"] === undefined) {
            // TypeScriptエラー回避のため 'as any' で一時的に型チェックを無効にする
            delete finalHeaders["Content-Type"];
        }
        const headers = finalHeaders;
        // --- Axiosリクエストの実行 ---
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                method: config.method || "GET",
                url: `${API_BASE_URL}${apiPath}`,
                // config.data または config.body のいずれかをリクエストボディとして使用
                data: config.data || config.body,
                params: config.params,
                headers: headers,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            // --- エラーハンドリング ---
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    console.error("[useApi] 401 Unauthorized detected. Token likely expired on backend.");
                    // ログアウトせず、エラーをスローして呼び出し元でリカバリ（必要に応じてリロードやリトライ）させる
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
            // ネットワークエラーなど
            console.error("[useApi] Network or other unexpected error:", error);
            throw error;
        }
    }, [
        user,
        logout,
        isLoggingOut
    ] // 依存配列: user/logout/isLoggingOut が変わったら関数を再生成
    );
    // --- プロファイル更新専用ラッパー ---
    const updateProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (data)=>{
        const response = await authenticatedFetch("/mypage/profile_update", {
            method: "PATCH",
            data: data
        });
        if (response && response.user) {
            return response.user;
        }
        throw new Error("Profile update failed: Invalid response structure.");
    }, [
        authenticatedFetch
    ] // 依存配列
    );
    // --- 画像アップロード専用ラッパー ---
    const uploadImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (formData, url = "/upload2")=>{
        // FormDataを送信する際、Content-Type: undefined とすることで、
        // Axiosが自動的に適切な 'multipart/form-data' ヘッダーを生成する
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
    }, [
        authenticatedFetch
    ] // 依存配列
    );
    return {
        authenticatedFetch,
        updateProfile,
        uploadImage
    };
}
}),
"[project]/app/(main)/mypage/profile/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useApi.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// =======================================================
// グローバル変数・ヘルパー関数
// =======================================================
// 環境変数からAPIベースURLを取得
const API_BASE_URL = ("TURBOPACK compile-time value", "https://laravel.test");
/**
 * プロフィール画像のURLを生成するヘルパー関数
 * Vue.jsの画像処理やLaravelのStorageパス解決を模倣
 */ const getProfileImageUrl = (path)=>{
    const base = API_BASE_URL;
    const DEFAULT_IMAGE_PATH = "storage/images/default-profile2.jpg";
    const DEFAULT_IMAGE_FULL_URL = `${base}/${DEFAULT_IMAGE_PATH}`;
    if (!path) {
        return DEFAULT_IMAGE_FULL_URL;
    }
    // 既にフルURLの場合はそのまま返す (S3など外部URL対応)
    if (path.startsWith("http")) {
        return path;
    }
    // 相対パスの場合はベースURLを付与
    // 先頭のスラッシュを削除して二重スラッシュを防ぐ
    return `${base}/${path.replace(/^\//, "")}`;
};
function ProfilePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // 1. 認証フック: ユーザー状態と認証アクションを提供
    const { user: authUser, isAuthenticated, isLoading: isAuthLoading, logout, reloadAuthToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    // 2. APIフック: 認証ヘッダー付きのAPI通信を提供
    const { authenticatedFetch, updateProfile, uploadImage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useApi$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApi"])();
    // -------------------- State --------------------
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        post_number: "",
        address: "",
        building: ""
    });
    const [profileErrors, setProfileErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [imageError, setImageError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // UI全体のローディング (trueの間はUIをブロック)
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // APIデータ取得中の状態 (重複フェッチを防ぐための内部状態)
    const [isFetching, setIsFetching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 401エラーからのリカバリー中を示す状態
    const [isRecovering, setIsRecovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // -------------------- Computed Value (useMemo) --------------------
    // URLクエリパラメータからメール認証状態を取得
    const isVerificationRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return searchParams.get("verified") === "true";
    }, [
        searchParams
    ]);
    // ----------------------------------------------------------------
    // 1. データ初期化ヘルパー
    // ----------------------------------------------------------------
    /**
   * APIから取得したユーザーデータでフォームと状態を初期化する
   */ const initializeUserData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((apiData)=>{
        let sourceData = null;
        // APIレスポンスの構造を考慮 ('user'キーの下にあるか、トップレベルか)
        if (apiData && apiData.user) {
            sourceData = apiData.user;
        } else if (apiData && apiData.id && apiData.name) {
            sourceData = apiData;
        }
        // ユーザーStateの更新 (無限ループを防ぐため、データが実際に変更されているかチェック)
        setUser((current)=>{
            if (JSON.stringify(current) !== JSON.stringify(sourceData)) {
                console.log("✅ [InitData] user State を更新しました。");
                return sourceData;
            }
            return current;
        });
        // フォームStateの更新
        if (sourceData) {
            setForm({
                name: sourceData.name || "",
                post_number: sourceData.post_number || "",
                address: sourceData.address || "",
                building: sourceData.building || ""
            });
        }
    }, []); // 依存配列は空でOK
    // ----------------------------------------------------------------
    // 2. データ取得ロジック (401リカバリー処理を含む)
    // ----------------------------------------------------------------
    /**
   * サーバーからプロフィールデータを取得する関数。401エラー時にトークンリフレッシュを試みる。
   * @param isRetry 再試行 (トークンリフレッシュ後) の呼び出しであるか
   */ const fetchUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (isRetry = false)=>{
        // 外部の状態 (isFetching や isAuthLoading) のチェックは useEffect に任せ、
        // ここではロジックの純粋性を保つ方が望ましいが、既存のロジックを踏襲し、
        // isRetryフラグで親の try/finally ブロックの動作を制御する設計を維持する。
        // 初回呼び出し時のみ isFetching を設定
        if (!isRetry) setIsFetching(true);
        try {
            // サーバーから最新のユーザーデータをフェッチ
            const response = await authenticatedFetch("/mypage/profile");
            initializeUserData(response);
            console.log("✅ [Fetch] プロフィールデータ取得に成功。");
            if (isVerificationRedirect) {
                setSuccessMessage("メール認証が完了しました！引き続きサービスをご利用いただけます。");
            }
            // 再試行が成功した場合は、リカバリー状態を解除し、成功メッセージをリセット
            if (isRetry) {
                setIsRecovering(false);
                setSuccessMessage("認証情報を回復し、データを再取得しました。");
            }
        } catch (err) {
            console.error("プロフィールデータのロードに失敗しました:", err);
            const status = err.status || err.response && err.response.status;
            if (status === 401) {
                // 既に再試行して再度401なら、無限ループを防ぐためログアウト
                if (isRetry) {
                    console.error("401再検出 (再試行時)。リカバリー失敗とみなしログアウトします。");
                    await logout();
                    return;
                }
                // ★ 401初回検出時のリカバリー処理 ★
                console.log(`401エラーを検出。トークンリフレッシュを試行...`);
                setSuccessMessage("認証情報を更新中...");
                setIsRecovering(true); // リカバリー開始
                try {
                    await reloadAuthToken(); // トークンを強制リフレッシュ
                    setSuccessMessage("認証情報を更新しました。データを再取得します。");
                    // 重要な修正ポイント: トークンリフレッシュ成功後、自身を再帰的に呼び出して再試行
                    // 再試行が成功すれば、tryブロックが実行され、setIsRecovering(false)となる。
                    await fetchUserProfile(true);
                } catch (reloadError) {
                    console.error("トークンのリロードに失敗。ログアウトします。", reloadError);
                    await logout();
                    setSuccessMessage("セッションが切れました。再度ログインが必要です。");
                }
                // リカバリーロジックが完了したら、この catch ブロックの実行を終了
                return;
            }
            // 401以外のエラー
            setSuccessMessage(`データのロード中に予期せぬエラーが発生しました。(Status: ${status || "不明"})`);
        } finally{
            // 初回呼び出しが終了した時のみ isFetching をリセットする
            // isRetry=true の再帰呼び出しが成功した場合、親の finally は実行されるが、
            // その時は isRetry=false のブロックしか実行されないため、isFetching のリセットは親で実行される。
            if (!isRetry) {
                setIsFetching(false);
            // ⚠️ 注意: 2回目の API Callが401エラーで失敗し、ログアウトした場合、
            // 親の finally が実行される。この時、isLoadingはまだ true のまま。
            // isLoading の制御は useEffect に任せることでこの複雑さを回避する。
            }
        }
    }, // ★ 依存配列から isFetching を削除し、外部状態への依存を減らす
    [
        authenticatedFetch,
        initializeUserData,
        logout,
        isVerificationRedirect,
        reloadAuthToken,
        isAuthLoading
    ]);
    // ----------------------------------------------------------------
    // 3. 認証状態とデータフェッチの監視 (useEffect)
    // ----------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // 1. 認証解決待ち、またはリカバリー中の場合はスキップ
        if (isAuthLoading || isRecovering) return;
        // 2. 未認証の場合はログインへリダイレクト
        if (!isAuthenticated) {
            if (isVerificationRedirect) {
                // メール認証リダイレクト中は、セッション解決を待つ
                console.log("Verification redirect detected. Waiting for session resolve.");
                return;
            }
            console.log("Unauthenticated detected. Redirecting to /login.");
            // authUserがnullで、認証情報が確実にない場合にリダイレクトを実行
            if (authUser === null) {
                router.replace("/login");
            }
            return;
        }
        // 3. 認証済みだがユーザーデータがまだロードされていない、かつ**現在フェッチ中でない**場合
        if (isAuthenticated && !user && !isFetching) {
            console.log("Authenticated but user data is missing. Fetching profile.");
            // isLoadingはここで true のまま維持される
            fetchUserProfile(false); // 初回フェッチ
            return;
        }
        // 4. データがロード済みで認証済みであれば、ローディングを解除してUIを表示可能にする
        if (user && isAuthenticated) {
            setIsLoading(false);
            // メール認証リダイレクトのクエリパラメータをクリーンアップ
            if (isVerificationRedirect) {
                // ★★★ 修正箇所: shallow オプションを削除し、単一引数に変更 ★★★
                // App Router (next/navigation) では shallow は使用できません。
                // 単一引数で replace を呼ぶことで、クエリパラメータなしのパスに遷移します。
                router.replace("/mypage/profile");
            }
            return;
        }
    // 依存配列に isFetching を追加することで、フェッチの開始・終了を監視し、
    // 状態に応じた次のアクションを実行できる。
    }, [
        isAuthLoading,
        isAuthenticated,
        router,
        fetchUserProfile,
        user,
        isFetching,
        isVerificationRedirect,
        isRecovering,
        authUser
    ]);
    // ----------------------------------------------------------------
    // 4. 画像アップロード処理
    // ----------------------------------------------------------------
    const handleImageUpload = async (event)=>{
        const file = event.target.files?.[0];
        if (!file || !user) return;
        setImageError("");
        setSuccessMessage("");
        setIsLoading(true);
        const formData = new FormData();
        formData.append("user_image", file);
        try {
            // APIに画像をアップロードし、更新されたユーザーデータを受け取る
            const updatedUser = await uploadImage(formData, "/upload2");
            // UIの状態を更新
            setUser(updatedUser);
            setSuccessMessage("画像をアップロードしました。");
        } catch (error) {
            console.error("【ERROR】画像アップロードに失敗しました:", error);
            const status = error.status || error.response && error.response.status;
            // 401 エラーは即時ログアウトで対応 (複雑なリカバリーロジックは実装しない)
            if (status === 401) {
                await logout();
                return;
            }
            if (error.response && error.response.status === 422) {
                // バリデーションエラー
                setImageError(error.response.data?.errors?.user_image?.[0] || "無効なファイルです。");
            } else {
                setImageError(`アップロードに失敗しました (ステータス: ${status || "不明"})。`);
            }
        } finally{
            setIsLoading(false);
            // ファイルインプットをリセット
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
        if (!user) return;
        setIsLoading(true);
        try {
            // APIにフォームデータを送信し、更新されたユーザーデータを受け取る
            const updatedUser = await updateProfile(form);
            setSuccessMessage("プロフィール情報を更新しました！");
            // 更新後のデータでフォームとユーザーの状態を初期化/更新
            initializeUserData(updatedUser);
        } catch (error) {
            const statusCode = error.status || (error.response ? error.response.status : "不明");
            console.error(`【ERROR】プロフィール更新に失敗しました (ステータス: ${statusCode})。`, error);
            // 401 エラーは即時ログアウトで対応
            if (statusCode === 401) {
                await logout();
                return;
            }
            if (error.response && error.response.status === 422) {
                // バリデーションエラー
                setProfileErrors(error.response.data.errors);
            } else {
                setSuccessMessage(`更新に失敗しました。(Status: ${statusCode}) 再度お試しください。`);
            }
        } finally{
            setIsLoading(false);
        }
    };
    // ----------------------------------------------------------------
    // 6. ローディング・未認証時の表示 (レンダリングブロック)
    // ----------------------------------------------------------------
    // 認証解決待ち、APIロード中、またはリカバリー中の全体ローディング
    if (isAuthLoading || isLoading && !user || isRecovering) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "login_page max-w-[1400px] mx-auto pt-5 pb-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "title",
                    children: "プロフィール設定"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 426,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 428,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-gray-500 mt-3",
                            children: isAuthLoading ? "認証状態を確認中 / セッションを再確立中..." : isRecovering ? "⚠️ 認証情報を回復中です..." // リカバリー中のメッセージを強調
                             : "データをロード中です..."
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 429,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 427,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
            lineNumber: 425,
            columnNumber: 7
        }, this);
    }
    // 認証が完了したがユーザーデータがない場合 (fetchで失敗した場合など)
    // このブロックに入る前に useEffect がリダイレクトを試みるため、短時間のみ表示されるはず
    if (!isAuthenticated || !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "login_page max-w-[1400px] mx-auto pt-5 pb-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "title",
                    children: "プロフィール設定"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 446,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl text-red-500",
                            children: "認証エラー、またはユーザー情報がロードできませんでした。"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 448,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-md text-gray-500 mt-2",
                            children: "ログインページへ移動しています..."
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                            lineNumber: 451,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                    lineNumber: 447,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(main)/mypage/profile/page.tsx",
            lineNumber: 445,
            columnNumber: 7
        }, this);
    }
    // ----------------------------------------------------------------
    // 7. メインレンダリング (UI)
    // ----------------------------------------------------------------
    return(// authUser?.uid をキーに使用し、ユーザーが変わった場合に強制再描画 (保険的な措置)
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-53929b350b281596" + " " + "login_page max-w-[1400px] mx-auto pt-5 pb-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "jsx-53929b350b281596" + " " + "title",
                children: "プロフィール設定"
            }, void 0, false, {
                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                lineNumber: 469,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-53929b350b281596" + " " + "form-wrapper",
                children: [
                    successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-53929b350b281596" + " " + "alert-success2",
                        children: successMessage
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 477,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: (e)=>e.preventDefault(),
                        className: "jsx-53929b350b281596" + " " + "item_sell_contents_box_line",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53929b350b281596" + " " + "image_name",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53929b350b281596" + " " + "image_button_row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: getProfileImageUrl(user.user_image),
                                                alt: "プロフィール画像",
                                                className: "jsx-53929b350b281596" + " " + "user_image_css"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                                lineNumber: 487,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>fileInput.current?.click(),
                                                disabled: isLoading,
                                                className: "jsx-53929b350b281596" + " " + "upload_submit",
                                                children: "画像を選択する"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                                lineNumber: 492,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 486,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        name: "user_image",
                                        ref: fileInput,
                                        style: {
                                            display: "none"
                                        },
                                        onChange: handleImageUpload,
                                        accept: "image/*",
                                        className: "jsx-53929b350b281596"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 501,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 485,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53929b350b281596" + " " + "user_image_error_message",
                                children: imageError
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 481,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleProfileUpdate,
                        className: "jsx-53929b350b281596",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53929b350b281596" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "name",
                                        className: "jsx-53929b350b281596" + " " + "label_form_1",
                                        children: "ユーザー名"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 517,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "name",
                                        type: "text",
                                        name: "name",
                                        value: form.name,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    name: e.target.value
                                                })),
                                        className: "jsx-53929b350b281596" + " " + "name_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53929b350b281596" + " " + "profile__error",
                                        children: profileErrors.name ? profileErrors.name[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 530,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53929b350b281596" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "post_number",
                                        className: "jsx-53929b350b281596" + " " + "label_form_2",
                                        children: "郵便番号 (8桁、ハイフンあり)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 537,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                        className: "jsx-53929b350b281596" + " " + "email_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 540,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53929b350b281596" + " " + "profile__error",
                                        children: profileErrors.post_number ? profileErrors.post_number[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 552,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 536,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53929b350b281596" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "address",
                                        className: "jsx-53929b350b281596" + " " + "label_form_3",
                                        children: "住所"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 559,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "address",
                                        type: "text",
                                        name: "address",
                                        value: form.address,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    address: e.target.value
                                                })),
                                        placeholder: "手動で入力してください",
                                        className: "jsx-53929b350b281596" + " " + "password_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 562,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53929b350b281596" + " " + "profile__error",
                                        children: profileErrors.address ? profileErrors.address[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 573,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 558,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53929b350b281596" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "building",
                                        className: "jsx-53929b350b281596" + " " + "label_form_4",
                                        children: "建物名"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 580,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "building",
                                        type: "text",
                                        name: "building",
                                        value: form.building,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    building: e.target.value
                                                })),
                                        className: "jsx-53929b350b281596" + " " + "password_form"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 583,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53929b350b281596" + " " + "profile__error",
                                        children: profileErrors.building ? profileErrors.building[0] : ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                        lineNumber: 593,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 579,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53929b350b281596" + " " + "submit",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "submit",
                                    value: "更新する",
                                    disabled: isLoading,
                                    className: "jsx-53929b350b281596" + " " + "submit_form"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                    lineNumber: 599,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                                lineNumber: 598,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                        lineNumber: 514,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/mypage/profile/page.tsx",
                lineNumber: 474,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "53929b350b281596",
                children: ".login_page.jsx-53929b350b281596{text-align:center}.title.jsx-53929b350b281596{color:#4f46e5;margin-bottom:2rem;font-size:2rem;font-weight:700}.form-wrapper.jsx-53929b350b281596{text-align:center;display:inline-block}.alert-success2.jsx-53929b350b281596{color:#065f46;background-color:#d1fae5;border:1px solid #34d399;border-radius:.5rem;margin-bottom:1.5rem;padding:1rem}.profile__error.jsx-53929b350b281596,.user_image_error_message.jsx-53929b350b281596{color:#f55;text-align:left;width:400px;margin:-5px auto 5px;padding-left:5px;font-size:15px}.user_image_error_message.jsx-53929b350b281596{text-align:center;position:relative;bottom:20px}.item_sell_contents_box_line.jsx-53929b350b281596{margin-bottom:0;padding-bottom:0;display:block}.image_name.jsx-53929b350b281596{justify-content:center;align-items:center;padding-top:35px;padding-bottom:60px;display:flex;position:relative}.image_button_row.jsx-53929b350b281596{align-items:center;gap:30px;display:flex;position:relative;right:50px}.user_image_css.jsx-53929b350b281596{object-fit:cover;object-position:center;border-radius:50%;width:100px;height:100px;position:static;overflow:hidden}.upload_submit.jsx-53929b350b281596{color:#f55;cursor:pointer;white-space:nowrap;background-color:#fff;border:1px solid #f55;border-radius:5px;margin:0;padding:5px 10px;font-weight:700;position:static}.form-group.jsx-53929b350b281596{text-align:center;width:400px;margin:0 auto}.label_form_1.jsx-53929b350b281596,.label_form_2.jsx-53929b350b281596,.label_form_3.jsx-53929b350b281596,.label_form_4.jsx-53929b350b281596{text-align:left;font-weight:700;display:block;position:relative;left:0}.label_form_2.jsx-53929b350b281596,.label_form_3.jsx-53929b350b281596,.label_form_4.jsx-53929b350b281596{margin-top:30px}.name_form.jsx-53929b350b281596,.email_form.jsx-53929b350b281596,.password_form.jsx-53929b350b281596{box-sizing:border-box;border:1px solid #d1d5db;border-radius:3px;width:400px;height:30px;margin-bottom:10px;padding:0 10px}.submit.jsx-53929b350b281596{margin-top:10px}.submit_form.jsx-53929b350b281596{color:#fff;cursor:pointer;background-color:#f55;border:#f55;border-radius:5px;width:400px;height:40px;margin:30px auto;font-weight:700;transition:background-color .1s;position:relative;top:20px}.submit_form.jsx-53929b350b281596:hover{background-color:#e54c4c}.submit_form.jsx-53929b350b281596:disabled{cursor:not-allowed;background-color:#9ca3af}"
            }, void 0, false, void 0, this)
        ]
    }, authUser?.uid || "unauthenticated", true, {
        fileName: "[project]/app/(main)/mypage/profile/page.tsx",
        lineNumber: 465,
        columnNumber: 5
    }, this));
}
}),
"[project]/node_modules/next/dist/compiled/client-only/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/node_modules/styled-jsx/dist/index/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.r("[project]/node_modules/next/dist/compiled/client-only/index.js [app-ssr] (ecmascript)");
var React = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
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
var isProd = typeof process !== "undefined" && process.env && ("TURBOPACK compile-time value", "development") === "production";
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
        var node = ("TURBOPACK compile-time value", "undefined") !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
        this._nonce = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
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
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && this._optimizeForSpeed) //TURBOPACK unreachable
        ;
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
        if ("TURBOPACK compile-time truthy", 1) {
            if (typeof index !== "number") {
                index = this._serverSheet.cssRules.length;
            }
            this._serverSheet.insertRule(rule, index);
            return this._rulesCount++;
        }
        //TURBOPACK unreachable
        ;
        var sheet;
        var insertionPoint;
    };
    _proto.replaceRule = function replaceRule(index, rule) {
        if (this._optimizeForSpeed || ("TURBOPACK compile-time value", "undefined") === "undefined") {
            var sheet = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : this._serverSheet;
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
        } else //TURBOPACK unreachable
        {
            var tag;
        }
        return index;
    };
    _proto.deleteRule = function deleteRule(index) {
        if ("TURBOPACK compile-time truthy", 1) {
            this._serverSheet.deleteRule(index);
            return;
        }
        //TURBOPACK unreachable
        ;
        var tag;
    };
    _proto.flush = function flush() {
        this._injected = false;
        this._rulesCount = 0;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            // simpler on server
            this._serverSheet.cssRules = [];
        }
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        if ("TURBOPACK compile-time truthy", 1) {
            return this._serverSheet.cssRules;
        }
        //TURBOPACK unreachable
        ;
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
    if ("TURBOPACK compile-time truthy", 1) {
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
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && !this._fromServer) //TURBOPACK unreachable
        ;
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
    var ref = React.useState(function() {
        return rootRegistry || configuredRegistry || createStyleRegistry();
    }), registry = ref[0];
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
var defaultRegistry = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
function JSXStyle(props) {
    var registry = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : useStyleRegistry();
    // If `registry` does not exist, we do nothing here.
    if (!registry) {
        return null;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        registry.add(props);
        return null;
    }
    //TURBOPACK unreachable
    ;
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
"[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/styled-jsx/dist/index/index.js [app-ssr] (ecmascript)").style;
}),
];

//# sourceMappingURL=_8d80d148._.js.map