"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { Project } from "../type";

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject: (id: string, data: { title: string; description: string }) => Promise<unknown>;
  onDeleteProject: (id: string) => Promise<void>;
  onDuplicateProject: (id: string) => Promise<unknown>;
}

interface EditProjectData {
  title: string;
  description: string;
}

const TEMPLATE_BADGE_CLASS: Record<string, string> = {
  REACT: "bg-sky-50 text-sky-700 border-sky-200",
  NEXTJS: "bg-zinc-100 text-zinc-700 border-zinc-200",
  EXPRESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  VUE: "bg-green-50 text-green-700 border-green-200",
  HONO: "bg-orange-50 text-orange-700 border-orange-200",
  ANGULAR: "bg-red-50 text-red-700 border-red-200",
};

export default function ProjectTable({
  projects,
  onDeleteProject,
  onDuplicateProject,
  onUpdateProject,
}: ProjectTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [editData, setEditData] = useState<EditProjectData>({
    title: "",
    description: "",
  });
  const [isBusy, setIsBusy] = useState(false);
  const [starredIds, setStarredIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      projects.map((project) => [
        project.id,
        Boolean(project.Starmark?.[0]?.isMarked),
      ]),
    ),
  );

  const openEdit = (project: Project) => {
    setEditTarget(project);
    setEditData({
      title: project.title,
      description: project.description ?? "",
    });
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    if (!editData.title.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }
    setIsBusy(true);
    await onUpdateProject(editTarget.id, {
      title: editData.title.trim(),
      description: editData.description,
    });
    setIsBusy(false);
    setEditTarget(null);
    toast.success("Project updated");
    router.refresh();
  };

  const handleDuplicate = async (project: Project) => {
    const result = await onDuplicateProject(project.id);
    if (result) {
      toast.success("Project duplicated");
      router.refresh();
    } else {
      toast.error("Could not duplicate the project");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsBusy(true);
    await onDeleteProject(deleteTarget.id);
    setIsBusy(false);
    setDeleteTarget(null);
    toast.success("Project deleted");
    router.refresh();
  };

  const copyProjectUrl = async (projectId: string) => {
    const url = `${window.location.origin}/playground/${projectId}`;
    await navigator.clipboard.writeText(url);
    toast.success("Project link copied");
  };

  const handleStar = async (project: Project) => {
    const next = !starredIds[project.id];
    setStarredIds((previous) => ({ ...previous, [project.id]: next }));
    const result = await toggleProjectStar(project.id);
    if (result === null) {
      setStarredIds((previous) => ({ ...previous, [project.id]: !next }));
      toast.error("Could not update star");
    }
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/70">
              <TableHead>Project</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="hover:bg-zinc-50/60">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      aria-label={
                        starredIds[project.id] ? "Unstar project" : "Star project"
                      }
                      onClick={() => handleStar(project)}
                      className="rounded-md p-1 transition-colors hover:bg-zinc-100"
                    >
                      <Star
                        className={`size-4 ${
                          starredIds[project.id]
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-300 hover:text-zinc-400"
                        }`}
                      />
                    </button>
                    <a
                      href={`/playground/${project.id}`}
                      className="font-medium text-zinc-900 hover:text-blue-700 hover:underline"
                    >
                      {project.title}
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      TEMPLATE_BADGE_CLASS[project.template] ??
                      "bg-zinc-100 text-zinc-700 border-zinc-200"
                    }
                  >
                    {project.template}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {format(new Date(project.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarImage
                        src={project.user.image ?? undefined}
                        alt={project.user.name ?? "User"}
                      />
                      <AvatarFallback className="bg-zinc-800 text-xs text-white">
                        {(project.user.name ?? project.user.email)
                          .slice(0, 1)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-zinc-600">
                      {project.user.name ?? project.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex size-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100"
                      aria-label="Open project actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem>
                        <a
                          href={`/playground/${project.id}`}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 size-4" />
                          Open Project
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(`/playground/${project.id}`, "_blank")
                        }
                      >
                        <ExternalLink className="mr-2 size-4" />
                        Open in New Tab
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEdit(project)}>
                        <Edit3 className="mr-2 size-4" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(project)}>
                        <Copy className="mr-2 size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyProjectUrl(project.id)}
                      >
                        <ExternalLink className="mr-2 size-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteTarget(project)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              Update the name and description of this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Project name</Label>
              <Input
                id="edit-title"
                value={editData.title}
                onChange={(event) =>
                  setEditData((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={editData.description}
                onChange={(event) =>
                  setEditData((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleEditSave}
              disabled={isBusy}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} and all of its files will be permanently
              deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isBusy}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
