"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/useSanctumAuth";
import type { ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 認証不要のパス（auth レイアウト系）
  const authFreePaths = ["/login", "/register", "/email/verify"];

  const isAuthFree = authFreePaths.some((p) => pathname.startsWith(p));

  if (isAuthFree) {
    return <>{children}</>;
  }

  // main (/ , /item , /sell , /mypage ...) は認証状態が必要
  return <AuthProvider>{children}</AuthProvider>;
}
