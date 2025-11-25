import React from "react";
import Header from "@/components/Header"; // 作成したHeaderコンポーネントをインポート

// 認証不要のメインページ群に適用されるレイアウト
export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    // Laravel CSSの @media (min-width: 1400px) { body { width: 1300px; margin: 0 auto; } } を再現
    <div className="mx-auto max-w-[1300px] min-h-screen flex flex-col">
      {/* 共通ヘッダー */}
        <Header />

      {/* メインコンテンツ */}
        <main className="flex-grow">{children}</main>

      {/* ここにフッターが必要であれば追加します */}
    </div>
    );
}
