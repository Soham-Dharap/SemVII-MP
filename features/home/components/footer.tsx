import Link from "next/link";
import { BrandMark } from "@/components/brand";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BrandMark size={26} />
          <span className="text-[15px] font-semibold tracking-tight">
            Codepilot
          </span>
        </div>

        <nav className="flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a
            href="#templates"
            className="transition-colors hover:text-foreground"
          >
            Templates
          </a>
          <Link
            href="/auth/sign-in"
            className="transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground/70">
          &copy; 2026 Codepilot
        </p>
      </div>
    </footer>
  );
}
