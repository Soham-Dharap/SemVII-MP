import Link from "next/link";
import { BrandMark } from "@/components/brand";

export function Footer() {

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BrandMark size={24} />
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            Codepilot
          </span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#features" className="transition-colors hover:text-zinc-900">
            Features
          </a>
          <a
            href="#templates"
            className="transition-colors hover:text-zinc-900"
          >
            Templates
          </a>
          <Link
            href="/auth/sign-in"
            className="transition-colors hover:text-zinc-900"
          >
            Sign in
          </Link>
        </nav>

        <p className="text-sm text-zinc-400">
          &copy; 2026 Codepilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
