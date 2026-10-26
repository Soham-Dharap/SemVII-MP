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
    <div className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="h-4 w-px bg-border" />
        <div>
          <div className="text-[13px] font-semibold tracking-[-0.01em] leading-none">{title}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded bg-secondary border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">{template}</span>
            <span className="hidden sm:inline">• {saving ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Unsaved"}</span>
            {savedAt && !saving && <Check className="h-3 w-3 text-primary" />}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={onSave} disabled={saving} className="h-8 rounded-full">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save
        </Button>
        <Button size="sm" onClick={onRun} className="h-8 rounded-full bg-primary text-primary-foreground hover:opacity-90">
          <Play className="h-3.5 w-3.5 mr-1.5" />
          Run
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-full">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
