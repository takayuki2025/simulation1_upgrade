"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

/**
 * ============================
 * Types
 * ============================
 */

type ShipmentStatus =
  | "not_created"
  | "created"
  | "packed"
  | "shipped"
  | "in_transit"
  | "delivered";

type Shipment = {
  id: number | null;
  status: ShipmentStatus;
  eta: string | null;
  canCreate: boolean;
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
        status: raw.status as ShipmentStatus,
        eta: raw.eta ?? null,
        canCreate: Boolean(raw.can_create),
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
   * Next action
   * ============================
   */
  const nextAction = useMemo(() => {
    if (!shipment) return null;

    switch (shipment.status) {
      case "created":
        return { key: "pack", label: "発送準備" };
      case "packed":
        return { key: "ship", label: "発送" };
      case "shipped":
        return { key: "in-transit", label: "輸送中" };
      case "in_transit":
        return { key: "deliver", label: "配達完了" };
      default:
        return null;
    }
  }, [shipment]);

  /**
   * ============================
   * Execute
   * ============================
   */
  const executeAction = async () => {
    if (!shipment?.id || !nextAction || !apiClient) return;

    setIsActionLoading(true);
    try {
      await apiClient.post(`/shipments/${shipment.id}/${nextAction.key}`);
      await fetchShipment();
    } finally {
      setIsActionLoading(false);
    }
  };

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

  // ---- Aフェーズ：未作成
  if (shipment.status === "not_created") {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-bold">配送管理（注文 #{order_id}）</h1>

        <div className="text-gray-600">まだ配送は作成されていません。</div>

        {shipment.canCreate && (
          <button
            disabled={isActionLoading}
            onClick={async () => {
              if (!apiClient) return;

              setIsActionLoading(true);
              try {
                await apiClient.post(
                  `/shops/${shop_code}/dashboard/orders/${order_id}/shipment`,
                );
                await fetchShipment();
              } finally {
                setIsActionLoading(false);
              }
            }}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            購入受付 / 配送準備
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

  // ---- Shipment あり
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">配送管理（注文 #{order_id}）</h1>

      <div className="space-y-1 text-sm">
        <div>
          状態：<span className="ml-2 font-mono">{shipment.status}</span>
        </div>
        <div>
          到着予定：<span className="ml-2">{shipment.eta ?? "未設定"}</span>
        </div>
      </div>

      {nextAction && (
        <button
          disabled={isActionLoading}
          onClick={executeAction}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          {nextAction.label}
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
