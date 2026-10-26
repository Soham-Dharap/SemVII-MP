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
    // Professional minimal keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save is handled outside via onChange debounce
    });
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v || "")}
        onMount={handleMount}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          fontSize: 13,
          fontFamily: "Geist Mono, SF Mono, Menlo, monospace",
          lineHeight: 20,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          wordWrap: "on",
          tabSize: 2,
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true },
        }}
        loading={
          <div className="flex h-full items-center justify-center text-[13px] text-[#888]">
            Loading editor…
          </div>
        }
      />
    </div>
  );
}

export { getMonacoLanguage };
