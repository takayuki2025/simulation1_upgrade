"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useSanctumAuth";

// 💡 実際のプロジェクトのパスに修正してください
import { getImageUrl, onImageError } from "@/utils/utils";

// 環境変数
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// 型定義
// =======================================================

interface Item {
  id: number;
  name: string;
  price: number | null;
  item_image: string | null;
  remain: number;
  is_favorited?: boolean;
}

// =======================================================
// メインコンポーネント: Home
// =======================================================

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. 認証フックから必要な状態とアクションを取得
  const {
    isLoading: isAuthLoading,
    isLoggingOut,
    isAuthenticated,
    apiClient, // Interceptor実装済みクライアント
    initialCheckComplete, // 💡 初期認証チェック完了フラグ
  } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false); // APIフェッチ中のローディング
  const [imageRefreshKey, setImageRefreshKey] = useState(0);

  // リクエストをキャンセルするための AbortController を保持
  const abortControllerRef = useRef<AbortController | null>(null);

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
    // 💡 認証初期チェックが完了するまではローディング状態とする
    return isLoggingOut || isAuthLoading || loading || !initialCheckComplete;
  }, [isLoggingOut, isAuthLoading, loading, initialCheckComplete]);

  // =======================================================
  // データフェッチロジック
  // =======================================================

  /**
   * 商品データをAPIから取得する関数 (キャンセル機能付き)
   */
  const fetchItems = useCallback(
    async (tab: string, search: string) => {
      // 💡 前のリクエストがあればキャンセルする
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // 新しい AbortController を生成して参照を更新
      abortControllerRef.current = new AbortController();

      // 認証状態が解決するまではフェッチをスキップ
      if (isAuthLoading || isLoggingOut || !initialCheckComplete) {
        setItems([]);
        setLoading(false);
        return;
      }

      // マイリストタブかつ未認証の場合、フェッチをスキップ（サーバー側で空リストが返るが、ここでスキップ可能）
      if (tab === "mylist" && !isAuthenticated) {
        setItems([]);
        setLoading(false);
        setImageRefreshKey((prev) => prev + 1);
        return;
      }

      setLoading(true);

      const apiUrl = `/api/item`;
      const params = { tab: tab, all_item_search: search };

      // ★★★ 修正箇所: 認証クライアントの使用ロジック ★★★
      // 💡 常に apiClient を使用する（apiClientは認証されていない場合でもグローバルaxiosをラップしているため、最も安全）
      const clientToUse = apiClient
        ? apiClient
        : axios.create({ baseURL: API_BASE_URL }); // フォールバック: apiClientが未設定の場合はグローバルaxiosを使用
      // ★★★ 修正箇所終わり ★★★

      try {
        // 認証チェック後、クライアントを使ってリクエスト
        const response = await clientToUse.get(apiUrl, {
          params: params,
          signal: abortControllerRef.current.signal,
        });

        const responseData = response.data;

        if (responseData && Array.isArray(responseData.items)) {
          setItems(responseData.items as Item[]);
          setImageRefreshKey((prev) => prev + 1);
        } else {
          setItems([]);
        }
      } catch (e: any) {
        // キャンセルエラーを無視する
        if (axios.isCancel(e)) {
          console.log("Fetch canceled due to state change.");
          return;
        }

        console.error("商品の取得中にエラーが発生しました:", e);
        setItems([]); // エラー発生時はリストをクリア
      } finally {
        setLoading(false);
      }
    },
    [
      isAuthenticated,
      isLoggingOut,
      isAuthLoading,
      apiClient, // apiClient の変更を監視
      initialCheckComplete,
    ],
  );

  // =======================================================
  // Effect / Watcher
  // =======================================================

  useEffect(() => {
    // 💡 認証チェックが完了していない、またはロード中の場合はフェッチをブロック
    if (isAuthLoading || !initialCheckComplete) {
      setItems([]);
      return;
    }

    // 認証が解決した後、またはクエリ/認証状態が変わったときにフェッチを実行
    fetchItems(currentTab, currentSearchQuery);

    // クリーンアップ関数
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    currentTab,
    currentSearchQuery,
    isAuthLoading,
    apiClient,
    fetchItems,
    initialCheckComplete,
    isAuthenticated, // 認証状態の変化を監視
  ]);

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
              : isAuthLoading || !initialCheckComplete
                ? "認証状態を確認中..."
                : "商品を読み込み中..."}
          </p>
        </div>
      )}

      {/* メインコンテンツエリア (isPageLoading中は非表示) */}
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
                <Link href={`/item/${item.id}`}>
                  <div className="relative">
                    <img
                      src={getImageUrl(item.item_image, imageRefreshKey)}
                      alt={item.name}
                      onError={(e) => onImageError(e, item.name)}
                      className="w-full aspect-square object-cover block rounded-lg shadow-md"
                    />
                    {/* remainが0の場合にSOLDタグを表示 */}
                    {item.remain === 0 && <div className="sold-text">SOLD</div>}

                    {/* 認証済みユーザーの場合、いいね状態を表示 (例) */}
                    {isAuthenticated && item.is_favorited && (
                      <div className="absolute top-2 right-2 text-red-500 text-2xl">
                        ❤️
                      </div>
                    )}
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
                {/* 認証チェック完了後かつ未認証でマイリストの場合のメッセージ */}
                {currentTab === "mylist" &&
                initialCheckComplete &&
                !isAuthenticated
                  ? "マイリストを見るにはログインが必要です。"
                  : "該当する商品が見つかりませんでした。"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- スタイル定義 (省略) --- */}
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
