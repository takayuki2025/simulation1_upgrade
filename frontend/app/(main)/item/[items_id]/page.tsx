"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/ui/auth/useAuth";

import { useItemDetailSWR } from "@/services/useItemDetailSWR";
import { getImageUrl, onImageError, IMAGE_TYPE } from "@/utils/utils";

import styles from "./W-ItemDetailView.module.css";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuth();

  /* =========================
     itemId 解決
  ========================= */
  const itemId = useMemo(() => {
    const raw = params.items_id;
    if (!raw) return null;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  }, [params.items_id]);

  /* =========================
     Query
  ========================= */
  const {
    item,
    comments,
    isFavorited,
    favoritesCount,
    isLoading,
    isError,
    mutate,
  } = useItemDetailSWR(itemId);

  /* =========================
     状態
  ========================= */
  const [newComment, setNewComment] = useState("");
  const [commentErrors, setCommentErrors] = useState<string[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isOwner = isAuthenticated && user?.id === item?.user_id;
  const canInteract = isAuthenticated && !isOwner;
  const isSoldOut = item?.remain === 0;
  const totalLoading = isLoading;

  /* =========================
     Favorite Command
  ========================= */
  const submitFavorite = async () => {
    if (!item) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    await fetch(`/api/items/${item.id}/favorite`, {
      method: isFavorited ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    mutate();
  };

  /* =========================
     Comment Command
  ========================= */
  const submitComment = async () => {
    if (!item) return;
    if (!newComment.trim()) {
      setCommentErrors(["コメントを入力してください"]);
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsSubmittingComment(true);
    setCommentErrors([]);

    try {
      await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: item.id,
          comment: newComment,
        }),
      });

      setNewComment("");
      mutate();
    } catch {
      setCommentErrors(["コメント投稿に失敗しました"]);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const navigateToPurchase = () => {
    if (!item) return;
    router.push(`/purchase/${item.id}`);
  };

  /* =========================
     ガード
  ========================= */
  if (totalLoading) {
    return <p className={styles.loadingText}>商品情報を読み込み中...</p>;
  }

  if (isError || !item) {
    return <p className={styles.notFoundText}>商品が見つかりませんでした。</p>;
  }

  const itemCategories = Array.isArray(item.category) ? item.category : [];

  /* =========================
     JSX（デザインそのまま）
  ========================= */
  return (
    <div className={styles.item_detail_wrapper}>
      <div className={styles.item_detail_contents}>
        <div className={styles.card}>
          {/* 商品画像 */}
          <div className={styles.imageArea}>
            <img
              src={getImageUrl(item.item_image, IMAGE_TYPE.ITEM)}
              onError={(e) => onImageError(e, item.name)}
              alt="商品写真"
              className={styles.image}
            />
          </div>

          {/* 商品情報 */}
          <div className={styles.infoArea}>
            <h2 className={styles.itemTitle}>{item.name}</h2>

            <div className={styles.brandBlock}>
              <p className={styles.brandLabel}>ブランド名</p>
              <p className={styles.brandValue}>{item.brand || "未登録"}</p>
            </div>

            <div className={styles.priceBlock}>
              {isSoldOut ? (
                <h2 className={styles.priceSoldOut}>SOLD OUT</h2>
              ) : (
                <h2 className={styles.price}>
                  <span className={styles.priceYen}>¥</span>
                  {item.price?.toLocaleString()}
                  <span className={styles.priceAfter}> (税込)</span>
                </h2>
              )}
            </div>

            {/* Favorite / Comment */}
            <div className={styles.reactionRow}>
              <div className={styles.favoriteBlock}>
                {canInteract ? (
                  <button
                    onClick={submitFavorite}
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

            {/* 購入 */}
            <button
              onClick={() => {
                if (isOwner) router.push("/mypage");
                else if (!isAuthenticated) router.push("/login");
                else navigateToPurchase();
              }}
              disabled={(isSoldOut && !isOwner) || totalLoading}
              className={styles.purchaseBtn}
            >
              {isOwner
                ? "マイページへ移動する"
                : !isAuthenticated
                  ? "ログインして購入"
                  : isSoldOut
                    ? "SOLD OUT"
                    : "カートへ"}
            </button>

            {/* 説明・コメント（以下 JSX そのまま） */}
            {/* …… ここは提示してくれた JSX と完全同一 …… */}
          </div>
        </div>
      </div>
    </div>
  );
}
