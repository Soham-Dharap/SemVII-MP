"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Copy,
  Edit3,
  ExternalLink,
  Link2,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toggleProjectStar } from "../actions";
import type { Project, TemplateName } from "../type";

const TEMPLATE_STYLE: Record<TemplateName, { label: string }> = {
  REACT: { label: "React" },
  NEXTJS: { label: "Next.js" },
  EXPRESS: { label: "Express" },
  VUE: { label: "Vue" },
  HONO: { label: "Hono" },
  ANGULAR: { label: "Angular" },
};

interface ProjectCardsProps {
  projects: Project[];
  onUpdateProject: (
    id: string,
    data: { title: string; description: string },
  ) => Promise<unknown>;
  onDeleteProject: (id: string) => Promise<void>;
  onDuplicateProject: (id: string) => Promise<unknown>;
}

export default function ProjectCards({
  projects,
  onDeleteProject,
  onDuplicateProject,
  onUpdateProject,
}: ProjectCardsProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [starred, setStarred] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      projects.map((p) => [p.id, Boolean(p.Starmark?.[0]?.isMarked)]),
    ),
  );

  const openEdit = (project: Project) => {
    setEditTarget(project);
    setEditData({
      title: project.title,
      description: project.description ?? "",
    });
  };

  const saveEdit = async () => {
    if (!editTarget || !editData.title.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }
    setBusy(true);
    await onUpdateProject(editTarget.id, {
      title: editData.title.trim(),
      description: editData.description,
    });
    setBusy(false);
    setEditTarget(null);
    toast.success("Project updated");
    router.refresh();
  };

  const duplicate = async (project: Project) => {
    const result = await onDuplicateProject(project.id);
    if (result) {
      toast.success("Project duplicated");
      router.refresh();
    } else {
      toast.error("Could not duplicate the project");
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await onDeleteProject(deleteTarget.id);
    setBusy(false);
    setDeleteTarget(null);
    toast.success("Project deleted");
    router.refresh();
  };

  const copyLink = async (id: string) => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/playground/${id}`,
    );
    toast.success("Project link copied");
  };

  const toggleStar = async (project: Project) => {
    const next = !starred[project.id];
    setStarred((prev) => ({ ...prev, [project.id]: next }));
    const result = await toggleProjectStar(project.id);
    if (result === null) {
      setStarred((prev) => ({ ...prev, [project.id]: !next }));
      toast.error("Could not update star");
    }
  };

  return (
    <>
      <div className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {projects.map((project, index) => {
          const style =
            TEMPLATE_STYLE[project.template as TemplateName] ??
            TEMPLATE_STYLE.REACT;
          const isStarred = starred[project.id];

          return (
            <div
              key={project.id}
              style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
              className="group flex animate-fade-up items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40 odd:border-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/70"
            >
              <button
                type="button"
                aria-label={isStarred ? "Unstar" : "Star"}
                onClick={() => toggleStar(project)}
                className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-muted"
              >
                <Star
                  className={`size-4 transition-colors ${
                    isStarred
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30 group-hover:text-muted-foreground/60"
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => router.push(`/playground/${project.id}`)}
                className="flex min-w-0 flex-1 items-center gap-4 text-left"
              >
                <span className="hidden w-20 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:block">
                  {style.label}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold tracking-tight transition-colors group-hover:text-iris">
                    {project.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {project.description ?? "No description yet."}
                  </span>
                </span>
              </button>

              <span className="hidden shrink-0 text-xs text-muted-foreground md:block">
                {format(new Date(project.createdAt), "MMM d, yyyy")}
              </span>

              <Avatar className="size-7 shrink-0">
                <AvatarImage
                  src={project.user.image ?? undefined}
                  alt={project.user.name ?? "User"}
                />
                <AvatarFallback className="bg-foreground text-[10px] text-background">
                  {(project.user.name ?? project.user.email)
                    .slice(0, 1)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Project actions"
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/playground/${project.id}`)
                    }
                  >
                    <ExternalLink className="mr-2 size-4" />
                    Open in editor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openEdit(project)}>
                    <Edit3 className="mr-2 size-4" />
                    Edit details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicate(project)}>
                    <Copy className="mr-2 size-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyLink(project.id)}>
                    <Link2 className="mr-2 size-4" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteTarget(project)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>

      {/* Edit dialog */}
      <Dialog
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Update the name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Project name</Label>
              <Input
                id="edit-title"
                value={editData.title}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                rows={3}
                value={editData.description}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button variant="brand" onClick={saveEdit} disabled={busy}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} and all of its files will be permanently
              removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={remove}
              disabled={busy}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
