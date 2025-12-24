"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useShop } from "./layout"; // 同階層 layout から
import { useItemListByShopSWR } from "@/services/useItemListByShopSWR";
import { useItemSearchByShopSWR } from "@/services/useItemSearchByShopSWR";
import { useAuth } from "@/ui/auth/useAuth";
import { getImageUrl } from "@/utils/utils";
import styles from "./W-Shop-Home.module.css"; // shop用に分離推奨

export default function ShopHomePage() {
  const { shopCode } = useShop();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const currentSearchQuery = useMemo(
    () => searchParams.get("q") || "",
    [searchParams],
  );
  const isSearch = currentSearchQuery.trim().length > 0;

  const listResult = useItemListByShopSWR(shopCode);
  const searchResult = useItemSearchByShopSWR(shopCode, currentSearchQuery);

  const items = isSearch ? searchResult.items : listResult.items;
  const isPageLoading =
    authLoading || (isSearch ? searchResult.isLoading : listResult.isLoading);

  if (isPageLoading) {
    return <div className={styles.loadingBox}>読み込み中...</div>;
  }

  return (
    <div className={styles.main_contents}>
      <h1 className={styles.title}>Shop: {shopCode}</h1>

      <div className={styles.items_select}>
        {items.map((item) => (
          <div key={item.id} className={styles.items_select_all}>
            <Link href={`/item/${item.id}`} className={styles.cardLink}>
              <img src={getImageUrl(item.item_image)} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>¥{item.price?.toLocaleString()}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {!isAuthenticated && (
        <div className={styles.notice}>
          ログインすると購入やマイリストが使えます。
        </div>
      )}
    </div>
  );
}
