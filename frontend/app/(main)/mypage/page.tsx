"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useSanctumAuth";
import { getImageUrl, IMAGE_TYPE, onImageError } from "@/utils/utils";

import styles from "./W-Mypage.module.css";

/* ============================
  型定義
============================ */
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

  item?: {
    id: number;
    name: string;
    item_image?: string;
    remain: number;
  };
}

interface Item {
  id: number;
  name: string;
  item_image?: string | null;
  remain: number;
}

/* ============================
  メインコンポーネント
============================ */
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

  const page = searchParams.get("page") === "buy" ? "buy" : "sell";
  const isVerificationRedirect = searchParams.get("verified") === "true";

  const normalizeItem = (raw: RawItem): Item => {
    if (raw.item) {
      return {
        id: raw.item.id,
        name: raw.item.name,
        item_image: raw.item.item_image ?? null,
        remain: raw.item.remain,
      };
    }
    return {
      id: raw.id,
      name: raw.name,
      item_image: raw.item_image ?? null,
      remain: raw.remain,
    };
  };

  /* ============================
    プロフィール取得
  ============================ */
  const fetchUserProfile = useCallback(async () => {
    // ... 認証チェックは省略 ...
    if (!apiClient) return;

    setIsLoading(true);
    try {
      const res = await apiClient.get("/mypage/profile");

      // ★★★ 修正箇所 ★★★
      // APIが { user: {...} } 形式でなければ res.data を直接使用
      const profileData = res.data.user || res.data;

      setUser(profileData);

      if (isVerificationRedirect) {
        setSuccessMessage("メール認証が完了しました！");
        router.replace(`/mypage?page=${page}`);
      }
    } catch (e: any) {
      console.error("Failed to fetch profile:", e);
      if (e.response?.status === 401) await logout();
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    apiClient,
    page,
    isVerificationRedirect,
    logout,
    router,
  ]);

  /* ============================
    アイテム取得
  ============================ */
  const fetchItems = useCallback(async () => {
    if (!user || !apiClient) return;

    setIsLoading(true);
    try {
      const endpoint =
        page === "sell" ? "/mypage/sell" : "/api/mypage/bought";

      const res = await apiClient.get(endpoint);
      const rawItems: RawItem[] = res.data.items ?? [];

      setItems(rawItems.map(normalizeItem));
    } catch (e: any) {
      if (e.response?.status === 401) await logout();
    } finally {
      setIsLoading(false);
    }
  }, [user, apiClient, page, logout]);

  /* ============================
    useEffect
  ============================ */
  useEffect(() => {
    if (!isAuthLoading) fetchUserProfile();
  }, [isAuthLoading, fetchUserProfile]);

  useEffect(() => {
    if (user) fetchItems();
  }, [user, page, fetchItems]);

  /* ============================
    UI： ローディング
  ============================ */
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-t-4 border-red-500 rounded-full"></div>
        <p className="ml-4 text-gray-500">読み込み中...</p>
      </div>
    );
  }

  /* ============================
    UI： 未認証
  ============================ */
  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-red-500">認証情報が確認できません。</p>
      </div>
    );
  }

  /* ============================
    UI： メイン
  ============================ */
  return (
    <div className={styles.profile_page}>
      {successMessage && (
        <div className={styles.alert_success}>{successMessage}</div>
      )}

      <div className={styles.profile_header}>
        {/* ヘッダー1 */}
        <div className={styles.profile_header_1}>
          <img
            src={getImageUrl(user.user_image ?? null, IMAGE_TYPE.USER)}
            className={styles.user_image_css}
            onError={(e) => onImageError(e, user.name)}
          />

          <h2 className={`text-2xl font-bold ${styles.user_name_large_shift}`}>
            {user.name}
          </h2>

          <button
            onClick={() => router.push("/mypage/profile")}
            className="ml-auto px-4 py-2 border border-red-500 text-red-500 rounded"
          >
            プロフィールを編集
          </button>
        </div>

        {/* タブ */}
        <div className={styles.profile_header_2}>
          <Link
            href="/mypage?page=sell"
            className={
              page === "sell" ? styles.active_tab : styles.inactive_tab
            }
          >
            出品した商品
          </Link>

          <Link
            href="/mypage?page=buy"
            className={`ml-8 ${
              page === "buy" ? styles.active_tab : styles.inactive_tab
            }`}
          >
            購入した商品
          </Link>
        </div>
      </div>

      {/* 商品一覧 */}
      <div className={styles.items_select}>
        {items.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            {page === "sell"
              ? "出品した商品はありません。"
              : "購入した商品はありません。"}
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={styles.items_select_all}>
              <Link href={`/item/${item.id}`}>
                <img
                  src={getImageUrl(item.item_image ?? null, IMAGE_TYPE.ITEM)}
                  alt={item.name}
                  onError={(e) => onImageError(e, item.name)}
                />
                <div className={styles.item_details}>
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
