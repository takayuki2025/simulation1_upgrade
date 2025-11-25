import "./globals.css";
// ★ 修正: ファイル拡張子を明確にするためインポートパスを更新
import { AuthProvider } from "@/hooks/useAuth"; // .tsxを削除 (推奨)

export const metadata = {
    title: "Next.js + Laravel",
    description: "Frontend by Next.js, Backend by Laravel",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    <html lang="ja">
        <body>
        {/* ★★★ AuthProviderでアプリケーション全体をラップ ★★★ */}
        <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
    );
}
