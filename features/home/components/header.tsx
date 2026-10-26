import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/features/auth/components/user-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFEFB]/95 backdrop-blur-[6px] border-b border-[#E8E0CC]">
      {/* Thin rule + masthead like Linear publication */}
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex h-[40px] items-center justify-between gap-6">
          {/* Left: wordmark — small, specific, no centered */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-[18px] w-[18px] items-center justify-center bg-[#0F0E0C] text-[#FFFEFB]">
                <span className="mono text-[10px] font-medium leading-none">◧</span>
              </span>
              <span className="mono text-[12px] font-medium tracking-[-0.01em] text-[#0F0E0C]">CodePilot</span>
              <span className="hidden sm:inline mono text-[10px] text-[#6B6560] border-l border-[#E8E0CC] pl-2 ml-1">2026.01 — Editor</span>
            </Link>
            <span className="hidden lg:inline-flex items-center gap-1.5 mono text-[10px] text-[#6B6560]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B4A] animate-pulse" />
              All systems operational
            </span>
          </div>

          {/* Center: TOC — mono, left-aligned, not centered pills */}
          <nav className="hidden md:flex items-center gap-5">
            <a href="#write" className="mono text-[11px] tracking-[0.06em] uppercase text-[#6B6560] hover:text-[#0F0E0C] transition-colors">01 Write</a>
            <span className="text-[#E8E0CC]">·</span>
            <a href="#preview" className="mono text-[11px] tracking-[0.06em] uppercase text-[#6B6560] hover:text-[#0F0E0C] transition-colors">02 Preview</a>
            <span className="text-[#E8E0CC]">·</span>
            <a href="#ship" className="mono text-[11px] tracking-[0.06em] uppercase text-[#6B6560] hover:text-[#0F0E0C] transition-colors">03 Ship</a>
            <span className="text-[#E8E0CC]">·</span>
            <Link href="/dashboard" className="mono text-[11px] tracking-[0.06em] uppercase text-[#0F0E0C] underline decoration-[#E8E0CC] underline-offset-4">Playgrounds</Link>
          </nav>

          {/* Right: quiet actions — no pill, hairline button */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex mono text-[10px] text-[#6B6560] border border-[#E8E0CC] bg-white px-2 py-1">⌘K</span>
            <Link
              href="/dashboard"
              className="inline-flex h-[28px] items-center border border-[#0F0E0C] bg-[#0F0E0C] px-3 mono text-[11px] font-medium tracking-[0.02em] text-[#FFFEFB] hover:bg-[#1A1917] transition-colors"
            >
              Open workspace →
            </Link>
            <div className="h-4 w-px bg-[#E8E0CC] hidden sm:block" />
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
