"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import { useItemDetailSWR } from "@/services/useItemDetailSWR";
import { useUserProfileSWR } from "@/services/useUserProfileSWR";
import { getStripe } from "@/lib/stripe";
import { getImageUrl } from "@/utils/utils";
import styles from "./W-Purchase-Confirm.module.css";

/** 内部的な支払い種別 */
type PaymentMethod = "" | "card" | "convenience";

/** 表示用 */
const paymentLabelMap: Record<PaymentMethod, string> = {
  "": "未選択",
  card: "クレジットカード支払い",
  convenience: "コンビニ支払い",
};

export default function PurchaseConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading, apiClient } = useAuth();

  /* =========================
     itemId
  ========================= */
  const itemId = useMemo(() => {
    const raw = params.items_id;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  }, [params.items_id]);

  /* =========================
     Item / Profile
  ========================= */
  const { item, isLoading: isItemLoading, isError } = useItemDetailSWR(itemId);
  const { profile, isLoading: isProfileLoading } = useUserProfileSWR();

  /* =========================
     支払い方法
  ========================= */
  const [payment, setPayment] = useState<PaymentMethod>("");

  const canPurchase =
    isAuthenticated &&
    !!item &&
    item.remain > 0 &&
    payment !== "" &&
    !!profile?.address;

  const isPageLoading = isAuthLoading || isItemLoading || isProfileLoading;

  /* =========================
     購入処理
  ========================= */
  const submitPurchase = async () => {
    if (!canPurchase || !item || !apiClient) return;

    try {
      /* ① Order 作成 */
      const orderRes = await apiClient.post("/orders", {
        shop_id: item.shop_id,
        items: [
          {
            item_id: item.id,
            name: item.name,
            price_amount: item.price,
            price_currency: "JPY",
            quantity: 1,
            image_path: item.item_image,
          },
        ],
      });

      const orderId = orderRes.data.order_id;

      /* ② Payment 開始 */
      const paymentRes = await apiClient.post("/payments/start", {
        order_id: orderId,
        method: payment === "card" ? "card" : "konbini",
      });

      /* ③ 支払い別分岐 */
      if (payment === "card") {
        const { client_secret } = paymentRes.data;
        if (!client_secret) {
          throw new Error("client_secret not returned");
        }

        const stripe = await getStripe();
        if (!stripe) {
          throw new Error("Stripe initialization failed");
        }

        const result = await stripe.confirmCardPayment(client_secret);
        if (result.error) {
          alert(result.error.message ?? "カード決済に失敗しました");
          return;
        }
      }

      // card / konbini 共通
      router.push("/purchase/processing");
    } catch (e) {
      console.error(e);
      alert("購入処理に失敗しました");
    }
  };

  /* =========================
     Guard
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

  console.log("ORDER PAYLOAD", {
    shop_id: item.shop_id,
    items: [
      {
        item_id: item.id,
        name: item.name,
        price_amount: item.price,
        price_currency: "JPY",
        quantity: 1,
        image_path: item.item_image,
      },
    ],
  });
  /* =========================
     UI
  ========================= */
  return (
    <div className={styles.item_buy_contents}>
      <div className={styles.item_buy_lr}>
        <div className={styles.item_buy_l}>
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

          <div className={styles.item_buy_content_section}>
            <h4>支払い方法</h4>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value as PaymentMethod)}
            >
              <option value="">選択してください</option>
              <option value="convenience">コンビニ支払い</option>
              <option value="card">クレジットカード支払い</option>
            </select>
          </div>

          <div className={styles.item_buy_content_section}>
            <h4>配送先</h4>
            {profile ? (
              <>
                <p>〒{profile.postNumber}</p>
                <p>{profile.address}</p>
                {profile.building && <p>{profile.building}</p>}
              </>
            ) : (
              <p className={styles.warnText}>配送先住所が未登録です</p>
            )}
          </div>
        </div>

        <div className={styles.item_buy_r}>
          <div className={styles.item_buy_summary_box}>
            <p>商品代金: ¥{item.price.toLocaleString()}</p>
            <p>支払い方法: {paymentLabelMap[payment]}</p>

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
