"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

export default function ShopOrderDetailPage() {
  const { shop_code, order_id } = useParams<{
    shop_code: string;
    order_id: string;
  }>();
  const router = useRouter();
  const { apiClient, isAuthenticated, isLoading } = useAuth();
  const [shipment, setShipment] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  /* =========================
     🔐 Auth Guard
  ========================= */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  /* =========================
     📦 Fetch Shipment
  ========================= */
  useEffect(() => {
    if (!apiClient || !order_id) return;

    apiClient
      .get(`/orders/${order_id}/shipment`)
      .then((res) => setShipment(res.data));
  }, [apiClient, order_id]);

  const action = async (type: string) => {
    if (!shipment || !apiClient) return;

    setIsActionLoading(true);
    try {
      await apiClient.post(`/shipments/${shipment.id}/${type}`);
      const res = await apiClient.get(`/shipments/${shipment.id}`);
      setShipment(res.data);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading || !shipment) {
    return <div className="p-6">読み込み中...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">配送管理（注文 #{order_id}）</h1>

      <p>
        現在の状態: <span className="font-mono">{shipment.status}</span>
      </p>
      <p>
        到着予定: <span className="font-mono">{shipment.eta ?? "-"}</span>
      </p>

      <div className="flex gap-2 flex-wrap">
        <button
          disabled={isActionLoading}
          onClick={() => action("pack")}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          梱包完了
        </button>
        <button
          disabled={isActionLoading}
          onClick={() => action("ship")}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          発送
        </button>
        <button
          disabled={isActionLoading}
          onClick={() => action("in-transit")}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          輸送中
        </button>
        <button
          disabled={isActionLoading}
          onClick={() => action("deliver")}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          配達完了
        </button>
      </div>

      <div className="pt-4">
        <button
          onClick={() => router.push(`/shops/${shop_code}/dashboard/orders`)}
          className="text-blue-600 underline text-sm"
        >
          ← 一覧へ戻る
        </button>
      </div>
    </div>
  );
}
