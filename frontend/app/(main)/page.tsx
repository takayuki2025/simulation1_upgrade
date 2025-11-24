"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl, onImageError } from "@/utils/utils";

// 環境変数ではなく、Next.jsのクライアント側の定数として扱います
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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
  const {
    user,
    token,
    isLoading: isAuthLoading, // useFirebaseInitのisReadyがfalseの時、trueになる
    isLoggingOut,
    isAuthenticated,
  } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false); // APIフェッチ中のローディング
  const [imageRefreshKey, setImageRefreshKey] = useState(0);

  // =======================================================
  // Computed (useMemoで代替)
  // =======================================================

  const currentTab = useMemo(() => {
    return searchParams.get("tab") === "mylist" ? "mylist" : "all";
  }, [searchParams]);

  const currentSearchQuery = useMemo(() => {
    return searchParams.get("all_item_search") || "";
  }, [searchParams]);

  // ページ全体のローディング状態
  const isPageLoading = useMemo(() => {
    // ログアウト処理中が最優先
    if (isLoggingOut) return true;
    // 認証状態の解決が完了していない場合（useFirebaseInit.isReady=false）
    if (isAuthLoading) return true;
    // 商品データロード中
    if (loading) return true;

    return false;
  }, [isLoggingOut, isAuthLoading, loading]);

  // テンプレートのログインメッセージ表示に使用
  const isUserLoggedOutComputed = useMemo(() => {
    // 認証が解決済み(isAuthLoading=false)で、かつユーザーが存在しない場合に「ログアウト状態」と判断
    return !isAuthLoading && !user;
  }, [isAuthLoading, user]);

  // =======================================================
  // データフェッチロジック
  // =======================================================

  const fetchItems = useCallback(
    async (tab: string, search: string, currentToken: string | null) => {
      const isAuthenticatedByHook = !!user && !user.isAnonymous; // 匿名ユーザーを除く認証済みチェック

      console.log(`[DEBUG] Received Token: ${currentToken}`);

      if (isLoggingOut) {
        console.log("[Skip Fetch] Logging out, skipping fetch.");
        setItems([]);
        setLoading(false);
        return;
      }

      // マイリストタブかつ未ログインの場合、フェッチをスキップ
      if (tab === "mylist" && !isAuthenticatedByHook) {
        console.log("[Skip Fetch] Not logged in and accessing mylist.");
        setItems([]);
        setLoading(false);
        setImageRefreshKey((prev) => prev + 1);
        return;
      }

      setLoading(true);
      console.log(
        `[Fetch] Auth Check: ${isAuthenticatedByHook}. Token Present: ${!!currentToken}. Fetching items: tab=${tab}, search=${search}`
      );

      const apiUrl = `${API_BASE_URL}/api/items`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // 重要な修正: currentTokenが確実に存在する（認証が完了している）場合にのみヘッダーを設定
      if (currentToken) {
        headers["Authorization"] = `Bearer ${currentToken}`;
        console.log(
          "[Fetch] Including 'Authorization: Bearer' header with Firebase ID Token."
        );
      } else if (isAuthenticatedByHook && user) {
        // トークンが存在しないが、userが存在する場合（念のためトークンを再取得）
        console.warn(
          "[Fetch] User exists but token is null. Fetching new token."
        );
        const freshToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${freshToken}`;
      }

      try {
        const response = await axios.get(apiUrl, {
          params: {
            tab: tab,
            all_item_search: search,
          },
          headers: headers,
        });

        const responseData = response.data;
        if (responseData && Array.isArray(responseData.items)) {
          setItems(responseData.items as Item[]);
          setImageRefreshKey((prev) => prev + 1);
        } else {
          console.warn("APIレスポンスの構造が不正です:", responseData);
          setItems([]);
        }
      } catch (e: any) {
        console.error("商品の取得中に予期せぬエラーが発生しました:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [user, isLoggingOut, API_BASE_URL]
  );

  // =======================================================
  // Effect / Watcher (認証状態とURLクエリの統合監視)
  // =======================================================

  useEffect(() => {
    console.group("Home.tsx useEffect Re-run Check");
    console.log(`[STATE] isAuthLoading: ${isAuthLoading}`); // 認証待機中は true
    console.log(`[STATE] user (exists): ${!!user}`);
    console.log(`[STATE] token (exists): ${!!token}`);
    console.groupEnd();

    // ★★★ 認証状態が解決するまで、フェッチを厳密にブロックする ★★★
    if (isAuthLoading) {
      console.log("[Skip] Waiting for authentication to resolve.");
      setItems([]); // データが表示されないようクリア
      return;
    }

    // 認証状態の解決後 (isAuthLoading=false) または、解決後のトークン/クエリ変更時にフェッチを実行
    console.log(
      `[Fetch Triggered] Auth Resolved/Query Changed. Re-fetching items.`
    );
    fetchItems(currentTab, currentSearchQuery, token);
  }, [
    currentTab,
    currentSearchQuery,
    isAuthLoading, // 認証完了を監視
    token, // トークン変更を監視
    fetchItems,
    user,
  ]);

  // =======================================================
  // レンダリング
  // =======================================================

  return (
    <div className="main_contents">
      {/* ローディング状態 */}
      {isPageLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"></div>
          <p className="ml-4 text-lg text-gray-400">
            {isLoggingOut
              ? "ログアウト処理中..."
              : isAuthLoading // 認証解決待ちのとき
              ? "認証状態を確認中..." // ← isAuthLoading が false になるまでデータフェッチはブロックされる
              : "商品を読み込み中..."}
          </p>
        </div>
      )}

      <div className={isPageLoading ? "hidden" : ""}>
        {/* タブ切り替えと検索フォーム（簡易版） */}
        <div className="main_select">
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
                  ? "認証状態を確認中..."
                  : "該当する商品が見つかりませんでした。"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vueの <style scoped> を Tailwind CSSと組み合わせて再現 */}
      <style jsx>{`
        .main_contents {
          margin: 0 auto;
          max-width: 1400px;
          padding: 0 20px;
        }

        .main_select {
          height: 80px;
          border-bottom: 3px solid #4b5563; /* Tailwind gray-600 */
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
          color: #9ca3af; /* Tailwind gray-400 */
          font-size: 1.2rem;
          font-weight: bold;
          padding-bottom: 15px;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .recs:hover,
        .mylists:hover {
          color: #d1d5db; /* Tailwind gray-300 */
        }

        .recs.active,
        .mylists.active {
          color: #ef4444; /* Tailwind red-500 */
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
          color: #000000ff; /* Tailwind gray-200 */
        }

        /* soldタグのスタイル */
        .items_select_all .sold-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-10deg);
          z-index: 10;
          font-size: 1.5rem;
          color: #f87171; /* Tailwind red-400 */
          font-weight: 900;
          padding: 8px 16px;
          background-color: rgba(
            31,
            41,
            55,
            0.9
          ); /* Tailwind gray-800 semi-transparent */
          border: 4px solid #f87171;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
