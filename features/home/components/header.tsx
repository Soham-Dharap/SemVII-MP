import Link from "next/link";
import Image from "next/image";
import UserButton from "@/features/auth/components/user-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0B] border-b-2 border-[#F4F4F0]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="flex h-[52px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-[12px] bg-[#F4F4F0] border-2 border-[#0A0A0B] flex items-center justify-center overflow-hidden brutal-dark rotate-[-2deg]">
              <Image src="/logo.svg" alt="CodePilot" width={28} height={28} className="h-[28px] w-[28px]" />
            </div>
            <span className="mono text-[11px] font-bold tracking-[0.14em] uppercase hidden sm:inline">
              <span className="text-[#F4F4F0]">CODE</span><span className="text-[#D6FF00]">PILOT</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-2 ml-2 px-2.5 py-1 rounded-full bg-[#D6FF00] text-black mono text-[10px] font-bold rotate-[1deg]">v2026.01 ✦ GEN-Z</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <a href="#write" className="px-3 py-1.5 rounded-full bg-[#1C1C1F] border-2 border-[#F4F4F0] mono text-[11px] font-bold text-white hover:bg-[#D6FF00] hover:text-black transition-colors">01 WRITE</a>
            <a href="#preview" className="px-3 py-1.5 rounded-full bg-[#1C1C1F] border-2 border-[#F4F4F0] mono text-[11px] font-bold text-white hover:bg-[#D6FF00] hover:text-black transition-colors">02 PREVIEW</a>
            <a href="#ship" className="px-3 py-1.5 rounded-full bg-[#1C1C1F] border-2 border-[#F4F4F0] mono text-[11px] font-bold text-white hover:bg-[#D6FF00] hover:text-black transition-colors">03 SHIP</a>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-full bg-white text-black mono text-[11px] font-bold border-2 border-black hover:rotate-[1deg] transition-transform">PLAYGROUNDS →</Link>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex mono text-[10px] font-bold bg-[#1C1C1F] border-2 border-[#F4F4F0] text-white px-2 py-1 rotate-[-1deg]">⌘K</span>
            <Link href="/dashboard" className="inline-flex h-[36px] items-center bg-[#D6FF00] text-black px-4 mono text-[12px] font-black border-2 border-black shadow-[3px_3px_0_#F4F4F0] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#F4F4F0] transition-all rotate-[-0.5deg]">
              OPEN APP ✦
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
      {/* ticker */}
      <div className="overflow-hidden border-t-2 border-[#F4F4F0] bg-[#D6FF00] text-black">
        <div className="flex whitespace-nowrap ticker mono text-[11px] font-black tracking-[0.12em] py-1.5">
          <span className="mx-4">{} CODE → PREVIEW → SHIP → REPEAT — NO AI SLOP — MONACO + LIVE PREVIEW + FILE SYSTEM —</span>
          <span className="mx-4">{} CODE → PREVIEW → SHIP → REPEAT — NO AI SLOP — MONACO + LIVE PREVIEW + FILE SYSTEM —</span>
          <span className="mx-4">{} CODE → PREVIEW → SHIP → REPEAT — NO AI SLOP — MONACO + LIVE PREVIEW + FILE SYSTEM —</span>
          <span className="mx-4">{} CODE → PREVIEW → SHIP → REPEAT — NO AI SLOP — MONACO + LIVE PREVIEW + FILE SYSTEM —</span>
        </div>
      </div>
    </header>
  );
}
