"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

type Shipment = {
  id: number;
  status: "created" | "packed" | "shipped" | "in_transit" | "delivered";
  eta: string | null;
};

export default function ShopOrderDetailPage() {
  const { shop_code, order_id } = useParams<{
    shop_code: string;
    order_id: string;
  }>();

  const router = useRouter();
  const { apiClient } = useAuth();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchShipment = async () => {
    if (!apiClient) return;
    setIsLoading(true);
    try {
      const res = await apiClient.get(
        `/shops/${shop_code}/orders/${order_id}/shipment`,
      );
      setShipment(res.data);
    } catch {
      setShipment(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!apiClient || !shop_code || !order_id) return;
    fetchShipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClient, shop_code, order_id]);

  const nextAction = useMemo(() => {
    if (!shipment) return null;
    switch (shipment.status) {
      case "created":
        return { key: "pack" as const, label: "梱包完了" };
      case "packed":
        return { key: "ship" as const, label: "発送" };
      case "shipped":
        return { key: "in-transit" as const, label: "輸送中" };
      case "in_transit":
        return { key: "deliver" as const, label: "配達完了" };
      default:
        return null;
    }
  }, [shipment]);

  const action = async () => {
    if (!shipment || !apiClient || !nextAction) return;
    if (isActionLoading) return; // 連打ブロック

    setIsActionLoading(true);
    try {
      await apiClient.post(`/shipments/${shipment.id}/${nextAction.key}`);
      await fetchShipment();
    } catch {
      alert("処理に失敗しました（状態が変わっている可能性があります）");
      await fetchShipment();
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) return <div className="p-6">読み込み中...</div>;
  if (!shipment) return <div className="p-6">Shipment が見つかりません。</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">配送管理（注文 #{order_id}）</h1>

      <p>
        現在の状態: <span className="font-mono">{shipment.status}</span>
      </p>

      <p>
        到着予定: <span className="font-mono">{shipment.eta ?? "-"}</span>
      </p>

      {nextAction ? (
        <button
          disabled={isActionLoading}
          onClick={action}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          {nextAction.label}
        </button>
      ) : (
        <div className="text-sm text-gray-600">
          これ以上の操作はありません。
        </div>
      )}

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
