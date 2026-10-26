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
import { PanelLeft, PanelRight } from "lucide-react";

interface EditorLayoutProps {
  playground: { id: string; title: string; template: string; };
  initialFiles: EditorFile[];
}

export function EditorLayout({ playground, initialFiles }: EditorLayoutProps) {
  const [files, setFiles] = useState<EditorFile[]>(initialFiles);
  const [activeId, setActiveId] = useState<string | null>(initialFiles[0]?.id || null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [mobileTab, setMobileTab] = useState<"code" | "preview">("code");
  const [showExplorer, setShowExplorer] = useState(true);
  const activeFile = files.find(f => f.id === activeId) || null;

  useEffect(() => {
    if (!activeFile) return;
    const h = setTimeout(async () => {
      if (activeFile.content !== null) {
        setSaving(true);
        try { await updateFileContent(activeFile.id, activeFile.content); setSavedAt(new Date()); } catch {}
        setSaving(false);
      }
    }, 800);
    return () => clearTimeout(h);
  }, [activeFile?.content, activeFile?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (activeFile) {
          setSaving(true);
          updateFileContent(activeFile.id, activeFile.content || "").then(() => {
            setSaving(false); setSavedAt(new Date()); toast.success("Saved");
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
    const nf = await createFile(playground.id, name, name.endsWith(".css") ? "/* New file */" : "// New file");
    if (nf) {
      const file: EditorFile = { id: nf.id, name: nf.name, content: nf.content || "" };
      setFiles(prev => [...prev, file]); setActiveId(file.id); toast.success(`Created ${name}`);
    } else {
      const id = Math.random().toString(36).slice(2);
      setFiles(prev => [...prev, { id, name, content: "" }]); setActiveId(id); toast.success(`Created ${name} (local)`);
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
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name } : f)); toast.success("Renamed");
  };
  const handleSave = async () => {
    if (!activeFile) return;
    setSaving(true); await updateFileContent(activeFile.id, activeFile.content || ""); setSaving(false); setSavedAt(new Date()); toast.success("Saved");
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden min-w-0">
      <Topbar title={playground.title} template={playground.template} saving={saving} savedAt={savedAt} onSave={handleSave} onRun={() => toast.info("Preview refreshed")} showExplorer={showExplorer} onToggleExplorer={() => setShowExplorer(!showExplorer)} />

      {/* Mobile tabs — premium style like refs */}
      <div className="flex md:hidden items-center gap-2 p-2 border-b border-border bg-card shrink-0">
        <div className="flex-1 flex bg-muted rounded-full p-1 gap-1">
          <button type="button" onClick={() => setMobileTab("code")} className={`flex-1 h-8 rounded-full text-[12px] font-bold transition ${mobileTab === "code" ? "bg-foreground text-background shadow" : "text-muted-foreground"}`}>Code</button>
          <button type="button" onClick={() => setMobileTab("preview")} className={`flex-1 h-8 rounded-full text-[12px] font-bold transition ${mobileTab === "preview" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}>Preview</button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowExplorer(v => !v)} className="h-8 rounded-full shrink-0 gap-1">
          <PanelLeft className="h-3.5 w-3.5" />{showExplorer ? "Hide" : "Files"}
        </Button>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-1 overflow-hidden min-h-0 min-w-0">
        <ResizablePanelGroup orientation="horizontal" className="flex-1 min-w-0">
          {showExplorer && (
            <>
              <ResizablePanel defaultSize={22} minSize={16} maxSize={32} className="bg-card min-w-0 border-r border-border">
                <FileExplorer files={files} activeFileId={activeId} onSelect={setActiveId} onCreate={handleCreate} onDelete={handleDelete} onRename={handleRename} />
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-border w-px shrink-0 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full" />
            </>
          )}
          <ResizablePanel defaultSize={showExplorer ? 48 : 62} minSize={30} className="flex flex-col min-w-0 bg-background">
            <div className="flex h-8 items-center gap-1 border-b border-border bg-muted/30 px-2 overflow-x-auto scrollbar-none shrink-0">
              {!showExplorer && (
                <button onClick={() => setShowExplorer(true)} className="h-6 w-6 rounded-md bg-card border border-border flex items-center justify-center shrink-0 mr-1">
                  <PanelLeft className="h-3 w-3" />
                </button>
              )}
              {files.filter(f => !f.name.endsWith("/.keep")).slice(0, 10).map(f => (
                <button key={f.id} onClick={() => setActiveId(f.id)} className={`h-6 px-3 rounded-full mono text-[11px] font-semibold whitespace-nowrap border shrink-0 transition ${activeId === f.id ? "bg-foreground text-background border-foreground" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
                  {f.name.split("/").pop()}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
              {activeFile ? <MonacoEditor value={activeFile.content || ""} language={getMonacoLanguage(activeFile.name, "typescript")} onChange={handleFileChange} /> : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">📄</div>
                  <div className="font-bold mt-3">No file selected</div>
                  <div className="text-[13px] text-muted-foreground mt-1">Choose a file or create one</div>
                </div>
              )}
            </div>
            <div className="h-6 flex items-center justify-between border-t border-border bg-muted/50 px-3 mono text-[11px] text-muted-foreground shrink-0 gap-2 min-w-0">
              <span className="truncate min-w-0 flex-1">{activeFile ? `${activeFile.name} • ${getMonacoLanguage(activeFile.name, "typescript")}` : "No file"} • UTF-8</span>
              <span className="hidden xl:inline shrink-0">{files.filter(f => !f.name.endsWith("/.keep")).length} files • Spaces: 2</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-border w-px shrink-0" />
          <ResizablePanel defaultSize={30} minSize={22} maxSize={50} className="bg-card min-w-0">
            <Preview files={files.map(f => ({ name: f.name, content: f.content }))} template={playground.template} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-1 overflow-hidden flex-col min-h-0 min-w-0">
        {showExplorer && (
          <div className="h-[44%] max-h-[50%] border-b border-border bg-card overflow-hidden shrink-0 min-h-0">
            <FileExplorer files={files} activeFileId={activeId} onSelect={(id) => { setActiveId(id); setMobileTab("code"); }} onCreate={handleCreate} onDelete={handleDelete} onRename={handleRename} />
          </div>
        )}
        <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
          {mobileTab === "code" ? (
            <>
              <div className="flex h-8 items-center gap-1 border-b border-border bg-muted/40 px-2 overflow-x-auto scrollbar-none shrink-0">
                {files.filter(f => !f.name.endsWith("/.keep")).slice(0, 6).map(f => (
                  <button key={f.id} onClick={() => setActiveId(f.id)} className={`h-6 px-3 rounded-full mono text-[11px] font-bold whitespace-nowrap border shrink-0 ${activeId === f.id ? "bg-foreground text-background border-foreground" : "bg-card border-border text-muted-foreground"}`}>
                    {f.name.split("/").pop()}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
                {activeFile ? <MonacoEditor value={activeFile.content || ""} language={getMonacoLanguage(activeFile.name, "typescript")} onChange={handleFileChange} /> : <div className="flex h-full items-center justify-center text-[12px] text-muted-foreground">Select a file</div>}
              </div>
            </>
          ) : (
            <div className="flex-1 bg-card min-h-0 min-w-0 overflow-hidden">
              <Preview files={files.map(f => ({ name: f.name, content: f.content }))} template={playground.template} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
