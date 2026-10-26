import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-foreground flex items-center justify-center shadow-sm">
                <Image src="/logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] invert dark:invert-0" />
              </div>
              <span className="text-[15px] font-bold tracking-tight">CodePilot</span>
              <span className="mono text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded-full">© 2026</span>
            </div>
            <p className="mt-4 display text-[24px] leading-[0.95] max-w-[380px]">Own your code.<br/>Shape your future.</p>
            <p className="text-[13px] leading-5 text-muted-foreground mt-3 max-w-[400px]">Premium playground with Monaco, live preview, and real file system. No Docker. No setup. Just code.</p>
            <div className="mt-5 flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-secondary border border-border text-[11px] font-medium">SOC 2 Certified</span>
              <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">● Live</span>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-6 text-[13px]">
            <div>
              <div className="label text-[11px] mb-4">Product</div>
              <div className="space-y-3 text-muted-foreground">
                <Link href="#" className="block hover:text-foreground transition">Editor</Link>
                <Link href="#" className="block hover:text-foreground transition">Templates</Link>
                <Link href="#" className="block hover:text-foreground transition">Changelog</Link>
                <Link href="#" className="block hover:text-foreground transition">Pricing</Link>
              </div>
            </div>
            <div>
              <div className="label text-[11px] mb-4">Resources</div>
              <div className="space-y-3 text-muted-foreground">
                <Link href="#" className="block hover:text-foreground transition">Docs</Link>
                <Link href="#" className="block hover:text-foreground transition">Shortcuts</Link>
                <Link href="#" className="block hover:text-foreground transition">API</Link>
                <Link href="#" className="block hover:text-foreground transition">Support</Link>
              </div>
            </div>
            <div>
              <div className="label text-[11px] mb-4">Company</div>
              <div className="space-y-3 text-muted-foreground">
                <Link href="#" className="block hover:text-foreground transition">Privacy</Link>
                <Link href="#" className="block hover:text-foreground transition">Terms</Link>
                <Link href="#" className="block hover:text-foreground transition">Security</Link>
                <Link href="#" className="block hover:text-foreground transition">Contact</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 mono text-[11px] text-muted-foreground">
          <span>Private by default. No trackers. Premium experience.</span>
          <span className="flex items-center gap-2">Crafted with <span className="text-foreground font-bold">◆</span> for builders</span>
        </div>
      </div>
    </footer>
  );
}
