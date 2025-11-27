"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios, { AxiosError, AxiosResponse } from "axios"; // AxiosError, AxiosResponse を追加
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// 💡 useAuth のみを使用 (useApi は削除)
import { useAuth, AuthContextType } from "@/hooks/useAuth";

// 💡 getImageUrl, onImageError はプロジェクト内の実際のパスに修正してください
import { getImageUrl, onImageError } from "@/utils/utils";

// 環境変数
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// グローバルなaxiosは、認証が不要なリクエストで使用（ただし、今回は apiClient を優先）
axios.defaults.withCredentials = true;

// =======================================================
// 型定義
// =======================================================

interface Item {
  id: number;
  name: string;
  price: number | null;
  item_image: string | null;
  remain: number;
}

// =======================================================
// メインコンポーネント
// =======================================================

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. 認証フックから必要な状態とアクションを取得
  const {
    user,
    isLoading: isAuthLoading,
    isLoggingOut,
    isAuthenticated,
    apiClient, // ★ 認証済みクライアント
    logout, // ★ ログアウト関数
    reloadAuthToken, // ★ トークンリフレッシュ関数
  } = useAuth(); // useAuthから全ての必要な機能を取得

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false); // APIフェッチ中のローディング
  // 画像URLのキャッシュ打破用キー
  const [imageRefreshKey, setImageRefreshKey] = useState(0);

  // =======================================================
  // Computed State
  // =======================================================

  const currentTab = useMemo(() => {
    return searchParams.get("tab") === "mylist" ? "mylist" : "all";
  }, [searchParams]);

  const currentSearchQuery = useMemo(() => {
    return searchParams.get("all_item_search") || "";
  }, [searchParams]);

  // ページ全体のローディング状態の判定
  const isPageLoading = useMemo(() => {
    return isLoggingOut || isAuthLoading || loading;
  }, [isLoggingOut, isAuthLoading, loading]);

  // テンプレートのログインメッセージ表示に使用
  const isUserLoggedOutComputed = useMemo(() => {
    return !isAuthLoading && !user;
  }, [isAuthLoading, user]);

  // =======================================================
  // データフェッチロジック (useAuthの apiClient を使用)
  // =======================================================

  /**
   * 💡 活用ポイント: 認証済みリクエストを実行する汎用ヘルパー関数
   * useApiが担っていたロジック（特に401エラー時のリトライ）をここに統合します。
   * 他のページでも同様の認証済み通信が必要な場合は、このロジックを再利用可能なカスタムフックとして切り出してください。
   */
  const authenticatedFetchWithRetry = useCallback(
    async (url: string, params: any): Promise<AxiosResponse> => {
      // ログアウト中であればすぐにエラーを投げる
      if (isLoggingOut) {
        throw new Error("Logging out, skipping request.");
      }

      // 認証済みクライアントがなければエラー
      if (!apiClient) {
        // apiClient が null の場合、isAuthenticated も false のはずだが、念のためチェック
        if (!isAuthenticated) {
          throw new Error("Not authenticated, API client unavailable.");
        }
        // ロード中などで一時的に apiClient が null の場合は、待機するかエラーとする
        throw new Error("API client not initialized.");
      }

      const requestConfig = {
        method: "GET",
        url: url,
        params: params,
      };

      try {
        // 1. 通常のリクエスト実行
        return await apiClient.request(requestConfig);
      } catch (e) {
        const error = e as AxiosError;
        const status = error.response?.status;

        // 2. 401 Unauthorized エラーの場合
        if (status === 401) {
          console.warn(
            "401 Unauthorized detected. Attempting token refresh..."
          );

          try {
            // トークンを強制リフレッシュ
            await reloadAuthToken();

            // 3. 再度リクエストを実行（apiClientは useMemo により新しいトークンで再生成されているはず）
            // 💡 注意: Next.js/Reactの非同期環境では、apiClientの再生成を待つ必要がありますが、
            // ここでは再レンダリングを挟まずにリトライするため、即時実行で試みます。
            // 理想的には、Axiosインターセプターを apiClient に設定することで、この処理を自動化すべきです。
            const secondResponse = await apiClient.request(requestConfig);
            console.log("Token refresh and retry successful.");
            return secondResponse;
          } catch (refreshError) {
            // 4. リフレッシュ失敗またはリトライ後のエラー
            console.error(
              "Token refresh or retry failed. Logging out.",
              refreshError
            );
            await logout(); // 致命的な認証エラーとしてログアウト
            throw new Error("Authentication failed after retry.");
          }
        }

        // 401 以外のエラーはそのままスロー
        throw error;
      }
    },
    [isAuthenticated, isLoggingOut, apiClient, logout, reloadAuthToken]
  );

  /**
   * 商品データをAPIから取得する関数
   */
  const fetchItems = useCallback(
    async (tab: string, search: string) => {
      // ログアウト処理中はフェッチをスキップ
      if (isLoggingOut) {
        setItems([]);
        setLoading(false);
        return;
      }

      // マイリストタブかつ未ログインの場合、フェッチをスキップ
      if (tab === "mylist" && !isAuthenticated) {
        setItems([]);
        setLoading(false);
        setImageRefreshKey((prev) => prev + 1);
        return;
      }

      setLoading(true);

      const apiUrl = `/api/items`;
      const params = { tab: tab, all_item_search: search };

      // 認証クライアントとグローバルAxiosの選択ロジック
      const useAuthClient = tab === "mylist" || isAuthenticated;

      try {
        let responseData;

        if (useAuthClient) {
          // ★★★ 認証済みリクエスト (apiClient/retryロジックを使用) ★★★
          const response = await authenticatedFetchWithRetry(apiUrl, params);
          responseData = response.data;
        } else {
          // ★★★ 未認証リクエスト (グローバル axios を使用) ★★★
          const response = await axios.get(`${API_BASE_URL}${apiUrl}`, {
            params: params,
          });
          responseData = response.data;
        }

        if (responseData && Array.isArray(responseData.items)) {
          setItems(responseData.items as Item[]);
          setImageRefreshKey((prev) => prev + 1);
        } else {
          setItems([]);
        }
      } catch (e: any) {
        // ログアウト処理は authenticatedFetchWithRetry で行われるため、ここではエラーをハンドルするのみ
        console.error("商品の取得中にエラーが発生しました:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    // 依存配列: 認証状態とカスタムフェッチャーに依存
    [
      isAuthenticated,
      isLoggingOut,
      authenticatedFetchWithRetry, // 認証クライアントとリトライロジックを内包
    ]
  );

  // =======================================================
  // Effect / Watcher
  // =======================================================

  useEffect(() => {
    // 認証状態の解決を待つ
    if (isAuthLoading) {
      setItems([]);
      return;
    }

    // 認証が解決した後、またはクエリ/認証状態が変わったときにフェッチを実行
    fetchItems(currentTab, currentSearchQuery);
  }, [currentTab, currentSearchQuery, isAuthLoading, fetchItems]);

  // =======================================================
  // レンダリング
  // =======================================================

  return (
    <div className="main_contents">
      {/* ローディング状態表示エリア */}
      {isPageLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"></div>
          <p className="ml-4 text-lg text-gray-400">
            {isLoggingOut
              ? "ログアウト処理中..."
              : isAuthLoading
              ? "認証状態を確認中..."
              : "商品を読み込み中..."}
          </p>
        </div>
      )}

      {/* メインコンテンツエリア (ローディング中は非表示) */}
      <div className={isPageLoading ? "hidden" : ""}>
        {/* タブ切り替えコンポーネント */}
        <div className="main_select">
          {/* すべてタブ */}
          <Link
            href={{
              pathname: "/",
              query: {
                tab: "all",
                all_item_search: currentSearchQuery || undefined,
              },
            }}
            className={["recs", { active: currentTab === "all" }]
              .join(" ")
              .replace("false", "")
              .trim()}
          >
            すべて
          </Link>
          {/* マイリストタブ */}
          <Link
            href={{
              pathname: "/",
              query: {
                tab: "mylist",
                all_item_search: currentSearchQuery || undefined,
              },
            }}
            className={["mylists", { active: currentTab === "mylist" }]
              .join(" ")
              .replace("false", "")
              .trim()}
          >
            マイリスト
          </Link>
        </div>

        <div className="items_select">
          {/* 商品リストの表示 */}
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="items_select_all">
                {/* 💡 商品詳細ページへのリンク */}
                <Link href={`/items/${item.id}`}>
                  <div className="relative">
                    <img
                      src={getImageUrl(item.item_image, imageRefreshKey)}
                      alt={item.name}
                      onError={(e) => onImageError(e, item.name)}
                      className="w-full aspect-square object-cover block rounded-lg shadow-md"
                    />
                    {/* remainが0の場合にSOLDタグを表示 */}
                    {item.remain === 0 && <div className="sold-text">SOLD</div>}
                  </div>
                  <div className="item-info">
                    <p className="item-name text-gray-100">{item.name}</p>
                    <p className="item-price font-bold text-red-400 text-lg mt-1">
                      &yen;{item.price ? item.price.toLocaleString() : "---"}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center w-full py-10 text-gray-500">
              <p>
                {currentTab === "mylist" && isUserLoggedOutComputed
                  ? "マイリストを見るにはログインしてください。"
                  : currentTab === "all" && isAuthLoading
                  ? "認証状態を確認中..." // 認証ロード中は認証状態を確認中を表示
                  : "該当する商品が見つかりませんでした。"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* スタイル定義 (変更なし) */}
      <style jsx>{`
        .main_contents {
          margin: 0 auto;
          max-width: 1400px;
          padding: 0 20px;
        }

        .main_select {
          height: 80px;
          border-bottom: 3px solid #4b5563;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 100px;
          gap: 50px;
        }

        .recs,
        .mylists {
          text-decoration: none;
          color: #9ca3af;
          font-size: 1.2rem;
          font-weight: bold;
          padding-bottom: 15px;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .recs:hover,
        .mylists:hover {
          color: #d1d5db;
        }

        .recs.active,
        .mylists.active {
          color: #ef4444;
          border-bottom: 3px solid #ef4444;
        }

        .items_select {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 40px;
          padding: 80px 0;
        }

        .items_select_all {
          flex: 0 0 calc(25% - 30px);
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1024px) {
          .items_select_all {
            flex: 0 0 calc(33.33% - 26.67px);
          }
        }

        @media (max-width: 640px) {
          .items_select_all {
            flex: 0 0 calc(50% - 20px);
          }
          .main_select {
            justify-content: flex-start;
            padding-left: 20px;
            gap: 30px;
          }
        }
        .items_select img {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .item-info {
          min-height: 40px;
        }
        .item-name {
          color: #000000ff;
        }

        /* soldタグのスタイル */
        .items_select_all .sold-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-10deg);
          z-index: 10;
          font-size: 1.5rem;
          color: #f87171;
          font-weight: 900;
          padding: 8px 16px;
          background-color: rgba(31, 41, 55, 0.9);
          border: 4px solid #f87171;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
