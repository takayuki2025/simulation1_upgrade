"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AxiosResponse } from "axios";
import { useAuth } from "@/ui/auth/useAuth";

type OrderHistoryItem = {
  order_id: number;
  order_status: string;
  payment_status?: string | null;
  payment_method?: string | null;
  has_shipment: boolean;
};

export default function OrderHistoryPage() {
  const { apiClient } = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiClient) return;

    apiClient
      .get("/me/orders")
      .then((res: AxiosResponse<OrderHistoryItem[]>) => {
        setOrders(res.data);
      })
      .finally(() => setLoading(false));
  }, [apiClient]);

  if (loading) return <p>注文履歴を取得中です…</p>;

  return (
    <div>
      <h1>注文履歴</h1>

      {orders.length === 0 && <p>注文はまだありません。</p>}

      <ul>
        {orders.map((o) => (
          <li key={o.order_id}>
            <Link href={`/me/orders/${o.order_id}`}>注文 #{o.order_id}</Link>
            <div>状態: {o.order_status}</div>
            <div>
              支払い: {o.payment_method ?? "-"} / {o.payment_status ?? "-"}
            </div>
            <div>発送: {o.has_shipment ? "発送準備中" : "未発送"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
