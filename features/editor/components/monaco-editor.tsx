"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

function getMonacoLanguage(filename: string, fallback: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    css: "css",
    html: "html",
    vue: "html",
  };
  return (ext && map[ext]) || fallback;
}

export function MonacoEditor({ value, language, onChange }: MonacoEditorProps) {
  const { theme } = useTheme();

  const handleMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
    // Ensure layout on container resize
    const ro = new ResizeObserver(() => editor.layout());
    const dom = editor.getDomNode();
    if (dom) ro.observe(dom);
  };

  return (
    <div className="h-full w-full min-h-0 min-w-0 overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v || "")}
        onMount={handleMount}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          fontSize: 13,
          fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
          lineHeight: 20,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          wordWrap: "on",
          wrappingStrategy: "advanced",
          wordWrapColumn: 120,
          tabSize: 2,
          renderLineHighlight: "none",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true },
          automaticLayout: true,
          fixedOverflowWidgets: true,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
        loading={
          <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
            Loading editor…
          </div>
        }
      />
    </div>
  );
}

export { getMonacoLanguage };
