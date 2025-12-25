"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { AxiosResponse } from "axios";

import { useAuth } from "@/ui/auth/useAuth";
import styles from "./W-ThanksKonbini.module.css";

/* =======================
   Types
======================= */

type KonbiniStoreInfo = {
  confirmation_number?: string;
};

type KonbiniInstructions = {
  expires_at?: number;
  store?: Record<string, KonbiniStoreInfo>;
};

type Payment = {
  payment_id: number;
  method: "konbini";
  status: string;
  instructions: KonbiniInstructions | null;
};

type OrderDetailResponse = {
  order_id: number;
  order_status: string;
  payment: Payment | null;
};

export default function ThanksBuyKonbiniPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { apiClient } = useAuth();

  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRY = 30;
  const INTERVAL_MS = 1000;

  /* =======================
     Fetch with polling
  ======================= */

  useEffect(() => {
    if (!apiClient || !orderId) {
      setError("注文情報が取得できませんでした。");
      return;
    }

    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const res: AxiosResponse<OrderDetailResponse> = await apiClient.get(
          `/me/orders/${orderId}`,
        );

        if (cancelled) return;

        setOrder(res.data);

        if (
          res.data.payment &&
          res.data.payment.method === "konbini" &&
          !res.data.payment.instructions &&
          retryCount < MAX_RETRY
        ) {
          setRetryCount((c) => c + 1);
          setTimeout(fetchOrder, INTERVAL_MS);
        }
      } catch {
        if (!cancelled) {
          setError("注文情報の取得に失敗しました。");
        }
      }
    };

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [apiClient, orderId, retryCount]);

  /* =======================
     Guards
  ======================= */

  if (error) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <p className={styles.message}>{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <p className={styles.message}>注文情報を取得中です…</p>
        </div>
      </div>
    );
  }

  if (!order.payment) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <p className={styles.message}>支払い情報を生成中です…</p>
        </div>
      </div>
    );
  }

  const instructions = order.payment.instructions;

  if (!instructions) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.messageBox}>
          <p className={styles.message}>
            支払い情報を生成中です…
            <br />
            数秒後に自動で反映されます。
          </p>
        </div>
      </div>
    );
  }

  /* =======================
     Normalize
  ======================= */

  const expiresAtText = instructions.expires_at
    ? new Date(instructions.expires_at * 1000).toLocaleString("ja-JP")
    : "未設定";

  const confirmationNumber =
    instructions.store &&
    Object.values(instructions.store)[0]?.confirmation_number
      ? Object.values(instructions.store)[0]!.confirmation_number
      : "未発行（後ほど表示されます）";

  const availableStores = instructions.store
    ? Object.keys(instructions.store)
    : [];

  /* =======================
     UI
  ======================= */

  return (
    <div className={styles.thankYouPage}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>ご購入ありがとうございます</h1>

        <p className={styles.message}>
          以下の内容でコンビニ支払いを行ってください。
        </p>

        <div className={styles.konbiniInfo}>
          <p>
            <strong>注文状態：</strong>
            未払い（コンビニ支払い待ち）
          </p>

          <p>
            <strong>支払期限：</strong>
            {expiresAtText}
          </p>

          <p>
            <strong>受付番号：</strong>
            {confirmationNumber}
          </p>

          {availableStores.length > 0 && (
            <>
              <p>
                <strong>利用可能なコンビニ：</strong>
              </p>
              <ul>
                {availableStores.map((store) => (
                  <li key={store}>{store}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <Link href="/me/orders" className={styles.backHomeLink}>
            注文履歴へ
          </Link>
        </div>
      </div>
    </div>
  );
}
