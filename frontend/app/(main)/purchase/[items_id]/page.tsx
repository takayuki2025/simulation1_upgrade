"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import { useItemDetailSWR } from "@/services/useItemDetailSWR";
import { useUserProfileSWR } from "@/services/useUserProfileSWR";
import { getImageUrl } from "@/utils/utils";
import styles from "./W-Purchase-Confirm.module.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/* =====================================================
   Stripe Provider（最重要）
===================================================== */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

/* =====================================================
   Types
===================================================== */
type PaymentMethod = "" | "card" | "convenience";

const paymentLabelMap: Record<PaymentMethod, string> = {
  "": "未選択",
  card: "クレジットカード支払い",
  convenience: "コンビニ支払い",
};

/* =====================================================
   Wrapper（Elements は最上位）
===================================================== */
export default function PurchaseConfirmPageWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <PurchaseConfirmPage />
    </Elements>
  );
}

/* =====================================================
   Page
===================================================== */
function PurchaseConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading, apiClient } = useAuth();

  const stripe = useStripe();
  const elements = useElements();

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
     Payment
  ========================= */
  const [payment, setPayment] = useState<PaymentMethod>("");

  const canPurchase =
    isAuthenticated &&
    !!item &&
    item.remain > 0 &&
    payment !== "" &&
    !!profile?.address;

  const isPageLoading = isAuthLoading || isItemLoading || isProfileLoading;

  /* =====================================================
     Purchase Flow
  ===================================================== */
  const submitPurchase = async () => {
    if (!canPurchase || !item || !apiClient) return;

    try {
      /* -----------------------
         ① Order 作成
      ----------------------- */
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

      /* -----------------------
         ② Payment Start
      ----------------------- */
      const paymentRes = await apiClient.post("/payments/start", {
        order_id: orderId,
        method: payment === "card" ? "card" : "konbini",
      });

      localStorage.setItem("latest_order_id", String(orderId));

      /* -----------------------
         ③ Card 決済
      ----------------------- */
      if (payment === "card") {
        if (!stripe || !elements) {
          throw new Error("Stripe not ready");
        }

        const card = elements.getElement(CardElement);

        // ★ destroy 対策（超重要）
        if (!card || (card as any)._destroyed) {
          alert("カード入力が初期化されています。再度入力してください。");
          return;
        }

        const { client_secret } = paymentRes.data;
        if (!client_secret) {
          throw new Error("client_secret not returned");
        }

        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: { card },
        });

        if (result.error) {
          alert(result.error.message ?? "カード決済に失敗しました");
          return;
        }
      }

      /* -----------------------
         ④ 完了画面へ遷移（★ここだけ変更）
      ----------------------- */
      if (payment === "card") {
        router.push("/thanks/buy/stripe-card");
      } else {
        router.push(`/thanks/buy/konbini?order_id=${orderId}`);
      }
    } catch (e) {
      console.error(e);
      alert("購入処理に失敗しました");
    }
  };

  /* =====================================================
     Guards
  ===================================================== */
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




  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className={styles.item_buy_contents}>
      <div className={styles.item_buy_lr}>
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

          {/* 支払い方法 */}
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

          {/* Card */}
          <div
            className={styles.item_buy_content_section}
            style={{ display: payment === "card" ? "block" : "none" }}
          >
            <h4>カード情報</h4>
            <CardElement options={{ hidePostalCode: true }} />
          </div>

          {/* 配送先 */}
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

        {/* Summary */}
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
