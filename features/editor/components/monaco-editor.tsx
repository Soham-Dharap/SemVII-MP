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

  const handleMount: OnMount = (editor) => {
    // Smooth resize — observe the wrapper, not the editor dom (which is already managed by monaco)
    const container = editor.getDomNode()?.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      try { editor.layout(); } catch {}
    });
    ro.observe(container);
    // Also observe window for panel resizes
    const onWin = () => { try { editor.layout(); } catch {} };
    window.addEventListener("resize", onWin);
    editor.onDidDispose(() => {
      ro.disconnect();
      window.removeEventListener("resize", onWin);
    });
  };

  return (
    <div className="h-full w-full min-h-0 min-w-0 overflow-hidden bg-[#0B0F1A] rounded-none">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
          lineHeight: 20,
          letterSpacing: -0.1,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 14, bottom: 14 },
          wordWrap: "on",
          wrappingStrategy: "advanced",
          wrappingIndent: "indent",
          wordWrapColumn: 100,
          tabSize: 2,
          renderLineHighlight: "none",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: false },
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
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: true,
          suggest: { preview: true },
          quickSuggestions: true,
        }}
        loading={
          <div className="flex h-full items-center justify-center bg-[#0B0F1A] text-[12px] text-white/40 mono gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-white/20 border-t-[#6366F1] animate-spin" /> Loading editor…
          </div>
        }
      />
    </div>
  );
}

export { getMonacoLanguage };
