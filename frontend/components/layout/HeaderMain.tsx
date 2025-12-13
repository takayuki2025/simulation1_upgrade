"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/ui/auth/useAuth";
import { useState, type FormEvent } from "react";

export default function HeaderMain() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const linkBase =
    "text-base py-1 px-3 border border-black transition duration-150";
  const linkStyled = "text-white bg-black hover:bg-white hover:text-black";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-black h-[70px] shadow-md">
      <div className="flex items-center p-[20px_15px] h-full mx-auto max-w-[1300px]">
        <Link href="/" className="relative w-[250px] h-[50px] flex-shrink-0">
          <Image
            src="/image_icon/logo.svg"
            alt="会社名"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <form className="ml-[50px] flex items-center">
          <input
            type="text"
            className="h-[30px] w-[300px] px-3 py-1 text-gray-800 rounded"
            placeholder="　なにをお探しですか？"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="flex items-center ml-auto space-x-2">
          {isLoading ? (
            <>
              <div className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
            </>
          ) : isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className={`${linkBase} ${linkStyled}`}
              >
                ログアウト
              </button>

              <Link
                href="/mypage?page=sell"
                className={`${linkBase} ${linkStyled}`}
              >
                マイページ
              </Link>

              <Link href="/sell" className={`${linkBase} ${linkStyled}`}>
                出品
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={`${linkBase} ${linkStyled}`}>
                ログインへ
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
