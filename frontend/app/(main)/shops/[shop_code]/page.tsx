"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { useItemListSWR } from "@/services/useItemListSWR";
import { useItemSearchSWR } from "@/services/useItemSearchSWR";
import { useAuth } from "@/ui/auth/useAuth";

import { getImageUrl } from "@/utils/utils";
import styles from "./W-Resource-Rich-Simulation-Center-Home.module.css";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  /* =========================
     🔑 タブ / 検索状態
  ========================= */
  const currentTab = useMemo(
    () => (searchParams.get("tab") === "mylist" ? "mylist" : "all"),
    [searchParams],
  );

  const currentSearchQuery = useMemo(
    () => searchParams.get("all_item_search") || "",
    [searchParams],
  );

  const isSearch = currentSearchQuery.trim().length > 0;

  /* =========================
     🔑 一覧取得
     - auth 確定後に fetch
     - ログイン中は /items/public
  ========================= */
  const {
    items,
    isLoading: itemsLoading,
    error,
  } = isSearch ? useItemSearchSWR(currentSearchQuery) : useItemListSWR();

  const isPageLoading = authLoading || itemsLoading;

  /* =========================
     🔍 確認用ログ（最低限）
  ========================= */
  console.log("[Home][CHECK]", {
    authLoading,
    isAuthenticated,
    userId: user?.id ?? null,
    itemsCount: items.length,
    sample: items.slice(0, 5).map((i) => ({
      id: i.id,
      name: i.name,
      user_id: (i as any).user_id ?? null,
    })),
  });

  /* =========================
     ⏳ ローディング
  ========================= */
  if (isPageLoading) {
    return (
      <div className={styles.loadingBox}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>読み込み中...</p>
      </div>
    );
  }

  /* =========================
     🧱 表示
  ========================= */
  return (
    <div className={styles.main_contents}>
      {/* ショップリンク（確認用） */}
      <div className={styles.shopButtons}>
        {["a", "b", "c", "d"].map((s) => (
          <button
            key={s}
            onClick={() => router.push(`/shops/shop-${s}`)}
            className={styles.shopButton}
          >
            テストリンク ショップ{s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* タブ */}
      <div className={styles.main_select}>
        <Link
          href={{ pathname: "/", query: { tab: "all" } }}
          className={`${styles.recs} ${
            currentTab === "all" ? styles.active : ""
          }`}
        >
          すべて
        </Link>

        <Link
          href={{ pathname: "/", query: { tab: "mylist" } }}
          className={`${styles.mylists} ${
            currentTab === "mylist" ? styles.active : ""
          }`}
        >
          マイリスト
        </Link>
      </div>

      {/* 商品一覧 */}
      <div className={styles.items_select}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className={styles.items_select_all}>
              <Link href={`/item/${item.id}`} className={styles.cardLink}>
                <div className={styles.itemImageWrapper}>
                  <img
                    src={getImageUrl(item.item_image)}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  {item.remain === 0 && (
                    <div className={styles.sold_text}>SOLD</div>
                  )}
                </div>

                <div className={styles.item_info}>
                  <p className={styles.item_name}>{item.name}</p>
                  <p className={styles.item_price}>
                    ¥{item.price?.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className={styles.no_items}>
            {currentTab === "mylist" && !isAuthenticated
              ? "マイリストを見るにはログインが必要です。"
              : "該当する商品が見つかりませんでした。"}
          </div>
        )}
      </div>
    </div>
  );
}
