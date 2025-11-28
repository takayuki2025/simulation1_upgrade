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

import { useAuth } from "@/hooks/useAuth";

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
    return isLoggingOut || isAuthLoading || loading;
  }, [isLoggingOut, isAuthLoading, loading]);

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
      if (isAuthLoading || isLoggingOut) {
        setItems([]);
        setLoading(false);
        return;
      }

      // マイリストタブかつ未認証の場合、フェッチをスキップ
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
          // ★★★ 修正の核心: 認証が必要だが apiClient が null なら中断し、再実行を待つ ★★★
          if (!apiClient) {
            console.warn(
              "API client (token) not ready for authenticated request. Skipping fetch.",
            );
            setItems([]);
            setLoading(false);
            // 💡 ここで return することで、apiClientが準備された後の useEffect の再発火を待つ
            return;
          }
          // ★★★ 修正終わり ★★★

          // AbortController をシグナルとして渡す
          const response = await apiClient.get(apiUrl, {
            params: params,
            signal: abortControllerRef.current.signal,
          });
          responseData = response.data;
        } else {
          // 未認証リクエスト (グローバル axios を使用)
          const response = await axios.get(`${API_BASE_URL}${apiUrl}`, {
            params: params,
            signal: abortControllerRef.current.signal,
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
        // キャンセルエラーを無視する
        if (axios.isCancel(e)) {
          console.log("Fetch canceled due to state change.");
          return;
        }

        console.error("商品の取得中にエラーが発生しました:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [
      isAuthenticated,
      isLoggingOut,
      isAuthLoading,
      apiClient, // apiClient の変更を監視
    ],
  );

  // =======================================================
  // Effect / Watcher
  // =======================================================

  useEffect(() => {
    if (isAuthLoading) {
      setItems([]);
      return;
    }

    // 認証が解決した後、またはクエリ/認証状態が変わったときにフェッチを実行
    fetchItems(currentTab, currentSearchQuery);

    // クリーンアップ: コンポーネントがアンマウントされるときや依存関係が変わるときにキャンセルする
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
                {currentTab === "mylist" && !isAuthLoading && !isAuthenticated
                  ? "マイリストを見るにはログインしてください。"
                  : currentTab === "all" && isAuthLoading
                    ? "認証状態を確認中..."
                    : "該当する商品が見つかりませんでした。"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- スタイル定義 --- */}
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
