"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
// getImageUrl は、utils.ts などで定義されているものと仮定
import { getImageUrl } from "@/utils/utils";
import Image from "next/image";
import { AxiosError, AxiosResponse } from "axios";

// =======================================================
// I. 型定義と定数
// =======================================================

// BackendUser の型定義
interface BackendUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  // ... 他のプロフィール情報も含む
}

interface ItemForm {
  item_image: string | null;
  category: string[];
  condition: string | null;
  name: string | null;
  brand: string | null;
  explain: string | null;
  price: number | null;
}

interface ServerErrors {
  [key: string]: string | string[] | undefined;
}

const categories = [
  "ファッション",
  "家電",
  "インテリア",
  "レディース",
  "メンズ",
  "コスメ",
  "本",
  "ゲーム",
  "スポーツ",
  "キッチン",
  "ハンドメイド",
  "アクセサリー",
  "おもちゃ",
  "キッズ:ベビー",
];
const conditions = [
  "良好",
  "目立った傷や汚れなし",
  "やや傷や汚れあり",
  "状態が悪い",
];

// =======================================================
// II. メインコンポーネント: ItemSellPage
// =======================================================

export default function ItemSellPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    isLoggingOut,
    apiClient,
    logout,
    reloadAuthToken,
  } = useAuth();

  // -------------------- State --------------------
  // ProfilePage と同じく、ローカルなユーザー情報とフェッチ状態を持つ
  const [localBackendUser, setLocalBackendUser] = useState<BackendUser | null>(
    null
  );
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [serverErrors, setServerErrors] = useState<ServerErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);

  const [form, setForm] = useState<ItemForm>({
    item_image: null,
    category: [],
    condition: null,
    name: null,
    brand: null,
    explain: null,
    price: null,
  });

  // -------------------- Computed Value --------------------

  const isPageLoading = useMemo(() => {
    // useAuthのロード中 or プロフィールフェッチ中の場合はローディング
    return isLoggingOut || isAuthLoading || isFetchingProfile;
  }, [isLoggingOut, isAuthLoading, isFetchingProfile]);

  const hasVerifiedEmail = useMemo(() => {
    // ローカルで取得した最新のユーザー情報に基づく
    return !!localBackendUser && !!localBackendUser.email_verified_at;
  }, [localBackendUser]);

  // -------------------- 関数定義 --------------------

  /**
   * プロフィールデータを取得する関数。認証状態の確定に使用。
   */
  const fetchBackendProfile = useCallback(async () => {
    if (!apiClient || isFetchingProfile) return;

    setIsFetchingProfile(true);
    try {
      const response = await apiClient.get("/api/mypage/profile");
      const data = response.data.user || response.data;

      if (data && data.id) {
        console.log("✅ [ItemSellPage] 最新プロフィールデータ取得に成功。");
        // ★★★ ログ出力強化: この値が null かどうかを確認してください ★★★
        console.log("【検証】email_verified_at:", data.email_verified_at);
        setLocalBackendUser(data as BackendUser);
      } else {
        throw new Error("Invalid user data received.");
      }
    } catch (err: any) {
      console.error("[ItemSellPage] プロフィールデータ取得失敗:", err);
      if (err.response?.status === 401) {
        setLocalBackendUser(null);
      } else {
        setErrorMessage("ユーザー情報のロード中にエラーが発生しました。");
      }
    } finally {
      setIsFetchingProfile(false);
    }
  }, [apiClient, isFetchingProfile]);

  /**
   * 認証リトライ付きAPIフェッチ
   */
  const authenticatedFetchWithRetry = useCallback(
    async (config: {
      url: string;
      method: string;
      data?: any;
      headers?: any;
      params?: any;
    }): Promise<AxiosResponse> => {
      if (!apiClient || !isAuthenticated) {
        throw new Error("API client unavailable or user not authenticated.");
      }

      const requestConfig = {
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers,
        params: config.params,
      };

      try {
        return await apiClient.request(requestConfig);
      } catch (e) {
        const error = e as AxiosError;
        const status = error.response?.status;

        if (status === 401) {
          console.warn(
            "401 Unauthorized detected. Attempting token refresh..."
          );

          try {
            await reloadAuthToken();
            const secondResponse = await apiClient.request(requestConfig);
            console.log("Token refresh and retry successful.");
            return secondResponse;
          } catch (refreshError) {
            console.error(
              "Token refresh or retry failed. Logging out.",
              refreshError
            );
            await logout();
            throw new Error("Authentication failed after retry.");
          }
        }

        throw error;
      }
    },
    [isAuthenticated, apiClient, logout, reloadAuthToken]
  );

  /**
   * フォーム入力変更ハンドラ
   */
  const handleFormChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: name === "price" ? (value ? Number(value) : null) : value,
      }));
    },
    []
  );

  /**
   * カテゴリー選択変更ハンドラ
   */
  const handleCategoryChange = useCallback((category: string) => {
    setForm((prev) => {
      const currentCategories = prev.category;
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          category: currentCategories.filter((c) => c !== category),
        };
      } else {
        return { ...prev, category: [...currentCategories, category] };
      }
    });
  }, []);

  /**
   * 商品画像アップロードハンドラ
   */
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsImageUploading(true);
      setServerErrors((prev) => ({ ...prev, item_image: undefined }));
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const formData = new FormData();
        formData.append("item_image", file);

        const response = await authenticatedFetchWithRetry({
          url: "/api/upload",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadedPath = response.data?.image_path;
        if (uploadedPath) {
          setForm((prev) => ({ ...prev, item_image: uploadedPath }));
          setImageRefreshKey((prev) => prev + 1);
          setSuccessMessage("商品画像をアップロードできました！");
        } else {
          throw new Error("サーバーから画像パスが返されませんでした。");
        }
      } catch (error: any) {
        console.error("画像アップロードエラー:", error);
        const errorData = error.response?.data?.errors;

        if (errorData) {
          setServerErrors((prev) => ({
            ...prev,
            item_image: errorData.item_image || "画像ファイルが無効です。",
          }));
        } else {
          setErrorMessage(
            error.message ||
              "画像アップロード中に予期せぬエラーが発生しました。"
          );
        }
      } finally {
        setIsImageUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [authenticatedFetchWithRetry]
  );

  /**
   * フォームデータ送信ハンドラ
   */
  const submitNewData = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // フォーム送信前にも認証状態をチェック
      if (
        isSubmitting ||
        isPageLoading ||
        !isAuthenticated ||
        !hasVerifiedEmail
      ) {
        setErrorMessage("認証またはメール確認が完了していません。");
        return;
      }

      setIsSubmitting(true);
      setServerErrors({});
      setSuccessMessage("");
      setErrorMessage("");

      if (!form.item_image) {
        setServerErrors((prev) => ({
          ...prev,
          item_image: ["商品画像をアップロードしてください。"],
        }));
        setErrorMessage("入力内容に誤りがあります。ご確認ください。");
        setIsSubmitting(false);
        return;
      }

      try {
        await authenticatedFetchWithRetry({
          url: "/api/items",
          method: "POST",
          data: {
            ...form,
            price: form.price !== null ? Number(form.price) : null,
          },
        });

        setSuccessMessage("商品を出品しました。サンクスページへ移動します。");

        setTimeout(() => {
          router.push("/thanks/sell");
        }, 1500);
      } catch (error: any) {
        console.error("出品エラー:", error);
        const errorData = error.response?.data?.errors;

        if (errorData) {
          setServerErrors(errorData || {});
          setErrorMessage("入力内容に誤りがあります。ご確認ください。");
        } else {
          setErrorMessage(
            error.message || `出品中に予期せぬエラーが発生しました。`
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      form,
      isSubmitting,
      isPageLoading,
      isAuthenticated,
      hasVerifiedEmail,
      authenticatedFetchWithRetry,
      router,
    ]
  );

  // -------------------- アクセス制御 (useEffect) --------------------

  useEffect(() => {
    // 1. 認証ロード中、またはAPIクライアントがない場合はスキップ
    if (isAuthLoading || !apiClient) return;

    // 2. 未認証であればログインページへ即時リダイレクト
    if (!isAuthenticated) {
      console.log("[Auth Check] 未認証。/loginへ即時リダイレクト。");
      router.replace("/login");
      return;
    }

    // 3. 認証済みだが、ローカルデータがまだロードされていない場合
    if (isAuthenticated && !localBackendUser && !isFetchingProfile) {
      console.log(
        "[Auth Check] 認証済みだがプロファイル未ロード。フェッチ開始。"
      );
      fetchBackendProfile();
      return;
    }

    // 4. ローカルデータがロード済みで、メール未認証の場合
    if (isAuthenticated && localBackendUser && !hasVerifiedEmail) {
      console.log(
        "[Auth Check] 認証済みだがメール未確認。/email/verifyへ即時リダイレクト。"
      );
      router.replace("/email/verify");
      return;
    }

    // 5. 認証・メール認証が完了していれば、エラーメッセージをクリア
    if (isAuthenticated && hasVerifiedEmail) {
      setErrorMessage("");
    }
  }, [
    isAuthenticated,
    isAuthLoading,
    localBackendUser,
    isFetchingProfile,
    hasVerifiedEmail,
    router,
    apiClient,
    fetchBackendProfile,
  ]);

  // -------------------- Render --------------------

  // ローディングガードの強化: isPageLoading または localBackendUser が確定するまでローディングを表示
  if (isPageLoading || !localBackendUser) {
    if (!isAuthLoading && !isAuthenticated) {
      // 認証失敗（useEffectがリダイレクトをトリガー）
    } else {
      return (
        <div className="flex justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
          <div className="w-full max-w-2xl bg-white p-8 sm:p-10 shadow-xl rounded-xl border border-gray-100">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"></div>
              <p className="ml-3 text-lg text-gray-700 p-8">
                {isFetchingProfile
                  ? "最新プロフィール情報を取得中..."
                  : "認証状態を最終確認中です..."}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // 認証失敗、またはメール認証未完了時の画面
  if (!isAuthenticated || !hasVerifiedEmail) {
    const displayMessage = !isAuthenticated
      ? "アクセス権限がありません。ログインページへリダイレクト中です。"
      : "メール認証が完了していません。メールをご確認ください。リダイレクト中です。";

    return (
      <div className="flex justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-2xl bg-white p-8 sm:p-10 shadow-xl rounded-xl border border-gray-100">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-red-700 p-8 bg-white shadow-lg rounded-lg">
              {displayMessage}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-10 shadow-xl rounded-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 border-b pb-4">
          商品の出品
        </h1>

        {successMessage && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <section className="mb-8 border-b pb-6">
          <label className="block text-lg font-bold text-gray-700 mb-4">
            商品画像 <span className="text-red-500 text-sm">(必須)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 bg-gray-50 min-h-[150px]">
            {form.item_image && (
              <div className="w-32 h-32 relative mb-4">
                <Image
                  src={getImageUrl(form.item_image, imageRefreshKey)}
                  alt="商品プレビュー画像"
                  fill
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  className="border border-gray-200"
                  unoptimized
                />
              </div>
            )}

            <button
              type="button"
              className="px-6 py-2 text-red-600 font-semibold border-2 border-red-600 bg-white rounded-full hover:bg-red-50 transition duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isImageUploading || isSubmitting}
              onClick={() => fileInputRef.current?.click()}
            >
              {isImageUploading ? "アップロード中..." : "画像を選択する"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
              accept="image/jpeg, image/png"
            />
            <div className="text-red-500 text-sm font-medium">
              {Array.isArray(serverErrors.item_image)
                ? serverErrors.item_image[0]
                : serverErrors.item_image}
            </div>
            {form.item_image && (
              <div className="text-green-600 font-medium text-sm mt-2">
                <p>✅ 画像がアップロードされました。</p>
              </div>
            )}
          </div>
        </section>

        <form onSubmit={submitNewData}>
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 border-b-2 border-gray-200 pb-2 mb-6">
              商品の詳細
            </h2>

            {/* --- カテゴリー --- */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                カテゴリー <span className="text-red-500 text-sm">(必須)</span>
              </label>
              <div className="flex flex-wrap justify-center gap-2 px-0 py-2 category-buttons-container">
                {categories.map((cat, index) => (
                  <React.Fragment key={index}>
                    <input
                      type="checkbox"
                      id={`cat${index}`}
                      value={cat}
                      name="category"
                      className="category-checkbox-input"
                      checked={form.category.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <label
                      htmlFor={`cat${index}`}
                      className="category-checkbox-label"
                    >
                      {cat}
                    </label>
                  </React.Fragment>
                ))}
              </div>
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(serverErrors.category)
                  ? serverErrors.category[0]
                  : serverErrors.category}
              </div>
            </div>

            {/* --- 商品の状態 --- */}
            <div className="mb-6">
              <label
                htmlFor="condition"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                商品の状態 <span className="text-red-500 text-sm">(必須)</span>
              </label>
              <select
                id="condition"
                name="condition"
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                value={form.condition || ""}
                onChange={handleFormChange}
              >
                <option value="" disabled>
                  選択してください
                </option>
                {conditions.map((cond, index) => (
                  <option key={index} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(serverErrors.condition)
                  ? serverErrors.condition[0]
                  : serverErrors.condition}
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 border-b-2 border-gray-200 pb-2 mb-6">
              商品名と説明
            </h2>

            {/* --- 商品名 --- */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                商品名 <span className="text-red-500 text-sm">(必須)</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                value={form.name || ""}
                onChange={handleFormChange}
              />
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(serverErrors.name)
                  ? serverErrors.name[0]
                  : serverErrors.name}
              </div>
            </div>

            {/* --- ブランド名 --- */}
            <div className="mb-6">
              <label
                htmlFor="brand"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                ブランド名
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                value={form.brand || ""}
                onChange={handleFormChange}
              />
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(serverErrors.brand)
                  ? serverErrors.brand[0]
                  : serverErrors.brand}
              </div>
            </div>

            {/* --- 商品の説明 --- */}
            <div className="mb-6">
              <label
                htmlFor="explain"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                商品の説明 <span className="text-red-500 text-sm">(必須)</span>
              </label>
              <textarea
                id="explain"
                name="explain"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity0 p-2 min-h-[120px] resize-y"
                value={form.explain || ""}
                onChange={handleFormChange}
              ></textarea>
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(serverErrors.explain)
                  ? serverErrors.explain[0]
                  : serverErrors.explain}
              </div>
            </div>

            {/* --- 販売価格 --- */}
            <div className="mb-6">
              <label
                htmlFor="price"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                販売価格 <span className="text-red-500 text-sm">(必須)</span>
              </label>
              <div className="relative">
                <span className="currency-symbol absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-semibold text-gray-500">
                  ¥
                </span>
                <input
                  id="price"
                  name="price"
                  type="text"
                  className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 pl-10 pr-2 text-right text-lg font-semibold"
                  value={form.price !== null ? form.price : ""}
                  onChange={handleFormChange}
                  inputMode="numeric"
                />
              </div>
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(serverErrors.price)
                  ? serverErrors.price[0]
                  : serverErrors.price}
              </div>
            </div>
          </section>

          {/* --- 送信ボタン --- */}
          <div className="mt-10">
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || isImageUploading || !form.item_image}
            >
              {isSubmitting ? "出品処理中..." : "出品する"}
            </button>
            <div className="text-red-500 text-sm mt-3 text-center">
              {!form.item_image && !isImageUploading && !isSubmitting
                ? "商品画像をアップロードしてください。"
                : ""}
            </div>
          </div>
        </form>
      </div>
      <style jsx>{`
        /* カテゴリーボタンのスタイル */
        .category-checkbox-input {
          display: none;
        }

        .category-checkbox-label {
          padding: 6px 14px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 2px solid #ef4444;
          color: #ef4444;
          border-radius: 9999px;
          cursor: pointer;
          background-color: white;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
          line-height: 1;
          white-space: nowrap;
        }

        .category-checkbox-input:checked + .category-checkbox-label {
          background-color: #ef4444;
          color: #fff;
          border-color: #ef4444;
        }
      `}</style>
    </div>
  );
}
