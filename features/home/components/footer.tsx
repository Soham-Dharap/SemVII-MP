import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#0F0E0C] bg-[#FFFEFB]">
      {/* Statement — large serif, left-aligned, not centered 3-col */}
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <p className="display text-[30px] sm:text-[36px] text-[#0F0E0C] leading-[0.9] max-w-[560px]">
              Built by people who missed the local.
            </p>
            <p className="mt-3 mono text-[11px] leading-5 text-[#6B6560] max-w-[520px]">
              No synthetic cloud FS. No “AI-powered” banner. Just Monaco, a real file tree, and a preview that updates as you type. Copy your Vite config — it runs.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-6 mono text-[11px] leading-4">
              <div>
                <div className="tracking-[0.08em] uppercase text-[#6B6560] mb-2">Product</div>
                <div className="space-y-1.5 text-[#0F0E0C]">
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Editor</Link>
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Templates</Link>
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Keyboard</Link>
                </div>
              </div>
              <div>
                <div className="tracking-[0.08em] uppercase text-[#6B6560] mb-2">Manual</div>
                <div className="space-y-1.5 text-[#0F0E0C]">
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Docs</Link>
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">API</Link>
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Changelog</Link>
                </div>
              </div>
              <div>
                <div className="tracking-[0.08em] uppercase text-[#6B6560] mb-2">Legal</div>
                <div className="space-y-1.5 text-[#0F0E0C]">
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Privacy</Link>
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Terms</Link>
                  <Link href="#" className="block hover:underline decoration-[#E8E0CC] underline-offset-4">Security</Link>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-[#E8E0CC] pt-4 mono text-[10px] text-[#6B6560]">
              <span>© 2026 CodePilot, Inc. — Private by default.</span>
              <span className="hidden sm:inline">Set in Instrument Serif & JetBrains Mono.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
