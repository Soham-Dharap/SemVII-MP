import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-[#232326] text-[#FAFAF8]">
      <div className="mx-auto max-w-[1240px] px-6 py-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="" width={24} height={24} className="h-6 w-6 rounded-[7px] bg-white p-0.5" />
              <span className="mono text-[12px] font-semibold tracking-[-0.02em]">CodePilot</span>
              <span className="mono text-[10px] text-[#8A8A90]">© 2026</span>
            </div>
            <p className="mt-3 display text-[22px] leading-none max-w-[380px]">A browser editor that behaves like your local one.</p>
            <p className="mono text-[11px] leading-5 text-[#8A8A90] mt-3 max-w-[400px]">Monaco, live preview, nested file system. Writes to git, no synthetic cloud FS. Paste your Vite config and it runs.</p>
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-6 mono text-[11px]">
            <div>
              <div className="font-semibold text-white mb-3">Product</div>
              <div className="space-y-2 text-[#8A8A90]">
                <Link href="#" className="block hover:text-white">Editor</Link>
                <Link href="#" className="block hover:text-white">Templates</Link>
                <Link href="#" className="block hover:text-white">Changelog</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Manual</div>
              <div className="space-y-2 text-[#8A8A90]">
                <Link href="#" className="block hover:text-white">Docs</Link>
                <Link href="#" className="block hover:text-white">Shortcuts</Link>
                <Link href="#" className="block hover:text-white">API</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Company</div>
              <div className="space-y-2 text-[#8A8A90]">
                <Link href="#" className="block hover:text-white">Privacy</Link>
                <Link href="#" className="block hover:text-white">Terms</Link>
                <Link href="#" className="block hover:text-white">Security</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#232326] pt-4 mono text-[10px] text-[#8A8A90]">
          <span>Private by default. No trackers.</span>
          <span className="flex items-center gap-2">Built with <span className="text-white">{"{<>};"}</span> • Monaco 0.52 • React 19</span>
        </div>
      </div>
    </footer>
  );
}
