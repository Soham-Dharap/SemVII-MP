import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/features/auth/components/user-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Apple translucent navigation bar */}
      <div className="w-full bg-[rgba(251,251,253,0.8)] backdrop-blur-[20px] supports-[backdrop-filter]:bg-[rgba(251,251,253,0.8)] border-b border-black/[0.04] dark:bg-black/60 dark:border-white/10">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="flex h-[44px] items-center justify-between gap-8">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1d1d1f] text-white group-hover:scale-105 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor" opacity="0.95"/>
                    <path d="M14 2v6h6" fill="white" fillOpacity="0.2"/>
                    <path d="M8 13l-2 2 2 2M16 13l2 2-2 2M13 10l-2 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[19px] font-semibold tracking-[-0.022em] text-[#1d1d1f] dark:text-white">
                  CodePilot
                </span>
                <span className="hidden sm:inline text-[12px] font-medium tracking-wide text-[#86868b] ml-1 mt-0.5">
                  AI Editor
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-7">
                <Link href="#" className="text-[12px] font-normal tracking-[-0.01em] text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors">
                  Features
                </Link>
                <Link href="#" className="text-[12px] font-normal tracking-[-0.01em] text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors">
                  Templates
                </Link>
                <Link href="#" className="text-[12px] font-normal tracking-[-0.01em] text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors">
                  Docs
                </Link>
                <Link href="#" className="text-[12px] font-normal tracking-[-0.01em] text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors flex items-center gap-1.5">
                  API
                  <span className="rounded-full bg-[#0071e3] px-1.5 py-0.5 text-[9px] font-semibold leading-none text-white">
                    NEW
                  </span>
                </Link>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex h-7 items-center justify-center rounded-full bg-[#0071e3] px-4 text-[12px] font-medium text-white hover:bg-[#0077ed] transition-colors"
                >
                  Open App
                </Link>
                <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Subtle bottom highlight like Apple */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent dark:via-white/10" />
    </header>
  );
}
