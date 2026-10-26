"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import UserButton from "@/features/auth/components/user-button";

export function Header() {
  const pathname = usePathname();
  // Landing has its own Marklab hero nav — hide outer header there to avoid duplication
  if (pathname === "/") return null;
  return (
    <header className="sticky top-0 z-50 w-full bg-[#070A1C]/80 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="flex h-[56px] items-center justify-between gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 min-w-0 shrink-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#6366F1] flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white font-black text-[11px]">✦</span>
            </div>
            <span className="text-white text-[14px] font-bold tracking-tight hidden sm:inline">CodePilot</span>
          </Link>

          <nav className="hidden md:flex items-center bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur">
            <Link href="/#features" className="px-4 py-1.5 rounded-full text-[12px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition">Features</Link>
            <Link href="/dashboard" className="px-4 py-1.5 rounded-full text-[12px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition">Workspaces</Link>
            <Link href="/dashboard" className="px-4 py-1.5 rounded-full bg-white text-black text-[12px] font-bold hover:bg-white/90 transition ml-1">Open App</Link>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard" className="hidden sm:inline-flex h-9 items-center bg-white text-black px-5 rounded-full text-[12px] font-bold hover:bg-white/90 transition">
              Dashboard
            </Link>
            <Link href="/dashboard" className="sm:hidden h-8 w-8 flex items-center justify-center bg-white text-black rounded-full">↗</Link>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
