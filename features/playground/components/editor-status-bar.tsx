"use client";

import { Check, Loader2, TriangleAlert } from "lucide-react";
import type { ProjectFile } from "@/features/dashboard/type";

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  jsx: "JSX",
  typescript: "TypeScript",
  tsx: "TSX",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  markdown: "Markdown",
  python: "Python",
  bash: "Shell",
  yaml: "YAML",
  sql: "SQL",
  plaintext: "Plain Text",
};

const EditorStatusBar = ({
  file,
  saveStatus,
  isDirty,
}: {
  file: ProjectFile | null;
  saveStatus: "idle" | "saving" | "saved" | "error";
  isDirty: boolean;
}) => {
  const lineCount = file ? file.content.split("\n").length : 0;
  const charCount = file ? file.content.length : 0;

  return (
    <div className="flex h-8 shrink-0 items-center justify-between rounded-2xl border border-border bg-card px-4 text-xs text-muted-foreground shadow-sm">
      <div className="flex items-center gap-4">
        <span className="font-medium">
          {file
            ? LANGUAGE_LABELS[file.language] ?? file.language
            : "No file"}
        </span>
        {file && (
          <span className="hidden sm:inline">
            {lineCount} {lineCount === 1 ? "line" : "lines"} · {charCount} chars
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 font-medium">
        {saveStatus === "error" ? (
          <>
            <TriangleAlert className="size-3.5 text-red-500" />
            <span className="text-red-500">Save failed</span>
          </>
        ) : saveStatus === "saving" || isDirty ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Saving…</span>
          </>
        ) : (
          <>
            <Check className="size-3.5 text-emerald-500" />
            <span>Saved</span>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorStatusBar;
