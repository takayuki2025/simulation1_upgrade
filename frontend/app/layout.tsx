import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Next.js + Laravel",
  description: "Frontend + Laravel API",
};

console.log(
  "🔵 SSR: RootLayout loaded. BASE =",
  process.env.NEXT_PUBLIC_API_BASE_URL,
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* SSR（server component）領域ここまで */}

        {/* Client コンポーネント（Providers）は “別 wrapper” の中に配置 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
