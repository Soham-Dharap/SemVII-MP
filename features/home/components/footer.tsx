import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#070A1C] border-t border-white/5 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#6366F1]/5 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 py-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#6366F1] flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-[12px]">✦</span>
              </div>
              <span className="text-white text-[15px] font-bold tracking-tight">CodePilot</span>
              <span className="mono text-[10px] text-white/40 border border-white/10 px-2 py-0.5 rounded-full">© 2026</span>
            </div>
            <p className="display text-white text-[24px] leading-[0.95] max-w-[380px] mt-4">Own your code.<br/>Shape your future.</p>
            <p className="text-[13px] leading-5 text-white/40 mt-3 max-w-[400px]">Premium playground with Monaco, live preview, real filesystem. No Docker. No setup. Just code.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[11px] font-medium">SOC 2 Certified</span>
              <span className="px-3 py-1.5 rounded-full bg-[#D6FF00] text-black text-[11px] font-bold">● Live Now</span>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-6 text-[13px]">
            <div>
              <div className="label text-white/30 text-[11px] mb-4">Product</div>
              <div className="space-y-3 text-white/50">
                <Link href="#" className="block hover:text-white transition">Editor</Link>
                <Link href="#" className="block hover:text-white transition">Templates</Link>
                <Link href="#" className="block hover:text-white transition">Changelog</Link>
                <Link href="#" className="block hover:text-white transition">Pricing</Link>
              </div>
            </div>
            <div>
              <div className="label text-white/30 text-[11px] mb-4">Resources</div>
              <div className="space-y-3 text-white/50">
                <Link href="#" className="block hover:text-white transition">Docs</Link>
                <Link href="#" className="block hover:text-white transition">Shortcuts</Link>
                <Link href="#" className="block hover:text-white transition">API</Link>
                <Link href="#" className="block hover:text-white transition">Support</Link>
              </div>
            </div>
            <div>
              <div className="label text-white/30 text-[11px] mb-4">Company</div>
              <div className="space-y-3 text-white/50">
                <Link href="#" className="block hover:text-white transition">Privacy</Link>
                <Link href="#" className="block hover:text-white transition">Terms</Link>
                <Link href="#" className="block hover:text-white transition">Security</Link>
                <Link href="#" className="block hover:text-white transition">Contact</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 mono text-[11px] text-white/30">
          <span>Private by default. No trackers. Premium experience.</span>
          <span className="flex items-center gap-2">Crafted with <span className="text-white font-bold">◆</span> for builders</span>
        </div>
      </div>
    </footer>
  );
}
