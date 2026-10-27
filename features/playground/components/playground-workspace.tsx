"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ProjectFile, TemplateName } from "@/features/dashboard/type";
import {
  createProjectFile,
  deleteProjectFile,
  getPlaygroundForUser,
  renameProjectFile,
  updateFileContent,
} from "../actions";
import EditorTopbar from "./editor-topbar";
import FileExplorer from "./file-explorer";
import CodeEditor from "./code-editor";
import EditorStatusBar from "./editor-status-bar";
import InspectorPanel from "./inspector-panel";
import FileNameDialog from "./file-name-dialog";
import ConfirmDeleteDialog from "./confirm-delete-dialog";

export interface PlaygroundMeta {
  id: string;
  title: string;
  description: string | null;
  template: TemplateName;
}

export interface ProjectSwitcherItem {
  id: string;
  title: string;
  template: TemplateName;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";
type RightTab = "preview" | "ai";

interface PendingCreate {
  parentPath: string;
  isDirectory: boolean;
}

interface PendingDelete {
  file: ProjectFile;
}

interface PendingRename {
  file: ProjectFile;
}

const PlaygroundWorkspace = ({
  playground,
  initialFiles,
  projects,
}: {
  playground: PlaygroundMeta;
  initialFiles: ProjectFile[];
  projects: ProjectSwitcherItem[];
}) => {
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const firstOpenFile = initialFiles.find((file) => !file.isDirectory) ?? null;
  const [openTabIds, setOpenTabIds] = useState<string[]>(
    firstOpenFile ? [firstOpenFile.id] : [],
  );
  const [activeFileId, setActiveFileId] = useState<string | null>(
    firstOpenFile?.id ?? null,
  );
  const [rightTab, setRightTab] = useState<RightTab>("preview");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedContents, setSavedContents] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(initialFiles.map((file) => [file.id, file.content])),
  );

  const [createDialog, setCreateDialog] = useState<PendingCreate | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<PendingDelete | null>(null);
  const [renameDialog, setRenameDialog] = useState<PendingRename | null>(null);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) ?? null,
    [files, activeFileId],
  );

  const isDirty = Boolean(
    activeFile &&
      !activeFile.isDirectory &&
      savedContents[activeFile.id] !== activeFile.content,
  );

  // Re-fetch structural data while preserving unsaved editor contents.
  const refreshFiles = useCallback(async () => {
    const fresh = await getPlaygroundForUser(playground.id);
    if (!fresh) return;
    const freshFiles = fresh.files as ProjectFile[];
    setFiles((previous) =>
      freshFiles.map((file) => {
        const local = previous.find((item) => item.id === file.id);
        return local ? { ...file, content: local.content } : file;
      }),
    );
    // Close tabs for files that no longer exist.
    const ids = new Set(freshFiles.map((file) => file.id));
    setOpenTabIds((tabs) => tabs.filter((id) => ids.has(id)));
    setActiveFileId((active) =>
      active && ids.has(active) ? active : null,
    );
  }, [playground.id]);

  // Debounced autosave for the active file. The "saving" status is set by the
  // change handler; this effect only schedules the network write.
  useEffect(() => {
    if (!activeFile || activeFile.isDirectory || !isDirty) return;

    saveTimer.current = setTimeout(async () => {
      const result = await updateFileContent(
        playground.id,
        activeFile.id,
        activeFile.content,
      );
      if (result.ok) {
        setSavedContents((previous) => ({
          ...previous,
          [activeFile.id]: activeFile.content,
        }));
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
        toast.error("Changes could not be saved");
      }
    }, 900);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [activeFile, isDirty, playground.id]);

  const openFile = useCallback((file: ProjectFile) => {
    if (file.isDirectory) return;
    setActiveFileId(file.id);
    setOpenTabIds((tabs) =>
      tabs.includes(file.id) ? tabs : [...tabs, file.id],
    );
  }, []);

  const closeTab = useCallback(
    (fileId: string) => {
      setOpenTabIds((tabs) => {
        const next = tabs.filter((id) => id !== fileId);
        if (activeFileId === fileId) {
          setActiveFileId(next[next.length - 1] ?? null);
        }
        return next;
      });
    },
    [activeFileId],
  );

  const updateLocalContent = useCallback((fileId: string, content: string) => {
    setFiles((previous) =>
      previous.map((file) =>
        file.id === fileId ? { ...file, content } : file,
      ),
    );
    setSaveStatus("saving");
  }, []);

  const handleCreate = useCallback(
    async (name: string) => {
      if (!createDialog) return;
      const fullPath = createDialog.parentPath
        ? `${createDialog.parentPath}/${name}`
        : name;
      const result = await createProjectFile(playground.id, {
        path: fullPath,
        isDirectory: createDialog.isDirectory,
      });

      if (!result.ok) {
        toast.error(result.error ?? "Could not create the file");
        return;
      }
      toast.success(
        createDialog.isDirectory ? "Folder created" : "File created",
      );
      setCreateDialog(null);
      await refreshFiles();
      if (!createDialog.isDirectory && result.file) {
        const created = result.file as ProjectFile;
        openFile(created);
      }
    },
    [createDialog, playground.id, refreshFiles, openFile],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteDialog) return;
    const result = await deleteProjectFile(playground.id, deleteDialog.file.id);
    if (result.ok) {
      toast.success("Deleted");
      closeTab(deleteDialog.file.id);
      setDeleteDialog(null);
      await refreshFiles();
    } else {
      toast.error("Could not delete");
    }
  }, [deleteDialog, playground.id, refreshFiles, closeTab]);

  const handleRename = useCallback(
    async (name: string) => {
      if (!renameDialog) return;
      const result = await renameProjectFile(
        playground.id,
        renameDialog.file.id,
        name,
      );
      if (!result.ok) {
        toast.error(result.error ?? "Could not rename");
        return;
      }
      toast.success("Renamed");
      setRenameDialog(null);
      await refreshFiles();
    },
    [renameDialog, playground.id, refreshFiles],
  );

  const panelOrientation = isMobile ? "vertical" : "horizontal";

  return (
    <div className="flex h-full flex-col gap-3">
      <EditorTopbar
        playground={playground}
        projects={projects}
        saveStatus={saveStatus}
        isDirty={isDirty}
      />

      <ResizablePanelGroup
        orientation={panelOrientation}
        className="min-h-0 flex-1 rounded-2xl"
      >
        <ResizablePanel
          defaultSize="20"
          minSize={isMobile ? "14" : "15"}
          className="animate-fade-in overflow-hidden rounded-2xl"
        >
          <FileExplorer
            files={files}
            activeFileId={activeFileId}
            onOpenFile={openFile}
            onCreate={(parentPath, isDirectory) =>
              setCreateDialog({ parentPath, isDirectory })
            }
            onDelete={(file) => setDeleteDialog({ file })}
            onRename={(file) => setRenameDialog({ file })}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-transparent"
        />

        <ResizablePanel
          defaultSize="50"
          minSize="28"
          className="animate-fade-in stagger-1 overflow-hidden rounded-2xl"
        >
          <div className="flex h-full flex-col gap-2">
            <div className="min-h-0 flex-1">
              <CodeEditor
                files={files}
                openTabIds={openTabIds}
                activeFileId={activeFileId}
                onSelectTab={setActiveFileId}
                onCloseTab={closeTab}
                onChangeContent={updateLocalContent}
              />
            </div>
            <EditorStatusBar
              file={activeFile}
              saveStatus={saveStatus}
              isDirty={isDirty}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-transparent"
        />

        <ResizablePanel
          defaultSize="30"
          minSize={isMobile ? "18" : "20"}
          className="animate-fade-in stagger-2 overflow-hidden rounded-2xl"
        >
          <InspectorPanel
            files={files}
            rightTab={rightTab}
            onRightTabChange={setRightTab}
            template={playground.template}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <FileNameDialog
        open={Boolean(createDialog)}
        onOpenChange={(open) => !open && setCreateDialog(null)}
        title={createDialog?.isDirectory ? "New folder" : "New file"}
        description={
          createDialog?.isDirectory
            ? "Name the folder. You can nest folders with a path, e.g. src/components."
            : "Name the file. Use a path to nest it, e.g. src/Button.jsx."
        }
        confirmLabel="Create"
        initialValue=""
        onSubmit={handleCreate}
      />

      <FileNameDialog
        open={Boolean(renameDialog)}
        onOpenChange={(open) => !open && setRenameDialog(null)}
        title="Rename"
        description="Enter a new name for this item."
        confirmLabel="Save"
        initialValue={renameDialog?.file.name ?? ""}
        onSubmit={handleRename}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteDialog)}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        fileName={deleteDialog?.file.name ?? ""}
        isDirectory={Boolean(deleteDialog?.file.isDirectory)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PlaygroundWorkspace;
