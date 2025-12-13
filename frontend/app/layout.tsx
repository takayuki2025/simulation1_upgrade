import "./globals.css";
import { AuthProvider } from "@/ui/auth/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
