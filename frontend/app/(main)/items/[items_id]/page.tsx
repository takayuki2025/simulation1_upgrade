"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useRouter, useParams } from "next/navigation";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

// 認証フックのインポート
import { useAuth } from "@/hooks/useSanctumAuth";
// 💡 【修正】汎用化された画像ヘルパーをインポート
import { getImageUrl, onImageError, IMAGE_TYPE } from "@/utils/utils";

// 💡 ライフサイクル診断ログ: コンポーネントがいつ再レンダリングされたかを確認
console.log("DIAGNOSTICS: ItemDetailPage RE-RENDERED.");

// =======================================================
// グローバル設定 & ユーティリティ
// =======================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// 認証情報付きリクエストをaxios全体で許可
axios.defaults.withCredentials = true;

// ----------------------------------------------------------------
// 型定義
// ----------------------------------------------------------------

interface ApiUser {
  id: number;
  name: string;
  user_image: string | null;
}

interface Item {
  id: number;
  user_id: number;
  name: string;
  brand: string | null;
  price: number | null;
  item_image: string | null;
  remain: number;
  explain: string;
  category: string;
  condition: string | null;
}

interface Comment {
  id: number;
  user: ApiUser;
  comment: string;
  created_at: string;
}

interface ItemDetailResponse {
  item: Item;
  is_favorited: boolean;
  favorites_count: number;
  comments: Comment[];
  errors?: string[];
}

interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  signal?: AbortSignal;
}

// ----------------------------------------------------------------
// ユーティリティ: エラーハンドリングのための型ガードとヘルパー
// ----------------------------------------------------------------

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
    // 404エラーの場合は、特に「ルートが見つからない」ことを明示
    if (error.response?.status === 404) {
      return `リクエストエラー: ルートが見つかりません (${error.config?.url})`;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

// =======================================================
// メインコンポーネント
// =======================================================

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();

  // 1. useAuth から必要な状態とアクションを取得
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    isRefreshing,
    isLoggingOut,
    apiClient,
    logout,
    backendUser, // 💡 backendUser を取得
  } = useAuth();

  // 💡 データフェッチが一度試行されたことを記録するRef
  const hasFetchedRef = useRef(false);

  // 💡 コメント投稿リクエストのAbortControllerを保持するRef
  const commentAbortControllerRef = useRef<AbortController | null>(null);

  // ----------------------------------------------------------------
  // State & Computed Properties
  // ----------------------------------------------------------------
  const itemId = useMemo(() => {
    const idParam = params.items_id;
    const idString = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!idString || typeof idString !== "string" || idString.trim() === "") {
      return null;
    }
    const parsedId = parseInt(idString as string);
    return isNaN(parsedId) || parsedId <= 0 ? -1 : parsedId;
  }, [params.items_id]);

  // 💡 backendUser を extendedUser の代替として使用
  const extendedUser = backendUser as ApiUser | null;

  const [item, setItem] = useState<Item | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemErrors, setItemErrors] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentErrors, setCommentErrors] = useState<string[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isOwner = useMemo(() => {
    return isAuthenticated && extendedUser?.id === item?.user_id;
  }, [isAuthenticated, extendedUser, item]);

  const canInteract = useMemo(() => {
    return isAuthenticated && extendedUser?.id !== item?.user_id;
  }, [isAuthenticated, extendedUser, item]);

  const isSoldOut = useMemo(() => {
    return (item?.remain ?? 0) < 1;
  }, [item]);

  const itemCategories = useMemo(() => {
    if (!item?.category) return [];
    try {
      const categories = JSON.parse(item.category);
      return Array.isArray(categories) ? categories : [String(item.category)];
    } catch (e) {
      return [item.category];
    }
  }, [item]);

  // 💡 【修正】getImageUrl を使用し、画像タイプに IMAGE_TYPE.ITEM (0) を渡す
  const fullItemImageUrl = useMemo(() => {
    // 0 は商品画像タイプ、キャッシュキー 0 はバスターなしを意味
    return getImageUrl(item?.item_image || null, IMAGE_TYPE.ITEM, 0);
  }, [item?.item_image]);

  // ----------------------------------------------------------------
  // データフェッチヘルパー (useCallback)
  // ----------------------------------------------------------------

  const authenticatedFetchWithRetry = useCallback(
    async (config: RetryableAxiosRequestConfig): Promise<AxiosResponse> => {
      if (isAuthLoading || isLoggingOut || !apiClient) {
        throw new Error(
          "Authentication or client not ready (isAuthLoading/isLoggingOut/apiClient check failed).",
        );
      }

      return await apiClient.request(config);
    },
    [isAuthLoading, isLoggingOut, apiClient],
  );

  const fetchData = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError("");
      setItemErrors([]);

      const endpoint = `/api/items/${id}`;

      try {
        let data: ItemDetailResponse;

        if (isAuthenticated && apiClient) {
          const response = await authenticatedFetchWithRetry({
            method: "GET",
            url: endpoint,
          });
          data = response.data as ItemDetailResponse;
        } else {
          const response = await axios.get(`${API_BASE_URL}${endpoint}`);
          data = response.data as ItemDetailResponse;
        }

        if (data.item) {
          setItem(data.item);
          setIsFavorited(data.is_favorited ?? false);
          setFavoritesCount(data.favorites_count ?? 0);
          setComments(data.comments ?? []);
        } else if (data.errors && data.errors.length > 0) {
          setItemErrors(data.errors);
          setError(data.errors[0]);
        } else {
          setError("商品情報が見つかりませんでした。");
        }
      } catch (e: unknown) {
        console.error("データの取得中に予期せぬエラーが発生しました。", e);
        let errMsg = getErrorMessage(e);
        if (axios.isAxiosError(e) && !e.response?.data?.message) {
          errMsg = "データの取得中にエラーが発生しました。";
        }
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, apiClient, authenticatedFetchWithRetry],
  );

  // ----------------------------------------------------------------
  // Effect / Watcher
  // ----------------------------------------------------------------

  useEffect(() => {
    if (itemId === null || itemId === -1) {
      let errorMessage =
        itemId === -1
          ? "無効な商品IDの形式です。"
          : "商品IDが指定されていません。";
      setError(errorMessage);
      setIsLoading(false);
      hasFetchedRef.current = true;
      return;
    }

    if (hasFetchedRef.current && item !== null) {
      setIsLoading(false);
      return;
    }

    if (isAuthLoading) {
      return;
    }

    hasFetchedRef.current = true;
    fetchData(itemId);
  }, [itemId, isAuthLoading, fetchData, item]);

  useEffect(() => {
    return () => {
      if (commentAbortControllerRef.current) {
        commentAbortControllerRef.current.abort();
        commentAbortControllerRef.current = null;
      }
    };
  }, []);

  // ----------------------------------------------------------------
  // 機能ロジック
  // ----------------------------------------------------------------

  const submitFavorite = useCallback(async () => {
    if (!item || !isAuthenticated) {
      if (!isAuthenticated) router.push("/login");
      return;
    }
    if (isOwner) {
      setItemErrors(["ご自身の商品の操作はできません。"]);
      return;
    }
    if (isAuthLoading || isRefreshing) {
      setItemErrors(["認証情報の同期中です。しばらくお待ちください..."]);
      return;
    }

    const isCurrentlyFavorited = isFavorited;
    setIsFavorited(!isCurrentlyFavorited);
    setFavoritesCount((prev) => (isCurrentlyFavorited ? prev - 1 : prev + 1));

    try {
      // 💡 【修正】お気に入りエンドポイントの URL 形式を統一
      const endpoint = `/api/items/${item.id}/favorite`;

      const config = isCurrentlyFavorited
        ? { method: "DELETE" as const, url: endpoint }
        : {
            method: "POST" as const,
            url: endpoint,
            // POSTの場合は、item_idはURLに含まれるため、dataは不要だが、あっても害はない
            // data: { item_id: item.id },
          };

      await authenticatedFetchWithRetry(config);
    } catch (e: unknown) {
      console.error("お気に入り操作中にエラーが発生しました:", e);
      // 失敗した場合は状態を元に戻す
      setIsFavorited((prev) => !prev);
      setFavoritesCount((prev) => (isCurrentlyFavorited ? prev + 1 : prev - 1));

      let errMsg = getErrorMessage(e);
      setItemErrors([errMsg]);
    }
  }, [
    item,
    isAuthenticated,
    isFavorited,
    authenticatedFetchWithRetry,
    router,
    isOwner,
    isAuthLoading,
    isRefreshing,
  ]);

  /**
   * コメント投稿処理
   */
  const submitComment = useCallback(async () => {
    // 💡 新しいガード句: 既に送信中であれば即座に終了 (二重実行の防御)
    if (isSubmittingComment) {
      console.log("DEBUG: Already submitting, blocking new request.");
      return;
    }

    // 1. 既存のコントローラーがあれば、新しいリクエストを開始する前にキャンセルを試みる
    if (commentAbortControllerRef.current) {
      console.log(
        "DEBUG: Cancelling previous comment submission to prevent duplicate.",
      );
      commentAbortControllerRef.current.abort();
      commentAbortControllerRef.current = null;
    }

    setCommentErrors([]);
    setIsSubmittingComment(true);

    // 2. 新しいコントローラーを作成し、Refに保持
    const controller = new AbortController();
    commentAbortControllerRef.current = controller;

    console.log("DEBUG: submitComment function started.");
    console.log("DEBUG: isAuthenticated =", isAuthenticated);
    console.log("DEBUG: isAuthLoading =", isAuthLoading);
    console.log("DEBUG: isRefreshing =", isRefreshing);

    // --- ガード句 ---
    if (!isAuthenticated) {
      router.push("/login");
      setIsSubmittingComment(false);
      commentAbortControllerRef.current = null;
      return;
    }
    if (!item) {
      setCommentErrors(["商品情報が読み込まれていません。"]);
      setIsSubmittingComment(false);
      commentAbortControllerRef.current = null;
      return;
    }

    if (newComment.trim() === "") {
      setCommentErrors(["コメントを入力してください"]);
      setIsSubmittingComment(false);
      commentAbortControllerRef.current = null;
      return;
    }

    // 💡 認証状態の矛盾を確実に捉えて中断する (extendedUser のチェック)
    if (!extendedUser || !extendedUser.id) {
      console.error(
        "DIAGNOSTICS_ERROR: Authentication Mismatch. isAuthenticated=true but extendedUser is null.",
      );
      setCommentErrors([
        "ユーザー情報が取得できませんでした。セッションが不安定です。再度ログインしてください。",
      ]);
      setIsSubmittingComment(false);
      commentAbortControllerRef.current = null;
      return;
    }
    // --- ガード句終了 ---

    try {
      // 5. コメント投稿リクエストを実行 (signalを追加)
      const response: AxiosResponse = await authenticatedFetchWithRetry({
        method: "POST",
        url: "/api/comment",
        data: { item_id: item.id, comment: newComment },
        signal: controller.signal,
      });

      // 6. 成功時の処理
      if (response.data.comment) {
        const resComment = response.data.comment;
        const newCommentData: Comment = {
          id: resComment.id,
          comment: resComment.comment,
          created_at: resComment.created_at,
          user: resComment.user || {
            id: extendedUser.id,
            name: extendedUser.name,
            user_image: extendedUser.user_image,
          },
        };

        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
      } else {
        throw new Error(
          "コメントの投稿に成功しましたが、データ更新に失敗しました。",
        );
      }

      setIsSubmittingComment(false);
    } catch (e: unknown) {
      // 💡 キャンセルエラーの判定と処理 (ここでキャンセルを捕捉)
      if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") {
        if (commentAbortControllerRef.current !== controller) {
          console.log(
            "DIAGNOSTICS: Cancel reason: Previous request aborted by new submission (Scenario 1 - NORMAL).",
          );
          return;
        }

        console.log(
          "DIAGNOSTICS: Cancel reason: Page Unmount or Token Refresh Failure (Scenario 2/3 - ABNORMAL).",
        );
        setIsSubmittingComment(false);
        return;
      }

      // 致命的なエラーが発生した場合
      console.error("コメント投稿中にエラーが発生しました:", e);

      let errMsg = getErrorMessage(e);
      setCommentErrors([errMsg]);

      // 🚨 致命的なエラー発生時は必ずローディング状態を解除
      setIsSubmittingComment(false);

      if (errMsg.includes("Authentication failed after retry")) {
        setCommentErrors([
          "セッションの有効期限が切れました。再度ログインが必要です。",
        ]);
      }
    } finally {
      // 💡 成功またはエラーの完了時に、このリクエストのコントローラーがまだ Ref に残っている場合のみクリア
      if (commentAbortControllerRef.current === controller) {
        commentAbortControllerRef.current = null;
      }
    }
  }, [
    item,
    isAuthenticated,
    newComment,
    extendedUser,
    logout,
    authenticatedFetchWithRetry,
    router,
    isSubmittingComment,
  ]);

  /**
   * 購入/マイページへの遷移
   */
  const navigateToPurchase = () => {
    if (isOwner) {
      router.push("/mypage");
    } else if (isAuthenticated && item) {
      router.push(`/purchase/${item.id}`);
    } else {
      router.push("/login");
    }
  };

  // ----------------------------------------------------------------
  // レンダリング
  // ----------------------------------------------------------------

  const totalLoading = isAuthLoading || isLoading || isRefreshing;

  if (totalLoading) {
    return (
      <div className="flex justify-center items-center h-48 my-20 w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"></div>
        <p className="ml-4 text-xl font-semibold text-gray-600">
          {isAuthLoading
            ? "認証状態を確認中..."
            : isRefreshing
              ? "認証情報を更新中..."
              : "商品情報を読み込み中..."}
        </p>
      </div>
    );
  }

  if (error || (itemErrors && itemErrors.length > 0)) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md my-10 w-full max-w-5xl mx-auto">
        <p className="font-bold">データの取得エラー</p>
        <p>{error}</p>
        {itemErrors.map((err, index) => (
          <p key={index}>{err}</p>
        ))}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 w-full">
        <p className="text-xl font-semibold text-gray-600">
          商品が見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="item_detail_wrapper bg-gray-100 min-h-screen">
      <div className="item_detail_contents">
        <div className="flex flex-wrap lg:flex-nowrap w-full max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          {/* 商品画像エリア */}
          <div className="item_detail_image p-4 lg:p-8 w-full lg:w-1/2">
            <img
              src={fullItemImageUrl}
              alt="商品写真"
              // 💡 【修正】onImageError をインポートしたものに置き換え
              onError={(e) => onImageError(e, item.name)}
              className="item_detail_image1 w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* 商品情報エリア */}
          <div className="information p-4 lg:p-8 w-full lg:w-1/2 space-y-4">
            <div className="item_detail_name">
              <h2 className="text-3xl font-extrabold text-gray-800">
                {item.name}
              </h2>
            </div>

            <div className="item_detail_brand text-sm text-gray-600">
              <p className="item_detail_brand_1 font-semibold">ブランド名</p>
              <p className="item_detail_brand_2">{item.brand || "未登録"}</p>
            </div>

            <div className="item_detail_price">
              {isSoldOut ? (
                <h2 className="text-3xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded inline-block">
                  SOLD OUT
                </h2>
              ) : (
                <h2 className="text-3xl font-bold text-gray-900">
                  <span className="price_after text-xl font-normal">¥</span>
                  {item.price ? item.price.toLocaleString() : "---"}
                  <span className="price_after text-lg font-normal">
                    {" "}
                    (税込)
                  </span>
                </h2>
              )}
            </div>

            <div className="space-y-6 pt-4">
              {/* お気に入り＆コメントアイコン */}
              <div className="flex items-center space-x-8">
                {/* お気に入りボタン */}
                <div className="flex items-center">
                  {canInteract ? (
                    <button
                      onClick={submitFavorite}
                      type="button"
                      disabled={totalLoading || isSubmittingComment}
                      className="text-3xl transition-transform transform hover:scale-110 active:scale-90 p-0 m-0 leading-none focus:outline-none disabled:opacity-50"
                    >
                      <span
                        className={`heart_icon text-4xl ${
                          isFavorited ? "text-red-500" : ""
                        }`}
                      >
                        {isFavorited ? "❤️" : "🤍"}
                      </span>
                    </button>
                  ) : (
                    <span className="text-3xl text-gray-400 leading-none">
                      🤍
                    </span>
                  )}
                  <p className="text-xl ml-2 font-semibold text-gray-600">
                    {favoritesCount}
                  </p>
                </div>

                {/* コメントアイコンとカウント */}
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.6 3.2 12.16 12.16 0 0 1-1.9 2.5c-.8 1.1-1.7 2-2.8 2.5a5.77 5.77 0 0 1-3.6 0c-1.1-.5-2.1-1.4-2.8-2.5a12.16 12.16 0 0 1-1.9-2.5 8.38 8.38 0 0 1-.6-3.2" />
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                    <path d="M8 10h8" />
                  </svg>

                  <p className="text-xl ml-2 font-semibold text-gray-600">
                    {comments.length}
                  </p>
                </div>
              </div>

              {/* 購入ボタン */}
              <div className="item_detail_form pt-4">
                <button
                  onClick={navigateToPurchase}
                  disabled={(isSoldOut && !isOwner) || totalLoading}
                  className={`w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${
                    !isSoldOut
                      ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  } disabled:bg-gray-400 disabled:opacity-70`}
                >
                  {isOwner ? (
                    <span>マイページへ移動する</span>
                  ) : isAuthenticated && !isSoldOut ? (
                    <span>カートへ</span>
                  ) : isAuthenticated && isSoldOut ? (
                    <span>SOLD OUT</span>
                  ) : (
                    <span>ログインして購入</span>
                  )}
                </button>
              </div>
            </div>

            {/* 商品説明 */}
            <div className="item_detail_explain mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">商品説明</h2>
              <h3 className="explain_word text-gray-700 whitespace-pre-wrap">
                {item.explain}
              </h3>
            </div>

            {/* 商品情報（カテゴリー・状態） */}
            <div className="item_detail_category mt-8 border-t border-gray-200 pt-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  商品情報
                </h2>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-4">
                    <p className="w-24 text-gray-600 font-medium">カテゴリー</p>
                    <ul className="flex flex-wrap gap-2">
                      {itemCategories.length > 0 ? (
                        itemCategories.map((category, index) => (
                          <li
                            key={index}
                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
                          >
                            {category}
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          カテゴリーは登録されていません。
                        </p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="item_detail_condition mt-4">
              <div className="flex items-center space-x-4">
                <p className="w-24 text-gray-600 font-medium">商品の状態</p>
                <p className="text-gray-700 font-semibold">
                  {item.condition || "未登録"}
                </p>
              </div>
            </div>

            {/* コメント履歴 */}
            <div className="item_detail_comment_history mt-10 border-t border-gray-200 pt-6">
              <div className="comment_count_flex flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">コメント</h2>
                <span className="comments_count text-gray-500">
                  ({comments.length})
                </span>
              </div>

              {comments && comments.length > 0 ? (
                <div className="max-h-80 overflow-y-auto pr-2 pt-2 space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="comment border-b border-gray-100 pb-3"
                    >
                      <div className="comment_name_image flex items-center space-x-3">
                        <img
                          // 💡 【修正】getImageUrl を使用し、ユーザー画像タイプ (1) を渡す
                          src={getImageUrl(
                            comment.user.user_image || null,
                            IMAGE_TYPE.USER, // ユーザー画像タイプ (1)
                            0, // キャッシュキー
                          )}
                          alt="プロフィール画像"
                          className="user_image_css w-10 h-10 rounded-full object-cover"
                          // 💡 【修正】onImageError をインポートしたものに置き換え
                          onError={(e) => onImageError(e, comment.user.name)}
                        />
                        <p className="comment_name font-semibold text-gray-800">
                          {comment.user.name}
                        </p>
                      </div>
                      <p className="comment-text ml-10 mt-1 text-gray-700 whitespace-pre-wrap">
                        {comment.comment}
                      </p>
                      <small className="text-xs ml-10 text-gray-500 block mt-1">
                        投稿日時:{" "}
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 ml-5 text-gray-500 text-sm">
                  まだコメントはありません。
                </p>
              )}
            </div>

            {/* コメント投稿フォーム */}
            <div className="item_detail_comment_form mt-10">
              <h2 className="comment_word text-xl font-bold text-gray-800 mb-4">
                商品へのコメント
              </h2>

              {/* エラーメッセージ */}
              {commentErrors.length > 0 && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                  <ul>
                    {commentErrors.map((err, index) => (
                      <li key={index} className="text-sm">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isAuthenticated ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitComment();
                  }}
                  className="comment_form space-y-3"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={5}
                    placeholder="コメントを入力してください"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-700"
                    disabled={isSubmittingComment || totalLoading}
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-red-300"
                    disabled={
                      isSubmittingComment ||
                      totalLoading ||
                      newComment.trim() === ""
                    }
                  >
                    {isSubmittingComment ? "投稿中..." : "コメントを送信する"}
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-lg">
                  <a
                    onClick={() => router.push("/login")}
                    className="text-red-600 font-semibold cursor-pointer hover:underline"
                  >
                    ログインしてコメントする
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* スタイル定義 */}
      <style jsx>{`
        /* スタイルは省略されたもののみを記載 */
        .item_detail_contents {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .item_detail_image {
          width: 50%;
          max-width: 450px;
          min-width: 300px;
          padding: 50px;
        }

        .item_detail_image1 {
          width: 100%;
          height: auto;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          object-position: center;
        }

        .information {
          width: 50%;
          max-width: 450px;
          min-width: 300px;
          padding: 50px;
        }

        .explain_word {
          word-break: break-all;
          overflow-wrap: break-word;
          font-weight: 600;
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: 1.6;
          margin-left: 20px;
          font-size: 14px;
        }

        .comment {
          max-width: 320px;
          word-break: break-all;
          overflow-wrap: break-word;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px dashed #ccc;
        }
        .comment-text {
          font-weight: 600;
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: 1.6;
          margin-left: 50px;
          font-size: 14px;
        }
        .user_image_css {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: cover;
          object-position: center;
          position: relative;
          left: 0px;
        }

        @media (max-width: 768px) {
          .item_detail_image,
          .information {
            width: 100%;
            max-width: 100%;
            min-width: unset;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
