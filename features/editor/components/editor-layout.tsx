"use client";

import { useState, useEffect, useCallback } from "react";
import { MonacoEditor, getMonacoLanguage } from "./monaco-editor";
import { FileExplorer, EditorFile } from "./file-explorer";
import { Preview } from "./preview";
import { Topbar } from "./topbar";
import { toast } from "sonner";
import { updateFileContent, createFile, deleteFile, renameFile } from "@/features/editor/actions";

interface EditorLayoutProps {
  playground: {
    id: string;
    title: string;
    template: string;
  };
  initialFiles: EditorFile[];
}

export function EditorLayout({ playground, initialFiles }: EditorLayoutProps) {
  const [files, setFiles] = useState<EditorFile[]>(initialFiles);
  const [activeId, setActiveId] = useState<string | null>(initialFiles[0]?.id || null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const activeFile = files.find(f => f.id === activeId) || null;

  // Auto-save debounce
  useEffect(() => {
    if (!activeFile) return;
    const handler = setTimeout(async () => {
      if (activeFile.content !== null) {
        setSaving(true);
        await updateFileContent(activeFile.id, activeFile.content);
        setSaving(false);
        setSavedAt(new Date());
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [files, activeId]);

  const handleFileChange = (value: string) => {
    if (!activeId) return;
    setFiles(prev => prev.map(f => f.id === activeId ? { ...f, content: value } : f));
  };

  const handleCreate = async (name: string) => {
    const ext = name.split(".").pop() || "ts";
    const langMap: Record<string, string> = { ts: "typescript", tsx: "typescript", js: "javascript", json: "json", css: "css" };
    const newFile = await createFile(playground.id, name, "// New file");
    if (newFile) {
      const nf: EditorFile = { id: newFile.id, name: newFile.name, content: newFile.content || "" };
      setFiles(prev => [...prev, nf]);
      setActiveId(nf.id);
      toast.success("File created");
    } else {
      // Fallback local-only (if DB not ready)
      const id = Math.random().toString(36).slice(2);
      setFiles(prev => [...prev, { id, name, content: "" }]);
      setActiveId(id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteFile(id, playground.id);
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeId === id) setActiveId(files.find(f => f.id !== id)?.id || null);
    toast.success("File deleted");
  };

  const handleRename = async (id: string, name: string) => {
    await renameFile(id, name, playground.id);
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name } : f));
  };

  const handleSave = async () => {
    if (!activeFile) return;
    setSaving(true);
    await updateFileContent(activeFile.id, activeFile.content || "");
    setSaving(false);
    setSavedAt(new Date());
    toast.success("Saved");
  };

  const handleRun = () => {
    toast.info("Preview refreshed");
    // Preview component listens to files change
  };

  return (
    <div className="flex h-screen flex-col bg-[#fcfcfc] dark:bg-[#0a0a0a]">
      <Topbar
        title={playground.title}
        template={playground.template}
        saving={saving}
        savedAt={savedAt}
        onSave={handleSave}
        onRun={handleRun}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1">
          <div className="w-[260px] shrink-0 border-r border-black/10 dark:border-white/10 bg-[#fcfcfc] dark:bg-[#111]">
            <FileExplorer
              files={files}
              activeFileId={activeId}
              onSelect={setActiveId}
              onCreate={handleCreate}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          </div>

          <div className="flex flex-1 min-w-0">
            <div className="flex flex-1 flex-col min-w-0 border-r border-black/10 dark:border-white/10">
              {/* Tab bar */}
              <div className="flex h-8 items-center gap-0 border-b border-black/10 dark:border-white/10 bg-[#f5f5f5] dark:bg-[#111] px-2 overflow-x-auto">
                {files.slice(0, 6).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveId(f.id)}
                    className={`flex h-6 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium whitespace-nowrap border ${
                      activeId === f.id
                        ? "bg-white dark:bg-[#1a1a1a] border-black/10 dark:border-white/10 text-[#111] dark:text-white shadow-sm"
                        : "border-transparent text-[#888] hover:text-[#111] dark:hover:text-white"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>

              <div className="flex-1 bg-white dark:bg-[#0a0a0a]">
                {activeFile ? (
                  <MonacoEditor
                    value={activeFile.content || ""}
                    language={getMonacoLanguage(activeFile.name, "typescript")}
                    onChange={handleFileChange}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[13px] text-[#999]">Select a file to edit</div>
                )}
              </div>

              <div className="h-5 flex items-center justify-between border-t border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#111] px-3 text-[11px] text-[#888]">
                <span>{activeFile?.name || "No file"} • {activeFile ? getMonacoLanguage(activeFile.name, "typescript") : ""}</span>
                <span>Ln 1, Col 1 • Spaces: 2</span>
              </div>
            </div>
          </div>

          <div className="w-[380px] shrink-0 bg-white dark:bg-[#0a0a0a] border-l border-black/10 dark:border-white/10">
            <Preview files={files.map(f => ({ name: f.name, content: f.content }))} template={playground.template} />
          </div>
        </div>
      </div>
    </div>
  );
}
