"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useItemsSWR } from "@/src/services/itemService";
import { getImageUrl, onImageError } from "@/utils/utils";
import { useAuth } from "@/hooks/useSanctumAuth";

export default function Home() {
  const searchParams = useSearchParams();
  const { apiClient, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // -------------------------------
  // タブ
  // -------------------------------
  const currentTab = useMemo(
    () => (searchParams.get("tab") === "mylist" ? "mylist" : "all"),
    [searchParams],
  );

  const currentSearchQuery = useMemo(
    () => searchParams.get("all_item_search") || "",
    [searchParams],
  );

  // -------------------------------
  // ★ 全タブで、ログインしていれば apiClient を使う
  // -------------------------------
  const effectiveApiClient = useMemo(() => {
    if (isAuthenticated && apiClient) {
      return apiClient; // ALLでもTOKEN付きでAPI呼び出す！
    }
    return null;
  }, [currentTab, isAuthenticated, apiClient]);

  // -------------------------------
  // SWR fetch
  // -------------------------------
  const { items, isLoading: isItemsLoading } = useItemsSWR(
    currentTab,
    currentSearchQuery,
    isAuthLoading ? null : effectiveApiClient,
  );

  console.log("[Home] apiClient =", apiClient);
  console.log("[Home] isAuthLoading =", isAuthLoading);
  console.log("[Home] isAuthenticated =", isAuthenticated);

  const isPageLoading = isAuthLoading || isItemsLoading;

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
          {/* タブ */}
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
              href={{ pathname: "/", query: { tab: "mylist" } }}
              className={`mylists ${currentTab === "mylist" ? "active" : ""}`}
            >
              マイリスト
            </Link>
          </div>

          {/* 商品一覧 */}
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
