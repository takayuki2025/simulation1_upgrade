"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useRouter, useParams } from "next/navigation";
import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

// 💡 useAuth のみを使用
import { useAuth } from "@/hooks/useAuth";
// 💡 外部のutils/utils.tsから画像ヘルパーをインポート
import { getImageUrl, onImageError } from "@/utils/utils";

// =======================================================
// グローバル変数
// =======================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.withCredentials = true;

// =======================================================
// 型定義
// =======================================================

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

/**
 * サーバーからのレスポンス型
 */
interface ItemDetailResponse {
  item: Item;
  is_favorited: boolean;
  favorites_count: number;
  comments: Comment[];
  errors?: string[];
}

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
    isLoggingOut, // ★ エラー解消のため追加
    apiClient,
    logout,
    reloadAuthToken,
  } = useAuth();

  // 💡 データフェッチが一度試行されたことを記録するRef
  const hasFetchedRef = useRef(false);

  // ----------------------------------------------------------------
  // Computed Properties: itemId
  // ----------------------------------------------------------------
  const itemId = useMemo(() => {
    const idParam = params.items_id;
    const idString = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!idString || typeof idString !== "string" || idString.trim() === "") {
      return null;
    }
    const parsedId = parseInt(idString as string);
    if (isNaN(parsedId) || parsedId <= 0) {
      return -1;
    }
    return parsedId;
  }, [params.items_id]);

  // userオブジェクトにuser_imageなどが含まれていることを期待し、型アサーション
  const extendedUser = user as any;

  const [item, setItem] = useState<Item | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemErrors, setItemErrors] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentErrors, setCommentErrors] = useState<string[]>([]);

  // ----------------------------------------------------------------
  // Computed Properties (useMemo) ★ 欠落部分をすべて追加
  // ----------------------------------------------------------------

  // 商品の所有者であるか
  const isOwner = useMemo(() => {
    return isAuthenticated && extendedUser?.id === item?.user_id;
  }, [isAuthenticated, extendedUser, item]);

  // お気に入り/購入操作が可能か (非所有者かつログイン済み)
  const canInteract = useMemo(() => {
    return isAuthenticated && extendedUser?.id !== item?.user_id;
  }, [isAuthenticated, extendedUser, item]);

  // 売り切れ状態か
  const isSoldOut = useMemo(() => {
    return (item?.remain ?? 0) < 1;
  }, [item]);

  // カテゴリ文字列を配列にパース
  const itemCategories = useMemo(() => {
    if (!item?.category) return [];
    try {
      const categories = JSON.parse(item.category);
      return Array.isArray(categories) ? categories : [item.category];
    } catch (e) {
      return [item.category];
    }
  }, [item]);

  // 商品画像のフルURL
  const fullItemImageUrl = useMemo(() => {
    return getImageUrl(item?.item_image || null, 0);
  }, [item?.item_image]);

  // ----------------------------------------------------------------
  // データフェッチヘルパー (useCallbackでラップ)
  // ----------------------------------------------------------------

  /**
   * 💡 責務: 認証済みリクエストを実行し、401エラー時にトークンをリフレッシュして再試行する。
   */
  const authenticatedFetchWithRetry = useCallback(
    async (config: any): Promise<AxiosResponse> => {
      if (isAuthLoading || isLoggingOut || !apiClient) {
        throw new Error(
          "Authentication or client not ready (isAuthLoading/isLoggingOut/apiClient check failed)."
        );
      }

      try {
        // 1. 通常のリクエスト実行
        return await apiClient.request(config);
      } catch (e) {
        const error = e as AxiosError;
        const status = error.response?.status;

        // 2. 401 Unauthorized エラーの場合
        if (status === 401) {
          console.warn(
            "401 Unauthorized detected. Attempting token refresh and retry..."
          );
          try {
            // トークンを強制リフレッシュ
            await reloadAuthToken();
            // 3. 再度リクエストを実行
            const secondResponse = await apiClient.request(config);
            console.log("Token refresh and retry successful.");
            return secondResponse;
          } catch (refreshError) {
            // 4. リフレッシュ失敗またはリトライ後のエラー
            console.error(
              "Token refresh or retry failed. Logging out.",
              refreshError
            );
            await logout();
            throw new Error("Authentication failed after retry.");
          }
        }
        // 401 以外のエラーはそのままスロー
        throw error;
      }
    },
    // ★ 依存配列に isLoggingOut を追加
    [
      isAuthLoading,
      isLoggingOut,
      isAuthenticated,
      apiClient,
      logout,
      reloadAuthToken,
    ]
  );

  /**
   * 商品詳細データをAPIから取得する関数
   */
  const fetchData = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError("");
      setItemErrors([]);

      const endpoint = `/api/items/${id}`;

      try {
        let data: ItemDetailResponse;

        // 💡 認証状態によってクライアントを使い分ける
        if (isAuthenticated && apiClient) {
          const response = await authenticatedFetchWithRetry({
            method: "GET",
            url: endpoint,
          });
          data = response.data as ItemDetailResponse; // ★ 型アサーション
        } else {
          const response = await axios.get(`${API_BASE_URL}${endpoint}`);
          data = response.data as ItemDetailResponse; // ★ 型アサーション
        }

        if (data.item) {
          setItem(data.item);
          // APIが返すプロパティを使用。??演算子で未定義の場合に備える
          setIsFavorited(data.is_favorited ?? false);
          setFavoritesCount(data.favorites_count ?? 0);
          setComments(data.comments ?? []);
        } else if (data.errors && data.errors.length > 0) {
          setItemErrors(data.errors);
          setError(data.errors[0]);
        } else {
          setError("商品情報が見つかりませんでした。");
        }
      } catch (e: any) {
        console.error("データの取得中に予期せぬエラーが発生しました。", e);
        const errMsg =
          e.message ||
          e.response?.data?.message ||
          "データの取得中にエラーが発生しました。";
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, apiClient, authenticatedFetchWithRetry]
  );

  // ----------------------------------------------------------------
  // Effect / Watcher
  // ----------------------------------------------------------------
  useEffect(() => {
    if (hasFetchedRef.current) {
      if (item) {
        setIsLoading(false);
      }
      return;
    }

    if (isAuthLoading) {
      return;
    }

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

    hasFetchedRef.current = true;
    fetchData(itemId);
  }, [itemId, isAuthLoading, fetchData, item]);

  // ----------------------------------------------------------------
  // 機能ロジック
  // ----------------------------------------------------------------

  /**
   * お気に入り追加/削除処理
   */
  const submitFavorite = useCallback(async () => {
    if (!item || !isAuthenticated) {
      if (!isAuthenticated) router.push("/login");
      return;
    }
    const isCurrentlyFavorited = isFavorited;
    setIsFavorited(!isCurrentlyFavorited);
    setFavoritesCount((prev) => (isCurrentlyFavorited ? prev - 1 : prev + 1));

    try {
      const endpoint = isCurrentlyFavorited
        ? `/api/favorite/${item.id}`
        : `/api/favorite`;
      const config = isCurrentlyFavorited
        ? { method: "DELETE" as const, url: endpoint }
        : {
            method: "POST" as const,
            url: endpoint,
            data: { item_id: item.id },
          };

      await authenticatedFetchWithRetry(config);
    } catch (e: any) {
      console.error("お気に入り操作中にエラーが発生しました:", e);
      setIsFavorited((prev) => !prev);
      setFavoritesCount((prev) => (isCurrentlyFavorited ? prev + 1 : prev - 1));
      const errMsg =
        e.message ||
        e.response?.data?.message ||
        "お気に入り操作中に予期せぬエラーが発生しました。";
      setItemErrors([errMsg]);
    }
  }, [item, isAuthenticated, isFavorited, authenticatedFetchWithRetry, router]);

  /**
   * コメント投稿処理
   */
  const submitComment = useCallback(async () => {
    setCommentErrors([]);
    if (!isAuthenticated || !item || newComment.trim() === "") {
      if (!isAuthenticated) router.push("/login");
      if (newComment.trim() === "")
        setCommentErrors(["コメントを入力してください"]);
      return;
    }
    if (!extendedUser || !extendedUser.id) {
      setCommentErrors([
        "ユーザー情報が取得できませんでした。再度ログインしてください。",
      ]);
      await logout();
      return;
    }

    try {
      const response: any = await authenticatedFetchWithRetry({
        method: "POST",
        url: "/api/comment",
        data: { item_id: item.id, comment: newComment },
      });

      if (response.data.comment) {
        const resComment = response.data.comment;
        const newCommentData: Comment = {
          id: resComment.id,
          comment: resComment.comment,
          created_at: resComment.created_at,
          user: {
            id: extendedUser.id,
            name: extendedUser.name,
            user_image: extendedUser.user_image,
          },
        };
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
      } else {
        throw new Error(
          "コメントの投稿に成功しましたが、データ更新に失敗しました。"
        );
      }
    } catch (e: any) {
      console.error("コメント投稿中にエラーが発生しました:", e);
      const errMsg =
        e.message ||
        e.response?.data?.message ||
        "コメント投稿中に予期せぬエラーが発生しました。";
      setCommentErrors([errMsg]);
    }
  }, [
    item,
    isAuthenticated,
    newComment,
    extendedUser,
    logout,
    authenticatedFetchWithRetry,
    router,
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
      // 未認証ならログインページへ
      router.push("/login");
    }
  };

  // ----------------------------------------------------------------
  // レンダリング
  // ----------------------------------------------------------------

  if (isAuthLoading || isLoading) {
    // ローディング/認証確認中の表示
    return (
      <div className="flex justify-center items-center h-48 my-20 w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"></div>
        <p className="ml-4 text-xl font-semibold text-gray-600">
          {isAuthLoading ? "認証状態を確認中..." : "商品情報を読み込み中..."}
        </p>
      </div>
    );
  }

  if (error || (itemErrors && itemErrors.length > 0)) {
    // エラーメッセージの表示
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
    // 商品が見つからない場合の表示
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
                      className="text-3xl transition-transform transform hover:scale-110 active:scale-90 p-0 m-0 leading-none focus:outline-none"
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
                  disabled={isSoldOut && !isOwner}
                  className={`w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${
                    !isSoldOut
                      ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isOwner ? (
                    <span>マイページへ移動する</span>
                  ) : isAuthenticated && !isSoldOut ? (
                    <span>購入手続きへ</span>
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
                          src={getImageUrl(comment.user.user_image || null, 0)}
                          alt="プロフィール画像"
                          className="user_image_css w-10 h-10 rounded-full object-cover"
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
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    コメントを送信する
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
        /* スタイルは変更なし */
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

        .information h2,
        .information h3,
        .information p {
          margin-left: 0 !important;
          position: static;
        }

        .item_detail_brand {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
        .item_detail_brand_1 {
          font-weight: 700;
          font-size: 14px;
        }
        .item_detail_brand_2 {
          position: relative;
          left: 50px;
          font-weight: 600;
          font-size: 14px;
        }

        .item_detail_price {
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .item_detail_price h2 {
          font-size: 26px;
        }
        .price_after {
          font-size: 19px;
          font-weight: 500;
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

        .comments_count {
          position: relative;
          top: 0;
          margin-left: 10px;
          font-size: 14px;
          font-weight: normal;
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
        .comment_name_image {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
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
        .comment_name {
          position: relative;
          left: 10px;
          font-size: 17px;
          font-weight: 700;
        }
        .item_detail_comment_form h2 {
          font-size: 18px;
          position: relative;
          top: 8px;
          margin-bottom: 10px;
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
