import Link from "next/link";
import Image from "next/image";
import UserButton from "@/features/auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-2xl border-b border-border/40">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="flex h-[56px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-foreground flex items-center justify-center shadow-sm shrink-0">
              <Image src="/logo.svg" alt="" width={16} height={16} className="h-4 w-4 invert dark:invert-0" />
            </div>
            <div className="flex flex-col leading-none hidden sm:flex">
              <span className="text-[14px] font-bold tracking-tight">CodePilot</span>
              <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Playground</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-muted/50 rounded-full p-1 border border-border/50">
            <Link href="/#features" className="px-3.5 py-1.5 rounded-full text-[12px] font-medium hover:bg-card hover:shadow-sm transition">Features</Link>
            <Link href="/#templates" className="px-3.5 py-1.5 rounded-full text-[12px] font-medium hover:bg-card hover:shadow-sm transition">Templates</Link>
            <Link href="/dashboard" className="px-3.5 py-1.5 rounded-full text-[12px] font-medium hover:bg-card hover:shadow-sm transition">Workspaces</Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />
            <Link href="/dashboard" className="hidden sm:inline-flex h-9 items-center bg-foreground text-background px-5 rounded-full text-[12px] font-semibold hover:opacity-90 transition shadow-sm">
              Open App
            </Link>
            <Link href="/dashboard" className="sm:hidden h-8 w-8 flex items-center justify-center bg-foreground text-background rounded-full text-[12px]">↗</Link>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
