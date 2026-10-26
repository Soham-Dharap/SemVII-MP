import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0B] border-t-2 border-[#F4F4F0] text-[#F4F4F0]">
      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-[10px] bg-[#F4F4F0] p-1 border-2 border-black" />
              <span className="display text-[22px]">CODEPILOT</span>
              <span className="mono text-[10px] font-bold bg-[#D6FF00] text-black px-2 py-1 rotate-[-1deg]">BUILT 2 SHIP</span>
            </div>
            <div className="display text-[32px] sm:text-[44px] leading-[0.85] mt-4 max-w-[520px]">CODE LIKE<br/>U MEAN IT<span className="text-[#D6FF00]">.</span></div>
            <p className="mono text-[11px] leading-5 text-white/60 mt-3 max-w-[480px]">No synthetic cloud FS. No purple gradient slop. Just Monaco, brutalist file tree, and a preview that hunts your typos live. Fr fr.</p>
            <div className="flex flex-wrap gap-2 mt-4 mono text-[10px] font-bold">
              <span className="px-2 py-1 bg-white text-black border-2 border-black rotate-[-1deg]">NEXT 16</span>
              <span className="px-2 py-1 bg-[#D6FF00] text-black border-2 border-black rotate-[1deg]">REACT 19</span>
              <span className="px-2 py-1 bg-[#00E5FF] text-black border-2 border-black rotate-[-0.5deg]">MONACO 0.52</span>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 grid grid-cols-3 gap-6 mono text-[11px] font-bold">
            <div>
              <div className="text-[#D6FF00] tracking-[0.14em] uppercase mb-3">Product</div>
              <div className="space-y-2 text-white/80">
                <Link href="#" className="block hover:text-[#D6FF00]">Editor →</Link>
                <Link href="#" className="block hover:text-[#D6FF00]">Templates →</Link>
                <Link href="#" className="block hover:text-[#D6FF00]">Changelog →</Link>
              </div>
            </div>
            <div>
              <div className="text-[#D6FF00] tracking-[0.14em] uppercase mb-3">Manual</div>
              <div className="space-y-2 text-white/80">
                <Link href="#" className="block hover:text-[#D6FF00]">Docs →</Link>
                <Link href="#" className="block hover:text-[#D6FF00]">Shortcuts →</Link>
                <Link href="#" className="block hover:text-[#D6FF00]">API →</Link>
              </div>
            </div>
            <div>
              <div className="text-[#D6FF00] tracking-[0.14em] uppercase mb-3">Vibe</div>
              <div className="space-y-2 text-white/80">
                <Link href="#" className="block hover:text-[#D6FF00]">Privacy</Link>
                <Link href="#" className="block hover:text-[#D6FF00]">Terms</Link>
                <Link href="#" className="block hover:text-[#D6FF00]">Security</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t-2 border-white/10 pt-4 mono text-[10px] font-bold text-white/60">
          <span>© 2026 CODEPILOT — PRIVATE BY DEFAULT. NO TRACKERS. NO CAP.</span>
          <span className="bg-white text-black px-2 py-1 border-2 border-black rotate-[1deg]">MADE WITH {} &lt;&gt; + D6FF00</span>
        </div>
      </div>
    </footer>
  );
}
