"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/features/auth/components/user-button";
import Brand from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const NAV_LINKS = [
  { label: "Templates", href: "#templates" },
  { label: "Workflow", href: "#workflow" },
];

export function Header() {
  const user = useCurrentUser();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand href="/" />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
              <Button variant="brand" size="sm" className="rounded-full px-4">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
