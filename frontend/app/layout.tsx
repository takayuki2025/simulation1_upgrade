import "./globals.css";
import ClientWrapper from "./client-wrapper";
import type { ReactNode } from "react";

export const metadata = {
  title: "Next.js + Laravel",
  description: "Frontend + Laravel API",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {/* レイアウト分岐はここで集約（AuthProvider はここに置かない） */}
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
