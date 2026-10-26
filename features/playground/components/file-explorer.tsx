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

const FILE_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
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
    const paddingLeft = 12 + depth * 14;

    if (node.isDirectory) {
      const isCollapsed = collapsed.has(node.path);
      return (
        <div key={node.id}>
          <div
            className="group flex h-8 cursor-pointer items-center gap-1 rounded-lg pr-1.5 text-sm text-foreground/80 transition-colors hover:bg-muted"
            style={{ paddingLeft }}
            onClick={() => toggleFolder(node.path)}
          >
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                !isCollapsed && "rotate-90",
              )}
            />
            {isCollapsed ? (
              <Folder className="size-4 shrink-0 fill-amber-100 text-amber-500" />
            ) : (
              <FolderOpen className="size-4 shrink-0 fill-amber-100 text-amber-500" />
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
          "group flex h-8 cursor-pointer items-center gap-2 rounded-lg pr-1.5 text-sm transition-colors",
          activeFileId === node.id
            ? "bg-iris-soft font-medium text-iris"
            : "text-foreground/75 hover:bg-muted",
        )}
        style={{ paddingLeft: paddingLeft + 16 }}
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
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/70 px-4">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Explorer
        </h2>
        <div className="flex items-center gap-0.5">
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
        <div className="space-y-0.5 p-2">
          {tree.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <FileCode2 className="mx-auto mb-3 size-7 text-zinc-300" />
              <p className="text-sm text-muted-foreground">No files yet</p>
              <button
                className="mt-2 text-sm font-medium text-iris hover:underline"
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
