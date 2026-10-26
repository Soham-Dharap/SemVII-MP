import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#1c1c1e] border-t border-black/[0.04]">
      <div className="mx-auto max-w-[980px] px-6 py-10">
        {/* Top links like Apple footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[12px] leading-5">
          <div>
            <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3 tracking-[-0.01em]">Product</h4>
            <ul className="space-y-2 text-[#515154] dark:text-[#a1a1a6]">
              <li><Link href="#" className="hover:underline hover:text-[#1d1d1f]">Overview</Link></li>
              <li><Link href="#" className="hover:underline hover:text-[#1d1d1f]">Templates</Link></li>
              <li><Link href="#" className="hover:underline hover:text-[#1d1d1f]">AI Assistant</Link></li>
              <li><Link href="#" className="hover:underline hover:text-[#1d1d1f]">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Developers</h4>
            <ul className="space-y-2 text-[#515154] dark:text-[#a1a1a6]">
              <li><Link href="#" className="hover:underline">Documentation</Link></li>
              <li><Link href="#" className="hover:underline">API Reference</Link></li>
              <li><Link href="#" className="hover:underline">GitHub</Link></li>
              <li><Link href="#" className="hover:underline">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-[#515154] dark:text-[#a1a1a6]">
              <li><Link href="#" className="hover:underline">Support</Link></li>
              <li><Link href="#" className="hover:underline">Privacy</Link></li>
              <li><Link href="#" className="hover:underline">Terms</Link></li>
              <li><Link href="#" className="hover:underline">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">CodePilot</h4>
            <p className="text-[#6e6e73] dark:text-[#86868b] text-[12px] leading-5">
              Crafted with care in California.<br />
              Built for developers who care about details.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#1d1d1f] dark:bg-white flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white dark:text-black">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-[#1d1d1f] dark:text-white">v1.0 • Stable</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-black/5 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[12px] text-[#6e6e73] dark:text-[#86868b]">
            Copyright © 2026 CodePilot Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[12px] text-[#515154] dark:text-[#a1a1a6]">
            <Link href="#" className="hover:text-[#1d1d1f] dark:hover:text-white">Privacy Policy</Link>
            <span className="text-black/10 dark:text-white/20">|</span>
            <Link href="#" className="hover:text-[#1d1d1f] dark:hover:text-white">Terms of Use</Link>
            <span className="text-black/10 dark:text-white/20">|</span>
            <Link href="#" className="hover:text-[#1d1d1f] dark:hover:text-white">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
