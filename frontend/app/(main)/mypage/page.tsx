"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useSanctumAuth"; // Next.jsのカスタム認証フック

// 💡 【修正】汎用化された画像ヘルパーをインポート
import { getImageUrl, IMAGE_TYPE } from "@/utils/utils";
// getImageUrl と IMAGE_TYPE を使用するため、元の getAssetUrl は削除します。

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

interface Item {
  id: number;
  name: string;
  item_image?: string; // 商品画像のパス
  remain: number;
  // 'buy' ページの場合、購入情報 (Item) に含まれる商品データ
  item?: {
    id: number;
    name: string;
    item_image?: string;
    remain: number;
    // その他の商品情報...
  };
}

// =======================================================
// Next.js クライアントコンポーネント
// =======================================================

// 環境変数からAPIベースURLを取得
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 💡 【削除】ローカルで定義されていた getAssetUrl は削除し、utilsからインポートしたものを使用

export default function Mypage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // useAuth から必要な状態と apiClient を取得
  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
    apiClient,
  } = useAuth();

  // --- 状態管理 ---
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // データフェッチ専用のローディング

  // URLクエリパラメータから現在のページ (sell/buy) を取得
  const page = useMemo(() => {
    return searchParams.get("page") === "buy" ? "buy" : "sell";
  }, [searchParams]);

  // URLクエリパラメータからメール認証状態を取得
  const isVerificationRedirect = useMemo(() => {
    return searchParams.get("verified") === "true";
  }, [searchParams]);

  // ----------------------------------------------------------------
  // ヘルパー関数: apiClient を使用したフェッチ (useApi の authenticatedFetch の代替)
  // ----------------------------------------------------------------

  // 認証済みリクエストを実行するヘルパー関数
  const fetcher = useCallback(
    async (endpoint: string) => {
      // apiClient が null の場合はエラーをスロー (非認証状態または初期ロード中)
      if (!apiClient) {
        const error = new Error(
          "API client is not ready (unauthenticated or loading).",
        );
        (error as any).status = 401;
        throw error;
      }

      try {
        const response = await apiClient.get(endpoint);
        return response.data;
      } catch (error) {
        console.error("fetcher error:", error);
        throw error;
      }
    },
    [apiClient],
  );

  // ----------------------------------------------------------------
  // 1. ユーザー情報取得ロジック (認証解決後に一度実行)
  // ----------------------------------------------------------------

  const fetchUserProfile = useCallback(async () => {
    // 認証済みでない場合、すぐにログインへリダイレクト
    if (!isAuthenticated) {
      if (isVerificationRedirect) {
        // メール認証リダイレクト中は、URLクエリ除去のためにmypageをロードさせる
        console.log("Verification redirect detected. Allow loading.");
        return;
      }
      console.log("Unauthenticated detected. Redirecting to /login.");
      router.replace("/login");
      return;
    }

    // apiClient が null の場合はスキップ
    if (!apiClient) {
      console.log("apiClient is null. Skipping profile fetch.");
      return;
    }

    // 認証済みで、かつユーザーデータがまだない場合のみフェッチ
    if (user) return;

    setIsLoading(true);
    try {
      const response: { user?: User } = await fetcher("/api/mypage/profile");

      if (response && response.user) {
        setUser(response.user);

        // メール認証後のクエリパラメータ処理
        if (isVerificationRedirect) {
          setSuccessMessage(
            `メール認証が完了しました！引き続きサービスをご利用いただけます。`,
          );
          // URLクエリから 'verified' を除去（replaceで実現）
          router.replace(`/mypage?page=${page}`);
        }
      }
    } catch (error: any) {
      console.error("プロフィールデータの取得に失敗しました:", error);
      const status = error.status || (error.response && error.response.status);

      if (status === 401) {
        console.log("401エラーを捕捉 (プロフィール取得)。ログアウト処理開始。");
        // トークンリフレッシュに失敗した場合、最終的にログアウトを呼び出す
        await logout();
      } else {
        setSuccessMessage("プロフィールデータのロードに失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    user,
    router,
    fetcher,
    logout,
    isVerificationRedirect,
    page,
    apiClient,
  ]);

  // ----------------------------------------------------------------
  // 2. 商品リスト取得ロジック
  // ----------------------------------------------------------------

  const fetchItems = useCallback(async () => {
    // ユーザープロフィールのロードが完了していることを確認
    if (!user) return;

    // apiClient が null の場合はスキップ
    if (!apiClient) {
      console.log("apiClient is null. Skipping items fetch.");
      return;
    }

    setIsLoading(true);
    setItems([]);

    try {
      // APIエンドポイントを /api/... に修正
      const endpoint = `/api/mypage/item?page=${page}`;
      // バックエンドから商品リストを取得する
      const response: { items: Item[] } = await fetcher(endpoint); // 👈 fetcher を使用
      setItems(response.items || []);
    } catch (error: any) {
      console.error(`${page}商品の取得に失敗しました:`, error);
      const status = error.status || (error.response && error.response.status);

      if (status === 401) {
        console.log(`401エラーを捕捉 (アイテム取得)。ログアウト処理開始。`);
        await logout();
      }
      // 商品取得エラーは致命的ではないため、ロード状態のみ解除
    } finally {
      setIsLoading(false);
    }
  }, [user, page, fetcher, logout, apiClient]);

  // ----------------------------------------------------------------
  // 3. useEffect による実行管理
  // ----------------------------------------------------------------

  // 認証解決監視用の useEffect
  useEffect(() => {
    // 認証状態が解決するまで待つ
    if (isAuthLoading) return;

    // 認証が解決した後、認証済みであればプロフィールを取得し、未認証であればリダイレクト
    fetchUserProfile();
  }, [isAuthLoading, fetchUserProfile, apiClient]);

  // page (クエリパラメータ) の変更時、または user データ取得完了時に商品リストをフェッチ
  useEffect(() => {
    if (user && isAuthenticated && !isAuthLoading && apiClient) {
      fetchItems();
    }
  }, [page, user, isAuthenticated, isAuthLoading, fetchItems, apiClient]);

  // ユーティリティ: プロフィール編集ページへ遷移
  const goToProfileEdit = useCallback(() => {
    router.push("/mypage/profile");
  }, [router]);

  // ----------------------------------------------------------------
  // 4. レンダーロジック
  // ----------------------------------------------------------------

  // 認証解決待ちの表示
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
        <p className="ml-3 text-gray-600">認証状態を確認中...</p>
      </div>
    );
  }

  // 認証解決後、未認証でリダイレクトされなかった場合（メール認証リダイレクト中など）
  if (!isAuthenticated || !user) {
    if (isVerificationRedirect && !user) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
          <p className="ml-3 text-gray-600">
            メール認証後のユーザー情報を確認中...
          </p>
        </div>
      );
    }

    return (
      <div className="text-center p-8">
        <p className="text-xl text-red-500">
          ユーザー情報を再ロード中です。しばらくお待ちください。このページのままでしたら修正が必要です。
        </p>
      </div>
    );
  }

  return (
    <div className="profile_page">
      {/* 成功メッセージの表示 */}
      {successMessage && (
        <div className="validation-errors bg-green-100 border border-green-400 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="profile_header">
        <div className="profile_header_1">
          {/* プロフィール画像 */}
          <img
            // 💡 修正: user.user_image が undefined の場合は null を渡す
            src={getImageUrl(user.user_image ?? null, IMAGE_TYPE.USER)}
            alt="プロフィール画像"
            className="user_image_css"
            // 💡 【追加】onImageError を使用してエラー時の表示を改善
            onError={(e) => {
              // utils.ts の onImageError は第2引数が name なので、user.name を渡す
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/90x90/e0e0e0/333?text=${user.name.replace(/\s/g, "+")}`;
            }}
          />
          <h2 className="user_name_css">{user.name}</h2>

          <div className="user_edit_css1">
            <button onClick={goToProfileEdit} className="user_edit_css2">
              プロフィールを編集
            </button>
          </div>
        </div>

        <div className="profile_header_2">
          {/* 出品した商品タブ */}
          <Link
            href="/mypage?page=sell"
            className={`sell_items ${page === "sell" ? "active" : ""}`}
            scroll={false}
          >
            出品した商品
          </Link>
          {/* 購入した商品タブ */}
          <Link
            href="/mypage?page=buy"
            className={`buy_items ${page === "buy" ? "active" : ""}`}
            scroll={false}
          >
            購入した商品
          </Link>
        </div>
      </div>

      <div className="profile_content">
        {/* アイテムリストの表示 */}
        {isLoading && (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-500 mt-3">商品リストを読み込み中...</p>
          </div>
        )}

        {!isLoading && items.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">
            <p>
              {page === "sell"
                ? "出品した商品はありません。"
                : "購入した商品はありません。"}
            </p>
          </div>
        ) : (
          <div className="items_select">
            {items.map((item) => {
              const displayItem = page === "buy" ? item.item : item;
              // buy ページで item.item が null の場合はスキップ（異常データ）
              if (page === "buy" && !displayItem) return null;

              return (
                <div key={item.id} className="items_select_all">
                  <Link
                    href={`/item/${displayItem!.id}`}
                    className="mypage_item_"
                  >
                    {/* 画像の表示 */}
                    {displayItem!.item_image ? (
                      <img
                        // 💡 【修正】getImageUrl を使用し、商品画像タイプ (0) を渡す
                        src={getImageUrl(
                          displayItem!.item_image,
                          IMAGE_TYPE.ITEM,
                        )}
                        alt={displayItem!.name + "の商品写真"}
                        // 💡 【追加】onImageError を使用してエラー時の表示を改善
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://placehold.co/250x250/e0e0e0/333?text=${displayItem!.name.replace(/\s/g, "+")}`;
                        }}
                      />
                    ) : (
                      <div className="no-image-placeholder">No Image</div>
                    )}
                    <div className="item-details">
                      <label>{displayItem!.name}</label>
                      {displayItem!.remain === 0 && (
                        <span className="sold-text">sold</span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* スタイル定義 (省略せずに含める) */}
      <style jsx>{`
        .profile_page {
          margin: 0 auto;
          max-width: 1400px;
        }

        .profile_header {
          border-bottom: 2px solid #5f5f5f;
          padding-bottom: 20px;
        }

        .user_image_css {
          position: relative;
          left: 200px;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: cover;
          object-position: center;
        }

        .user_name_css {
          position: relative;
          left: 220px;
        }

        .user_edit_css1 {
          margin-left: auto;
        }

        .user_edit_css2 {
          position: relative;
          right: 200px;
          width: 200px;
          height: 35px;
          font-weight: bold;
          font-size: 15px;
          color: #ff5555;
          border: 2px solid #ff5555;
          background-color: white;
          border-radius: 5px;
          cursor: pointer;
          transition:
            background-color 0.2s,
            color 0.2s;
        }

        .user_edit_css2:hover {
          background-color: #ffeaea;
        }

        .items_select {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          padding: 60px;
        }

        .items_select_all {
          width: 100%;
          max-width: 250px;
          display: flex;
          flex-direction: column;
        }

        .items_select_all a,
        .mypage_item_ {
          display: block;
          width: 100%;
          height: auto;
          text-decoration: none;
          color: black;
          transition: opacity 0.2s;
        }

        .items_select_all a:hover {
          opacity: 0.8;
        }

        .items_select img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }

        .no-image-placeholder {
          width: 100%;
          aspect-ratio: 1 / 1;
          background-color: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #a0a0a0;
          font-size: 16px;
          border: 1px dashed #ccc;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .items_select_all label {
          font-size: 14px;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sold-text {
          font-size: 14px;
          color: #ff4041;
          font-weight: bold;
          white-space: nowrap;
        }

        .profile_header_1 {
          display: flex;
          height: 200px;
          text-align: center;
          align-items: center;
          position: relative;
        }

        .profile_header_2 {
          display: flex;
        }

        .sell_items,
        .buy_items {
          color: #5f5f5f;
          font-weight: 800;
          text-decoration: none;
          position: relative;
          padding-bottom: 5px;
          transition: color 0.2s;
        }

        .sell_items {
          left: 70px;
        }

        .buy_items {
          left: 120px;
        }

        .sell_items:hover,
        .buy_items:hover {
          color: #ff8888;
        }

        .sell_items.active,
        .buy_items.active {
          color: #ff5555;
        }

        .sell_items.active::after,
        .buy_items.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #ff5555;
          border-radius: 2px;
        }

        .validation-errors {
          position: fixed;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 400px;
          width: 90%;
          padding: 10px;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          z-index: 100;
          text-align: center;
          color: #155724;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* レスポンシブ対応 (最小限) */
        @media (max-width: 1024px) {
          .items_select {
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            padding: 30px;
          }
          .user_image_css,
          .user_name_css,
          .user_edit_css2 {
            position: static;
            margin: 0 10px;
          }
          .profile_header_1 {
            justify-content: center;
            flex-wrap: wrap;
            height: auto;
            padding: 20px 0;
          }
          .user_edit_css1 {
            margin: 10px auto;
            width: 100%;
            text-align: center;
          }
          .user_edit_css2 {
            width: 80%;
            max-width: 200px;
          }
          .sell_items,
          .buy_items {
            left: 0;
            margin: 0 20px;
          }
          .profile_header_2 {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .items_select {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 20px 10px;
          }
          .profile_page {
            padding: 0 10px;
          }
          .sell_items,
          .buy_items {
            margin: 0 10px;
          }
        }
      `}</style>
    </div>
  );
}
