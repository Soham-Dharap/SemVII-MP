"use client";

import { MonitorPlay, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectFile, TemplateName } from "@/features/dashboard/type";
import PreviewPane from "./preview-pane";
import AiPanel from "./ai-panel";

export type RightTab = "preview" | "ai";

const InspectorPanel = ({
  files,
  rightTab,
  onRightTabChange,
  template,
}: {
  files: ProjectFile[];
  rightTab: RightTab;
  onRightTabChange: (tab: RightTab) => void;
  template: TemplateName;
}) => {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-zinc-100 px-3">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
          <button
            type="button"
            onClick={() => onRightTabChange("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
              rightTab === "preview"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            <MonitorPlay className="size-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => onRightTabChange("ai")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
              rightTab === "ai"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            <Sparkles className="size-3.5" />
            AI
          </button>
        </div>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
          v1
        </span>
      </div>

      {rightTab === "preview" ? (
        <PreviewPane files={files} template={template} />
      ) : (
        <AiPanel />
      )}
    </section>
  );
};

export default InspectorPanel;
