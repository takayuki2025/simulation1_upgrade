import React from "react";
import Link from "next/link";
import Image from "next/image";

// 認証ページグループに適用されるレイアウト
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1300px] min-h-screen flex flex-col">
      {/* ★★★ ヘッダーの再現 (.header) ★★★ */}
      <header className="bg-black h-[70px] shadow-md">
        <div className="flex items-center px-4 h-full">
          {/* ロゴ: サイズを h-[50px] w-[250px] に拡大しました */}
          <Link href="/" className="relative h-[50px] w-[250px] flex-shrink-0">
            <Image
              className="object-contain" // 親要素のサイズに合わせて調整
              src="/image_icon/logo.svg"
              alt="会社名"
              fill // width, heightを削除し、fillを追加
              priority
            />
          </Link>

          {/* 検索フォームは認証ページでは不要なので省略 */}

          {/* ナビゲーションリンク (認証状況に関わらず固定表示) */}
          <div className="flex ml-auto items-center space-x-2">
            {/* 会員登録 (.login_page_1 相当) */}
            <Link
              href="/register"
              className="text-white text-base py-1 px-3 border border-black transition duration-150 hover:bg-white hover:text-black"
            >
              会員登録
            </Link>

            {/* ログイン (.login_page_2 相当) */}
            <Link
              href="/login"
              className="text-white text-base py-1 px-3 border border-black transition duration-150 hover:bg-white hover:text-black"
            >
              ログイン
            </Link>
          </div>
        </div>
      </header>

      {/* ★★★ メインコンテンツ (@yield('content')) ★★★ */}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
