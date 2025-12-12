"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { useItemsSWR } from "@/src/services/itemService";
import { getImageUrl, onImageError } from "@/utils/utils";
import { useAuth } from "@/hooks/useSanctumAuth";

import styles from "./W-Resource-Rich-Simulation-Center-Home.module.css"; // ← ★ CSS Modules 読み込み

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { apiClient, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const currentTab = useMemo(
    () => (searchParams.get("tab") === "mylist" ? "mylist" : "all"),
    [searchParams],
  );

  const currentSearchQuery = useMemo(
    () => searchParams.get("all_item_search") || "",
    [searchParams],
  );

  const effectiveApiClient = useMemo(() => {
    if (isAuthenticated && apiClient) return apiClient;
    return null;
  }, [isAuthenticated, apiClient]);

  const { items, isLoading: isItemsLoading } = useItemsSWR(
    currentTab,
    currentSearchQuery,
    isAuthLoading ? null : effectiveApiClient,
  );

  const isPageLoading = isAuthLoading || isItemsLoading;

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
        <button
          onClick={() => router.push("/shops/shop-a")}
          className={styles.shopButton}
        >
          ショップA(テスト用リンク)
        </button>

        <button
          onClick={() => router.push("/shops/shop-b")}
          className={styles.shopButton}
        >
          ショップB(テスト用リンク)
        </button>

        <button
          onClick={() => router.push("/shops/shop-c")}
          className={styles.shopButton}
        >
          ショップC(テスト用リンク)
        </button>

        <button
          onClick={() => router.push("/shops/shop-d")}
          className={styles.shopButton}
        >
          ショップD(テスト用リンク)
        </button>
      </div>

      {!isPageLoading && (
        <>
          {/* タブ */}
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
                  <Link href={`/item/${item.id}`}>
                    <div className={styles.itemImageWrapper}>
                      <img
                        src={getImageUrl(item.item_image)}
                        alt={item.name}
                        onError={(e) => onImageError(e, item.name)}
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
