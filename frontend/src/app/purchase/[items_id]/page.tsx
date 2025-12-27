"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import { useItemDetailSWR } from "@/services/useItemDetailSWR";
import { useUserPrimaryAddressSWR } from "@/services/useUserPrimaryAddressSWR";
import { getImageUrl } from "@/utils/utils";
import styles from "./W-Purchase-Confirm.module.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type PaymentMethod = "" | "card" | "convenience";

/* ================= Wrapper ================= */
export default function PurchaseConfirmPageWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <PurchaseConfirmPage />
    </Elements>
  );
}

/* ================= Page ================= */
function PurchaseConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const { apiClient, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const stripe = useStripe();
  const elements = useElements();

  const itemId = useMemo(() => {
    const raw = (params as any).items_id;
    return Number(raw);
  }, [params]);

  const { item, isLoading: isItemLoading } = useItemDetailSWR(itemId);
  const { address, isLoading: isAddressLoading } = useUserPrimaryAddressSWR();

  const [payment, setPayment] = useState<PaymentMethod>("");

  const canPurchase =
    isAuthenticated &&
    !!item &&
    item.remain > 0 &&
    payment !== "" &&
    !!address?.id &&
    !!stripe &&
    !!elements;

  const submitPurchase = async () => {
    if (!canPurchase || !apiClient || !item || !address) return;

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

    await apiClient.post(`/orders/${orderId}/confirm-address`, {
      address_id: address.id,
    });

    const paymentRes = await apiClient.post("/payments/start", {
      order_id: orderId,
      method: payment === "card" ? "card" : "konbini",
    });

    if (payment === "card") {
      const card = elements!.getElement(CardElement);
      const { client_secret } = paymentRes.data;

      const result = await stripe!.confirmCardPayment(client_secret, {
        payment_method: { card: card! },
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      router.push(`/thanks/buy/stripe-card?order_id=${orderId}`);
    } else {
      router.push(`/thanks/buy/konbini?order_id=${orderId}`);
    }
  };

  if (isAuthLoading || isItemLoading || isAddressLoading || !item) {
    return <div className={styles.loadingOverlay}>購入情報を読み込み中...</div>;
  }

  return (
    <div className={styles.item_buy_wrapper}>
      <div className={styles.item_buy_contents}>
        <div className={styles.item_buy_lr}>
          {/* LEFT */}
          <div className={styles.item_buy_l}>
            {/* 商品 */}
            <div className={styles.item_buy_content_section}>
              <div className={styles.item_buy_image}>
                <img src={getImageUrl(item.item_image)} alt={item.name} />
              </div>
              <div>
                <h3 className={styles.item_name}>{item.name}</h3>
                <p className={styles.item_price}>
                  ¥{item.price.toLocaleString()}
                </p>
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
                <option value="コンビニ支払い">コンビニ支払い</option>
                <option value="card">クレジットカード支払い</option>
              </select>
            </div>

            {/* Card */}
            {payment === "card" && (
              <div className={styles.item_buy_content_section}>
                <h4>カード情報</h4>
                <div style={{ width: "100%" }}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#111827",
                          "::placeholder": { color: "#9ca3af" },
                        },
                        invalid: {
                          color: "#dc2626",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* 配送先 */}
            <div className={styles.item_buy_content_section}>
              <div className={styles.addressHeader}>
                <h4>配送先</h4>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => router.push("/purchase/address")}
                >
                  変更する
                </button>
              </div>

              {address ? (
                <div className={styles.addressBody}>
                  <p>〒{address.postNumber}</p>
                  <p>
                    {address.prefecture} {address.city}
                  </p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p className={styles.recipientName}>
                    {address.recipientName}
                  </p>
                </div>
              ) : (
                <p className={styles.warnText}>配送先住所が未登録です</p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.item_buy_r}>
            <div className={styles.item_buy_summary_box}>
              <p>商品代金: ¥{item.price.toLocaleString()}</p>
              <p>支払い方法: {payment || "未選択"}</p>

              <button disabled={!canPurchase} onClick={submitPurchase}>
                購入する
              </button>

              {!canPurchase && (
                <p className={styles.warnText}>
                  支払い方法・配送先を確認してください
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
