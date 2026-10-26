"use client";

import { useState, useMemo } from "react";
import { Folder, FolderOpen, FileCode, Plus, Trash2, Pencil, ChevronRight, ChevronDown, FilePlus, FolderPlus } from "lucide-react";
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
        <div key={node.path}>
          <div
            onClick={() => toggle(node.path)}
            className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] cursor-pointer hover:bg-accent text-muted-foreground w-full"
            style={{ paddingLeft: 8 + depth * 14 }}
          >
            {isOpen ? <ChevronDown className="h-3 w-3 opacity-50" /> : <ChevronRight className="h-3 w-3 opacity-50" />}
            {isOpen ? <FolderOpen className="h-3.5 w-3.5" /> : <Folder className="h-3.5 w-3.5" />}
            <span className="flex-1 truncate font-medium">{node.name}</span>
            <div className="hidden group-hover:flex gap-0.5">
              <button onClick={(e) => { e.stopPropagation(); setParentPath(node.path); setIsCreating("file"); }} className="p-1 rounded hover:bg-secondary"><FilePlus className="h-3 w-3" /></button>
              <button onClick={(e) => { e.stopPropagation(); setParentPath(node.path); setIsCreating("folder"); }} className="p-1 rounded hover:bg-secondary"><FolderPlus className="h-3 w-3" /></button>
            </div>
          </div>
          {isOpen && (
            <div className="mt-0.5 space-y-0.5">
              {node.children?.map(c => renderNode(c, depth + 1))}
              {node.children?.length === 0 && <div className="text-[11px] text-muted-foreground pl-8 py-1">Empty</div>}
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
        className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] cursor-pointer border ml-2 transition-colors ${isActive ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:bg-accent border-transparent"}`}
        style={{ marginLeft: depth * 14 }}
      >
        <span className={`shrink-0 text-[9px] font-bold tracking-wide px-1 py-0.5 rounded ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{getFileIcon(file.name)}</span>
        {editingId === file.id ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename(file.id)}
            onBlur={() => setEditingId(null)}
            className="h-5 text-[12px] py-0 px-1 rounded flex-1"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 truncate">{node.name}</span>
        )}
        <div className={`hidden group-hover:flex items-center gap-0.5 ${isActive ? "text-primary-foreground/70" : ""}`}>
          <button onClick={(e) => { e.stopPropagation(); setEditingId(file.id); setEditName(node.name); }} className="p-1 rounded hover:bg-secondary"><Pencil className="h-3 w-3" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(file.id); }} className="p-1 rounded hover:bg-destructive/20 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 h-8 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
          <Folder className="h-3.5 w-3.5" />
          Explorer
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-6 w-6 rounded-md inline-flex items-center justify-center hover:bg-accent transition-colors">
            <Plus className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-lg">
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
        <div className="p-2 border-b border-border bg-card">
          <div className="text-[11px] text-muted-foreground mb-1">{isCreating === "folder" ? "New folder:" : "New file:"} {parentPath && `in ${parentPath}/`}</div>
          <div className="flex gap-1">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder={isCreating === "folder" ? "components" : "App.tsx"}
              className="h-7 text-[12px] rounded-md flex-1"
              autoFocus
            />
            <Button size="sm" onClick={handleCreate} className="h-7 px-3 rounded-full bg-primary text-primary-foreground text-[11px]">Create</Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsCreating(null); setParentPath(""); }} className="h-7 px-2">Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-2">
        {tree.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-secondary flex items-center justify-center mb-2"><FileCode className="h-4 w-4 text-muted-foreground" /></div>
            <div className="text-[12px] font-medium">No files</div>
            <div className="text-[11px] text-muted-foreground mt-1">Create a file or folder to start</div>
          </div>
        ) : (
          <div className="space-y-0.5 px-2">{tree.map(n => renderNode(n))}</div>
        )}
      </div>

      <div className="p-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground bg-muted/30">
        <span>{files.filter(f => !f.name.endsWith("/.keep")).length} files</span>
        <span className="flex items-center gap-1">● Saved</span>
      </div>
    </div>
  );
}
