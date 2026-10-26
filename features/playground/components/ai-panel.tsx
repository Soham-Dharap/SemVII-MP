"use client";

import { Bot, MessageSquareCode, Sparkles, WandSparkles } from "lucide-react";

const PLANNED_FEATURES = [
  "Explain and refactor any open file",
  "Generate code from a natural-language prompt",
  "Fix errors directly inside the editor",
  "Context-aware answers about your project",
];

const AiPanel = () => {
  return (
    <div className="editor-scroll flex min-h-0 flex-1 flex-col items-center justify-center gap-5 overflow-y-auto p-6 text-center">
      <div className="relative">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-iris to-iris-deep shadow-lg shadow-iris/30">
          <Bot className="size-7 text-white" />
        </div>
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border">
          <Sparkles className="size-3.5 text-iris" />
        </span>
      </div>

      <div className="space-y-1.5">
        <span className="inline-block rounded-full bg-iris-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-iris">
          Arriving in Version 2
        </span>
        <h3 className="text-lg font-semibold tracking-tight">AI Assistant</h3>
        <p className="mx-auto max-w-xs text-sm leading-6 text-muted-foreground">
          Your in-editor pair programmer is being fine-tuned and will arrive in
          the next major release.
        </p>
      </div>

      <ul className="w-full max-w-xs space-y-2.5 text-left">
        {PLANNED_FEATURES.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-foreground/75"
          >
            <WandSparkles className="mt-0.5 size-4 shrink-0 text-iris" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="w-full max-w-xs">
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/50 px-3.5 py-3 text-sm text-muted-foreground">
          <MessageSquareCode className="size-4" />
          <span>Ask Codepilot AI…</span>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
