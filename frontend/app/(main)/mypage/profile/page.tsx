"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Next.jsのカスタム認証フックのパスを調整してください
import { useApi } from "@/hooks/useApi"; // 認証済みリクエスト用カスタムフックのパスを調整してください

// =======================================================
// 型定義
// =======================================================

// User interface, assuming it matches the backend model
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

// useApiのupdateProfile/uploadImageが返す応答型（Userと同じ構造を想定）
interface UpdatedUserResponse extends User {}

// =======================================================
// Next.js クライアントコンポーネント
// =======================================================

// 環境変数からAPIベースURLを取得
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * プロフィール画像のURLを生成するヘルパー関数
 */
const getProfileImageUrl = (path: string | undefined | null): string => {
  let base = API_BASE_URL;
  const DEFAULT_IMAGE_PATH = "storage/images/default-profile2.jpg";
  const DEFAULT_IMAGE_FULL_URL = `${base}/${DEFAULT_IMAGE_PATH}`;

  if (!path) {
    return DEFAULT_IMAGE_FULL_URL;
  }

  // pathがHTTPから始まっていればそのまま返す（フルURLの場合）
  if (path.startsWith("http")) {
    return path;
  }

  // 相対パスの場合はベースURLを付与
  return `${base}/${path.replace(/^\//, "")}`;
};

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
    reloadAuthToken, // トークン強制リフレッシュ関数
  } = useAuth();

  // useApiは通常、Firebase IDトークンをヘッダーに付けてAPIをコールする
  const { authenticatedFetch, updateProfile, uploadImage } = useApi();

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
  const [isLoading, setIsLoading] = useState(true); // APIフェッチ中のローディング (全体)
  const [isFetching, setIsFetching] = useState(false); // データ取得中のローディング (フェッチ専用)

  // 401エラーからのリカバリー中を示す状態
  const [isRecovering, setIsRecovering] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);

  // URLクエリパラメータからメール認証状態を取得
  const isVerificationRedirect = useMemo(() => {
    return searchParams.get("verified") === "true";
  }, [searchParams]);

  // ----------------------------------------------------------------
  // 1. データ初期化ヘルパー
  // ----------------------------------------------------------------

  /**
   * APIから取得したユーザーデータでフォームと状態を初期化する
   */
  const initializeUserData = useCallback((apiData: any) => {
    let sourceData: User | null = null;

    if (apiData && apiData.user) {
      sourceData = apiData.user as User;
    } else if (apiData && apiData.id && apiData.name) {
      sourceData = apiData as User;
    }

    setUser((current) => {
      // 無限ループを防ぐため、データが実際に変更されているかチェック
      if (JSON.stringify(current) !== JSON.stringify(sourceData)) {
        console.log("✅ [InitData] user State を更新しました。", sourceData);
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
  // 2. データ取得ロジック (リカバリー処理を強化)
  // ----------------------------------------------------------------

  const fetchUserProfile = useCallback(
    async (isRetry = false) => {
      // 初回呼び出し時に、既にフェッチ中または認証解決待ちの場合はスキップ
      if (!isRetry && isFetching) return;
      if (isAuthLoading) return;

      // フェッチ開始 (初回呼び出し時のみ isFetching を設定)
      if (!isRetry) setIsFetching(true);

      try {
        // サーバーから最新のユーザーデータをフェッチ
        const response: any = await authenticatedFetch("/mypage/profile");

        // 最新のサーバーデータで更新
        initializeUserData(response);

        console.log(
          "✅ [Fetch] プロフィールデータ取得に成功。ユーザーデータを初期化しました。"
        );

        // メール認証成功後のメッセージ表示
        if (isVerificationRedirect) {
          setSuccessMessage(
            "メール認証が完了しました！引き続きサービスをご利用いただけます。"
          );
        }

        // 再試行が成功した場合は、リカバリー状態を解除
        if (isRetry) {
          setIsRecovering(false);
        }
      } catch (err: any) {
        console.error("プロフィールデータのロードに失敗しました:", err);
        const status = err.status || (err.response && err.response.status);

        if (status === 401) {
          // 既に再試行して再度401なら、無限ループを防ぐためログアウト
          if (isRetry) {
            console.error(
              "401再検出 (再試行時)。リカバリー失敗とみなしログアウトします。"
            );
            // ログアウト処理が完了したら、この処理は終了
            await logout();
            return;
          }

          console.log(`401エラーを検出。トークンリフレッシュを試行...`);
          setSuccessMessage("認証情報を更新中...");

          // リカバリー開始
          setIsRecovering(true);

          try {
            // 認証回復ロジック
            await reloadAuthToken(); // トークンを強制リフレッシュ
            setSuccessMessage("認証情報を更新しました。データを再取得します。");

            // 重要な修正: トークンリフレッシュ成功後、自身を再帰的に呼び出して再試行
            await fetchUserProfile(true); // isRetry=true で再試行
          } catch (reloadError) {
            console.error(
              "トークンのリロードに失敗。ログアウトします。",
              reloadError
            );
            await logout();
            setSuccessMessage(
              "セッションが切れました。再度ログインが必要です。"
            );
          } finally {
            // 再帰呼び出しが完了しても、成功時は内部で isRecovering(false) になるため、
            // ここで設定するとリカバリー失敗時のみとなる。
            // ★重要な変更点: 成功時は tryブロック内部で isRecovering(false) を呼ぶため、
            // ここでは失敗時、または再帰後のクリーンアップは不要。
          }
        } else {
          // 401以外のエラー
          setSuccessMessage(
            `データのロード中に予期せぬエラーが発生しました。(Status: ${
              status || "不明"
            })`
          );
        }
      } finally {
        // 初回呼び出しが終了した時のみ isFetching をリセットする
        // 再帰呼び出し (isRetry=true) が成功した場合、このブロックは実行されない
        // (再帰呼び出しが成功し、親の try ブロックを抜けるため)
        if (!isRetry) {
          setIsFetching(false);
          // 2回目の API Callが401エラーで失敗し、ログアウトした場合、
          // 初回呼び出しの finally が実行されるが、その時には既にログアウト処理がされているため問題なし。
        }
      }
    },
    // useCallbackの依存配列
    [
      authenticatedFetch,
      initializeUserData,
      logout,
      isVerificationRedirect,
      reloadAuthToken,
      isFetching, // 初回呼び出し時のガード
      isAuthLoading,
    ]
  );

  // ----------------------------------------------------------------
  // 3. 認証状態とデータフェッチの監視
  // ----------------------------------------------------------------

  // 認証状態に応じたデータフェッチとリダイレクト
  useEffect(() => {
    // 1. 認証解決待ち、またはリカバリー中の場合はスキップ
    if (isAuthLoading || isRecovering) return;

    // 2. 未認証の場合はログインへリダイレクト
    if (!isAuthenticated) {
      // 認証リダイレクト中（?verified=true）は、セッション解決を待つ
      if (isVerificationRedirect) {
        console.log(
          "Verification redirect detected. Waiting for useLaravelSession to resolve session."
        );
        return;
      }

      console.log("Unauthenticated detected. Redirecting to /login.");
      // ログアウト処理が完了していない場合は強制リダイレクト
      if (authUser === null) {
        router.replace("/login");
      }
      return;
    }

    // 3. 認証済みだがユーザーデータがまだロードされていない場合、データフェッチを実行
    // isFetching で現在ロード中かチェックし、重複実行を防ぐ
    if (isAuthenticated && !user && !isFetching) {
      console.log("Authenticated but user data is missing. Fetching profile.");
      // setIsLoading(true) はレンダリングブロック時に設定されているため、ここでは省略
      fetchUserProfile(false); // 初回フェッチ
      return;
    }

    // 4. データがロード済みで認証済みであれば、ローディングを解除して終了
    if (user && isAuthenticated) {
      setIsLoading(false);
      return;
    }
  }, [
    isAuthLoading,
    isAuthenticated,
    router,
    fetchUserProfile,
    user,
    isFetching,
    isVerificationRedirect,
    isRecovering, // リカバリー状態の変化を監視
    authUser,
  ]);

  // ----------------------------------------------------------------
  // 4. 画像アップロード処理
  // ----------------------------------------------------------------
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setImageError("");
    setSuccessMessage("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("user_image", file);

    try {
      const updatedUser: UpdatedUserResponse = await uploadImage(
        formData,
        "/upload2"
      );

      setUser(updatedUser as User);

      setSuccessMessage("画像をアップロードしました。");
    } catch (error: any) {
      console.error("【ERROR】画像アップロードに失敗しました:", error);
      const status = error.status || (error.response && error.response.status);

      if (status === 401) {
        // 画像アップロードの401もトークンリフレッシュを試みるべきだが、今回は即時ログアウトで対応
        // ここでのリカバリーロジックの実装は一旦見送り
        await logout();
        return;
      }

      if (error.response && error.response.status === 422) {
        // エラーレスポンスの構造に応じて修正
        setImageError(
          error.response.data?.errors?.user_image?.[0] || "無効なファイルです。"
        );
      } else {
        setImageError(
          `アップロードに失敗しました (ステータス: ${status || "不明"})。`
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
    if (!user) return;
    setIsLoading(true);

    try {
      const updatedUser: UpdatedUserResponse = await updateProfile(form);

      setSuccessMessage("プロフィール情報を更新しました！");

      initializeUserData(updatedUser);
    } catch (error: any) {
      const statusCode =
        error.status || (error.response ? error.response.status : "不明");
      console.error(
        `【ERROR】プロフィール更新に失敗しました (ステータス: ${statusCode})。`,
        error
      );

      if (statusCode === 401) {
        // 更新時の401もトークンリフレッシュを試みるべきだが、今回は即時ログアウトで対応
        // ここでのリカバリーロジックの実装は一旦見送り
        await logout();
        return;
      }

      if (error.response && error.response.status === 422) {
        // エラーレスポンスの構造に応じて修正
        setProfileErrors(error.response.data.errors);
      } else {
        setSuccessMessage(
          `更新に失敗しました。(Status: ${statusCode}) 再度お試しください。`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // 6. ローディング・未認証時の表示
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
              ? "認証情報を回復中です..." // リカバリー中のメッセージ
              : "データをロード中です..."}
          </p>
        </div>
      </div>
    );
  }

  // 認証が完了したがユーザーデータがない場合 (fetchで失敗した場合など)
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
  // 7. レンダリング
  // ----------------------------------------------------------------

  return (
    // authUser?.uid をキーに使用し、ユーザーが変わった場合に強制再描画
    <div
      className="login_page max-w-[1400px] mx-auto pt-5 pb-10"
      key={authUser?.uid || "unauthenticated"}
    >
      <h2 className="title">プロフィール設定</h2>

      <div className="form-wrapper">
        {/* 成功メッセージの表示 (元のCSSでは .alert-success2) */}
        {successMessage && (
          <div className="alert-success2">{successMessage}</div>
        )}

        {/* 画像アップロードフォーム */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="item_sell_contents_box_line"
        >
          <div className="image_name">
            {/* 画像とボタンを横並びにするラッパー */}
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

        {/* プロフィール情報更新フォーム */}
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

      {/* Vueの <style scoped> を Tailwind CSSと組み合わせて再現 */}
      <style jsx>{`
        /*
        |--------------------------------------------------------------------------
        | スコープ付きCSS (元のCSSの99%再現を目指す)
        |--------------------------------------------------------------------------
        */

        /* -------------------- 共通コンテナ -------------------- */
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

        /* -------------------- メッセージ・エラー -------------------- */
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

        /* -------------------- 画像アップロード (横並び調整) -------------------- */

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

        /* 横並びを実現する新しいラッパー */
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

        /* -------------------- フォーム要素 -------------------- */

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
          margin-bottom: 10px; /* profile__errorとのスペースを確保するため調整 */
          border: 1px solid #d1d5db;
          border-radius: 3px;
        }

        /* -------------------- 送信ボタン -------------------- */
        .submit {
          margin-top: 10px;
        }

        .submit_form {
          position: relative;
          top: 20px;
          width: 400px;
          height: 40px; /* 高さを少し大きくして押しやすく */
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
