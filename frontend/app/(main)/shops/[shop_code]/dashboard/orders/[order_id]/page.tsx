"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

export default function ShopOrderDetailPage() {
  const { order_id } = useParams<{ order_id: string }>();
  const { apiClient } = useAuth();
  const [shipment, setShipment] = useState<any>(null);

  const action = async (type: string) => {
    await apiClient.post(`/shipments/${shipment.id}/${type}`);
    const res = await apiClient.get(`/shipments/${shipment.id}`);
    setShipment(res.data);
  };

  useEffect(() => {
    if (!apiClient) return;
    apiClient
      .get(`/orders/${order_id}/shipment`)
      .then((res) => setShipment(res.data));
  }, [apiClient, order_id]);

  if (!shipment) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">配送管理</h1>

      <p>現在の状態: {shipment.status}</p>
      <p>到着予定: {shipment.eta}</p>

      <div className="flex gap-2">
        <button onClick={() => action("pack")} className="btn">
          梱包完了
        </button>
        <button onClick={() => action("ship")} className="btn">
          発送
        </button>
        <button onClick={() => action("in-transit")} className="btn">
          輸送中
        </button>
        <button onClick={() => action("deliver")} className="btn">
          配達完了
        </button>
      </div>
    </div>
  );
}
