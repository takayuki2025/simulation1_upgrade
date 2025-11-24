"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// ★ 以下のカスタムフックは、ご提示のプロファイル編集ページ (profile/page.tsx)
//    と共通のロジックを使用していると想定しています。
import { useAuth } from "@/hooks/useAuth"; // Next.jsのカスタム認証フック
import { useApi } from "@/hooks/useApi"; // 認証済みリクエスト用カスタムフック

// =======================================================
// 型定義 (Nuxt 3 コンポーネントに合わせる)
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
// Next.jsでは process.env.NEXT_PUBLIC_... の形式
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * アセットURLを生成する汎用ヘルパー関数
 * Nuxt 3 コンポーネントの getAssetUrl() ロジックを移植
 */
const getAssetUrl = (
  path: string | undefined | null,
  isProfileImage: boolean = false
): string => {
  // 1. path が存在しない、または空の場合は、デフォルト画像を返す
  if (!path) {
    if (isProfileImage) {
      const DEFAULT_IMAGE_PATH = "storage/images/default-profile2.jpg";
      // ベースURLの末尾が / で終わるか、DEFAULT_IMAGE_PATHの先頭が / で始まるかを考慮
      return `${API_BASE_URL?.replace(/\/$/, "")}/${DEFAULT_IMAGE_PATH}`;
    }
    // 商品画像の場合はパスがないので空文字列を返す
    return "";
  }

  // 2. pathがURL形式（http:// または https:// で始まる）であれば、そのまま返す
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // 3. パスが絶対URL形式でなく、/storage/などで始まっている場合
  const cleanBase = API_BASE_URL?.replace(/\/$/, "") || "";
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // 例: [API_BASE_URL]/storage/images/item/xxx.jpg
  return `${cleanBase}/${cleanPath}`;
};

export default function Mypage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
    reloadAuthToken, // トークンリフレッシュ
  } = useAuth();
  const { authenticatedFetch } = useApi();

  // --- 状態管理 ---
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 全体ローディング

  // URLクエリパラメータから現在のページ (sell/buy) を取得
  const page = useMemo(() => {
    return searchParams.get("page") === "buy" ? "buy" : "sell";
  }, [searchParams]);

  // URLクエリパラメータからメール認証状態を取得 (Nuxt版ロジックを移植)
  const isVerificationRedirect = useMemo(() => {
    return searchParams.get("verified") === "true";
  }, [searchParams]);

  // ----------------------------------------------------------------
  // 1. ユーザー情報取得ロジック
  // ----------------------------------------------------------------

  const fetchUserProfile = useCallback(async () => {
    // 認証解決待ち、または既にロード済みの場合はスキップ
    if (isAuthLoading) return;

    // 未認証の場合はログインへリダイレクト
    if (!isAuthenticated) {
      if (isVerificationRedirect) {
        console.log(
          "Verification redirect detected. Waiting for session resolve."
        );
        return; // メール認証リダイレクト中は待機
      }
      console.log("Unauthenticated detected. Redirecting to /login.");
      // ログアウト処理が完了していない場合は強制リダイレクト
      if (authUser === null) {
        router.replace("/login");
      }
      return;
    }

    // 認証済みでユーザーデータがない場合のみフェッチ
    if (user) return; // 既にユーザーデータがあればフェッチしない

    setIsLoading(true);
    try {
      // APIから最新の完全なプロフィールデータを取得
      const response: { user?: User } = await authenticatedFetch(
        "/mypage/profile"
      );

      if (response && response.user) {
        setUser(response.user);

        // メール認証後のクエリパラメータ処理
        if (isVerificationRedirect) {
          setSuccessMessage(
            `メール認証が完了しました！引き続きサービスをご利用いただけます。`
          );
          // URLクエリから 'verified' を除去（replaceで実現）
          router.replace(`/mypage?page=${page}`);
        }
      }
    } catch (error: any) {
      console.error("プロフィールデータの取得に失敗しました:", error);
      const status = error.status || (error.response && error.response.status);

      if (status === 401) {
        // Nuxt版と同様、グローバルインターセプターまたはuseApiで401処理（トークンリフレッシュ/リダイレクト）を期待
        // ここでは、カスタムフック任せとして、もし失敗したらログアウトを促す
        console.log("401エラーを捕捉 (プロフィール取得)。");
        await logout(); // 認証フックのログアウトを呼び出す
      } else {
        setSuccessMessage("プロフィールデータのロードに失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthLoading,
    isAuthenticated,
    user,
    router,
    authUser,
    authenticatedFetch,
    logout,
    isVerificationRedirect,
    page,
  ]);

  // ----------------------------------------------------------------
  // 2. 商品リスト取得ロジック
  // ----------------------------------------------------------------

  const fetchItems = useCallback(async () => {
    // ユーザープロフィールのロードが完了していることを確認
    if (!user) {
      await fetchUserProfile();
      if (!user) return; // プロフィールロード失敗/未認証の場合は終了
    }

    setIsLoading(true);
    setItems([]);

    try {
      const endpoint = `/mypage/items?page=${page}`;
      // バックエンドから商品リストを取得する
      const response: { items: Item[] } = await authenticatedFetch(endpoint);
      setItems(response.items || []);
    } catch (error: any) {
      console.error(`${page}商品の取得に失敗しました:`, error);
      const status = error.status || (error.response && error.response.status);

      if (status === 401) {
        console.log(`401エラーを捕捉 (アイテム取得)。`);
        await logout();
      }
      // 商品取得エラーは致命的ではないため、ロード状態のみ解除
    } finally {
      setIsLoading(false);
    }
  }, [user, page, authenticatedFetch, fetchUserProfile, logout]);

  // ----------------------------------------------------------------
  // 3. useEffect による実行管理
  // ----------------------------------------------------------------

  // 初回ロード時: 認証チェックとプロフィールデータ取得
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // page (クエリパラメータ) の変更時、または user データ取得完了時に商品リストをフェッチ
  useEffect(() => {
    // ユーザーデータがロードされ、認証済みであればアイテムをフェッチ
    if (user && isAuthenticated && !isAuthLoading) {
      fetchItems();
    }
  }, [page, user, isAuthenticated, isAuthLoading, fetchItems]);

  // ユーティリティ: プロフィール編集ページへ遷移
  const goToProfileEdit = useCallback(() => {
    router.push("/mypage/profile");
  }, [router]);

  // ----------------------------------------------------------------
  // 4. レンダーロジック
  // ----------------------------------------------------------------

  // 認証解決待ち、または全体ロード中の表示
  if (isAuthLoading || (isLoading && !user)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
        <p className="ml-3 text-gray-600">
          {isAuthLoading ? "認証状態を確認中..." : "データを読み込み中..."}
        </p>
      </div>
    );
  }

  // 認証済みだがユーザーデータがない場合 (fetchUserProfileでリダイレクト失敗時など)
  if (!isAuthenticated || !user) {
    // 既に fetchUserProfile() 内でリダイレクトされているはずだが、念のため。
    return (
      <div className="text-center p-8">
        <p className="text-xl text-red-500">
          ユーザー情報がロードできませんでした。
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
            src={getAssetUrl(user.user_image, true)}
            alt="プロフィール画像"
            className="user_image_css"
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
            scroll={false} // 画面遷移時のスクロールを制御
          >
            出品した商品
          </Link>
          {/* 購入した商品タブ */}
          <Link
            href="/mypage?page=buy"
            className={`buy_items ${page === "buy" ? "active" : ""}`}
            scroll={false} // 画面遷移時のスクロールを制御
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
                        src={getAssetUrl(displayItem!.item_image)}
                        alt={displayItem!.name + "の商品写真"}
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

      {/* 以下の style タグ内の CSS は、ご提示の Nuxt ファイルのものをそのままコピーして使用してください */}
      {/* Tailwind CSS 環境では、上記コンポーネントの className に反映されるべきですが、
          ここでは Scoped CSS を模倣してそのまま残します。
          Next.jsのグローバルCSSまたはCSS Modulesとして別途定義する必要があります。 */}
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
          transition: background-color 0.2s, color 0.2s;
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
