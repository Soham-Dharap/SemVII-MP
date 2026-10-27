"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Globe,
  Loader2,
  Maximize2,
  Minimize2,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildPreviewDocument } from "@/lib/preview-builder";
import type { ProjectFile, TemplateName } from "@/features/dashboard/type";

type DeviceMode = "fit" | "tablet" | "phone";

const DEVICE_WIDTHS: Record<Exclude<DeviceMode, "fit">, number> = {
  tablet: 768,
  phone: 390,
};

const PreviewPane = ({
  files,
  template,
}: {
  files: ProjectFile[];
  template: TemplateName;
}) => {
  // DOMParser is browser-only; keep this subtree off the server render.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const builtDocument = useMemo(() => {
    if (!isClient) return null;
    try {
      return buildPreviewDocument(files);
    } catch (error) {
      console.error("Preview build failed:", error);
      return null;
    }
  }, [files, isClient]);

  const entryFile = useMemo(
    () =>
      files
        .filter((file) => !file.isDirectory && file.path.endsWith(".html"))
        .sort(
          (a, b) => a.path.split("/").length - b.path.split("/").length,
        )[0],
    [files],
  );

  const [frameHtml, setFrameHtml] = useState<string | null>(builtDocument);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("fit");
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const frameSignature = `${reloadKey}:${frameHtml ?? ""}`;
  const [loadedSignature, setLoadedSignature] = useState<string | null>(null);
  const isFrameLoading = loadedSignature !== frameSignature;

  // Debounce rebuilds so typing does not reload the iframe on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setFrameHtml(builtDocument), 500);
    return () => clearTimeout(timer);
  }, [builtDocument]);

  // The iframe `load` event waits for every sub-resource — including external
  // CDN scripts that a restrictive network can hang for minutes. Cap the wait
  // so the "Compiling" overlay can never get permanently stuck.
  useEffect(() => {
    if (!isFrameLoading) return;
    const timer = setTimeout(() => {
      setLoadedSignature(frameSignature);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isFrameLoading, frameSignature]);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      node.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const handleRefresh = () => {
    setFrameHtml(builtDocument);
    setLoadedSignature(null);
    setReloadKey((key) => key + 1);
  };

  const deviceButton =
    "flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  if (!builtDocument) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
          <Globe className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold">No preview available</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Add an{" "}
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              index.html
            </span>{" "}
            file to enable the live preview.
          </p>
        </div>
      </div>
    );
  }

  const frameWidth =
    deviceMode === "fit" ? null : DEVICE_WIDTHS[deviceMode];

  return (
    <div ref={containerRef} className="flex min-h-0 flex-1 flex-col bg-card">
      {/* Browser chrome */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border/70 px-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
          <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
          <Globe className="size-3 shrink-0 text-muted-foreground" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            localhost:3000
            {entryFile && entryFile.path !== "index.html"
              ? `/${entryFile.path}`
              : ""}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Desktop width"
            aria-pressed={deviceMode === "fit"}
            onClick={() => setDeviceMode("fit")}
            className={cn(
              deviceButton,
              deviceMode === "fit" && "bg-muted text-foreground",
            )}
          >
            <Monitor className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Tablet width (768px)"
            aria-pressed={deviceMode === "tablet"}
            onClick={() => setDeviceMode("tablet")}
            className={cn(
              deviceButton,
              deviceMode === "tablet" && "bg-muted text-foreground",
            )}
          >
            <Tablet className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Phone width (390px)"
            aria-pressed={deviceMode === "phone"}
            onClick={() => setDeviceMode("phone")}
            className={cn(
              deviceButton,
              deviceMode === "phone" && "bg-muted text-foreground",
            )}
          >
            <Smartphone className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Reload preview"
            onClick={handleRefresh}
            className={deviceButton}
          >
            <RotateCcw className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={isFullscreen ? "Exit full screen" : "Full screen preview"}
            onClick={toggleFullscreen}
            className={deviceButton}
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 bg-muted/50 p-3">
        <div
          className="relative mx-auto flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border transition-all duration-300"
          style={{
            width: frameWidth ? `${frameWidth}px` : "100%",
            maxWidth: "100%",
          }}
        >
          {frameWidth && (
            <span className="absolute left-2 top-2 z-20 rounded-full bg-foreground/80 px-2 py-0.5 font-mono text-[10px] text-background">
              {frameWidth}px · {deviceMode}
            </span>
          )}
          {isFrameLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/90 backdrop-blur-sm">
              <Loader2 className="size-6 animate-spin text-iris" />
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Compiling preview
              </p>
            </div>
          )}
          <iframe
            key={reloadKey}
            title={`${template} preview`}
            srcDoc={frameHtml ?? ""}
            sandbox="allow-scripts"
            className="h-full w-full flex-1 border-0"
            onLoad={() => setLoadedSignature(frameSignature)}
          />
        </div>
      </div>

      <div className="flex h-8 shrink-0 items-center justify-center border-t border-border/70 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
        Auto-refresh enabled
      </div>
    </div>
  );
};

export default PreviewPane;
