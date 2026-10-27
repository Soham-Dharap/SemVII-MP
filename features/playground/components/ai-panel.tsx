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
    <div className="editor-scroll relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      {/* Ambient iris glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--iris)_14%,transparent),transparent_70%)]"
      />

      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-iris-soft text-iris dark:bg-iris/15">
          <Sparkles className="size-5" />
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-iris">
            Codepilot AI
          </p>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">
            Coming
            <br />
            <span className="font-display italic font-normal text-muted-foreground">
              soon in v2
            </span>
          </h2>
          <p className="mx-auto max-w-xs text-sm leading-6 text-muted-foreground">
            An assistant built against this exact workspace — it will read
            your open files and act inside the editor, not a generic chat
            window.
          </p>
        </div>

        <ul className="w-full max-w-xs space-y-2.5 text-left">
          {PLANNED_FEATURES.map((feature, index) => (
            <li
              key={feature}
              className="flex animate-fade-up items-baseline gap-3 rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5 text-[13px] text-foreground/80"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="font-mono text-[10px] font-semibold text-iris/70">
                0{index + 1}
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto w-full max-w-xs pt-4">
          <div className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-3.5 py-3 text-sm text-muted-foreground/70">
            <span className="flex-1 truncate text-left">
              Ask Codepilot AI…
            </span>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-card">
              <ArrowUp className="size-3.5" />
            </span>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
            Arriving in Version 2
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
