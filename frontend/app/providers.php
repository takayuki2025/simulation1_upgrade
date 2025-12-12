"use client";

import { AuthProvider } from "@/hooks/useSanctumAuth";

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
