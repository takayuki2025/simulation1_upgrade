"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl, onImageError } from "@/utils/utils";
import { useAuth } from "@/hooks/useSanctumAuth";

interface Shop {
  id: number;
  shop_code: string;
  name: string;
  description: string;
  banner_url?: string | null;
  owner_user_id: number;
}

interface Item {
  id: number;
  name: string;
  price: number;
  item_image: string;
}

export default function ShopTopPage() {
  const params = useParams();
  const shopCode = params.shop_code as string;

  // 🔥 正しい Auth の取り方
  const { isLoading: authLoading, user } = useAuth();

  const [shop, setShop] = useState<Shop | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwner =
    user && shop && user.role === "OWNER" && user.id === shop.owner_user_id;

  // ---------------------------------------
  // 店舗データのロード
  // ---------------------------------------
  useEffect(() => {
    async function loadShopData() {
      try {
        const shopRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shops/${shopCode}`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
          },
        );

        const shopData = await shopRes.json();
        setShop(shopData.shop);

        const itemsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shops/${shopCode}/items`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
          },
        );

        const itemsData = await itemsRes.json();
        setItems(itemsData.items ?? []);
      } catch (err) {
        console.error("Error loading shop page:", err);
      } finally {
        setLoading(false);
      }
    }

    loadShopData();
  }, [shopCode]);

  // ---------------------------------------
  // 🔥 グローバル (Auth) と ローカル (Page) の両方のローディングを見る！
  // ---------------------------------------
  if (authLoading || loading) {
    return <div className="p-6">読み込み中...</div>;
  }

  if (!shop) return <div className="p-6">店舗が見つかりません</div>;

  return (
    <div className="w-full">
      {/* 🔙 フリマトップへ戻る */}
      <div className="px-6 mt-4">
        <Link href="/" className="text-blue-600 underline">
          ← フリマトップへ戻る
        </Link>
      </div>

      {/* OWNER 専用リンク */}
      {isOwner && (
        <div className="px-6 mt-2 flex justify-end">
          <Link
            href={`/shops/${shopCode}/dashboard`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            店舗ダッシュボードへ
          </Link>
        </div>
      )}

      {/* バナー */}
      {shop.banner_url && (
        <div className="w-full h-60 relative mt-2">
          <Image
            src={shop.banner_url}
            alt="banner"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Shop 情報 */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
        <p className="text-gray-700">{shop.description}</p>
      </div>

      {/* 商品一覧 */}
      <div className="px-6">
        <h2 className="text-2xl font-semibold mb-4">商品一覧</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                                      src={getImageUrl(item.item_image)}
                                      alt={item.name}
                                      onError={(e) => onImageError(e, item.name)}
                                    />

              <div className="font-bold">{item.name}</div>
              <div className="text-lg text-red-600 font-semibold">
                ¥{item.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
