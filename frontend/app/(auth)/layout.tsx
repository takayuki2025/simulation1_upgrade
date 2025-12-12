"use client";

import HeaderAuth from "@/components/layout/HeaderAuth";
import { AuthProvider } from "@/hooks/useSanctumAuth";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <HeaderAuth />
      <main className="mx-auto max-w-[1300px] min-h-screen">{children}</main>
    </AuthProvider>
  );
}
