"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { mutate } from "swr";
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

  const { isAuthenticated, isLoading: isAuthLoading, apiClient } = useAuth();

  /* =========================
     🔐 Profile Gate state
  ========================= */
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  /* =========================
     🔐 Profile 判定（API 呼び出し）
  ========================= */
  useEffect(() => {
    if (!isAuthenticated || !apiClient) return;

    let cancelled = false;

    const run = async () => {
      try {
        const res = await apiClient.get("/mypage/profile");
        if (cancelled) return;

        const flag =
          typeof res.data?.has_profile === "boolean"
            ? res.data.has_profile
            : false;

        setHasProfile(flag);
        setProfileChecked(true);
      } catch (e) {
        console.error(e);
        setHasProfile(false);
        setProfileChecked(true);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, apiClient]);

  /* =========================
     🚦 Profile 未作成なら強制遷移
     ※ Hooks 後・副作用でのみ実行
  ========================= */
  useEffect(() => {
    if (isAuthenticated && profileChecked && hasProfile === false) {
      router.replace("/mypage/profile");
    }
  }, [isAuthenticated, profileChecked, hasProfile, router]);

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
     ❤️ いいね切替
  ========================= */
  const toggleFavorite = async (item: PublicItem, isFavorited: boolean) => {
    if (!apiClient) return;

    try {
      if (isFavorited) {
        await apiClient.delete(`/reactions/items/${item.id}/favorite`);
      } else {
        await apiClient.post(`/reactions/items/${item.id}/favorite`);
      }

      mutate("/items/favorite");
      await favoriteResult.refetchFavorites();
    } catch (e) {
      console.error(e);
    }
  };

  /* =========================
     🧠 表示アイテム決定
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
      displayType: item.displayType ?? null,
      isFavorited: item.isFavorited ?? false,
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



  /* =========================
     ⛔ Profile Gate UI
     ※ return は必ず Hooks の後
  ========================= */
  const isGateLoading =
  isAuthenticated && (!profileChecked || hasProfile === null);

  const isPageLoading =
  isAuthLoading || isItemsLoading || isGateLoading;

if (isGateLoading) {
  return (
    <div className={styles.main_contents}>
      <div className={styles.loadingBox}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>確認中...</p>
      </div>
    </div>
  );
}

  /* =========================
     🎨 UI（既存デザイン完全保持）
  ========================= */
  return (
    <div className={styles.main_contents}>
      {isPageLoading && (
        <div className={styles.loadingBox}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      )}

      {!isPageLoading && (
        <>
          {/* 🏪 テスト用ショップリンク */}
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

          {/* Tabs */}
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

          {/* Items */}
          <div className={styles.items_select}>
            {items.length > 0 ? (
              items.map((item) => {
                const isFavorited = item.isFavorited === true;

                return (
                  <div key={item.id} className={styles.items_select_all}>
                    <div
                      className={styles.cardLink}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/item/${item.id}`)}
                    >
                      <div className={styles.itemImageWrapper}>
                        {item.displayType &&
                          item.displayType !== "FAVORITE" && (
                            <span className={styles.ownStar}>
                              {item.displayType === "STAR" ? "⭐️" : "💫"}
                            </span>
                          )}

                        {isAuthenticated && (
                          <button
                            className={styles.favoriteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item, isFavorited);
                            }}
                          >
                            {isFavorited ? "❤️" : "🤍"}
                          </button>
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
                );
              })
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