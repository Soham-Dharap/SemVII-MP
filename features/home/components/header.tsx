import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/features/auth/components/user-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-[12px] border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="flex h-[64px] items-center justify-between">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#111] dark:bg-white text-white dark:text-black">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold tracking-[-0.015em] text-[#111] dark:text-white">
                  CodePilot
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="#" className="text-[13px] font-[450] tracking-[-0.01em] text-[#666] hover:text-[#111] dark:text-[#aaa] dark:hover:text-white transition-colors">
                  Overview
                </Link>
                <Link href="#" className="text-[13px] font-[450] tracking-[-0.01em] text-[#666] hover:text-[#111] dark:text-[#aaa] dark:hover:text-white transition-colors">
                  Templates
                </Link>
                <Link href="#" className="text-[13px] font-[450] tracking-[-0.01em] text-[#666] hover:text-[#111] dark:text-[#aaa] dark:hover:text-white transition-colors">
                  Docs
                </Link>
                <Link href="#" className="text-[13px] font-[450] tracking-[-0.01em] text-[#666] hover:text-[#111] dark:text-[#aaa] dark:hover:text-white transition-colors">
                  Changelog
                </Link>
              </nav>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-8 items-center justify-center rounded-md bg-[#111] dark:bg-white px-4 text-[13px] font-medium text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-colors"
              >
                Open workspace
              </Link>
              <div className="hidden sm:block h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />
              <ThemeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
