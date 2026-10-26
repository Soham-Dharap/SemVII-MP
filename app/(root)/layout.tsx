import React from "react";
import { Header } from "@/features/home/components/header";
import { Footer } from "@/features/home/components/footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#fbfbfd]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
