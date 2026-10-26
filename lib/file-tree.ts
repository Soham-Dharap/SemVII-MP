import type { ProjectFile } from "@/features/dashboard/type";

export interface TreeNode {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  language: string;
  children: TreeNode[];
  file?: ProjectFile;
}

const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  html: "html",
  htm: "html",
  css: "css",
  json: "json",
  md: "markdown",
  markdown: "markdown",
  py: "python",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  yml: "yaml",
  yaml: "yaml",
  txt: "plaintext",
};

export function getLanguageFromPath(filePath: string): string {
  const parts = filePath.split(".");
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() ?? "" : "";
  return EXTENSION_LANGUAGE_MAP[extension] ?? "plaintext";
}

/** Normalizes a user-entered path: trims, strips leading slashes and ./ parts. */
export function normalizePath(rawPath: string): string {
  return rawPath
    .trim()
    .replace(/^\.?\//, "")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
}

export function getParentPath(filePath: string): string {
  const index = filePath.lastIndexOf("/");
  return index === -1 ? "" : filePath.slice(0, index);
}

export function joinPath(parent: string, name: string): string {
  return parent ? `${parent}/${name}` : name;
}

/** Builds an ordered folder tree from a flat list of files. */
export function buildFileTree(files: ProjectFile[]): TreeNode[] {
  const roots: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));

  const ensureFolder = (folderPath: string): TreeNode => {
    const existing = nodeMap.get(folderPath);
    if (existing) return existing;

    const name = folderPath.split("/").pop() ?? folderPath;
    const node: TreeNode = {
      id: `dir-${folderPath}`,
      name,
      path: folderPath,
      isDirectory: true,
      language: "plaintext",
      children: [],
    };
    nodeMap.set(folderPath, node);

    const parentPath = getParentPath(folderPath);
    if (!parentPath) {
      roots.push(node);
    } else {
      ensureFolder(parentPath).children.push(node);
    }
    return node;
  };

  for (const file of sorted) {
    if (file.isDirectory) {
      const folderNode = ensureFolder(file.path);
      folderNode.file = file;
      continue;
    }

    const node: TreeNode = {
      id: file.id,
      name: file.name,
      path: file.path,
      isDirectory: false,
      language: file.language || getLanguageFromPath(file.path),
      children: [],
      file,
    };
    nodeMap.set(file.path, node);

    const parentPath = getParentPath(file.path);
    if (!parentPath) {
      roots.push(node);
    } else {
      ensureFolder(parentPath).children.push(node);
    }
  }

  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    nodes.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => sortNodes(node.children));
    return nodes;
  };

  return sortNodes(roots);
}

/** All implicit folder paths derived from file paths (used when creating files). */
export function deriveFolders(filePath: string): string[] {
  const folders: string[] = [];
  const segments = normalizePath(filePath).split("/").filter(Boolean);
  let current = "";
  for (let i = 0; i < segments.length - 1; i += 1) {
    current = current ? `${current}/${segments[i]}` : segments[i];
    folders.push(current);
  }
  return folders;
}
