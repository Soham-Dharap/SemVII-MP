"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8 rounded-full border border-border bg-card" />;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border hover:bg-accent transition-colors"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light (white + blue)" : "Switch to dark (black + neon)"}
    >
      {isDark ? <Sun className="size-4 text-foreground" /> : <Moon className="size-4 text-foreground" />}
    </button>
  );
}
