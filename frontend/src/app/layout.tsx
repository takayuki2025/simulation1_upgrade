import "./globals.css";
import { SWRProvider } from "./SWRProvider";
import ClientLayout from "./ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <SWRProvider>
          <ClientLayout>{children}</ClientLayout>
        </SWRProvider>
      </body>
    </html>
  );
}
