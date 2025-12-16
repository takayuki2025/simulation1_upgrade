"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { useItemListSWR } from "@/services/useItemListSWR";
import { useItemSearchSWR } from "@/services/useItemSearchSWR";
import { useFavoriteItemsSWR } from "@/services/useFavoriteItemsSWR";

import type { Item } from "@/types/item";
import { getImageUrl } from "@/utils/utils";
import { useAuth } from "@/ui/auth/useAuth";

import styles from "./W-Resource-Rich-Simulation-Center-Home.module.css";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  /* =========================
     🔖 タブ状態
  ========================= */
  const currentTab = useMemo(
    () => (searchParams.get("tab") === "mylist" ? "mylist" : "all"),
    [searchParams],
  );

  /* =========================
     🔍 検索状態
  ========================= */
  const currentSearchQuery = useMemo(
    () => searchParams.get("all_item_search") || "",
    [searchParams],
  );

  const isSearch = currentSearchQuery.trim().length > 0;

  /* =========================
     📦 Hooks（必ず全呼び）
  ========================= */
  const listResult = useItemListSWR();
  const searchResult = useItemSearchSWR(currentSearchQuery);
  const favoriteResult = useFavoriteItemsSWR();

  /* =========================
     🧠 表示切り替え
  ========================= */
  const items: Item[] =
    currentTab === "mylist"
      ? favoriteResult.items
      : isSearch
        ? searchResult.items
        : listResult.items;

  const isItemsLoading =
    currentTab === "mylist"
      ? favoriteResult.isLoading
      : isSearch
        ? searchResult.isLoading
        : listResult.isLoading;

  const isPageLoading = isAuthLoading || isItemsLoading;

  /* =========================
     🎨 UI
  ========================= */
  return (
    <div className={styles.main_contents}>
      {/* ローディング */}
      {isPageLoading && (
        <div className={styles.loadingBox}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      )}

      {/* ショップボタン */}
      <div className={styles.shopButtons}>
        {["a", "b", "c", "d"].map((code) => (
          <button
            key={code}
            onClick={() => router.push(`/shops/shop-${code}`)}
            className={styles.shopButton}
          >
            テストリンク ショップ{code.toUpperCase()}
          </button>
        ))}
      </div>

      {!isPageLoading && (
        <>
          {/* 🔖 タブ */}
          <div className={styles.main_select}>
            <Link
              href={{
                pathname: "/",
                query: { tab: "all", all_item_search: currentSearchQuery },
              }}
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
        </>
      )}
    </div>
  );
}
