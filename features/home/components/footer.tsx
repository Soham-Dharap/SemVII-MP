import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border text-foreground">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-[8px] bg-foreground flex items-center justify-center">
                <Image src="/logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] invert dark:invert-0" />
              </div>
              <span className="mono text-[12px] font-semibold tracking-[-0.02em]">CodePilot</span>
              <span className="mono text-[10px] text-muted-foreground">© 2026</span>
            </div>
            <p className="mt-3 display text-[22px] leading-none max-w-[380px]">A browser editor that behaves like your local one.</p>
            <p className="mono text-[11px] leading-5 text-muted-foreground mt-3 max-w-[400px]">Monaco, live preview, nested file system. Writes to git, no synthetic cloud FS. Paste your Vite config and it runs.</p>
            <div className="mt-4 flex gap-2 mono text-[10px]">
              <span className="px-2 py-1 rounded-full bg-secondary border border-border text-muted-foreground">White + Blue light</span>
              <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground font-semibold">Black + Neon dark</span>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-6 mono text-[11px]">
            <div>
              <div className="font-semibold mb-3">Product</div>
              <div className="space-y-2 text-muted-foreground">
                <Link href="#" className="block hover:text-foreground">Editor</Link>
                <Link href="#" className="block hover:text-foreground">Templates</Link>
                <Link href="#" className="block hover:text-foreground">Changelog</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3">Manual</div>
              <div className="space-y-2 text-muted-foreground">
                <Link href="#" className="block hover:text-foreground">Docs</Link>
                <Link href="#" className="block hover:text-foreground">Shortcuts</Link>
                <Link href="#" className="block hover:text-foreground">API</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3">Company</div>
              <div className="space-y-2 text-muted-foreground">
                <Link href="#" className="block hover:text-foreground">Privacy</Link>
                <Link href="#" className="block hover:text-foreground">Terms</Link>
                <Link href="#" className="block hover:text-foreground">Security</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 mono text-[10px] text-muted-foreground">
          <span>Private by default. No trackers. Consistent UI in both themes.</span>
          <span className="flex items-center gap-2">Built with <span className="text-foreground font-semibold">{"{<>};"}</span> • Use toggle to switch themes</span>
        </div>
      </div>
    </footer>
  );
}
