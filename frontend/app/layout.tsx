import "./globals.css";
// ★ 修正: AuthProviderを直接インポートする代わりに、クライアントラッパーをインポート
import { Providers } from "@/components/Providers";

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
        {/* ★★★ 修正: クライアントコンポーネントであるProvidersでラップ ★★★ */}
        <Providers>{children}</Providers>
        </body>
    </html>
    );
}
