"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useSanctumAuth";

// 画像ヘルパー
import { getImageUrl, IMAGE_TYPE, onImageError } from "@/utils/utils";

// =======================================================
// 型定義
// =======================================================

interface User {
  id: number;
  name: string;
  email: string;
  uid: string;
  email_verified_at: string | null;
  post_number: string | null;
  address: string | null;
  building: string | null;
  user_image?: string | null;
}

interface RawItem {
  id: number;
  name: string;
  item_image?: string;
  remain: number;

  // buy ページでは nested item の可能性あり
  item?: {
    id: number;
    name: string;
    item_image?: string;
    remain: number;
  };
}

interface ApiItemsResponse {
  items?: RawItem[];
}

// 正規化された Item 型
interface Item {
  id: number;
  name: string;
  item_image?: string | null;
  remain: number;
}

// =======================================================
// メインコンポーネント
// =======================================================

export default function Mypage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    apiClient,
    logout,
  } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // page=sell or page=buy
  const page = searchParams.get("page") === "buy" ? "buy" : "sell";

  // メール認証後のクエリ
  const isVerificationRedirect = searchParams.get("verified") === "true";

  // ------------------------------------------------------------
  // Utility: アイテムを正規化
  // ------------------------------------------------------------
  const normalizeItem = (raw: RawItem): Item | null => {
    if (raw.item) {
      // 購入した商品の場合、内部の商品データを使う
      return {
        id: raw.item.id,
        name: raw.item.name,
        item_image: raw.item.item_image ?? null,
        remain: raw.item.remain,
      };
    }

    // 出品した商品
    return {
      id: raw.id,
      name: raw.name,
      item_image: raw.item_image ?? null,
      remain: raw.remain,
    };
  };

  // ------------------------------------------------------------
  // 1. プロフィール取得（/api/mypage/profile）
  // ------------------------------------------------------------
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!apiClient) return;

    setIsLoading(true);
    try {
      const res = await apiClient.get("/api/mypage/profile");

      if (!res.data?.user) {
        throw new Error("Profile response missing 'user'");
      }

      setUser(res.data.user);

      if (isVerificationRedirect) {
        setSuccessMessage("メール認証が完了しました！");
        router.replace(`/mypage?page=${page}`);
      }
    } catch (e: any) {
      console.error("Failed to fetch profile:", e);

      if (e.response?.status === 401) {
        await logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isVerificationRedirect, apiClient, page, logout, router]);

  // ------------------------------------------------------------
  // 2. アイテム取得（/api/mypage/sell or /api/mypage/bought）
  // ------------------------------------------------------------
  const fetchItems = useCallback(async () => {
    if (!user || !apiClient) return;

    setIsLoading(true);
    try {
      const endpoint =
        page === "sell" ? "/api/mypage/sell" : "/api/mypage/bought";

      const res = await apiClient.get(endpoint);

      const rawItems: RawItem[] = res.data.items ?? [];

      const normalized = rawItems
        .map((raw) => normalizeItem(raw))
        .filter((i): i is Item => i !== null);

      setItems(normalized);
    } catch (e: any) {
      console.error("Failed to fetch items:", e);

      if (e.response?.status === 401) {
        await logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, page, apiClient, logout]);

  // ------------------------------------------------------------
  // useEffect: 認証 → プロフィール → アイテム
  // ------------------------------------------------------------
  useEffect(() => {
    if (isAuthLoading) return;
    fetchUserProfile();
  }, [isAuthLoading, fetchUserProfile]);

  useEffect(() => {
    if (user && apiClient) {
      fetchItems();
    }
  }, [user, page, apiClient, fetchItems]);

  // ------------------------------------------------------------
  // UI: ローディング
  // ------------------------------------------------------------
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-t-4 border-red-500 rounded-full"></div>
        <p className="ml-4 text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // UI: 未認証
  // ------------------------------------------------------------
  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-red-500">認証情報が確認できません。</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // UI: メイン画面
  // ------------------------------------------------------------
  return (
    <div className="profile_page max-w-[1400px] mx-auto pt-5 pb-10">
      {successMessage && (
        <div className="alert-success2">{successMessage}</div>
      )}

      <div className="profile_header border-b-2 border-gray-400 pb-5 mb-6">
        <div className="profile_header_1 flex items-center gap-6">
          <img
            src={getImageUrl(user.user_image ?? null, IMAGE_TYPE.USER)}
            className="user_image_css w-[90px] h-[90px] rounded-full object-cover"
            onError={(e) => onImageError(e, user.name)}
          />
          <h2 className="text-2xl font-bold">{user.name}</h2>

          <button
            onClick={() => router.push("/mypage/profile")}
            className="ml-auto px-4 py-2 border border-red-500 text-red-500 rounded"
          >
            プロフィールを編集
          </button>
        </div>

        <div className="profile_header_2 flex mt-4 gap-8 pl-4">
          <Link
            href="/mypage?page=sell"
            className={`font-bold ${
              page === "sell" ? "text-red-500" : "text-gray-500"
            }`}
          >
            出品した商品
          </Link>

          <Link
            href="/mypage?page=buy"
            className={`font-bold ${
              page === "buy" ? "text-red-500" : "text-gray-500"
            }`}
          >
            購入した商品
          </Link>
        </div>
      </div>

      <div className="items_select grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            {page === "sell"
              ? "出品した商品はありません。"
              : "購入した商品はありません。"}
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="items_select_all">
              <Link href={`/item/${item.id}`}>
                <img
                  src={getImageUrl(item.item_image ?? null, IMAGE_TYPE.ITEM)}
                  alt={item.name}
                  className="w-full aspect-square object-cover"
                  onError={(e) => onImageError(e, item.name)}
                />
                <div className="item-details flex justify-between mt-2">
                  <span>{item.name}</span>
                  {item.remain === 0 && (
                    <span className="text-red-500 font-bold">sold</span>
                  )}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

