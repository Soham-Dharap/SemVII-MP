"use client";

import Link from "next/link";
import { ArrowLeft, Save, Play, MoreHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex h-12 items-center justify-between border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] px-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex h-7 w-7 items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] hover:bg-black/[0.04] dark:hover:bg-white/10">
          <ArrowLeft className="h-4 w-4 text-[#111] dark:text-white" />
        </Link>
        <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
        <div>
          <div className="text-[13px] font-semibold tracking-[-0.01em] text-[#111] dark:text-white leading-none">{title}</div>
          <div className="text-[11px] text-[#888] mt-0.5 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded bg-[#f5f5f5] dark:bg-white/10 border border-black/5 dark:border-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#666] dark:text-[#aaa]">{template}</span>
            <span className="hidden sm:inline">• {saving ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Unsaved"}</span>
            {savedAt && !saving && <Check className="h-3 w-3 text-[#0a0]" />}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSave} disabled={saving} className="h-8 rounded-md border-black/10 dark:border-white/10">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save
        </Button>
        <Button size="sm" onClick={onRun} className="h-8 rounded-md bg-[#111] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-white/90">
          <Play className="h-3.5 w-3.5 mr-1.5" />
          Run
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-md">
          <MoreHorizontal className="h-4 w-4 text-[#888]" />
        </Button>
      </div>
    </div>
  );
}
