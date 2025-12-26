"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";

type ShopContextValue = { shopCode: string };

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used under ShopProvider");
  return ctx;
}

export default function ShopProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const shopCode = String(params.shop_code ?? "");

  const value = useMemo(() => ({ shopCode }), [shopCode]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
