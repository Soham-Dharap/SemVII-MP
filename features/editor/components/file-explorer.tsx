"use client";

import { useState, useMemo } from "react";
import { Folder, FolderOpen, FileCode, Plus, Trash2, Pencil, ChevronRight, ChevronDown, FilePlus, FolderPlus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface EditorFile {
  id: string;
  name: string;
  content: string | null;
}

type TreeNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  file?: EditorFile;
  children?: TreeNode[];
};

function buildTree(files: EditorFile[]): TreeNode[] {
  const visibleFiles = files.filter(f => !f.name.endsWith("/.keep"));
  const result: TreeNode[] = [];
  const folderPaths = new Set(
    files.filter(f => f.name.endsWith("/.keep")).map(f => f.name.replace("/.keep", ""))
  );
  for (const file of visibleFiles) {
    const parts = file.name.split("/");
    let current = result;
    let currentPath = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = i === parts.length - 1;
      if (isFile) {
        current.push({ name: part, path: currentPath, type: "file", file });
      } else {
        let folder = current.find(n => n.name === part && n.type === "folder");
        if (!folder) {
          folder = { name: part, path: currentPath, type: "folder", children: [] };
          current.push(folder);
        }
        current = folder.children!;
      }
    }
  }
  for (const folderPath of folderPaths) {
    const parts = folderPath.split("/");
    let current = result;
    let currentPath = "";
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      let folder = current.find(n => n.name === part && n.type === "folder");
      if (!folder) {
        folder = { name: part, path: currentPath, type: "folder", children: [] };
        current.push(folder);
      }
      current = folder.children!;
    }
  }
  return result;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "TS", tsx: "TSX", js: "JS", jsx: "JSX", json: "JSON", css: "CSS", html: "HTML", vue: "VUE"
  };
  return map[ext || ""] || "FILE";
}
function getFileDot(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["ts", "tsx", "js", "jsx"].includes(ext || "")) return "bg-[#6366F1]";
  if (ext === "css") return "bg-[#06B6D4]";
  if (ext === "json") return "bg-[#F59E0B]";
  return "bg-white/20";
}

interface FileExplorerProps {
  files: EditorFile[];
  activeFileId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function FileExplorer({ files, activeFileId, onSelect, onCreate, onDelete, onRename }: FileExplorerProps) {
  const [isCreating, setIsCreating] = useState<null | "file" | "folder">(null);
  const [newName, setNewName] = useState("");
  const [parentPath, setParentPath] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ src: true, app: true, components: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const tree = useMemo(() => buildTree(files), [files]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const fullName = parentPath ? `${parentPath}/${newName.trim()}` : newName.trim();
    const finalName = isCreating === "folder" ? `${fullName}/.keep` : fullName;
    onCreate(finalName);
    setNewName("");
    setIsCreating(null);
    setParentPath("");
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    const file = files.find(f => f.id === id);
    if (!file) return;
    const dir = file.name.includes("/") ? file.name.substring(0, file.name.lastIndexOf("/")) : "";
    const newFull = dir ? `${dir}/${editName.trim()}` : editName.trim();
    onRename(id, newFull);
    setEditingId(null);
  };

  const toggle = (path: string) => setExpanded(e => ({ ...e, [path]: !e[path] }));

  const renderNode = (node: TreeNode, depth = 0) => {
    if (node.type === "folder") {
      const isOpen = expanded[node.path] ?? true;
      return (
        <div key={node.path} className="min-w-0 w-full">
          <div
            onClick={() => toggle(node.path)}
            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] cursor-pointer hover:bg-white/[0.06] text-white/60 hover:text-white w-full min-w-0 transition-colors"
            style={{ paddingLeft: 8 + Math.min(depth, 6) * 10 }}
          >
            {isOpen ? <ChevronDown className="h-3 w-3 opacity-50 shrink-0" /> : <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />}
            {isOpen ? <FolderOpen className="h-3.5 w-3.5 text-[#6366F1] shrink-0" /> : <Folder className="h-3.5 w-3.5 text-white/30 shrink-0" />}
            <span className="flex-1 truncate font-medium min-w-0 text-[12px]">{node.name}</span>
            <div className="hidden sm:group-hover:flex gap-0.5 shrink-0 opacity-60">
              <button onClick={(e) => { e.stopPropagation(); setParentPath(node.path); setIsCreating("file"); }} className="p-1 rounded-md hover:bg-white/10 transition"><FilePlus className="h-3 w-3" /></button>
              <button onClick={(e) => { e.stopPropagation(); setParentPath(node.path); setIsCreating("folder"); }} className="p-1 rounded-md hover:bg-white/10 transition"><FolderPlus className="h-3 w-3" /></button>
            </div>
          </div>
          {isOpen && (
            <div className="mt-0.5 space-y-0.5 min-w-0 w-full">
              {node.children?.map(c => renderNode(c, depth + 1))}
              {node.children?.length === 0 && <div className="text-[11px] text-white/20 pl-8 py-1">Empty</div>}
            </div>
          )}
        </div>
      );
    }

    const file = node.file!;
    const isActive = activeFileId === file.id;
    return (
      <div
        key={file.id}
        onClick={() => onSelect(file.id)}
        className={`group flex items-center gap-2 rounded-full h-7 px-2 py-1 text-[12px] cursor-pointer border transition-all min-w-0 w-full overflow-hidden ${isActive ? "bg-[#D6FF00] text-black border-[#D6FF00] font-semibold shadow-[0_2px_8px_rgba(214,255,0,0.2)]" : "text-white/60 hover:bg-white/[0.06] hover:text-white border-transparent"}`}
        style={{ marginLeft: Math.min(depth, 6) * 6 }}
      >
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-black/60" : getFileDot(file.name)}`} />
        <span className={`hidden sm:inline shrink-0 text-[9px] font-black tracking-wide px-1 py-0.5 rounded-full ${isActive ? "bg-black/10 text-black" : "bg-white/10 text-white/50"}`}>{getFileIcon(file.name)}</span>
        {editingId === file.id ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename(file.id)}
            onBlur={() => setEditingId(null)}
            className="h-5 text-[11px] py-0 px-2 rounded-full flex-1 min-w-0 bg-white text-black border-white"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 truncate min-w-0 text-[12px] leading-none">{node.name}</span>
        )}
        <div className={`hidden sm:group-hover:flex items-center gap-0.5 shrink-0 ${isActive ? "text-black/60" : "text-white/40"}`}>
          <button onClick={(e) => { e.stopPropagation(); setEditingId(file.id); setEditName(node.name); }} className={`p-1 rounded-full ${isActive ? "hover:bg-black/10" : "hover:bg-white/10"}`}><Pencil className="h-3 w-3" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(file.id); }} className={`p-1 rounded-full ${isActive ? "hover:bg-black/10" : "hover:bg-red-500/20 hover:text-red-400"}`}><Trash2 className="h-3 w-3" /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 w-full overflow-hidden bg-[#0F1115] border-r border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-white/[0.06] bg-white/[0.02] shrink-0 gap-2">
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-white/50 truncate">
          <Layers className="h-3.5 w-3.5 text-[#6366F1] shrink-0" />
          <span className="truncate">Explorer</span>
          <span className="hidden sm:inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-black text-white/70">{files.filter(f => !f.name.endsWith("/.keep")).length}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-7 w-7 rounded-full inline-flex items-center justify-center bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors shrink-0 text-white/70">
            <Plus className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-2xl">
            <DropdownMenuItem onClick={() => { setParentPath(""); setIsCreating("file"); }}>
              <FilePlus className="h-4 w-4 mr-2" /> New File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setParentPath(""); setIsCreating("folder"); }}>
              <FolderPlus className="h-4 w-4 mr-2" /> New Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isCreating && (
        <div className="p-3 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
          <div className="text-[11px] text-white/40 mb-2 truncate mono">{isCreating === "folder" ? "New folder" : "New file"} {parentPath && `in ${parentPath}/`}</div>
          <div className="flex gap-1.5 min-w-0">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder={isCreating === "folder" ? "components" : "App.tsx"}
              className="h-8 text-[12px] rounded-full flex-1 min-w-0 bg-white text-black border-white placeholder:text-black/40"
              autoFocus
            />
            <Button size="sm" onClick={handleCreate} className="h-8 px-4 rounded-full bg-[#D6FF00] text-black text-[12px] font-bold shrink-0 hover:bg-[#D6FF00]">Create</Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsCreating(null); setParentPath(""); }} className="h-8 px-2 text-white/60 shrink-0">Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 min-h-0 min-w-0 w-full custom-scroll">
        {tree.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="mx-auto h-10 w-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-3"><FileCode className="h-5 w-5 text-white/40" /></div>
            <div className="text-[12px] font-semibold text-white">No files yet</div>
            <div className="text-[11px] text-white/40 mt-1 leading-4">Create a file to start coding.<br/>Your preview updates live.</div>
            <Button size="sm" onClick={() => setIsCreating("file")} className="mt-4 h-8 rounded-full bg-[#6366F1] text-white text-[11px] font-bold">New File</Button>
          </div>
        ) : (
          <div className="space-y-0.5 px-2 min-w-0 w-full">{tree.map(n => renderNode(n))}</div>
        )}
      </div>

      <div className="px-3 h-8 border-t border-white/[0.06] flex items-center justify-between text-[11px] bg-white/[0.02] shrink-0 gap-2">
        <span className="mono text-white/30 truncate">{files.filter(f => !f.name.endsWith("/.keep")).length} files • Spaces: 2</span>
        <span className="hidden sm:flex items-center gap-1.5 mono text-[10px] text-emerald-400 shrink-0"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/>Auto-save</span>
      </div>
    </div>
  );
}
