import Link from "next/link";
import Image from "next/image";
import UserButton from "@/features/auth/components/user-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#09090B]/80 backdrop-blur-xl border-b border-[#232326]">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex h-[56px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-[9px] bg-white flex items-center justify-center overflow-hidden">
              <Image src="/logo.svg" alt="CodePilot" width={22} height={22} className="h-[22px] w-[22px]" />
            </div>
            <span className="mono text-[12px] font-semibold tracking-[-0.02em] text-white">
              CodePilot
            </span>
            <span className="hidden sm:inline-flex ml-1 px-2 py-0.5 rounded-full bg-[#1A1A1D] border border-[#232326] mono text-[10px] font-medium text-[#8A8A90]">Monaco • Live</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#write" className="px-3 py-1.5 rounded-full mono text-[11px] font-medium text-[#8A8A90] hover:text-white hover:bg-[#1A1A1D] transition-colors">Write</a>
            <a href="#preview" className="px-3 py-1.5 rounded-full mono text-[11px] font-medium text-[#8A8A90] hover:text-white hover:bg-[#1A1A1D] transition-colors">Preview</a>
            <a href="#ship" className="px-3 py-1.5 rounded-full mono text-[11px] font-medium text-[#8A8A90] hover:text-white hover:bg-[#1A1A1D] transition-colors">Ship</a>
            <span className="mx-2 h-4 w-px bg-[#232326]" />
            <Link href="/dashboard" className="mono text-[11px] font-medium text-[#8A8A90] hover:text-white transition-colors">Playgrounds</Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex mono text-[10px] font-medium bg-[#1A1A1D] border border-[#232326] text-[#8A8A90] px-2 py-1 rounded-[8px]">⌘ K</span>
            <Link href="/dashboard" className="inline-flex h-[34px] items-center bg-[#D6FF00] text-[#09090B] px-4 mono text-[12px] font-semibold rounded-full hover:bg-[#C6EB00] transition-colors">
              Open app
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
