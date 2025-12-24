"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/ui/auth/useAuth";
import styles from "./W-StripeThankYou.module.css";

type PaymentResponse = {
  payment_id: number;
  method: "card";
  status: string;
  provider_payment_id?: string;
  method_details?: {
    receipt_number?: string;
  };
};

export default function StripeThankYouPage() {
  const { apiClient } = useAuth();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);

  // 購入直後に保存した order_id
  const orderId =
    typeof window !== "undefined"
      ? localStorage.getItem("latest_order_id")
      : null;

  useEffect(() => {
    if (!apiClient || !orderId) return;

    apiClient
      .get("/payments/latest-by-order", {
        params: { order_id: orderId },
      })
      .then((res) => setPayment(res.data))
      .catch(() => {});
  }, [apiClient, orderId]);

  if (!payment) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <p>決済情報を取得中です…</p>
        </div>
      </div>
    );
  }

  const receiptNumber = payment.method_details?.receipt_number;

  return (
    <div className={styles.thankYouPage}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>ご購入ありがとうございます！</h1>

        {receiptNumber && (
          <p>
            <strong>受付番号：</strong>
            {receiptNumber}
          </p>
        )}

        <p className={styles.message}>
          Stripe カード決済が正常に完了しました。
          <br />
          商品発送完了までしばらくお待ちください。
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.backHomeLink}>
            ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
