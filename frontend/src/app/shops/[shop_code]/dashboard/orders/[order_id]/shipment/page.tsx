"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

/**
 * ============================
 * Types
 * ============================
 */

type ShipmentStatus = "draft" | "packed" | "shipped" | "delivered";

type Shipment = {
  id: number | null;
  status: ShipmentStatus | null;
  eta: string | null;
  deliveredAt?: string | null; // ★ 追加（あってもなくてもOK）
  nextAction: {
    key: "accept" | "pack" | "ship";
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
        status: raw.shipment_id ? (raw.status as ShipmentStatus) : null,
        eta: raw.eta ?? null,
        deliveredAt: raw.delivered_at ?? null, // ★ 追加
        nextAction: raw.next_action ?? null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady || !apiClient) return;
    fetchShipment();
  }, [isReady, apiClient]);

  if (isLoading) return <div className="p-6">読み込み中...</div>;
  if (!shipment) return <div className="p-6 text-red-600">取得失敗</div>;

  const hasShipment = shipment.id !== null;

  /**
   * ============================
   * Action
   * ============================
   */
  const handleAction = async () => {
    if (!apiClient || !shipment.nextAction) return;

    setIsActionLoading(true);
    try {
      const action = shipment.nextAction.key;

      // 🔒 accept は「未作成」のときだけ
      if (action === "accept" && hasShipment) {
        return;
      }

      const url =
        action === "accept"
          ? `/shops/${shop_code}/dashboard/orders/${order_id}/shipment`
          : `/shipments/${shipment.id}/${action}`;

      await apiClient.post(url);
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
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">配送管理（注文 #{order_id}）</h1>

      {!hasShipment && (
        <div className="text-gray-600">まだ配送は作成されていません。</div>
      )}

      {hasShipment && shipment.status && (
        <div className="text-sm">
          状態：
          <span className="ml-2 font-mono">{shipment.status}</span>
        </div>
      )}

      {shipment.eta && (
        <div className="text-sm">
          到着予定：<span className="ml-2">{shipment.eta}</span>
        </div>
      )}

      {/* ✅ 配達完了表示（終端状態） */}
      {shipment.status === "delivered" && (
        <div className="mt-4 space-y-1 text-sm">
          <div className="font-semibold text-green-700">配達完了</div>

          {shipment.deliveredAt && (
            <div className="text-gray-600">
              配達完了日：
              {new Date(shipment.deliveredAt).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Action（バックエンド完全準拠） */}
      {shipment.nextAction &&
        !(shipment.nextAction.key === "accept" && hasShipment) && (
          <button
            disabled={isActionLoading}
            onClick={handleAction}
            className="px-4 py-2 border rounded bg-blue-600 text-white"
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
