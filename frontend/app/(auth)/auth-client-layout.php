"use client";

import { AuthProvider } from "@/hooks/useSanctumAuth";
import AuthHeaderLayout from "./auth-header-layout"; // auth 専用ヘッダー

export default function AuthClientLayout({ children }) {
  return (
    <AuthProvider>
      <AuthHeaderLayout>{children}</AuthHeaderLayout>
    </AuthProvider>
  );
}
