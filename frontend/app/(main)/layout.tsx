"use client";

import HeaderMain from "@/components/layout/HeaderMain";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderMain />
      <main className="mx-auto max-w-[1300px] min-h-screen">{children}</main>
    </>
  );
}