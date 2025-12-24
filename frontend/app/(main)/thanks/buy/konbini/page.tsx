"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { AxiosResponse } from "axios";

import { useAuth } from "@/ui/auth/useAuth";
import styles from "./W-ThanksKonbini.module.css";

/* =====================================================
   Types
===================================================== */

type KonbiniStoreInfo = {
  payment_code?: string;
  confirmation_number?: string;
};

type KonbiniInstructions = {
  expires_at?: number; // UNIX timestamp (seconds)
  store?: Record<string, KonbiniStoreInfo>;
};

type PaymentLatestByOrderResponse = {
  payment_id: number;
  method: "konbini";
  status: string;
  instructions: KonbiniInstructions | null;
};

/* =====================================================
   Page
===================================================== */

export default function ThanksBuyKonbiniPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { apiClient } = useAuth();

  const [payment, setPayment] = useState<PaymentLatestByOrderResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  /* =====================================================
     Fetch payment by order_id
  ===================================================== */

  useEffect(() => {
    if (!apiClient || !orderId) {
      setError("注文情報が取得できませんでした。");
      return;
    }

    apiClient
      .get("/payments/latest-by-order", {
        params: { order_id: orderId },
      })
      .then((res: AxiosResponse<PaymentLatestByOrderResponse>) => {
        setPayment(res.data);
      })
      .catch(() => {
        setError("支払い情報の取得に失敗しました。");
      });
  }, [apiClient, orderId]);

  /* =====================================================
     Guards
  ===================================================== */

  if (error) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <h1 className={styles.title}>エラー</h1>
          <p className={styles.message}>{error}</p>
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
          <p>支払い情報を取得中です…</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     Normalize Stripe data
  ===================================================== */

  const instructions = payment.instructions;

  // 支払期限（UNIX秒 → 日本時間）
  const expiresAtText = instructions?.expires_at
    ? new Date(instructions.expires_at * 1000).toLocaleString("ja-JP")
    : "未設定";

  // 受付番号（Stripe は store ごとに同一値を返す）
  const confirmationNumber =
    instructions?.store &&
    Object.values(instructions.store)[0]?.confirmation_number
      ? Object.values(instructions.store)[0]!.confirmation_number
      : "未発行";

  // 利用可能なコンビニ一覧
  const availableStores = instructions?.store
    ? Object.keys(instructions.store)
    : [];

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className={styles.thankYouPage}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>ご購入ありがとうございます！</h1>

        <p className={styles.message}>
          以下の内容でコンビニ支払いを行ってください。
        </p>

        <div className={styles.konbiniInfo}>
          <p>
            <strong>支払期限：</strong>
            {expiresAtText}
          </p>

          <p>
            <strong>受付番号：</strong>
            {confirmationNumber}
          </p>

          <div className={styles.storeList}>
            <p>
              <strong>利用可能なコンビニ：</strong>
            </p>
            <ul>
              {availableStores.map((store) => (
                <li key={store}>{store}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.backHomeLink}>
            ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
