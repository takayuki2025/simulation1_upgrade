"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

export default function CustomerOrderPage() {
  const { order_id } = useParams<{ order_id: string }>();
  const { apiClient } = useAuth();
  const [shipment, setShipment] = useState<any>(null);

  useEffect(() => {
    if (!apiClient) return;

    apiClient.get(`/me/orders/${order_id}/shipment`).then((res: any) => {
      setShipment(res.data);
    });
  }, [apiClient, order_id]);

  if (!shipment) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">配送状況</h1>

      <p>状態: {shipment.status}</p>
      <p>到着予定: {shipment.eta}</p>

      <ul className="border-l pl-4 space-y-2">
        {shipment.timeline.map((e: any) => (
          <li key={e.at}>
            {e.type} - {e.at}
          </li>
        ))}
      </ul>
    </div>
  );
}
