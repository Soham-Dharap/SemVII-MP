import Link from "next/link";
import Image from "next/image";
import UserButton from "@/features/auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex h-[60px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-[10px] bg-foreground flex items-center justify-center overflow-hidden">
              <Image src="/logo.svg" alt="CodePilot" width={20} height={20} className="h-[20px] w-[20px] invert dark:invert-0" />
            </div>
            <span className="mono text-[13px] font-semibold tracking-[-0.02em] text-foreground">
              CodePilot
            </span>
            <span className="hidden sm:inline-flex ml-1 px-2 py-0.5 rounded-full bg-secondary border border-border mono text-[10px] font-medium text-muted-foreground">
              Monaco • Live
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#write" className="px-3 py-1.5 rounded-full mono text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Write</a>
            <a href="#preview" className="px-3 py-1.5 rounded-full mono text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Preview</a>
            <a href="#ship" className="px-3 py-1.5 rounded-full mono text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Ship</a>
            <span className="mx-2 h-4 w-px bg-border" />
            <Link href="/dashboard" className="mono text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">Playgrounds</Link>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <ThemeToggle />
            <span className="hidden sm:inline-flex mono text-[10px] font-medium bg-secondary border border-border text-muted-foreground px-2 py-1 rounded-[8px]">⌘K</span>
            <Link href="/dashboard" className="inline-flex h-[36px] items-center bg-primary text-primary-foreground px-4 mono text-[12px] font-semibold rounded-full hover:opacity-90 transition-opacity">
              Open app
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
