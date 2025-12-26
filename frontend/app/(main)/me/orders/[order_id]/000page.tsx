"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { AxiosResponse } from "axios";
import { useAuth } from "@/ui/auth/useAuth";

/* =========================
   DTO（注文詳細）
========================= */
type OrderDetailResponse = {
  order_id: number;
  order_status: string;

  payment: {
    payment_id: number;
    provider_payment_id: string | null;
    method: string;
    status: string;
  } | null;

  shipment: {
    shipment_id: number;
    status: "created" | "packed" | "shipped" | "in_transit" | "delivered";
    eta?: string;
    address: {
      prefecture: string;
      city: string;
      addressLine1: string;
      addressLine2?: string;
    };
  } | null;
};

/* =========================
   配送ステータス表示
========================= */
const shipmentStatusLabel: Record<string, string> = {
  created: "発送準備中",
  packed: "梱包済み",
  shipped: "発送済み",
  in_transit: "配送中",
  delivered: "配達完了",
};

/* =========================
   Page Component
========================= */
export default function OrderDetailPage() {
  const { apiClient } = useAuth();
  const params = useParams();
  const orderId = params.order_id as string;

  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     Fetch
  ========================= */
  useEffect(() => {
    if (!apiClient || !orderId) return;

    apiClient
      .get(`/me/orders/${orderId}`)
      .then((res: AxiosResponse<OrderDetailResponse>) => {
        setOrder(res.data);
      })
      .catch(() => {
        setError("注文情報の取得に失敗しました。");
      })
      .finally(() => setLoading(false));
  }, [apiClient, orderId]);

  /* =========================
     Render
  ========================= */
  if (loading) return <p>注文情報を取得中です…</p>;

  if (error || !order) {
    return (
      <div>
        <p>{error ?? "注文情報が見つかりません。"}</p>
        <Link href="/mypage?page=buy">← 注文履歴へ戻る</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>注文詳細</h1>

      <h2>注文 #{order.order_id}</h2>

      <div>
        <strong>注文ステータス：</strong>
        {order.order_status}
      </div>

      {/* ===== Payment ===== */}
      {order.payment && (
        <>
          <hr />
          <h3>支払い情報</h3>

          <div>
            <strong>決済ID：</strong>
            {order.payment.provider_payment_id ?? "-"}
          </div>

          <div>
            <strong>支払い方法：</strong>
            {order.payment.method}
          </div>

          <div>
            <strong>支払い状態：</strong>
            {order.payment.status}
          </div>
        </>
      )}

      {/* ===== Shipment ===== */}
      {order.shipment && (
        <>
          <hr />
          <h3>配送情報</h3>

          <div>
            <strong>配送状況：</strong>
            {shipmentStatusLabel[order.shipment.status]}
          </div>

          {order.shipment.eta && (
            <div>
              <strong>配送予定日：</strong>
              {order.shipment.eta}
            </div>
          )}

          <div>
            <strong>配送先住所：</strong>
            <div>
              {order.shipment.address.prefecture}
              {order.shipment.address.city}
              {order.shipment.address.addressLine1}
            </div>
            {order.shipment.address.addressLine2 && (
              <div>{order.shipment.address.addressLine2}</div>
            )}
          </div>
        </>
      )}

      <hr />
      <Link href="/mypage?page=buy">← 注文履歴へ戻る</Link>
    </div>
  );
}
