"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

/**
 * ============================
 * Types
 * ============================
 */

type Shipment = {
  id: number | null;
  status: string;
  eta: string | null;
  canCreate: boolean;
  nextAction: {
    key: string;
    label: string;
  } | null;
};

/**
 * ============================
 * Page
 * ============================
 */

export default function ShopOrderShipmentPage() {
  const { shop_code, order_id } = useParams<{
    shop_code: string;
    order_id: string;
  }>();

  const router = useRouter();
  const { apiClient, isReady } = useAuth();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  /**
   * ============================
   * Fetch
   * ============================
   */
  const fetchShipment = async () => {
    if (!apiClient) return;

    setIsLoading(true);
    try {
      const res = await apiClient.get(
        `/shops/${shop_code}/dashboard/orders/${order_id}/shipment`,
      );

      const raw = res.data;

      setShipment({
        id: raw.shipment_id ?? null,
        status: raw.status,
        eta: raw.eta ?? null,
        canCreate: Boolean(raw.can_create),
        nextAction: raw.next_action ?? null,
      });
    } catch {
      setShipment(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady || !apiClient || !shop_code || !order_id) return;
    fetchShipment();
  }, [isReady, apiClient, shop_code, order_id]);

  /**
   * ============================
   * Render
   * ============================
   */

  if (isLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  if (!shipment) {
    return (
      <div className="p-6 text-red-600">配送情報の取得に失敗しました。</div>
    );
  }

  /**
   * ---- Aフェーズ：未作成（not_created）
   */
  if (shipment.status === "not_created") {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-bold">配送管理（注文 #{order_id}）</h1>

        <div className="text-gray-600">まだ配送は作成されていません。</div>

        {shipment.nextAction !== null && apiClient && (
          <button
            disabled={isActionLoading}
            onClick={async () => {
              if (!apiClient || !shipment.nextAction) return;

              setIsActionLoading(true);
              try {
                const url =
                  shipment.nextAction.key === "accept"
                    ? `/shops/${shop_code}/dashboard/orders/${order_id}/shipment`
                    : `/shipments/${shipment.id}/${shipment.nextAction.key}`;

                await apiClient.post(url);
                await fetchShipment();
              } finally {
                setIsActionLoading(false);
              }
            }}
            className="px-4 py-2 border rounded"
          >
            {shipment.nextAction.label}
          </button>
        )}

        <button
          onClick={() => router.push(`/shops/${shop_code}/dashboard/orders`)}
          className="text-blue-600 underline text-sm"
        >
          ← 注文一覧へ戻る
        </button>
      </div>
    );
  }

  /**
   * ---- Shipment あり
   */
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">配送管理（注文 #{order_id}）</h1>

      <div className="space-y-1 text-sm">
        <div>
          状態：
          <span className="ml-2 font-mono">{shipment.status}</span>
        </div>
        <div>
          到着予定：
          <span className="ml-2">{shipment.eta ?? "未設定"}</span>
        </div>
      </div>

      {shipment.nextAction !== null && apiClient && (
        <button
          disabled={isActionLoading}
          onClick={async () => {
            if (!apiClient || !shipment.nextAction) return;

            setIsActionLoading(true);
            try {
              const url =
                shipment.nextAction.key === "accept"
                  ? `/shops/${shop_code}/dashboard/orders/${order_id}/shipment`
                  : `/shipments/${shipment.id}/${shipment.nextAction.key}`;

              await apiClient.post(url);
              await fetchShipment();
            } finally {
              setIsActionLoading(false);
            }
          }}
          className="px-4 py-2 border rounded"
        >
          {shipment.nextAction.label}
        </button>
      )}

      <button
        onClick={() => router.push(`/shops/${shop_code}/dashboard/orders`)}
        className="text-blue-600 underline text-sm"
      >
        ← 注文一覧へ戻る
      </button>
    </div>
  );
}
