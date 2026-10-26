import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="mx-auto max-w-[1120px] px-6 py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          <div className="max-w-[320px]">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#111] dark:bg-white text-white dark:text-black flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="text-[14px] font-semibold tracking-[-0.015em] text-[#111] dark:text-white">CodePilot</span>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-[#666] dark:text-[#888]">
              A fast, minimal code workspace for professional teams. No telemetry, no clutter.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-10 text-[13px]">
            <div>
              <h4 className="font-medium text-[#111] dark:text-white mb-3">Product</h4>
              <ul className="space-y-2 text-[#666] dark:text-[#999]">
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Editor</Link></li>
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Templates</Link></li>
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#111] dark:text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-[#666] dark:text-[#999]">
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">API</Link></li>
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#111] dark:text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-[#666] dark:text-[#999]">
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-[#111] dark:hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-[12px] text-[#888]">
            © 2026 CodePilot, Inc.
          </p>
          <p className="text-[12px] text-[#888]">
            Built for developers who value clarity.
          </p>
        </div>
      </div>
    </footer>
  );
}
