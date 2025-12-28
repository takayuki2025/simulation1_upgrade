"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/ui/auth/useAuth";

type ShipmentListItem = {
  order_id: number;
  order_status: string;
  total_amount: number;
  currency: string;

  buyer_user_id: number;
  address_confirmed_at: string | null;

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
  } | null;
};

export default function ShopShipmentListPage() {
  const { shop_code } = useParams<{ shop_code: string }>();
  const { apiClient, isReady } = useAuth();

  const [items, setItems] = useState<ShipmentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !apiClient || !shop_code) return;

    setIsLoading(true);
    apiClient
      .get(`/shops/${shop_code}/shipments`)
      .then((res) => {
        setItems(res.data.shipments ?? []);
      })
      .finally(() => setIsLoading(false));
  }, [isReady, apiClient, shop_code]);

  const count = useMemo(() => items.length, [items]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">注文・配送管理</h1>
        <Link
          href={`/shops/${shop_code}/dashboard`}
          className="text-blue-600 underline text-sm"
        >
          ← 店舗ダッシュボードへ戻る
        </Link>
      </div>

      {isLoading ? (
        <div className="p-4">読み込み中...</div>
      ) : (
        <div className="text-sm text-gray-600">件数: {count}</div>
      )}

      <div className="space-y-4">
        {items.map((it) => {
          const addr = it.destination_address;

          const addressText = addr
            ? `〒${addr.postal_code ?? ""} ${addr.prefecture ?? ""}${addr.city ?? ""}${addr.address_line1 ?? ""} ${addr.address_line2 ?? ""}`
            : "（配送先未確定）";

          return (
            <div
              key={`${it.order_id}-${it.shipment_id ?? "none"}`}
              className="border rounded p-4 space-y-2"
            >
              {/* 上段 */}
              <div className="flex justify-between items-start">
                <div className="font-semibold text-lg">注文 #{it.order_id}</div>
                <div className="text-sm text-right">
                  <div>{it.order_status}</div>
                  <div>{it.shipment_status ?? "not_created"}</div>
                </div>
              </div>

              {/* 金額 */}
              <div className="text-sm">
                金額：¥{it.total_amount} {it.currency}
              </div>

              {/* 住所確定 */}
              {it.address_confirmed_at && (
                <div className="text-sm text-gray-500">
                  住所確定日時：
                  {new Date(it.address_confirmed_at).toLocaleString()}
                </div>
              )}

              {/* 購入者 */}
              <div className="text-sm">
                購入者ユーザーID：
                <span className="ml-1 font-mono">{it.buyer_user_id}</span>
              </div>

              {/* 配送先 */}
              <div className="text-sm">
                配送先：
                <div className="ml-2">
                  <div>宛名：{addr?.recipient_name ?? "（未設定）"}</div>
                  <div>{addressText}</div>
                  {addr?.phone && <div>TEL: {addr.phone}</div>}
                </div>
              </div>

              {/* 導線 */}
              <div className="pt-2">
                <Link
                  href={`/shops/${shop_code}/dashboard/orders/${it.order_id}/shipment`}
                  className="text-blue-600 underline text-sm"
                >
                  配送詳細を見る →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
