"use client";

import { useState } from "react";
import { File, Folder, Plus, Trash2, Pencil, FileCode, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface EditorFile {
  id: string;
  name: string;
  content: string | null;
  language?: string;
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
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName("");
    setIsCreating(false);
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    onRename(id, editName.trim());
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 h-8 border-b border-black/[0.06] dark:border-white/10 bg-[#fafafa] dark:bg-[#111]">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-[#888]">
          <Folder className="h-3.5 w-3.5" />
          Explorer
        </div>
        <Button variant="ghost" size="icon-xs" onClick={() => setIsCreating(true)} className="h-6 w-6 rounded-md">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isCreating && (
        <div className="p-2 border-b border-black/[0.06] dark:border-white/10 flex gap-1">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="new-file.ts"
            className="h-7 text-[12px] rounded-md"
            autoFocus
          />
          <Button size="sm" onClick={handleCreate} className="h-7 px-2 rounded-md text-[11px]">
            Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)} className="h-7 px-2">
            Cancel
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-1">
        <div className="px-2 py-1 flex items-center gap-1 text-[11px] font-medium text-[#111] dark:text-white">
          <ChevronDown className="h-3 w-3 text-[#999]" />
          Project files
        </div>
        <div className="mt-1 space-y-0.5 px-2">
          {files.map((f) => (
            <div
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] cursor-pointer border ${
                activeFileId === f.id
                  ? "bg-[#111] text-white dark:bg-white dark:text-black border-transparent"
                  : "text-[#555] dark:text-[#aaa] hover:bg-black/[0.04] dark:hover:bg-white/10 border-transparent"
              }`}
            >
              <FileCode className={`h-3.5 w-3.5 shrink-0 ${activeFileId === f.id ? "opacity-80" : "opacity-50"}`} />
              {editingId === f.id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(f.id)}
                  onBlur={() => setEditingId(null)}
                  className="h-5 text-[12px] py-0 px-1 rounded"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 truncate">{f.name}</span>
              )}
              <div className={`hidden group-hover:flex items-center gap-0.5 ${activeFileId === f.id ? "text-white/70" : ""}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(f.id);
                    setEditName(f.name);
                  }}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/20"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(f.id);
                  }}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/20"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          {files.length === 0 && (
            <div className="px-2 py-4 text-center text-[12px] text-[#999]">No files yet. Create one.</div>
          )}
        </div>
      </div>

      <div className="p-2 border-t border-black/[0.06] dark:border-white/10 text-[11px] text-[#888]">
        {files.length} file{files.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
