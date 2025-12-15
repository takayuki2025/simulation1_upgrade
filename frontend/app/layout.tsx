import "./globals.css";
import { AuthProvider } from "@/ui/auth/AuthProvider";
import { SWRProvider } from "./SWRProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <SWRProvider>
          <AuthProvider>{children}</AuthProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
