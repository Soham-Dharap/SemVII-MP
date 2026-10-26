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
    <div className="relative min-h-0 flex-1 overflow-hidden bg-card">
      <div
        ref={gutterRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 select-none border-r border-border/70 bg-card pt-4 will-change-transform"
      >
        {lines.map((_, index) => (
          <div
            key={index}
            className="pr-3 text-right text-[12px] leading-6 text-muted-foreground/40"
          >
            {index + 1}
          </div>
        ))}
      </div>

      <pre
        ref={preRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-auto text-foreground",
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
          "absolute inset-0 resize-none overflow-auto border-0 bg-transparent text-transparent caret-iris outline-none",
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
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Tab strip */}
      <div className="flex h-12 shrink-0 items-center border-b border-border/70 bg-muted/40">
        {openFiles.length === 0 ? (
          <span className="px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Editor
          </span>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex h-12 items-end">
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
                      "group relative flex h-10 min-w-36 max-w-52 cursor-pointer items-center gap-2 border-r border-border/60 px-3.5 text-sm transition-colors",
                      isActive
                        ? "bg-card font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/70",
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-iris" />
                    )}
                    <Code2
                      className={cn(
                        "size-3.5 shrink-0",
                        isActive ? "text-iris" : "text-muted-foreground",
                      )}
                    />
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      aria-label={`Close ${file.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onCloseTab(file.id);
                      }}
                      className="ml-auto rounded-md p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
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

      {/* Breadcrumb */}
      {activeFile && !activeFile.isDirectory && (
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-border/70 px-4">
          <span className="truncate font-mono text-xs text-muted-foreground">
            {activeFile.path.split("/").map((part, i, arr) => (
              <span key={i}>
                {i > 0 && <span className="mx-1.5 text-border">/</span>}
                <span className={i === arr.length - 1 ? "text-foreground/80" : ""}>
                  {part}
                </span>
              </span>
            ))}
          </span>
          <span className="ml-4 shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {LANGUAGE_LABELS[activeFile.language] ?? activeFile.language}
          </span>
        </div>
      )}

      {activeFile && !activeFile.isDirectory ? (
        <EditorSurface
          key={activeFile.id}
          file={activeFile}
          onChange={(content) => onChangeContent(activeFile.id, content)}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <Code2 className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">No file open</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a file from the explorer to start editing.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CodeEditor;
