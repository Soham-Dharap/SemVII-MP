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
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/70 px-3">
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => onRightTabChange("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
              rightTab === "preview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MonitorPlay className="size-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => onRightTabChange("ai")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
              rightTab === "ai"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="size-3.5" />
            AI
          </button>
        </div>
        <span className="rounded-full bg-iris-soft px-2.5 py-1 text-[11px] font-semibold text-iris">
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
