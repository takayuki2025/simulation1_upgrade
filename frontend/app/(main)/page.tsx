"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Hexagonal Service
import { itemService } from "@/src/services/itemService";

// Utility
import { getImageUrl, onImageError } from "@/utils/utils";

// Auth
import { useAuth } from "@/hooks/useSanctumAuth";

// 型
import type { Item } from "@/src/types/item";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    isLoading: isAuthLoading,
    isLoggingOut,
    isAuthenticated,
    apiClient, // AxiosInstance | null
  } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);


console.log("[Home] apiClient =", apiClient);

  // ---------------------------------------------------
  // タブ判定（all / mylist）
  // ---------------------------------------------------
  const currentTab = useMemo(
    () => (searchParams.get("tab") === "mylist" ? "mylist" : "all"),
    [searchParams],
  );

  // ---------------------------------------------------
  // 検索クエリ（all のみ有効）
  // ---------------------------------------------------
  const currentSearchQuery = useMemo(
    () => searchParams.get("all_item_search") || "",
    [searchParams],
  );

  // ---------------------------------------------------
  // 全体ローディング状態
  // ---------------------------------------------------
  const isPageLoading = useMemo(() => {
    return isAuthLoading || isLoggingOut || loading;
  }, [isAuthLoading, isLoggingOut, loading]);

  // ---------------------------------------------------
  // アイテム取得
  // ---------------------------------------------------
  async function loadItems() {
    if (isAuthLoading) return; // 認証チェック中は待つ

    // mylist で未認証 → 空でOK
    if (currentTab === "mylist" && !isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);

    try {
      const list = await itemService.getItems({
        tab: currentTab,
        search: currentSearchQuery,
        apiClient: apiClient ?? undefined, // null 防止
      });

      setItems(list ?? []);
    } catch (err) {
      console.error("[Home] Item fetch error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------
  // Effect
  // ---------------------------------------------------
  useEffect(() => {
    loadItems();
  }, [
    currentTab,
    currentSearchQuery,
    isAuthenticated,
    apiClient,
    isAuthLoading,
  ]);

  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------
  return (
    <div className="main_contents">
      {isPageLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-red-500 border-red-300"></div>
          <p className="ml-4 text-lg text-gray-400">読み込み中...</p>
        </div>
      )}

      {!isPageLoading && (
        <>
          {/* ---------------------------------------------------
              タブ
            --------------------------------------------------- */}
          <div className="main_select">
            <Link
              href={{
                pathname: "/",
                query: { tab: "all", all_item_search: currentSearchQuery },
              }}
              className={`recs ${currentTab === "all" ? "active" : ""}`}
            >
              すべて
            </Link>

            <Link
              href={{
                pathname: "/",
                query: { tab: "mylist" },
              }}
              className={`mylists ${currentTab === "mylist" ? "active" : ""}`}
            >
              マイリスト
            </Link>
          </div>

          {/* ---------------------------------------------------
              商品一覧
            --------------------------------------------------- */}
          <div className="items_select">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="items_select_all">
                  <Link href={`/item/${item.id}`}>
                    <div className="relative">
                      <img
                        src={getImageUrl(item.item_image)}
                        alt={item.name}
                        onError={(e) => onImageError(e, item.name)}
                      />
                      {item.remain === 0 && (
                        <div className="sold-text">SOLD</div>
                      )}
                    </div>

                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">
                        ¥{item.price?.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center w-full py-10 text-gray-500">
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
