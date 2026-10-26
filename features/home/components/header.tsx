import Link from "next/link";
import Image from "next/image";
import UserButton from "@/features/auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto max-w-[1160px] px-6">
        <div className="flex h-[48px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[8px] bg-foreground flex items-center justify-center">
              <Image src="/logo.svg" alt="" width={16} height={16} className="h-4 w-4 invert dark:invert-0" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight">CodePilot</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard" className="hidden sm:inline-flex h-8 items-center bg-primary text-primary-foreground px-4 rounded-full text-[12px] font-medium hover:opacity-90">
              Open app
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
