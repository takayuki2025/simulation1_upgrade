"use client";

import React from "react";
import HeaderWrapper from "@/components/HeaderWrapper"; // 作成したHeaderコンポーネントをインポート

console.log("SSR BASE =", process.env.NEXT_PUBLIC_API_BASE_URL);

// 認証不要のメインページ群に適用されるレイアウト
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1300px] min-h-screen flex flex-col">
      <HeaderWrapper /> {/* ← Header を直接 import しない */}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
