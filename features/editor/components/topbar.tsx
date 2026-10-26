"use client";

import Link from "next/link";
import { ArrowLeft, Save, Play, Check, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface TopbarProps {
  title: string;
  template: string;
  saving: boolean;
  savedAt: Date | null;
  onSave: () => void;
  onRun: () => void;
  showExplorer?: boolean;
  onToggleExplorer?: () => void;
}

export function Topbar({ title, template, saving, savedAt, onSave, onRun, showExplorer, onToggleExplorer }: TopbarProps) {
  return (
    <div className="flex h-14 min-w-0 shrink-0 items-center justify-between border-b border-border bg-card gap-2 px-3 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {onToggleExplorer && (
          <Button variant="ghost" size="icon-sm" onClick={onToggleExplorer} className="hidden md:flex h-8 w-8 rounded-xl shrink-0">
            {showExplorer ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </Button>
        )}
        <Link href="/dashboard" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card border border-border hover:bg-accent transition md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="hidden sm:block h-6 w-px bg-border shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-bold tracking-tight leading-none truncate max-w-[160px] sm:max-w-[360px]">{title}</div>
          <div className="flex items-center gap-1.5 mt-1 min-w-0">
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-black tracking-wide">{template}</span>
            <span className="hidden md:inline mono text-[11px] text-muted-foreground truncate">• {saving ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Auto-save"}</span>
            {savedAt && !saving && <Check className="h-3 w-3 text-primary hidden md:block shrink-0" />}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={onSave} disabled={saving} className="h-9 rounded-full px-3 sm:px-4 gap-1.5 font-semibold">
          <Save className="h-4 w-4" /><span className="hidden sm:inline">Save</span>
        </Button>
        <Button size="sm" onClick={onRun} className="h-9 rounded-full bg-primary text-primary-foreground hover:opacity-90 gap-1.5 px-3 sm:px-4 font-bold shadow-sm">
          <Play className="h-4 w-4" /><span className="hidden sm:inline">Run</span>
        </Button>
      </div>
    </div>
  );
}
