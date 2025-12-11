"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useSanctumAuth";
import { useItemDetailSWR } from "@/src/services/itemService";

import { getImageUrl, onImageError, IMAGE_TYPE } from "@/utils/utils";
import type { ItemComment } from "@/src/types/item";

import styles from "./W-ItemDetailView.module.css";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();

  const {
    apiClient,
    isAuthenticated,
    isLoading: isAuthLoading,
    user,
  } = useAuth();

  const isRefreshing = false;

  const itemId = useMemo(() => {
    const raw = params.items_id;
    if (!raw) return null;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(id);
    return isNaN(n) ? null : n;
  }, [params.items_id]);

  const {
    item,
    comments,
    isFavorited,
    favoritesCount,
    isLoading,
    isError,
    mutate,
  } = useItemDetailSWR(itemId, apiClient);

  const totalLoading = isAuthLoading || isLoading || isRefreshing;
  const itemErrors: string[] = [];
  const error = isError;

  // コメント投稿
  const [newComment, setNewComment] = useState("");
  const [commentErrors, setCommentErrors] = useState<string[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const navigateToPurchase = () => {
    if (!item) return;

    // ここは実際の購入ページのパスに合わせて変えてOK
    // 例: /purchase/9 みたいなページなら
    router.push(`/purchase/${item.id}`);

    // もし「カート画面に飛ばしたい」なら:
    // router.push(`/cart?item_id=${item.id}`);
  };

  const isOwner = useMemo(() => {
    if (!isAuthenticated || !item) return false;
    return user?.id === item.user_id;
  }, [isAuthenticated, item, user]);

  const canInteract = isAuthenticated && !isOwner;
  const isSoldOut = item?.remain === 0;

  /* ローディング -------------------------------- */
  if (totalLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>
          {isAuthLoading
            ? "認証状態を確認中..."
            : isRefreshing
              ? "認証情報を更新中..."
              : "商品情報を読み込み中..."}
        </p>
      </div>
    );
  }

  /* エラー -------------------------------- */
  if (isError || (itemErrors && itemErrors.length > 0)) {
    return (
      <div className={styles.errorBox}>
        <p className={styles.errorTitle}>データの取得エラー</p>
        <p>{String(error)}</p>
        {itemErrors.map((err, index) => (
          <p key={index}>{err}</p>
        ))}
      </div>
    );
  }

  /* 見つからない -------------------------------- */
  if (!item) {
    return (
      <div className={styles.notFoundBox}>
        <p className={styles.notFoundText}>商品が見つかりませんでした。</p>
      </div>
    );
  }

  /* カテゴリー整形 -------------------------------- */
  const itemCategories = Array.isArray(item.category)
    ? item.category
    : (() => {
        try {
          const parsed = JSON.parse(item.category);
          return Array.isArray(parsed) ? parsed : [item.category];
        } catch (_) {
          return [item.category];
        }
      })();

  /* JSX ----------------------------------------- */
  return (
    <div className={styles.item_detail_wrapper}>
      <div className={styles.item_detail_contents}>
        <div className={styles.card}>
          {/* 商品画像エリア */}
          <div className={styles.imageArea}>
            <img
              src={getImageUrl(item.item_image, IMAGE_TYPE.ITEM)}
              onError={(e) => onImageError(e, item.name)}
              alt="商品写真"
              className={styles.image}
            />
          </div>

          {/* 商品情報エリア */}
          <div className={styles.infoArea}>
            {/* 商品名 */}
            <h2 className={styles.itemTitle}>{item.name}</h2>

            {/* ブランド */}
            <div className={styles.brandBlock}>
              <p className={styles.brandLabel}>ブランド名</p>
              <p className={styles.brandValue}>{item.brand || "未登録"}</p>
            </div>

            {/* 価格 */}
            <div className={styles.priceBlock}>
              {isSoldOut ? (
                <h2 className={styles.priceSoldOut}>SOLD OUT</h2>
              ) : (
                <h2 className={styles.price}>
                  <span className={styles.priceYen}>¥</span>
                  {item.price ? item.price.toLocaleString() : "---"}
                  <span className={styles.priceAfter}> (税込)</span>
                </h2>
              )}
            </div>

            {/* お気に入り + コメント */}
            <div className={styles.reactionRow}>
              <div className={styles.favoriteBlock}>
                {canInteract ? (
                  <button
                    onClick={() => mutate()}
                    className={styles.favoriteBtn}
                  >
                    <span
                      className={`${styles.favoriteIcon} ${
                        isFavorited ? styles.favoriteActive : ""
                      }`}
                    >
                      {isFavorited ? "❤️" : "🤍"}
                    </span>
                  </button>
                ) : (
                  <span className={styles.disabledHeart}>🤍</span>
                )}

                <p className={styles.favoriteCount}>{favoritesCount}</p>
              </div>

              <div className={styles.commentIconBlock}>
                <span className={styles.commentIcon}>💬</span>
                <span className={styles.commentCount}>{comments.length}</span>
              </div>
            </div>

            {/* 購入ボタン */}
            <div className="item_detail_form pt-4">
              <button
                onClick={() => {
                  if (isOwner) {
                    router.push("/mypage");
                  } else if (!isAuthenticated) {
                    router.push("/login");
                  } else {
                    navigateToPurchase();
                  }
                }}
                disabled={(isSoldOut && !isOwner) || totalLoading}
                className={`w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${
                  !isSoldOut
                    ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                } disabled:bg-gray-400 disabled:opacity-70`}
              >
                {isOwner ? (
                  <span>マイページへ移動する</span>
                ) : !isAuthenticated ? (
                  <span>ログインして購入</span>
                ) : !isSoldOut ? (
                  <span>カートへ</span>
                ) : (
                  <span>SOLD OUT</span>
                )}
              </button>
            </div>

            {/* 商品説明 */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>商品説明</h2>
              <p className={styles.explainText}>{item.explain}</p>
            </div>

            {/* カテゴリー */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>商品情報</h2>
              <div className={styles.categoryRow}>
                <p className={styles.categoryLabel}>カテゴリー</p>
                <ul className={styles.categoryList}>
                  {itemCategories.map((category, index) => (
                    <li key={index} className={styles.categoryTag}>
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 商品状態 */}
            <div className={styles.conditionRow}>
              <p className={styles.conditionLabel}>商品の状態</p>
              <p className={styles.conditionValue}>
                {item.condition || "未登録"}
              </p>
            </div>

            {/* コメント履歴 */}
            <div className={styles.section}>
              <div className={styles.commentHeader}>
                <h2 className={styles.sectionTitle}>コメント</h2>
                <span className={styles.commentCountText}>
                  ({comments.length})
                </span>
              </div>

              {comments.length > 0 ? (
                <div className={styles.commentList}>
                  {comments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentUserRow}>
                        <img
                          src={getImageUrl(
                            comment.user.user_image || null,
                            IMAGE_TYPE.USER,
                          )}
                          className={styles.commentUserImage}
                          onError={(e) => onImageError(e, comment.user.name)}
                        />

                        <p className={styles.commentUserName}>
                          {comment.user.name}
                        </p>
                      </div>

                      <p className={styles.commentText}>{comment.comment}</p>

                      <small className={styles.commentDate}>
                        投稿日時:{" "}
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noComments}>まだコメントはありません。</p>
              )}
            </div>

            {/* コメント投稿 */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>商品へのコメント</h2>

              {commentErrors.length > 0 && (
                <div className={styles.errorBoxSmall}>
                  {commentErrors.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}

              {isAuthenticated ? (
                <>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={5}
                    className={styles.textarea}
                  />

                  <button
                    className={styles.submitBtn}
                    onClick={() => mutate()}
                    disabled={isSubmittingComment}
                  >
                    {isSubmittingComment ? "投稿中..." : "コメントを送信する"}
                  </button>
                </>
              ) : (
                <p
                  className={styles.submitBtn}
                  onClick={() => router.push("/login")}
                  style={{ cursor: "pointer" }}
                >
                  ログインしてコメントする
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
