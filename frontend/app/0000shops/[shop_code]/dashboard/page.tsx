"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApiClient, useAuth } from "@/hooks/useSanctumAuth";

export default function ShopDashboard() {
  const params = useParams();
  const shopCode = params.shop_code as string;

  const { user, apiClient, isAuthenticated, isLoading } = useAuth();

  // 🔥 暫定 loading 判定（APIクライアントが無い場合はロード中扱い）
  const loading = isLoading || !apiClient;

  if (loading) {
    return <div className="p-6">読み込み中...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 店舗トップ（Amazon風）へ */}
      <Link href={`/shops/${shopCode}`} className="text-blue-600 underline">
        ← 店舗トップへ戻る
      </Link>

      <h1 className="text-3xl font-bold mb-4">店舗ダッシュボード</h1>

      <div className="mt-8 space-y-4">
        <div className="p-4 border rounded">商品管理</div>
        <div className="p-4 border rounded">店舗設定（バナー・説明）</div>
        <div className="p-4 border rounded">注文管理（将来）</div>
      </div>
    </div>
  );
}
