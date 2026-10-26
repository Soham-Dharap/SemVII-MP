"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/features/auth/components/user-button";
import Brand from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Workflow", href: "#workflow" },
];

export function Header() {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/80 px-4 shadow-sm backdrop-blur-xl">
        <Brand href="/" />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <UserButton />
          ) : (
            <Link href="/auth/sign-in">
              <Button variant="brand" size="sm">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
