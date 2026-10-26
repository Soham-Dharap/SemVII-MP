"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  Globe,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildPreviewDocument } from "@/lib/preview-builder";
import type { ProjectFile, TemplateName } from "@/features/dashboard/type";
import { Button } from "@/components/ui/button";

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

  const builtDocument = useMemo(
    () => (isClient ? buildPreviewDocument(files) : null),
    [files, isClient],
  );
  const entryFile = useMemo(
    () =>
      files
        .filter((file) => !file.isDirectory && file.path.endsWith(".html"))
        .sort(
          (a, b) => a.path.split("/").length - b.path.split("/").length,
        )[0],
    [files],
  );

  const [document, setDocument] = useState<string | null>(builtDocument);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("fit");
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce rebuilds so typing does not reload the iframe on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDocument(builtDocument), 1000);
    return () => clearTimeout(timer);
  }, [builtDocument]);

  const handleRefresh = () => {
    setDocument(builtDocument);
    setReloadKey((key) => key + 1);
  };

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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
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
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Responsive width"
            onClick={() => setDeviceMode("fit")}
            className={cn(deviceMode === "fit" && "bg-muted")}
          >
            <Monitor className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Tablet width"
            onClick={() => setDeviceMode("tablet")}
            className={cn(deviceMode === "tablet" && "bg-muted")}
          >
            <Tablet className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Phone width"
            onClick={() => setDeviceMode("phone")}
            className={cn(deviceMode === "phone" && "bg-muted")}
          >
            <Smartphone className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Reload preview"
            onClick={handleRefresh}
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 bg-muted/50 p-3">
        <div
          className="mx-auto h-full overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border transition-all duration-300"
          style={{
            maxWidth:
              deviceMode === "fit"
                ? "100%"
                : DEVICE_WIDTHS[deviceMode as Exclude<DeviceMode, "fit">],
          }}
        >
          <iframe
            key={reloadKey}
            title={`${template} preview`}
            srcDoc={document ?? ""}
            sandbox="allow-scripts"
            className="h-full w-full border-0"
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
