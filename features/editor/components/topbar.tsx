"use client";

import Link from "next/link";
import { ArrowLeft, Save, Play, MoreHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface TopbarProps {
  title: string;
  template: string;
  saving: boolean;
  savedAt: Date | null;
  onSave: () => void;
  onRun: () => void;
}

export function Topbar({ title, template, saving, savedAt, onSave, onRun }: TopbarProps) {
  return (
    <div className="flex h-12 min-w-0 shrink-0 items-center justify-between border-b border-border bg-card gap-2 px-2 sm:px-4 overflow-hidden">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        <Link href="/dashboard" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-card hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="hidden sm:block h-4 w-px bg-border shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold tracking-[-0.01em] leading-none truncate max-w-[160px] sm:max-w-[320px]">{title}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5 min-w-0">
            <span className="inline-flex shrink-0 items-center rounded bg-secondary border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">{template}</span>
            <span className="hidden sm:inline truncate">• {saving ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Unsaved"}</span>
            {savedAt && !saving && <Check className="h-3 w-3 text-primary shrink-0 hidden sm:block" />}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={onSave} disabled={saving} className="h-8 rounded-full px-2 sm:px-3 gap-1 sm:gap-1.5">
          <Save className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button size="sm" onClick={onRun} className="h-8 rounded-full bg-primary text-primary-foreground hover:opacity-90 gap-1 sm:gap-1.5 px-2 sm:px-3">
          <Play className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Run</span>
        </Button>
        <Button variant="ghost" size="icon-sm" className="hidden sm:flex h-8 w-8 rounded-full shrink-0">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
