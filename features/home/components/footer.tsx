import { BrandMark } from "@/components/brand";

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BrandMark size={24} />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Codepilot
          </span>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground/70">
          &copy; 2026 Codepilot · Browser-native editor
        </p>
      </div>
    </footer>
  );
}
