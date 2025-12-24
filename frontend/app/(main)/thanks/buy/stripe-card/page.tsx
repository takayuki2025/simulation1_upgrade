"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/ui/auth/useAuth";
import type { AxiosResponse } from "axios";
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
  const [error, setError] = useState<string | null>(null);

  const orderId =
    typeof window !== "undefined"
      ? localStorage.getItem("latest_order_id")
      : null;

  useEffect(() => {
    if (!apiClient || !orderId) return;

    let cancelled = false;
    let retryCount = 0;
    const MAX_RETRY = 10;
    const INTERVAL_MS = 500;

    const fetchPayment = async () => {
      try {
        const res: AxiosResponse<PaymentResponse> = await apiClient.get(
          "/payments/latest-by-order",
          {
            params: { order_id: orderId },
            validateStatus: () => true, // ★ 404 / 202 を catch しない
          },
        );

        if (cancelled) return;

        if (res.status === 200) {
          setPayment(res.data);
          return;
        }

        // 404 / 202 = まだ処理中
        if (retryCount < MAX_RETRY) {
          retryCount++;
          setTimeout(fetchPayment, INTERVAL_MS);
          return;
        }

        setError(
          "決済の確認に時間がかかっています。しばらくしてから再度ご確認ください。",
        );
      } catch (e) {
        if (retryCount < MAX_RETRY) {
          retryCount++;
          setTimeout(fetchPayment, INTERVAL_MS);
        } else {
          setError("決済情報の取得に失敗しました。");
        }
      }
    };

    fetchPayment();

    return () => {
      cancelled = true;
    };
  }, [apiClient, orderId]);

  /* ==========================
     表示
  ========================== */

  if (error) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <p>{error}</p>
          <Link href="/" className={styles.backHomeLink}>
            ホームへ戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <p>決済情報を確認中です…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.thankYouPage}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>ご購入ありがとうございます！</h1>

        {payment.method_details?.receipt_number && (
          <p>受付番号：{payment.method_details.receipt_number}</p>
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
