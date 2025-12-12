"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useSanctumAuth";
import { useState, type FormEvent, type ChangeEvent } from "react";

export default function HeaderMain() {
  const { isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderLoading, setIsHeaderLoading] = useState(false);

  const linkBaseClass =
    "text-base py-1 px-3 border border-black transition duration-150";
  const linkStyleClass = "text-white bg-black hover:bg-white hover:text-black";

  const handleLogout = async () => {
    await logout();
  };

  // ★ ここに型を付ければ TS エラー消える
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <header className="bg-black h-[70px] shadow-md">
      <div className="flex items-center p-[20px_15px] h-full mx-auto max-w-[1300px]">
        <Link href="/" className="relative h-[50px] w-[250px] flex-shrink-0">
          <Image
            className="object-contain"
            src="/image_icon/logo.svg"
            alt="会社名"
            fill
            loading="eager"
          />
        </Link>

        {isHeaderLoading ? (
          <div className="flex ml-[50px] flex-grow items-center justify-end space-x-4">
            <div className="h-[30px] w-[300px] bg-gray-700 rounded animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
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

            <div className="flex ml-auto items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleLogout}
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    ログアウト
                  </button>

                  <Link
                    href="/mypage?page=sell"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    マイページ
                  </Link>

                  <Link
                    href="/sell"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    出品
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    ログインへ
                  </Link>

                  <Link
                    href="/login"
                    className={`${linkBaseClass} ${linkStyleClass}`}
                  >
                    ログインへ（マイページ）
                  </Link>

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
