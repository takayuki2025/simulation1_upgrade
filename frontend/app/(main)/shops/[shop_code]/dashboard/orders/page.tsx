"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

type ShipmentListItem = {
  order_id: number;
  order_status: string;
  total_amount: number;
  currency: string;
  buyer_user_id: number;
  address_snapshot_at: string | null;

  shipment_id: number | null;
  shipment_status: string | null;
  eta: string | null;
  destination_address: {
    postal_code?: string | null;
    prefecture?: string | null;
    city?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    recipient_name?: string | null;
    phone?: string | null;
    [key: string]: any;
  } | null;
};

export default function ShopShipmentListPage() {
  const { shop_code } = useParams<{ shop_code: string }>();
  const router = useRouter();
  const { apiClient, isAuthenticated, isLoading: authLoading } = useAuth();

  const [items, setItems] = useState<ShipmentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* =========================
     🔐 Auth Guard
  ========================= */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  /* =========================
     📦 Fetch Shipments
  ========================= */
  useEffect(() => {
    if (!apiClient || !shop_code) return;

    setIsLoading(true);

    apiClient
      .get(`/shops/${shop_code}/shipments`)
      .then((res: any) => {
        const list = (res?.data?.shipments ?? []) as ShipmentListItem[];
        setItems(list);
      })
      .finally(() => setIsLoading(false));
  }, [apiClient, shop_code]);

  const count = useMemo(() => items.length, [items]);

  if (authLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">注文・配送管理</h1>
        <Link
          href={`/shops/${shop_code}/dashboard`}
          className="text-blue-600 underline"
        >
          ← 店舗ダッシュボードへ戻る
        </Link>
      </div>

      {isLoading ? (
        <div className="p-4">読み込み中...</div>
      ) : (
        <div className="text-sm text-gray-600">件数: {count}</div>
      )}

      <div className="space-y-3">
        {items.map((it) => {
          const addr = it.destination_address;
          const addrText = addr
            ? `${addr.prefecture ?? ""}${addr.city ?? ""}${addr.address_line1 ?? ""} ${addr.address_line2 ?? ""}`.trim()
            : "（配送先未確定）";

          const recipient = addr?.recipient_name ?? "（宛名なし）";

          return (
            <div
              key={`${it.order_id}-${it.shipment_id ?? "none"}`}
              className="border rounded p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  注文 #{it.order_id} / ¥{it.total_amount} {it.currency}
                </div>

                <div className="text-sm text-gray-700">
                  Order: <span className="font-mono">{it.order_status}</span>
                  {" / "}
                  Shipment:{" "}
                  <span className="font-mono">
                    {it.shipment_status ?? "not_created"}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-700">
                購入者 user_id:{" "}
                <span className="font-mono">{it.buyer_user_id}</span>
              </div>

              <div className="text-sm text-gray-700">
                配送先: {recipient} / {addrText}
              </div>

              <div className="text-sm text-gray-700">
                ETA: <span className="font-mono">{it.eta ?? "-"}</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/shops/${shop_code}/dashboard/orders/${it.order_id}`}
                  className="text-blue-600 underline text-sm"
                >
                  詳細を見る →
                </Link>
              </div>

              <div className="pt-2 text-sm text-gray-500">
                ※ 発送操作（pack / ship / deliver）は次フェーズで追加
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
