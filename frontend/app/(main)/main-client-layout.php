"use client";
import HeaderWrapper from "@/components/HeaderWrapper";

export default function MainClientLayout({ children }) {
  return (
    <div className="mx-auto max-w-[1300px] min-h-screen flex flex-col">
      <HeaderWrapper />
      <main>{children}</main>
    </div>
  );
}
