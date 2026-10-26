import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Editor — Codepilot",
};

// The editor reads the session and database on every request.
export const instant = false;

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#f5f5f7]">
      {children}
    </div>
  );
}
