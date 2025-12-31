"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mutate } from "swr";

import { useAuth } from "@/ui/auth/useAuth";
import { useItemDetailSWR } from "@/services/useItemDetailSWR";
import { getImageUrl, IMAGE_TYPE, onImageError } from "@/utils/utils";

import styles from "./W-ItemDetailView.module.css";

/* =========================
   util（変更なし）
========================= */
function toTokenList(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((v) => String(v ?? "").trim()).filter(Boolean);
  }
  const s = String(input).trim();
  if (!s) return [];
  return s
    .split(/[|/,\u3001\u30fb]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function shortenLabel(s: string, max = 14): string {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max) + "…";
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();

  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  /* =========================
     itemId
  ========================= */
  const itemId = useMemo(() => {
    const raw = (params as any).items_id;
    if (!raw) return null;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  }, [params]);

  /* =========================
     SWR（初期取得のみ）
  ========================= */
  const { item, comments, isFavorited, favoritesCount, isLoading, isError } =
    useItemDetailSWR(itemId);

  /* =========================
     ★ FIX: 表示の真実は local state
  ========================= */

  const [newComment, setNewComment] = useState("");
  const [commentErrors, setCommentErrors] = useState<string[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;

  /* =========================
     Guard
  ========================= */
  if (isLoading) {
    return <p className={styles.loadingText}>商品情報を読み込み中...</p>;
  }

  if (isError || !item) {
    return <p className={styles.notFoundText}>商品が見つかりませんでした。</p>;
  }

  const isOwner = isAuthenticated && user?.id === item.user_id;
  const canInteract = isAuthenticated && !isOwner;
  const isSoldOut = item.remain === 0;

  // ✅ local state は廃止：表示は常に SWR の値（唯一の真実）
  const displayedFavorited = isFavorited;
  const displayedCount = favoritesCount;

  /* =========================
     ❤️ Favorite（確定版）
  ========================= */

  const submitFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !auth.apiClient) {
      router.push("/login");
      return;
    }
    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);

    const next = !isFavorited;

    // ✅ useItemDetailSWR と完全に同じ key を使う（ここが最重要）
    const detailKey = ["item-detail", item.id, "auth"] as const;

    // ✅ optimistic update（GET を発生させない）
    mutate(
      detailKey,
      (current: any) => {
        if (!current) return current;
        return {
          ...current,
          is_favorited: next,
          favorites_count: Math.max(
            0,
            (current.favorites_count ?? 0) + (next ? 1 : -1),
          ),
        };
      },
      false,
    );

    try {
      if (next) {
        await auth.apiClient.post(`/reactions/items/${item.id}/favorite`);
      } else {
        await auth.apiClient.delete(`/reactions/items/${item.id}/favorite`);
      }

      // Favorite 一覧だけ再検証
      if (user) {
        mutate(["favorite-items", user.id]);
      }
    } catch {
      // ✅ rollback（直前のキャッシュに戻す）
      mutate(detailKey);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  /* =========================
     💬 Comment
  ========================= */
  const submitComment = async () => {
    if (!item) return;

    if (!newComment.trim()) {
      setCommentErrors(["コメントを入力してください"]);
      return;
    }

    if (!isAuthenticated || !auth.apiClient) {
      router.push("/login");
      return;
    }

    setIsSubmittingComment(true);
    setCommentErrors([]);

    try {
      await auth.apiClient.post("/comment", {
        item_id: item.id,
        comment: newComment,
      });

      setNewComment("");

      // ✅ ★ここが最重要修正点★
      const swrKey = ["item-detail", item.id, "auth"];
      mutate(swrKey);
    } catch {
      setCommentErrors(["コメント投稿に失敗しました"]);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  /* =========================
    表示用派生
  ========================= */
  const brandTokens: string[] = Array.isArray(item.brands)
    ? item.brands
    : item.brand
      ? toTokenList(item.brand)
      : [];

  const categoryTokens: string[] =
    (item as any)?.tags?.category?.map((c: any) => c.display_name) ??
    (Array.isArray(item.category) ? item.category : []);

  const rawCondition =
    (item as any).raw_condition ??
    (item as any).original_condition ??
    item.condition ??
    null;

  const rawColor =
    (item as any).raw_color ??
    (item as any).original_color ??
    (item as any).color ??
    null;

  const displayColor = item.color ?? null;

  const navigateToPurchase = () => {
    router.push(`/purchase/${item.id}`);
  };
  /* =========================
     JSX
  ========================= */
  return (
    <div className={styles.item_detail_wrapper}>
      <div className={styles.item_detail_contents}>
        <div className={styles.card}>
          {/* 商品画像エリア */}
          <div className={styles.imageArea}>
            <img
              src={getImageUrl(item.item_image)}
              onError={(e) => onImageError(e, item.name)}
              alt="商品写真"
              className={styles.image}
            />
          </div>

          {/* 商品情報エリア */}
          <div className={styles.infoArea}>
            {/* 商品名 */}
            <h2 className={styles.itemTitle}>{item.name}</h2>

            {/* ブランド（複数ボタン） */}
            <div className={styles.brandBlock}>
              <p className={styles.brandLabel}>ブランド名</p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {brandTokens.length > 0 ? (
                  brandTokens.map((b, idx) => (
                    <button
                      key={`${b}-${idx}`}
                      type="button"
                      // ここは「将来UI向上ボタン」に育てられる（検索/同ブランド一覧/属性説明など）
                      onClick={() => {
                        // v1: 動作確認用（必要なら後で実装を入れる）
                        // 例: router.push(`/search?brand=${encodeURIComponent(b)}`)
                        console.log("[brand token clicked]", b);
                      }}
                      style={{
                        border: "1px solid rgba(0,0,0,0.15)",
                        borderRadius: 10,
                        padding: "6px 10px",
                        fontSize: 13,
                        lineHeight: 1,
                        background: "white",
                        cursor: "pointer",
                        maxWidth: 220,
                      }}
                      title={b}
                    >
                      {shortenLabel(b)}
                    </button>
                  ))
                ) : (
                  <p className={styles.brandValue}>未登録</p>
                )}
              </div>
            </div>

            {/* 価格 */}
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

            {/* お気に入り + コメント */}
            <div className={styles.reactionRow}>
              <div className={styles.favoriteBlock}>
                {canInteract ? (
                  <button
                    type="button"
                    className={styles.favoriteBtn}
                    onClick={(e) => submitFavorite(e)}
                  >
                    <span
                      className={`${styles.favoriteIcon} ${
                        displayedFavorited ? styles.favoriteActive : ""
                      }`}
                    >
                      {displayedFavorited ? "❤️" : "🤍"}
                    </span>
                  </button>
                ) : (
                  <span className={styles.disabledHeart}>🤍</span>
                )}

                <p className={styles.favoriteCount}>{displayedCount}</p>
              </div>

              <div className={styles.commentIconBlock}>
                <span className={styles.commentIcon}>💬</span>
                <span className={styles.commentCount}>{comments.length}</span>
              </div>
            </div>

            {/* 購入ボタン */}
            <div className="item_detail_form pt-4">
              <button
                type="button" // ★ 必須
                onClick={() => {
                  if (isOwner) {
                    router.push("/mypage");
                  } else if (!isAuthenticated) {
                    router.push("/login");
                  } else {
                    navigateToPurchase();
                  }
                }}
                disabled={(isSoldOut && !isOwner) || isLoading}
                className={`w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg ${
                  !isSoldOut
                    ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                {isOwner
                  ? "マイページへ移動する"
                  : !isAuthenticated
                    ? "ログインして購入"
                    : isSoldOut
                      ? "SOLD OUT"
                      : "カートへ"}
              </button>
            </div>

            {/* 商品説明 */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>商品説明</h2>
              <p className={styles.explainText}>{item.explain}</p>
            </div>

            {/* 商品情報 */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>商品情報</h2>

              <div className={styles.categoryRow}>
                <p className={styles.categoryLabel}>カテゴリー：</p>
                <ul className={styles.categoryList}>
                  {categoryTokens.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* 状態：左 raw / 右 加工後（スペースあり） */}
              <div
                className={styles.conditionRow}
                style={{ display: "flex", gap: 14 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className={styles.conditionLabel}>商品の状態：</p>
                  <p className={styles.conditionValue}>
                    {rawCondition || "未登録"}
                  </p>
                </div>

                {/* <div style={{ flex: 1, minWidth: 0 }}>
                  <p className={styles.conditionLabel}>Update</p>
                  <p className={styles.conditionValue}>
                    {displayCondition || rawCondition || "未登録"}
                  </p>
                </div>
              </div> */}

                {/* カラー：新規追加 */}
                <div className={styles.conditionRow} style={{ marginTop: 10 }}>
                  <p className={styles.conditionLabel}>カラー：</p>
                  <p className={styles.conditionValue}>
                    {displayColor || rawColor || "未登録"}
                  </p>
                </div>
              </div>

              {/* コメント一覧 */}
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
                              comment.user.user_image,
                              IMAGE_TYPE.USER,
                            )}
                            className={styles.commentUserImage}
                            onError={onImageError}
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
                  <p className={styles.noComments}>
                    まだコメントはありません。
                  </p>
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
                      type="button" // ★ 必須
                      className={styles.submitBtn}
                      onClick={submitComment}
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
    </div>
  );
}
