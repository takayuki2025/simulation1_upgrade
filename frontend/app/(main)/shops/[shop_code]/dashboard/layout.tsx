import React from "react";
import ShopProvider from "../ShopProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopProvider>{children}</ShopProvider>;
}
