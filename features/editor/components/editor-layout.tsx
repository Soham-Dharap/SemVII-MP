"use client";

import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { MonacoEditor, getMonacoLanguage } from "./monaco-editor";
import { FileExplorer, EditorFile } from "./file-explorer";
import { Preview } from "./preview";
import { Topbar } from "./topbar";
import { toast } from "sonner";
import { updateFileContent, createFile, deleteFile, renameFile } from "@/features/editor/actions";
import { Button } from "@/components/ui/button";

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
  const [mobileTab, setMobileTab] = useState<"code" | "preview">("code");
  const [showMobileExplorer, setShowMobileExplorer] = useState(false);

  const activeFile = files.find(f => f.id === activeId) || null;

  useEffect(() => {
    if (!activeFile) return;
    const handler = setTimeout(async () => {
      if (activeFile.content !== null) {
        setSaving(true);
        try {
          await updateFileContent(activeFile.id, activeFile.content);
          setSavedAt(new Date());
        } catch {}
        setSaving(false);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [activeFile?.content, activeFile?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (activeFile) {
          setSaving(true);
          updateFileContent(activeFile.id, activeFile.content || "").then(() => {
            setSaving(false);
            setSavedAt(new Date());
            toast.success("Saved");
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeFile]);

  const handleFileChange = (value: string) => {
    if (!activeId) return;
    setFiles(prev => prev.map(f => f.id === activeId ? { ...f, content: value } : f));
  };

  const handleCreate = async (name: string) => {
    const newFile = await createFile(playground.id, name, name.endsWith(".css") ? "/* New file */" : "// New file");
    if (newFile) {
      const nf: EditorFile = { id: newFile.id, name: newFile.name, content: newFile.content || "" };
      setFiles(prev => [...prev, nf]);
      setActiveId(nf.id);
      toast.success(`Created ${name}`);
    } else {
      const id = Math.random().toString(36).slice(2);
      setFiles(prev => [...prev, { id, name, content: "" }]);
      setActiveId(id);
      toast.success(`Created ${name} (local)`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await deleteFile(id, playground.id);
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeId === id) setActiveId(files.find(f => f.id !== id)?.id || null);
    toast.success("File deleted");
  };

  const handleRename = async (id: string, name: string) => {
    await renameFile(id, name, playground.id);
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name } : f));
    toast.success("Renamed");
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
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <Topbar
        title={playground.title}
        template={playground.template}
        saving={saving}
        savedAt={savedAt}
        onSave={handleSave}
        onRun={handleRun}
      />

      {/* Mobile tab bar */}
      <div className="flex md:hidden items-center gap-1 p-1.5 border-b border-border bg-muted/30 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("code")}
          className={`flex-1 h-8 rounded-full text-[12px] font-medium transition-colors ${mobileTab === "code" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Code
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 h-8 rounded-full text-[12px] font-medium transition-colors ${mobileTab === "preview" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Preview
        </button>
        <Button variant="outline" size="sm" onClick={() => setShowMobileExplorer(v => !v)} className="h-8 rounded-full ml-1 text-[12px] shrink-0">
          {showMobileExplorer ? "Hide files" : "Files"}
        </Button>
      </div>

      {/* Desktop: resizable 3 panels */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          <ResizablePanel defaultSize={22} minSize={15} maxSize={32} className="bg-card">
            <FileExplorer
              files={files}
              activeFileId={activeId}
              onSelect={setActiveId}
              onCreate={handleCreate}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border w-px" />

          <ResizablePanel defaultSize={48} minSize={30} className="flex flex-col min-w-0">
            <div className="flex h-8 items-center gap-0 border-b border-border bg-muted/50 px-2 overflow-x-auto shrink-0">
              {files.filter(f => !f.name.endsWith("/.keep")).slice(0, 8).map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveId(f.id)}
                  className={`flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium whitespace-nowrap border shrink-0 transition-colors cursor-pointer ${activeId === f.id ? "bg-foreground text-background border-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {f.name.split("/").pop()}
                </button>
              ))}
            </div>

            <div className="flex-1 bg-background min-h-0">
              {activeFile ? (
                <MonacoEditor
                  value={activeFile.content || ""}
                  language={getMonacoLanguage(activeFile.name, "typescript")}
                  onChange={handleFileChange}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center p-8">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                    <span className="text-[16px]">📄</span>
                  </div>
                  <div className="text-[13px] font-medium">No file selected</div>
                  <div className="text-[12px] text-muted-foreground mt-1">Choose a file from the explorer or create a new one</div>
                </div>
              )}
            </div>

            <div className="h-5 flex items-center justify-between border-t border-border bg-muted px-3 text-[11px] text-muted-foreground shrink-0">
              <span className="truncate">{activeFile ? `${activeFile.name} • ${getMonacoLanguage(activeFile.name, "typescript")}` : "No file"} • UTF-8 • LF</span>
              <span className="hidden lg:inline">Ln 1, Col 1 • Spaces: 2 • {files.filter(f => !f.name.endsWith("/.keep")).length} files</span>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border w-px" />

          <ResizablePanel defaultSize={30} minSize={20} maxSize={45} className="bg-card min-w-[280px]">
            <Preview files={files.map(f => ({ name: f.name, content: f.content }))} template={playground.template} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: stacked */}
      <div className="flex md:hidden flex-1 overflow-hidden flex-col">
        {showMobileExplorer && (
          <div className="h-[45%] border-b border-border bg-card overflow-hidden shrink-0">
            <FileExplorer
              files={files}
              activeFileId={activeId}
              onSelect={(id) => { setActiveId(id); setMobileTab("code"); setShowMobileExplorer(false); }}
              onCreate={handleCreate}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          </div>
        )}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {mobileTab === "code" ? (
            <>
              <div className="flex h-8 items-center gap-1 border-b border-border bg-muted/50 px-2 overflow-x-auto shrink-0">
                {files.filter(f => !f.name.endsWith("/.keep")).slice(0, 6).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveId(f.id)}
                    className={`flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium whitespace-nowrap border shrink-0 cursor-pointer ${activeId === f.id ? "bg-foreground text-background border-foreground" : "border-transparent text-muted-foreground"}`}
                  >
                    {f.name.split("/").pop()}
                  </button>
                ))}
              </div>
              <div className="flex-1 bg-background min-h-0">
                {activeFile ? (
                  <MonacoEditor
                    value={activeFile.content || ""}
                    language={getMonacoLanguage(activeFile.name, "typescript")}
                    onChange={handleFileChange}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[12px] text-muted-foreground p-6 text-center">Select a file</div>
                )}
              </div>
              <div className="h-5 flex items-center justify-between border-t border-border bg-muted px-3 text-[11px] text-muted-foreground shrink-0">
                <span className="truncate">{activeFile?.name || "No file"}</span>
                <span>{files.filter(f => !f.name.endsWith("/.keep")).length} files</span>
              </div>
            </>
          ) : (
            <div className="flex-1 bg-card min-h-0 overflow-hidden">
              <Preview files={files.map(f => ({ name: f.name, content: f.content }))} template={playground.template} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
