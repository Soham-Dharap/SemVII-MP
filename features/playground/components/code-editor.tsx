"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Code2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import type { ProjectFile } from "@/features/dashboard/type";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface CodeEditorProps {
  files: ProjectFile[];
  openTabIds: string[];
  activeFileId: string | null;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onChangeContent: (id: string, content: string) => void;
}

const EditorSurface = ({
  file,
  onChange,
}: {
  file: ProjectFile;
  onChange: (content: string) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lines = useHighlightedCode(file.content, file.language);

  const handleScroll = useCallback(() => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.style.transform = `translateY(-${scrollTop}px)`;
    }
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.currentTarget;
    const { selectionStart, selectionEnd, value } = target;
    const next = `${value.slice(0, selectionStart)}  ${value.slice(
      selectionEnd,
    )}`;
    onChange(next);
    requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = selectionStart + 2;
    });
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const sharedClasses =
    "m-0 whitespace-pre font-mono text-[13px] leading-6 p-4 pl-14";

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
      {/* Fixed gutter: never scrolls horizontally, tracks vertical scroll. */}
      <div
        ref={gutterRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 select-none border-r border-zinc-100 bg-white pt-4 will-change-transform"
      >
        {lines.map((_, index) => (
          <div
            key={index}
            className="pr-3 text-right text-[12px] leading-6 text-zinc-300"
          >
            {index + 1}
          </div>
        ))}
      </div>

      <pre
        ref={preRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-auto text-zinc-800",
          sharedClasses,
        )}
      >
        <code className="block min-w-full">
          {lines.map((line, index) => (
            <div key={index} className="min-h-6 whitespace-pre">
              {line}
            </div>
          ))}
        </code>
      </pre>

      <textarea
        ref={textareaRef}
        value={file.content}
        onChange={handleChange}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        aria-label={`Editing ${file.path}`}
        className={cn(
          "absolute inset-0 resize-none overflow-auto border-0 bg-transparent text-transparent caret-zinc-900 outline-none",
          sharedClasses,
        )}
      />
    </div>
  );
};

const CodeEditor = ({
  files,
  openTabIds,
  activeFileId,
  onSelectTab,
  onCloseTab,
  onChangeContent,
}: CodeEditorProps) => {
  const openFiles = useMemo(
    () =>
      openTabIds
        .map((id) => files.find((file) => file.id === id))
        .filter((file): file is ProjectFile => Boolean(file)),
    [openTabIds, files],
  );

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) ?? null,
    [files, activeFileId],
  );

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      <div className="flex h-11 shrink-0 items-center border-b border-zinc-100">
        {openFiles.length === 0 ? (
          <div className="px-4 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Editor
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex h-11 items-end">
              {openFiles.map((file) => {
                const isActive = file.id === activeFileId;
                return (
                  <div
                    key={file.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectTab(file.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") onSelectTab(file.id);
                    }}
                    className={cn(
                      "group flex h-9 min-w-36 max-w-52 cursor-pointer items-center gap-2 border-r border-zinc-100 px-3 text-sm transition-colors",
                      isActive
                        ? "border-b-2 border-b-blue-600 bg-white font-medium text-zinc-900"
                        : "bg-zinc-50/60 text-zinc-500 hover:bg-zinc-100",
                    )}
                  >
                    <Code2 className="size-3.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      aria-label={`Close ${file.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onCloseTab(file.id);
                      }}
                      className="ml-auto rounded p-0.5 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-200 hover:text-zinc-700 group-hover:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      {activeFile && !activeFile.isDirectory ? (
        <>
          <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4">
            <span className="truncate font-mono text-xs text-zinc-500">
              {activeFile.path}
            </span>
            <span className="ml-4 shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-500 ring-1 ring-zinc-200">
              {LANGUAGE_LABELS[activeFile.language] ?? activeFile.language}
            </span>
          </div>
          <EditorSurface
            key={activeFile.id}
            file={activeFile}
            onChange={(content) => onChangeContent(activeFile.id, content)}
          />
        </>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-white p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100">
            <Code2 className="size-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">
              No file open
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Pick a file from the explorer to start editing.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CodeEditor;
