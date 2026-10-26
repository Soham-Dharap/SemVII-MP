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
import { PanelLeft, X, Eye, Code2 } from "lucide-react";

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
  const [showPreview, setShowPreview] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col bg-[#0A0C12] overflow-hidden min-w-0 w-full max-w-full">
      <Topbar title={playground.title} template={playground.template} saving={saving} savedAt={savedAt} onSave={handleSave} onRun={() => toast.info("Preview refreshed")} showExplorer={showExplorer} onToggleExplorer={() => setShowExplorer(!showExplorer)} />

      {/* ===== MOBILE/TABLET BAR: lg:hidden ===== */}
      <div className="flex lg:hidden items-center gap-2 px-3 h-11 border-b border-white/[0.06] bg-[#0F1115] shrink-0 min-w-0 overflow-hidden">
        {/* Code / Preview pill */}
        <div className="flex-1 flex bg-white/[0.06] rounded-full p-1 gap-1 min-w-0 max-w-[280px] border border-white/10">
          <button type="button" onClick={() => setMobileTab("code")} className={`flex-1 h-7 rounded-full text-[12px] font-bold transition flex items-center justify-center gap-1.5 ${mobileTab === "code" ? "bg-white text-black shadow" : "text-white/50"}`}>
            <Code2 className="h-3.5 w-3.5" /> Code
          </button>
          <button type="button" onClick={() => setMobileTab("preview")} className={`flex-1 h-7 rounded-full text-[12px] font-bold transition flex items-center justify-center gap-1.5 ${mobileTab === "preview" ? "bg-[#D6FF00] text-black shadow" : "text-white/50"}`}>
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            onClick={() => setDrawerOpen(true)}
            className="h-8 px-3 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-bold flex items-center gap-1.5"
          >
            <PanelLeft className="h-3.5 w-3.5" /> Files
          </button>
        </div>
      </div>

      {/* ===== DESKTOP 3-PANEL: lg:flex ===== */}
      <div className="hidden lg:flex flex-1 overflow-hidden min-h-0 min-w-0 w-full max-w-full">
        <ResizablePanelGroup orientation="horizontal" className="flex-1 min-w-0 w-full max-w-full">
          {showExplorer && (
            <>
              <ResizablePanel defaultSize={20} minSize={16} maxSize={32} className="min-w-0 max-w-full overflow-hidden">
                <FileExplorer files={files} activeFileId={activeId} onSelect={setActiveId} onCreate={handleCreate} onDelete={handleDelete} onRename={handleRename} />
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-white/[0.06] w-px hover:bg-[#6366F1]/50 transition-colors shrink-0" />
            </>
          )}
          <ResizablePanel defaultSize={showExplorer ? 46 : 58} minSize={28} className="flex flex-col min-w-0 max-w-full overflow-hidden bg-[#0A0C12]">
            {/* File tabs */}
            <div className="flex h-8 items-center gap-1 border-b border-white/[0.06] bg-[#0F1115] px-2 overflow-x-auto scrollbar-none shrink-0 min-w-0">
              {!showExplorer && (
                <button onClick={() => setShowExplorer(true)} className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-1 text-white/60 hover:bg-white/10">
                  <PanelLeft className="h-3 w-3" />
                </button>
              )}
              {files.filter(f => !f.name.endsWith("/.keep")).map(f => (
                <button key={f.id} onClick={() => setActiveId(f.id)} className={`h-6 px-3 rounded-full mono text-[11px] font-bold whitespace-nowrap border shrink-0 transition flex items-center gap-1.5 ${activeId === f.id ? "bg-[#D6FF00] text-black border-[#D6FF00]" : "bg-white/[0.06] border-white/10 text-white/60 hover:text-white hover:bg-white/10"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${activeId === f.id ? "bg-black/60" : "bg-[#6366F1]"}`} />
                  {f.name.split("/").pop()}
                </button>
              ))}
              <div className="flex items-center gap-1 shrink-0 ml-auto pl-2">
                <button onClick={() => setShowPreview(v => !v)} className="h-6 px-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white mono text-[10px] font-bold hidden xl:flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
            </div>
            {/* Monaco */}
            <div className="flex-1 min-h-0 min-w-0 max-w-full overflow-hidden relative">
              {activeFile ? (
                <MonacoEditor value={activeFile.content || ""} language={getMonacoLanguage(activeFile.name, "typescript")} onChange={handleFileChange} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-[#0B0F1A]">
                  <div className="h-12 w-12 rounded-2xl bg-[#6366F1]/20 border border-[#6366F1]/20 flex items-center justify-center">📄</div>
                  <div className="font-bold mt-3 text-white">No file selected</div>
                  <div className="text-[13px] text-white/40 mt-1">Choose a file or create one</div>
                </div>
              )}
            </div>
            {/* Status bar */}
            <div className="h-7 flex items-center justify-between border-t border-white/[0.06] bg-[#0F1115] px-3 mono text-[10px] text-white/30 shrink-0 gap-2 min-w-0">
              <span className="truncate min-w-0 flex-1">{activeFile ? `${activeFile.name} • ${getMonacoLanguage(activeFile.name, "typescript")}` : "No file"} • UTF-8</span>
              <span className="hidden xl:inline shrink-0">{files.filter(f => !f.name.endsWith("/.keep")).length} files • LF • Spaces: 2</span>
            </div>
          </ResizablePanel>
          {showPreview && (
            <>
              <ResizableHandle withHandle className="bg-white/[0.06] w-px hover:bg-[#6366F1]/50 transition-colors shrink-0" />
              <ResizablePanel defaultSize={32} minSize={22} maxSize={50} className="min-w-0 max-w-full overflow-hidden">
                <Preview files={files.map(f => ({ name: f.name, content: f.content }))} template={playground.template} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* ===== MOBILE/TABLET stacked: lg:hidden ===== */}
      <div className="flex lg:hidden flex-1 overflow-hidden flex-col min-h-0 min-w-0 w-full max-w-full bg-[#0A0C12]">
        {mobileTab === "code" ? (
          <div className="flex flex-1 flex-col min-h-0 min-w-0 max-w-full overflow-hidden">
            {/* File tabs mobile */}
            <div className="flex h-8 items-center gap-1 border-b border-white/[0.06] bg-[#0F1115] px-2 overflow-x-auto scrollbar-none shrink-0">
              {files.filter(f => !f.name.endsWith("/.keep")).slice(0, 8).map(f => (
                <button key={f.id} onClick={() => setActiveId(f.id)} className={`h-6 px-3 rounded-full mono text-[11px] font-bold whitespace-nowrap border shrink-0 flex items-center gap-1.5 ${activeId === f.id ? "bg-[#D6FF00] text-black border-[#D6FF00]" : "bg-white/5 border-white/10 text-white/60"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${activeId === f.id ? "bg-black/50" : "bg-[#6366F1]"}`} />
                  {f.name.split("/").pop()}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0 min-w-0 max-w-full overflow-hidden relative">
              {activeFile ? (
                <MonacoEditor value={activeFile.content || ""} language={getMonacoLanguage(activeFile.name, "typescript")} onChange={handleFileChange} />
              ) : (
                <div className="flex h-full items-center justify-center text-[12px] text-white/40 bg-[#0B0F1A]">Select a file</div>
              )}
            </div>
            <div className="h-7 flex items-center justify-between border-t border-white/[0.06] bg-[#0F1115] px-3 mono text-[10px] text-white/30 shrink-0">
              <span className="truncate">{activeFile?.name || "No file"}</span>
              <span className="shrink-0">{files.filter(f => !f.name.endsWith("/.keep")).length} files</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 min-w-0 max-w-full overflow-hidden bg-[#0F1115]">
            <Preview files={files.map(f => ({ name: f.name, content: f.content }))} template={playground.template} />
          </div>
        )}
      </div>

      {/* Drawer — Explorer on mobile/tablet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[86%] max-w-[320px] h-full bg-[#0F1115] border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-200 overflow-hidden">
            <div className="flex items-center justify-between px-3 h-11 border-b border-white/[0.06] shrink-0">
              <span className="text-white font-bold text-[13px]">Files</span>
              <button onClick={() => setDrawerOpen(false)} className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <FileExplorer files={files} activeFileId={activeId} onSelect={(id) => { setActiveId(id); setMobileTab("code"); setDrawerOpen(false); }} onCreate={handleCreate} onDelete={handleDelete} onRename={handleRename} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
