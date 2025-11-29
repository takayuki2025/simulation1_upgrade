"use client";

import React, { useState, FormEvent, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useSanctumAuth"; // useAuthフックを使用
import { useRouter } from "next/navigation";

// LaravelのCSSをTailwindで再現したメインページ用ヘッダー
export default function Header() {
  const {
    isAuthenticated,
    logout,
    isLoading: isAuthLoading, // useFirebaseInit.isReady (!isReady) と連動
    isLoggingOut,
  } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // ヘッダー全体を非表示にする必要があるローディング状態
  const isHeaderLoading = useMemo(
    () => isAuthLoading || isLoggingOut,
    [isAuthLoading, isLoggingOut],
  );

  // ログアウト処理
  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // logoutフックは引数なしで呼び出し、その後クライアント側でリダイレクト
      await logout();
      // router.push("/"); リダイレクトは不要（logout内で完結しているため）
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // 検索フォームの処理 (Laravelのroute('front_page')へGETリクエスト)
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      // 検索クエリをURLに含めてフロントページへ遷移 (Next.jsのルーティングを使用)
      router.push(`/?all_item_search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push(`/`);
    }
  };

  // Tailwind CSSでのデザインクラスを定義
  const linkBaseClass =
    "text-base py-1 px-3 border border-black transition duration-150";
  const linkStyleClass = "text-white bg-black hover:bg-white hover:text-black"; // .login_page_1/2/3 相当

  return (
    <header className="bg-black h-[70px] shadow-md">
      {" "}
      {/* .header を再現 */}
      <div className="flex items-center p-[20px_15px] h-full mx-auto max-w-[1300px]">
        {" "}
        {/* .header__inner と @media の max-width を考慮 */}
        {/* ロゴ部分 (.company) */}
        <Link href="/" className="relative h-[50px] w-[250px] flex-shrink-0">
          <Image
            className="object-contain"
            src="/image_icon/logo.svg"
            alt="会社名"
            fill
            loading="eager" //priorityは非推奨となった（早い読み込みオプション）
          />
        </Link>
        {/* ★修正箇所: ローディング中は検索フォームとナビゲーションを非表示にし、プレースホルダーを表示 */}
        {isHeaderLoading ? (
          <div className="flex ml-[50px] flex-grow items-center justify-end space-x-4">
            {/* 検索フォームのプレースホルダー */}
            <div className="h-[30px] w-[300px] bg-gray-700 rounded animate-pulse"></div>
            {/* ナビゲーションのプレースホルダー */}
            <div className="flex space-x-2">
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            {/* 検索フォームの再現 */}
            <form
              onSubmit={handleSearch}
              className="ml-[50px] flex items-center"
            >
              <input
                type="text"
                className="h-[30px] w-[300px] px-3 py-1 text-gray-800 rounded"
                name="all_item_search"
                placeholder="　なにをお探しですか？"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            {/* 認証状態に応じたナビゲーションリンク (.login_page0) */}
            <div className="flex ml-auto items-center space-x-2">
              {isAuthenticated ? (
                // 認証済みの場合
                <>
                  {/* ログアウト */}
                  <button
                    onClick={handleLogout}
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    ログアウト
                  </button>

                  {/* マイページ */}
                  <Link
                    href="/mypage?page=sell"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    マイページ
                  </Link>

                  {/* 出品 */}
                  <Link
                    href="/sell"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    出品
                  </Link>
                </>
              ) : (
                // 未認証の場合
                <>
                  {/* ログイン */}
                  <Link
                    href="/login"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    ログインへ
                  </Link>

                  {/* マイページ (未認証時はログインページへ) */}
                  <Link
                    href="/login"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    ログインへ（マイページ）
                  </Link>

                  {/* 出品 (未認証時はログインページへ) */}
                  <Link
                    href="/login"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    ログインへ（出品）
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
