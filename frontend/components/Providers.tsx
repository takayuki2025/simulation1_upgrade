"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { ReactNode } from "react";

/**
 * AuthProvider をラップするためのクライアントコンポーネント。
 * RootLayout (サーバーコンポーネント) と AuthProvider (クライアントコンポーネント)
 * の境界線として機能します。
 */
export function Providers({ children }: { children: ReactNode }) {
  // AuthProviderはuseContextやuseStateを使用するため、このクライアントコンポーネント内で実行される必要があります。
    return <AuthProvider>{children}</AuthProvider>;
}
