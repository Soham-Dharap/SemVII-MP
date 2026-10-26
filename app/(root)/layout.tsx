import React from "react";
import { Header } from "@/features/home/components/header";
import { Footer } from "@/features/home/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — CodePilot",
    default: "CodePilot — Intelligent Code Editor",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-black flex flex-col">
      <Header />
      <main className="flex-1 w-full relative">
        {/* Subtle Apple dot grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
