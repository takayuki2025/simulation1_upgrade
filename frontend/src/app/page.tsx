"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { useItemListSWR } from "@/services/useItemListSWR";
import { useItemSearchSWR } from "@/services/useItemSearchSWR";
import { useFavoriteItemsSWR } from "@/services/useFavoriteItemsSWR";

import type { PublicItem } from "@/types/publicItem";

import { getImageUrl, IMAGE_TYPE, onImageError } from "@/utils/utils";
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
     📦 Hooks
  ========================= */
  const listResult = useItemListSWR();
  const searchResult = useItemSearchSWR(currentSearchQuery);
  const favoriteResult = useFavoriteItemsSWR();

  /* =========================
     🧠 PublicItem に正規化（★型安全）
  ========================= */
  const items: PublicItem[] = useMemo(() => {
    const rawItems =
      currentTab === "mylist"
        ? favoriteResult.items
        : isSearch
          ? searchResult.items
          : listResult.items;

    return rawItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      itemImagePath: item.itemImagePath ?? item.item_image ?? null,
      brandPrimary: item.brandPrimary ?? null,
      conditionName: item.conditionName ?? null,
      colorName: item.colorName ?? null,
      publishedAt: item.publishedAt ?? null,
      isOwnPersonalItem: item.isOwnPersonalItem ?? false,
    }));
  }, [
    currentTab,
    isSearch,
    favoriteResult.items,
    searchResult.items,
    listResult.items,
  ]);

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
      {isPageLoading && (
        <div className={styles.loadingBox}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      )}

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
          {/* ===== Tabs ===== */}
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

          {/* ===== Items ===== */}
          <div className={styles.items_select}>
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className={styles.items_select_all}>
                  {/* ★ Link を使わない（GET誤爆防止） */}
                  <div
                    className={styles.cardLink}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/item/${item.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        router.push(`/item/${item.id}`);
                      }
                    }}
                  >
                    <div className={styles.itemImageWrapper}>
                      {item.isOwnPersonalItem && (
                        <span
                          className={styles.ownStar}
                          title="あなたの出品"
                          aria-label="あなたの出品"
                        >
                          💫
                        </span>
                      )}

                      <img
                        src={getImageUrl(item.itemImagePath, IMAGE_TYPE.ITEM)}
                        alt={item.name}
                        className={styles.itemImage}
                        onError={onImageError}
                      />
                    </div>

                    <div className={styles.item_info}>
                      <p className={styles.item_name}>{item.name}</p>
                      <p className={styles.item_price}>
                        ¥{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
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
