import type { ProjectFile } from "@/features/dashboard/type";
import { getLanguageFromPath, normalizePath } from "./file-tree";

const BABEL_CDN = "https://unpkg.com/@babel/standalone/babel.min.js";
const REACT_CDN = "https://unpkg.com/react@18/umd/react.development.js";
const REACT_DOM_CDN =
  "https://unpkg.com/react-dom@18/umd/react-dom.development.js";

const SCRIPT_EXTENSIONS = ["js", "jsx", "ts", "tsx", "mjs"];

function resolvePath(baseDir: string, reference: string): string {
  const cleanReference = reference.split("?")[0].split("#")[0];
  if (/^https?:\/\//.test(cleanReference) || cleanReference.startsWith("//")) {
    return cleanReference;
  }
  const normalizedReference = normalizePath(cleanReference);
  if (!cleanReference.startsWith(".") && !baseDir) {
    return normalizedReference;
  }
  const stack = baseDir ? baseDir.split("/").filter(Boolean) : [];
  for (const part of normalizedReference.split("/")) {
    if (part === "..") stack.pop();
    else if (part && part !== ".") stack.push(part);
  }
  return stack.join("/");
}

function isExternal(reference: string): boolean {
  return /^https?:\/\//.test(reference) || reference.startsWith("//");
}

function pickEntryHtml(files: ProjectFile[]): ProjectFile | null {
  const htmlFiles = files
    .filter((file) => !file.isDirectory && file.path.endsWith(".html"))
    .sort((a, b) => a.path.split("/").length - b.path.split("/").length);
  return htmlFiles[0] ?? null;
}

/**
 * Builds a fully self-contained HTML document from the project files so the
 * preview can run inside a sandboxed iframe without a dev server. Local CSS is
 * inlined, local JS/JSX/TS is inlined and JSX/TS is compiled in the browser
 * through Babel Standalone.
 */
export function buildPreviewDocument(files: ProjectFile[]): string | null {
  const entry = pickEntryHtml(files);
  if (!entry) return null;

  const fileByPath = new Map<string, ProjectFile>();
  for (const file of files) {
    if (!file.isDirectory) fileByPath.set(file.path, file);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(entry.content, "text/html");
  const entryDir = entry.path.includes("/")
    ? entry.path.slice(0, entry.path.lastIndexOf("/"))
    : "";

  const referencedPaths = new Set<string>();
  let needsBabel = false;
  let needsReact = false;

  // Inline local stylesheets.
  doc.querySelectorAll('link[rel="stylesheet"][href]').forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    if (isExternal(href)) return;
    const resolved = resolvePath(entryDir, href);
    const stylesheet = fileByPath.get(resolved);
    if (!stylesheet) return;
    referencedPaths.add(resolved);
    const style = doc.createElement("style");
    style.setAttribute("data-source", resolved);
    style.textContent = stylesheet.content;
    link.replaceWith(style);
  });

  // Inline local scripts and mark JSX/TS for Babel.
  doc.querySelectorAll("script[src]").forEach((script) => {
    const src = script.getAttribute("src") ?? "";
    if (isExternal(src)) {
      const lowerSrc = src.toLowerCase();
      if (lowerSrc.includes("babel")) needsBabel = true;
      if (lowerSrc.includes("/react") || lowerSrc.includes("react-dom")) {
        needsReact = true;
      }
      return;
    }

    const resolved = resolvePath(entryDir, src);
    const sourceFile = fileByPath.get(resolved);
    if (!sourceFile) {
      script.remove();
      return;
    }

    referencedPaths.add(resolved);
    const language = sourceFile.language || getLanguageFromPath(resolved);
    const replacement = doc.createElement("script");
    if (language === "jsx" || language === "tsx" || language === "typescript") {
      replacement.setAttribute("type", "text/babel");
      const presets = language.includes("ts")
        ? "react,typescript"
        : "react";
      replacement.setAttribute("data-presets", presets);
      needsBabel = true;
      needsReact = true;
    }
    replacement.setAttribute("data-source", resolved);
    replacement.textContent = sourceFile.content;
    script.replaceWith(replacement);
  });

  // Append any script files that exist in the project but were not referenced.
  const orphanScripts = files
    .filter((file) => {
      if (file.isDirectory || referencedPaths.has(file.path)) return false;
      const extension = file.path.split(".").pop()?.toLowerCase() ?? "";
      return SCRIPT_EXTENSIONS.includes(extension);
    })
    .sort((a, b) => {
      const rank = (path: string) =>
        /(main|index|app)\./.test(path) ? 1 : 0;
      return rank(a.path) - rank(b.path);
    });

  for (const sourceFile of orphanScripts) {
    const language =
      sourceFile.language || getLanguageFromPath(sourceFile.path);
    const script = doc.createElement("script");
    if (
      language === "jsx" ||
      language === "tsx" ||
      language === "typescript"
    ) {
      script.setAttribute("type", "text/babel");
      script.setAttribute(
        "data-presets",
        language.includes("ts") ? "react,typescript" : "react",
      );
      needsBabel = true;
      needsReact = true;
    }
    script.setAttribute("data-source", sourceFile.path);
    script.textContent = sourceFile.content;
    doc.body.appendChild(script);
  }

  // Ensure the compiler and React runtimes are present when needed.
  const hasScript = (needle: string) =>
    Array.from(doc.querySelectorAll("script[src]")).some((script) =>
      (script.getAttribute("src") ?? "").toLowerCase().includes(needle),
    );

  if (needsReact && !hasScript("react-dom")) {
    const reactScript = doc.createElement("script");
    reactScript.src = REACT_CDN;
    doc.head.appendChild(reactScript);
    const reactDomScript = doc.createElement("script");
    reactDomScript.src = REACT_DOM_CDN;
    doc.head.appendChild(reactDomScript);
  }

  if (needsBabel && !hasScript("babel")) {
    const babelScript = doc.createElement("script");
    babelScript.src = BABEL_CDN;
    doc.head.appendChild(babelScript);
  }

  const serialized = `<!doctype html>\n${doc.documentElement.outerHTML}`;
  return serialized;
}
