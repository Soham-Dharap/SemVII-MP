"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronRight,
  FileCode2,
  FileCog,
  FileJson2,
  FileText,
  FileType2,
  Folder,
  FolderOpen,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildFileTree, type TreeNode } from "@/lib/file-tree";
import type { ProjectFile } from "@/features/dashboard/type";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const FILE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> =
  {
    javascript: FileCode2,
    jsx: FileCode2,
    typescript: FileCode2,
    tsx: FileCode2,
    html: FileType2,
    css: FileCog,
    json: FileJson2,
    markdown: FileText,
    plaintext: FileText,
  };

const FileIcon = ({ language }: { language: string }) => {
  const Icon = FILE_ICON_MAP[language] ?? FileText;
  return <Icon className="size-4 shrink-0 text-zinc-400" />;
};

interface FileExplorerProps {
  files: ProjectFile[];
  activeFileId: string | null;
  onOpenFile: (file: ProjectFile) => void;
  onCreate: (parentPath: string, isDirectory: boolean) => void;
  onDelete: (file: ProjectFile) => void;
  onRename: (file: ProjectFile) => void;
}

const FileExplorer = ({
  files,
  activeFileId,
  onOpenFile,
  onCreate,
  onDelete,
  onRename,
}: FileExplorerProps) => {
  const tree = useMemo(() => buildFileTree(files), [files]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const paddingLeft = 10 + depth * 14;

    if (node.isDirectory) {
      const isCollapsed = collapsed.has(node.path);
      return (
        <div key={node.id}>
          <div
            className="group flex h-8 cursor-pointer items-center gap-1 pr-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
            style={{ paddingLeft }}
            onClick={() => toggleFolder(node.path)}
          >
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-zinc-400 transition-transform",
                !isCollapsed && "rotate-90",
              )}
            />
            {isCollapsed ? (
              <Folder className="size-4 shrink-0 text-zinc-400" />
            ) : (
              <FolderOpen className="size-4 shrink-0 text-zinc-400" />
            )}
            <span className="truncate font-medium">{node.name}</span>
            <span className="ml-auto hidden items-center gap-0.5 group-hover:flex">
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`New file in ${node.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onCreate(node.path, false);
                }}
              >
                <Plus className="size-3.5" />
              </Button>
              {node.file && (
                <>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Rename ${node.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onRename(node.file as ProjectFile);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Delete ${node.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(node.file as ProjectFile);
                    }}
                  >
                    <Trash2 className="size-3.5 text-red-500" />
                  </Button>
                </>
              )}
            </span>
          </div>
          {!isCollapsed &&
            node.children.map((child) => renderNode(child, depth + 1))}
        </div>
      );
    }

    return (
      <div
        key={node.id}
        className={cn(
          "group flex h-8 cursor-pointer items-center gap-2 pr-2 text-sm transition-colors",
          activeFileId === node.id
            ? "bg-blue-50 font-medium text-blue-700"
            : "text-zinc-700 hover:bg-zinc-100",
        )}
        style={{ paddingLeft: paddingLeft + 18 }}
        onClick={() => node.file && onOpenFile(node.file)}
      >
        <FileIcon language={node.language} />
        <span className="truncate">{node.name}</span>
        <span className="ml-auto hidden items-center gap-0.5 group-hover:flex">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Rename ${node.name}`}
            onClick={(event) => {
              event.stopPropagation();
              if (node.file) onRename(node.file);
            }}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${node.name}`}
            onClick={(event) => {
              event.stopPropagation();
              if (node.file) onDelete(node.file);
            }}
          >
            <Trash2 className="size-3.5 text-red-500" />
          </Button>
        </span>
      </div>
    );
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-zinc-100 px-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Explorer
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New file"
            onClick={() => onCreate("", false)}
          >
            <Plus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New folder"
            onClick={() => onCreate("", true)}
          >
            <FolderPlus className="size-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="py-2">
          {tree.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <FileCode2 className="mx-auto mb-2 size-6 text-zinc-300" />
              <p className="text-sm text-zinc-500">No files yet</p>
              <button
                className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                onClick={() => onCreate("", false)}
              >
                Create your first file
              </button>
            </div>
          ) : (
            tree.map((node) => renderNode(node, 0))
          )}
        </div>
      </ScrollArea>
    </section>
  );
};

export default FileExplorer;
