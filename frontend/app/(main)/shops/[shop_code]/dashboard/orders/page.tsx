"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

export default function ShopOrderListPage() {
  const { shop_code } = useParams<{ shop_code: string }>();
  const { apiClient } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!apiClient) return;
    apiClient
      .get(`/shops/${shop_code}/orders`)
      .then((res) => setOrders(res.data.orders));
  }, [apiClient, shop_code]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">注文一覧</h1>

      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/shops/${shop_code}/dashboard/orders/${order.id}`}
          className="block border p-4 rounded hover:bg-gray-50"
        >
          注文 #{order.id} / ¥{order.total_amount}
        </Link>
      ))}
    </div>
  );
}
