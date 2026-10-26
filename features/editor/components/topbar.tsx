"use client";

import Link from "next/link";
import { ArrowLeft, Save, Play, Check, PanelLeft, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex h-14 shrink-0 items-center justify-between bg-[#0A0C12] border-b border-white/[0.08] px-3 sm:px-4 gap-2 min-w-0 overflow-hidden">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Desktop toggle */}
        <button
          onClick={onToggleExplorer}
          className="hidden lg:flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition shrink-0"
          title={showExplorer ? "Hide explorer" : "Show explorer"}
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        {/* Mobile back */}
        <Link href="/dashboard" className="flex lg:hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="hidden lg:block h-6 w-px bg-white/10 shrink-0" />
        {/* Title block */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="text-white text-[13px] font-bold tracking-tight leading-none truncate max-w-[140px] xs:max-w-[200px] sm:max-w-[320px] lg:max-w-[420px]">{title}</div>
          <div className="flex items-center gap-1.5 mt-1 min-w-0 overflow-hidden">
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#D6FF00] text-black px-2 py-0.5 text-[10px] font-black tracking-widest">{template}</span>
            <span className="hidden sm:inline mono text-[11px] text-white/40 truncate">• {saving ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Auto-save"}</span>
            {savedAt && !saving && <Check className="h-3 w-3 text-[#D6FF00] hidden sm:block shrink-0" />}
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <span className="hidden xl:flex items-center gap-1.5 mono text-[10px] text-white/40 mr-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
        </span>
        <Button variant="ghost" size="sm" onClick={onSave} disabled={saving} className="h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-white px-3 sm:px-4 gap-1.5 font-semibold text-[12px] shrink-0">
          <Save className="h-4 w-4" /><span className="hidden xs:inline">{saving ? "Saving" : "Save"}</span>
        </Button>
        <Button size="sm" onClick={onRun} className="h-9 rounded-full bg-[#6366F1] text-white hover:bg-[#5558E6] gap-1.5 px-3 sm:px-5 font-bold text-[12px] shadow-[0_4px_12px_rgba(99,102,241,0.3)] shrink-0">
          <Play className="h-4 w-4 fill-white/20" /><span className="hidden xs:inline">Run</span>
        </Button>
      </div>
    </div>
  );
}
