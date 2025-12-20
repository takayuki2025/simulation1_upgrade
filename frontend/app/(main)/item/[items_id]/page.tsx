"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import { useItemDetailSWR } from "@/services/useItemDetailSWR";
import { getImageUrl, IMAGE_TYPE, onImageError } from "@/utils/utils";
import { mutate as globalMutate } from "swr";

import styles from "./W-ItemDetailView.module.css";

/**
 * 将来の拡張に備えて「brand が string / string[] どちらでも」扱えるようにする
 * さらに、string の場合は " / | ・ , 、 空白" などを許容して分割する。
 */
function toTokenList(input: unknown): string[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((v) => String(v ?? "").trim()).filter(Boolean);
  }

  const s = String(input).trim();
  if (!s) return [];

  // 区切り候補を多めに許容（将来の複雑入力や複数属性にも耐える）
  // 例: "ROLEX|SWISS|Ref:123", "ROLEX / SWISS", "ROLEX,SWISS", "ROLEX・SWISS"
  const parts = s
    .split(/[|/,\u3001\u30fb]+/) // | / , 、 ・
    .map((v) => v.trim())
    .filter(Boolean);

  // 分割できなければ単体扱い
  return parts.length ? parts : [s];
}

/**
 * UI用：ボタンに載せる短いラベル
 * 長い場合は省略（必要なら後で tooltip などへ）
 */
function shortenLabel(s: string, max = 14): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return t.slice(0, max) + "…";
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();

  /* =========================
     itemId 解決
  ========================= */
  const itemId = useMemo(() => {
    const raw = (params as any).items_id;
    if (!raw) return null;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  }, [params]);

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
     Optimistic UI State
  ========================= */
  const [localFavorited, setLocalFavorited] = useState<boolean | null>(null);
  const [localCount, setLocalCount] = useState<number | null>(null);

  /* =========================
     Comment Local State
  ========================= */
  const [newComment, setNewComment] = useState("");
  const [commentErrors, setCommentErrors] = useState<string[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;

  const isOwner = isAuthenticated && user?.id === item?.user_id;
  const canInteract = isAuthenticated && !isOwner;
  const isSoldOut = item?.remain === 0;

  /* =========================
     表示用 Reaction 状態
  ========================= */
  const displayedFavorited =
    localFavorited !== null ? localFavorited : isFavorited;

  const displayedCount = localCount !== null ? localCount : favoritesCount;

  /* =========================
     Favorite Command
  ========================= */
  const submitFavorite = async () => {
    if (!item) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const next = !displayedFavorited;

    // optimistic update
    setLocalFavorited(next);
    setLocalCount((prev) => (prev ?? favoritesCount) + (next ? 1 : -1));

    try {
      await auth.apiClient(`/items/${item.id}/favorite`, {
        method: next ? "POST" : "DELETE",
      });

      // 🔥 両方同期
      mutate(); // item detail
      globalMutate((key) => Array.isArray(key) && key[0] === "favorite-items");
    } catch {
      setLocalFavorited(isFavorited);
      setLocalCount(favoritesCount);
    }
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
      await auth.apiClient.post("/comment", {
        item_id: item.id,
        comment: newComment,
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

  /**
   * v2対応：
   * API が tags を返す場合は必ずそれを優先する
   */
  const tagBrandTokens: string[] =
    (item as any)?.tags?.brand?.map((b: any) => b.name) ?? [];

  const tagCondition = (item as any)?.tags?.condition?.[0]?.name ?? null;

  const tagColor = (item as any)?.tags?.color?.[0]?.name ?? null;

  /* =========================
     Guard
  ========================= */
  if (isLoading) {
    return <p className={styles.loadingText}>商品情報を読み込み中...</p>;
  }

  if (isError || !item) {
    return <p className={styles.notFoundText}>商品が見つかりませんでした。</p>;
  }

  const itemCategories = Array.isArray(item.category) ? item.category : [];

  /**
   * ブランドを「複数表示」するためのトークン化。
   * 優先順：
   * 1) item.brand_tokens（将来APIが返すならここ）
   * 2) item.brand（string / string[] どちらでも）
   */
  const brandTokens: string[] =
    tagBrandTokens.length > 0
      ? tagBrandTokens
      : toTokenList((item as any).brand_tokens ?? item.brand);

  /**
   * condition / color も将来 raw と display を分けられるように準備
   * - raw: items テーブル由来（例: "良好"）
   * - display: entity 由来（例: "ほぼ新品"）
   * 現状APIが display しか返さないなら raw=display で表示されるだけ（壊れない）
   */
  const rawCondition =
    (item as any).raw_condition ??
    (item as any).original_condition ??
    item.condition;

  const displayCondition =
    tagCondition ?? (item as any).display_condition ?? item.condition;

  const rawColor =
    (item as any).raw_color ??
    (item as any).original_color ??
    (item as any).color;

  const displayColor =
    tagColor ?? (item as any).display_color ?? (item as any).color;

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
                    onClick={submitFavorite}
                    className={styles.favoriteBtn}
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
                <p className={styles.categoryLabel}>カテゴリー</p>
                <ul className={styles.categoryList}>
                  {itemCategories.map((category, index) => (
                    <li key={index} className={styles.categoryTag}>
                      {category}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 状態：左 raw / 右 加工後（スペースあり） */}
              <div
                className={styles.conditionRow}
                style={{ display: "flex", gap: 14 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className={styles.conditionLabel}>商品の状態</p>
                  <p className={styles.conditionValue}>
                    {rawCondition || "未登録"}
                  </p>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className={styles.conditionLabel}>状態（加工）</p>
                  <p className={styles.conditionValue}>
                    {displayCondition || rawCondition || "未登録"}
                  </p>
                </div>
              </div>

              {/* カラー：新規追加 */}
              <div className={styles.conditionRow} style={{ marginTop: 10 }}>
                <p className={styles.conditionLabel}>カラー</p>
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
  );
}
