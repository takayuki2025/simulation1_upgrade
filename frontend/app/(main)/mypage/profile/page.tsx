"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // 認証と認証済みAxiosクライアントの提供元

// =======================================================
// 型定義 (TypeScript の整合性を高める)
// =======================================================

interface User {
  id: number;
  name: string;
  email: string;
  uid: string;
  email_verified_at: string | null;
  post_number: string | null;
  address: string | null;
  building: string | null;
  user_image?: string | null;
}

interface UpdatedUserResponse extends User {}

// =======================================================
// グローバル変数・ヘルパー関数
// =======================================================

// 環境変数からAPIベースURLを取得
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * プロフィール画像のURLを生成するヘルパー関数
 */
const getProfileImageUrl = (path: string | undefined | null): string => {
  const base = API_BASE_URL;
  const DEFAULT_IMAGE_PATH = "storage/images/default-profile2.jpg";
  const DEFAULT_IMAGE_FULL_URL = `${base}/${DEFAULT_IMAGE_PATH}`;

  if (!path) {
    return DEFAULT_IMAGE_FULL_URL;
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `${base}/${path.replace(/^\//, "")}`;
};

// =======================================================
// メインコンポーネント: ProfilePage
// =======================================================

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. 認証フック: ユーザー状態とAPIクライアントを取得
  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
    reloadAuthToken, // 401リカバリー用
    apiClient, // 認証済み Axios インスタンス
  } = useAuth();

  // -------------------- State --------------------
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    post_number: "",
    address: "",
    building: "",
  });

  const [profileErrors, setProfileErrors] = useState<any>({});
  const [imageError, setImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true); // UI全体のローディング
  const [isFetching, setIsFetching] = useState(false); // データ取得中の状態
  const [isRecovering, setIsRecovering] = useState(false); // 401リカバリー中

  const fileInput = useRef<HTMLInputElement>(null);

  // -------------------- Computed Value (useMemo) --------------------

  // URLクエリパラメータからメール認証状態を取得
  const isVerificationRedirect = useMemo(() => {
    return searchParams.get("verified") === "true";
  }, [searchParams]);

  // ----------------------------------------------------------------
  // 1. データ初期化ヘルパー
  // ----------------------------------------------------------------

  /**
   * APIから取得したユーザーデータでフォームと状態を初期化する。
   */
  const initializeUserData = useCallback((apiData: any) => {
    let sourceData: User | null = null;

    // APIレスポンスの構造をチェック
    if (apiData && apiData.user) {
      sourceData = apiData.user as User;
    } else if (apiData && apiData.id && apiData.name) {
      sourceData = apiData as User;
    }

    setUser((current) => {
      // データの変更がなければステート更新をスキップ
      if (JSON.stringify(current) !== JSON.stringify(sourceData)) {
        console.log("✅ [InitData] user State を更新しました。");
        return sourceData;
      }
      return current;
    });

    if (sourceData) {
      setForm({
        name: sourceData.name || "",
        post_number: sourceData.post_number || "",
        address: sourceData.address || "",
        building: sourceData.building || "",
      });
    }
  }, []);

  // ----------------------------------------------------------------
  // 2. データ取得ロジック (401リカバリー処理を含む)
  // ----------------------------------------------------------------

  /**
   * サーバーからプロフィールデータを取得する関数。401エラー時にトークンリフレッシュを試みる。
   * (認証リダイレクト時のポーリングロジックはuseEffectに分離)
   */
  const fetchUserProfile = useCallback(
    async (isRetry = false) => {
      if (!apiClient) return;

      if (!isRetry) setIsFetching(true); // 初回試行時のみフェッチ中フラグを立てる

      try {
        const response = await apiClient.get("/api/mypage/profile");
        const responseData = response.data;

        console.log("API Response Data:", responseData);

        initializeUserData(responseData);
        console.log("✅ [Fetch] プロフィールデータ取得に成功。");

        // ★修正: 認証成功メッセージ表示ロジックはポーリング側に移譲するか、削除する
        // if (isVerificationRedirect) {
        //   setSuccessMessage("メール認証が完了しました！引き続きサービスをご利用いただけます。");
        // }

        if (isRetry) {
          setIsRecovering(false);
          setSuccessMessage("認証情報を回復し、データを再取得しました。");
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error("プロフィールデータのロードに失敗しました:", err);
        console.error("Fetch Error Details:", err);

        const status = err.response ? err.response.status : null;

        if (status === 401) {
          if (isRetry) {
            console.error(
              "401再検出 (再試行時)。リカバリー失敗とみなしログアウトします。",
            );
            await logout();
            return;
          }

          console.log(`401エラーを検出。トークンリフレッシュを試行...`);
          setSuccessMessage("認証情報を更新中...");
          setIsRecovering(true);

          try {
            await reloadAuthToken();
            setSuccessMessage("認証情報を更新しました。データを再取得します。");
            await fetchUserProfile(true);
          } catch (reloadError) {
            console.error(
              "トークンのリロードに失敗。ログアウトします。",
              reloadError,
            );
            await logout();
            setSuccessMessage(
              "セッションが切れました。再度ログインが必要です。",
            );
          }
          return;
        }

        // 401以外のエラー
        setSuccessMessage(
          `データのロード中に予期せぬエラーが発生しました。(Status: ${
            status || "不明"
          })`,
        );
        setIsLoading(false);
      } finally {
        if (!isRetry) {
          setIsFetching(false);
        }
      }
    },
    [apiClient, initializeUserData, logout, reloadAuthToken],
  );

  // ----------------------------------------------------------------
  // 3. 認証状態とデータフェッチの監視 (useEffect) - ★ポーリングロジックを実装★
  // ----------------------------------------------------------------

  useEffect(() => {
    // 1. 認証解決待ち、またはリカバリー中の場合はスキップ
    if (isAuthLoading || isRecovering) return;

    // 2. 未認証の場合はログインへリダイレクト
    if (!isAuthenticated) {
      if (isVerificationRedirect) {
        // このロジックは残す
        console.log("Waiting for session resolve.");
        return;
      }
      console.log("Unauthenticated detected. Redirecting to /login.");
      if (authUser === null) {
        router.replace("/login");
      }
      return;
    }

    // 3. 認証済みで、APIクライアントも利用可能だが、データがまだロードされていない場合
    const needsInitialFetch =
      isAuthenticated && apiClient && !user && !isFetching;
    // 💡 削除: needsPolling はもう不要です

    // 初回フェッチ
    if (needsInitialFetch) {
      console.log("[DEBUG] Initial Fetch Triggered.");
      fetchUserProfile(false);
      return;
    }

    // ★★★ メール認証後のポーリング処理 は削除されます ★★★

    // 4. データがロード済みで認証済みであれば、ローディングを解除（ガードロジック）
    // ポーリング中でない、かつユーザーデータがあれば、ローディングを解除
    if (user && isAuthenticated && !isFetching && isLoading) {
      console.log("[DEBUG] Guard: User loaded, setting isLoading=false.");
      setIsLoading(false);
    }
  }, [
    // 依存配列は維持
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
    initializeUserData,
  ]);

  // ----------------------------------------------------------------
  // 4. 画像アップロード処理
  // ----------------------------------------------------------------
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user || !apiClient) return;

    setImageError("");
    setSuccessMessage("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("user_image", file);

    try {
      // apiClient.post で画像アップロード
      const response = await apiClient.post("/upload2", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser: UpdatedUserResponse = response.data;

      setUser(updatedUser as User);
      setSuccessMessage("画像をアップロードしました。");
    } catch (error: any) {
      console.error("【ERROR】画像アップロードに失敗しました:", error);
      const status = error.response ? error.response.status : null;

      if (status === 401) {
        await logout();
        return;
      }

      if (status === 422) {
        setImageError(
          error.response.data?.errors?.user_image?.[0] ||
            "無効なファイルです。",
        );
      } else {
        setImageError(
          `アップロードに失敗しました (ステータス: ${status || "不明"})。`,
        );
      }
    } finally {
      setIsLoading(false);
      if (fileInput.current) {
        fileInput.current.value = "";
      }
    }
  };

  // ----------------------------------------------------------------
  // 5. プロフィール情報更新処理
  // --------------------------------------------------------------
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    setSuccessMessage("");
    if (!user || !apiClient) return;
    setIsLoading(true);

    try {
      // apiClient.put でプロフィール情報更新
      const response = await apiClient.put("/mypage/profile", form);

      const updatedUser: UpdatedUserResponse = response.data;

      setSuccessMessage("プロフィール情報を更新しました！");
      initializeUserData(updatedUser);
    } catch (error: any) {
      const statusCode = error.response ? error.response.status : "不明";
      console.error(
        `【ERROR】プロフィール更新に失敗しました (ステータス: ${statusCode})。`,
        error,
      );

      if (statusCode === 401) {
        await logout();
        return;
      }

      if (statusCode === 422) {
        setProfileErrors(error.response.data.errors);
      } else {
        setSuccessMessage(
          `更新に失敗しました。(Status: ${statusCode}) 再度お試しください。`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // 6. ローディング・未認証時の表示 (レンダリングブロック)
  // ----------------------------------------------------------------

  // 認証解決待ち、APIロード中、またはリカバリー中の全体ローディング
  if (isAuthLoading || (isLoading && !user) || isRecovering) {
    return (
      <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
        <h2 className="title">プロフィール設定</h2>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-lg text-gray-500 mt-3">
            {isAuthLoading
              ? "認証状態を確認中 / セッションを再確立中..."
              : isRecovering
                ? "⚠️ 認証情報を回復中です..."
                : "データをロード中です..."}
          </p>
          {isVerificationRedirect && isFetching && (
            <p className="text-sm text-blue-500 mt-2">
              メール認証の状態を確認中です。しばらくお待ちください。
            </p>
          )}
        </div>
      </div>
    );
  }

  // 認証が完了したがユーザーデータがない場合
  if (!isAuthenticated || !user) {
    return (
      <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
        <h2 className="title">プロフィール設定</h2>
        <div className="text-center p-8">
          <p className="text-xl text-red-500">
            認証エラー、またはユーザー情報がロードできませんでした。
          </p>
          <p className="text-md text-gray-500 mt-2">
            ログインページへ移動しています...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 7. メインレンダリング (UI)
  // ----------------------------------------------------------------

  return (
    <div
      className="login_page max-w-[1400px] mx-auto pt-5 pb-10"
      key={authUser?.uid || "unauthenticated"}
    >
      <h2 className="title">プロフィール設定</h2>

      <div className="form-wrapper">
        {successMessage && (
          <div className="alert-success2">{successMessage}</div>
        )}

        {/* --- 画像アップロードフォーム --- */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="item_sell_contents_box_line"
        >
          <div className="image_name">
            <div className="image_button_row">
              <img
                src={getProfileImageUrl(user.user_image)}
                alt="プロフィール画像"
                className="user_image_css"
              />
              <button
                type="button"
                className="upload_submit"
                onClick={() => fileInput.current?.click()}
                disabled={isLoading}
              >
                画像を選択する
              </button>
            </div>
            <input
              type="file"
              name="user_image"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
          <div className="user_image_error_message">{imageError}</div>
        </form>

        {/* --- プロフィール情報更新フォーム --- */}
        <form onSubmit={handleProfileUpdate}>
          {/* ユーザー名 */}
          <div className="form-group">
            <label htmlFor="name" className="label_form_1">
              ユーザー名
            </label>
            <input
              id="name"
              type="text"
              className="name_form"
              name="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className="profile__error">
              {profileErrors.name ? profileErrors.name[0] : ""}
            </div>
          </div>

          {/* 郵便番号 */}
          <div className="form-group">
            <label htmlFor="post_number" className="label_form_2">
              郵便番号 (8桁、ハイフンあり)
            </label>
            <input
              id="post_number"
              type="text"
              className="email_form"
              name="post_number"
              value={form.post_number}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, post_number: e.target.value }))
              }
              placeholder="例: 100-0001"
              maxLength={8}
            />
            <div className="profile__error">
              {profileErrors.post_number ? profileErrors.post_number[0] : ""}
            </div>
          </div>

          {/* 住所 */}
          <div className="form-group">
            <label htmlFor="address" className="label_form_3">
              住所
            </label>
            <input
              id="address"
              type="text"
              className="password_form"
              name="address"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="手動で入力してください"
            />
            <div className="profile__error">
              {profileErrors.address ? profileErrors.address[0] : ""}
            </div>
          </div>

          {/* 建物名 */}
          <div className="form-group">
            <label htmlFor="building" className="label_form_4">
              建物名
            </label>
            <input
              id="building"
              type="text"
              className="password_form"
              name="building"
              value={form.building}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, building: e.target.value }))
              }
            />
            <div className="profile__error">
              {profileErrors.building ? profileErrors.building[0] : ""}
            </div>
          </div>

          <div className="submit">
            <input
              type="submit"
              className="submit_form"
              value="更新する"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>

      {/* --- スタイル定義 (変更なし) --- */}
      <style jsx>{`
        .login_page {
          text-align: center;
        }
        .title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #4f46e5;
        }
        .form-wrapper {
          display: inline-block;
          text-align: center;
        }
        .alert-success2 {
          background-color: #d1fae5;
          color: #065f46;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #34d399;
        }
        .profile__error,
        .user_image_error_message {
          color: #ff5555;
          font-size: 15px;
          text-align: left;
          margin-top: -5px;
          margin-bottom: 5px;
          padding-left: 5px;
          width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .user_image_error_message {
          text-align: center;
          position: relative;
          bottom: 20px;
        }
        .item_sell_contents_box_line {
          display: block;
          padding-bottom: 0;
          margin-bottom: 0;
        }
        .image_name {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 35px;
          padding-bottom: 60px;
          position: relative;
        }
        .image_button_row {
          display: flex;
          align-items: center;
          gap: 30px;
          position: relative;
          right: 50px;
        }
        .user_image_css {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: cover;
          object-position: center;
          position: static;
        }
        .upload_submit {
          position: static;
          margin: 0;
          color: #ff5555;
          font-weight: 700;
          background-color: white;
          border: 1px solid #ff5555;
          border-radius: 5px;
          padding: 5px 10px;
          cursor: pointer;
          white-space: nowrap;
        }
        .form-group {
          width: 400px;
          margin: 0 auto;
          text-align: center;
        }
        .label_form_1,
        .label_form_2,
        .label_form_3,
        .label_form_4 {
          font-weight: 700;
          display: block;
          text-align: left;
          position: relative;
          left: 0;
        }
        .label_form_2 {
          margin-top: 30px;
        }
        .label_form_3 {
          margin-top: 30px;
        }
        .label_form_4 {
          margin-top: 30px;
        }
        .name_form,
        .email_form,
        .password_form {
          width: 400px;
          height: 30px;
          box-sizing: border-box;
          padding: 0 10px;
          margin-bottom: 10px;
          border: 1px solid #d1d5db;
          border-radius: 3px;
        }
        .submit {
          margin-top: 10px;
        }
        .submit_form {
          position: relative;
          top: 20px;
          width: 400px;
          height: 40px;
          margin: 30px auto;
          background-color: #ff5555;
          border: #ff5555;
          color: white;
          font-weight: 700;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.1s;
        }
        .submit_form:hover {
          background-color: #e54c4c;
        }
        .submit_form:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
