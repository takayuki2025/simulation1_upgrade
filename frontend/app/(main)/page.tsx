"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { useItemListSWR } from "@/services/useItemListSWR";
import { useItemSearchSWR } from "@/services/useItemSearchSWR";

import { getImageUrl } from "@/utils/utils";
import { useAuth } from "@/ui/auth/useAuth";

import styles from "./W-Resource-Rich-Simulation-Center-Home.module.css";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isLoading: isAuthLoading } = useAuth();

  /* =========================
     🔍 URLベース検索状態
  ========================= */
  const currentSearchQuery = useMemo(
    () => searchParams.get("all_item_search") || "",
    [searchParams],
  );

  const isSearch = currentSearchQuery.trim().length > 0;

  /* =========================
     📦 Hooks は必ず両方呼ぶ（重要）
  ========================= */
  const listResult = useItemListSWR();
  const searchResult = useItemSearchSWR(currentSearchQuery);

  const items = isSearch ? searchResult.items : listResult.items;
  const isItemsLoading = isSearch
    ? searchResult.isLoading
    : listResult.isLoading;

  const isPageLoading = isAuthLoading || isItemsLoading;

  /* =========================
     🧪 デバッグ
  ========================= */
  console.log("[Home][Search]", {
    currentSearchQuery,
    isSearch,
    itemsLength: items.length,
  });

  /* =========================
     🎨 UI
  ========================= */
  return (
    <div className={styles.main_contents}>
      {/* 🔄 ローディング */}
      {isPageLoading && (
        <div className={styles.loadingBox}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      )}

      {/* 🏬 ショップリンク（そのまま） */}
      <div className={styles.shopButtons}>
        {["a", "b", "c", "d"].map((code) => (
          <button
            key={code}
            onClick={() => router.push(`/shops/shop-${code}`)}
            className={styles.shopButton}
          >
            テストリンク ショップ UseCase DDD 構築中{code.toUpperCase()}
          </button>
        ))}
      </div>

      {!isPageLoading && (
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
              {isSearch
                ? "該当する商品が見つかりませんでした。"
                : "商品がありません。"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
