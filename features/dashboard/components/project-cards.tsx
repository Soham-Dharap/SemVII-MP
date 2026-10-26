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

const TEMPLATE_STYLE: Record<TemplateName, { bg: string; label: string }> = {
  REACT: { bg: "bg-sky-500", label: "React" },
  NEXTJS: { bg: "bg-zinc-900", label: "Next.js" },
  EXPRESS: { bg: "bg-emerald-500", label: "Express" },
  VUE: { bg: "bg-green-500", label: "Vue" },
  HONO: { bg: "bg-orange-500", label: "Hono" },
  ANGULAR: { bg: "bg-red-500", label: "Angular" },
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const style =
            TEMPLATE_STYLE[project.template as TemplateName] ??
            TEMPLATE_STYLE.REACT;
          const isStarred = starred[project.id];

          return (
            <div
              key={project.id}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-iris/30 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-iris-soft">
                  <span
                    className={`size-5 rounded-md ${style.bg} opacity-90`}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={isStarred ? "Unstar" : "Star"}
                    onClick={() => toggleStar(project)}
                    className="rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <Star
                      className={`size-4 transition-colors ${
                        isStarred
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30 group-hover:text-muted-foreground/60"
                      }`}
                    />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
              </div>

              <button
                type="button"
                onClick={() => router.push(`/playground/${project.id}`)}
                className="text-left"
              >
                <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-iris">
                  {project.title}
                </h3>
                <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                  {project.description ?? "No description yet."}
                </p>
              </button>

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {style.label}
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
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
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(project.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
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
