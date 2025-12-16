"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import { useItemDetailSWR } from "@/services/useItemDetailSWR";
import { useUserProfileSWR } from "@/services/useUserProfileSWR";

import { getImageUrl } from "@/utils/utils";
import styles from "./W-Purchase-Confirm.module.css";

export default function PurchaseConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading, apiClient } = useAuth();

  /* =========================
     🧩 itemId
  ========================= */
  const itemId = useMemo(() => {
    const raw = params.items_id;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  }, [params.items_id]);

  /* =========================
     📦 Item / Profile
  ========================= */
  const { item, isLoading: isItemLoading, isError } = useItemDetailSWR(itemId);

  const { profile, isLoading: isProfileLoading } = useUserProfileSWR();
  

  /* =========================
     💳 支払い方法
  ========================= */
  const [payment, setPayment] = useState<"" | "convenience" | "card">("");

  const canPurchase =
    isAuthenticated &&
    !!item &&
    item.remain > 0 &&
    payment !== "" &&
    !!profile?.address;

  const isPageLoading = isAuthLoading || isItemLoading || isProfileLoading;

  /* =========================
     🧾 Purchase
  ========================= */
  const submitPurchase = async () => {
    if (!canPurchase || !item || !apiClient) return;

    try {
      if (payment === "card") {
        const res = await apiClient.post("/purchase/card", {
          item_id: item.id,
        });

        if (res.data?.stripe_url) {
          window.location.href = res.data.stripe_url;
          return;
        }
        throw new Error("Stripe URL が取得できませんでした");
      }

      if (payment === "convenience") {
        await apiClient.post("/purchase/convenience", {
          item_id: item.id,
        });
        router.push("/thanks/buy");
      }
    } catch (e) {
      console.error(e);
      alert("購入処理に失敗しました");
    }
  };

  /* =========================
     🛑 Guard
  ========================= */
  if (isPageLoading) {
    return <div className={styles.loadingOverlay}>購入情報を読み込み中...</div>;
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  if (isError || !item) {
    return (
      <div className={styles.errorBox}>
        <p className={styles.errorTitle}>データの取得エラー</p>
        <p>商品が見つかりませんでした。</p>
      </div>
    );
  }

  /* =========================
     🎨 UI（Vue 完全再現）
  ========================= */
  return (
    <div className={styles.item_buy_contents}>
      <div className={styles.item_buy_lr}>
        {/* 左 */}
        <div className={styles.item_buy_l}>
          {/* 商品 */}
          <div className={styles.item_buy_content_section}>
            <div className={styles.item_buy_image}>
              <img
                src={getImageUrl(item.item_image)}
                alt={item.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/96x96?text=No+Image";
                }}
              />
            </div>
            <div>
              <h3 className={styles.item_name}>{item.name}</h3>
              <h2 className={styles.item_price}>
                ¥{item.price.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* 支払い */}
          <div className={styles.item_buy_content_section}>
            <h4>支払い方法</h4>

            <select
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value as "convenience" | "card" | "")
              }
              disabled={item.remain <= 0}
            >
              <option value="">選択してください</option>
              <option value="convenience">コンビニ払い</option>
              <option value="card">カード支払い</option>
            </select>
          </div>

          {/* 配送先 */}
          <div className={styles.item_buy_content_section}>
            <div className={styles.addressHeader}>
              <h4>配送先</h4>
              <button
                className={styles.linkBtn}
                onClick={() => router.push(`/purchase/address/${item.id}`)}
              >
                変更する
              </button>
            </div>

            {profile ? (
              <div>
                <p>〒{profile.postNumber}</p>
                <p>{profile.address}</p>
                {profile.building && <p>{profile.building}</p>}
              </div>
            ) : (
              <p className={styles.warnText}>配送先住所が未登録です</p>
            )}
          </div>
        </div>

        {/* 右 */}
        <div className={styles.item_buy_r}>
          <div className={styles.item_buy_summary_box}>
            <p>商品代金: ¥{item.price.toLocaleString()}</p>
            <p>支払い方法: {payment || "未選択"}</p>

            {item.remain > 0 ? (
              <button disabled={!canPurchase} onClick={submitPurchase}>
                購入する
              </button>
            ) : (
              <p className={styles.soldText}>SOLD</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
