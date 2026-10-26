"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-7 w-7" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/5 dark:border-white/5 hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-3.5 text-[#f5f5f7]" />
      ) : (
        <Moon className="size-3.5 text-[#1d1d1f]" />
      )}
    </button>
  );
}
