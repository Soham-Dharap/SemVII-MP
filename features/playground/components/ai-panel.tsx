"use client";

import { ArrowUp, Sparkles } from "lucide-react";

const PLANNED_FEATURES = [
  "Explain and refactor any open file",
  "Generate code from a natural-language prompt",
  "Fix errors directly inside the editor",
  "Context-aware answers about your project",
];

const AiPanel = () => {
  return (
    <div className="editor-scroll flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Assistant
          </span>
          <span className="rounded-full border border-dashed border-border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            v2 · soon
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
            <Sparkles className="size-4.5 text-iris" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              In-editor pair programming
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              The assistant is being built against this exact workspace. It
              will read your open files and act inside the editor instead of a
              generic chat window.
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-border" />

        <ul className="space-y-0.5">
          {PLANNED_FEATURES.map((feature, index) => (
            <li
              key={feature}
              className="flex items-baseline gap-3 rounded-lg px-2 py-2.5 text-sm text-foreground/80"
            >
              <span className="font-mono text-[11px] text-muted-foreground/60">
                0{index + 1}
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3.5 py-3 text-sm text-muted-foreground">
            <span className="flex-1 truncate">Ask Codepilot AI…</span>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-card">
              <ArrowUp className="size-3.5" />
            </span>
          </div>
          <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
            Arriving in Version 2
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
