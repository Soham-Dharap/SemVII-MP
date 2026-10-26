"use client";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
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
import Link from "next/link";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Star,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Project } from "../type";

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject?: Function;
  onDeleteProject?: Function;
  onDuplicateProject?: Function;
}

interface EditProjectData {
  title: string;
  description: string;
}

const templateMeta: Record<string, { color: string; icon: string }> = {
  REACT: { color: "bg-[#61DAFB] text-[#20232a]", icon: "/react.svg" },
  NEXTJS: { color: "bg-black text-white dark:bg-white dark:text-black", icon: "/nextjs-icon.svg" },
  EXPRESS: { color: "bg-[#68a063] text-white", icon: "/expressjs-icon.svg" },
  VUE: { color: "bg-[#4FC08D] text-white", icon: "/vuejs-icon.svg" },
  HONO: { color: "bg-[#ff5722] text-white", icon: "/hono.svg" },
  ANGULAR: { color: "bg-[#DD0031] text-white", icon: "/angular-2.svg" },
};

export default function ProjectTable({
  projects,
  onDeleteProject,
  onDuplicateProject,
  onUpdateProject,
}: ProjectTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState<EditProjectData>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return;
    setIsLoading(true);
    try {
      // @ts-ignore
      await onDuplicateProject(project.id);
      toast.success("Project duplicated");
    } catch (error) {
      toast.error("Failed to duplicate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (project: Project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedProject || !onUpdateProject) return;
    setIsLoading(true);
    try {
      // @ts-ignore
      await onUpdateProject(selectedProject.id, editData);
      toast.success("Project updated");
      setEditDialogOpen(false);
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  const copyProjectUrl = async (projectId: string) => {
    const url = `${window.location.origin}/playground/${projectId}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleDeleteClick = async (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject || !onDeleteProject) return;
    setIsLoading(true);
    try {
      // @ts-ignore
      await onDeleteProject(selectedProject.id);
      toast.success("Project deleted");
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  if (projects.length === 0) return null;

  return (
    <>
      {/* Apple-style card grid - replaces table on desktop, card list on mobile */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-white">
            Recent Projects
          </h2>
          <span className="text-[12px] text-[#86868b]">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Desktop: Table styled as Apple cards */}
        <div className="hidden sm:block overflow-hidden rounded-[18px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/10 bg-[#f5f5f7]/60 dark:bg-white/[0.03]">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold tracking-wide uppercase text-[#86868b]">
                    Project
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-wide uppercase text-[#86868b]">
                    Template
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-wide uppercase text-[#86868b]">
                    Created
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-wide uppercase text-[#86868b]">
                    Owner
                  </th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/5">
                {projects.map((project) => {
                  const meta = templateMeta[project.template] || templateMeta.REACT;
                  return (
                    <tr
                      key={project.id}
                      className="group hover:bg-[#f5f5f7]/60 dark:hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <Link href={`/playground/${project.id}`} className="flex items-center gap-3 group/link">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/5 dark:border-white/5 flex-shrink-0">
                            <Image src={meta.icon} alt="" width={16} height={16} className="opacity-80" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14px] font-medium tracking-[-0.01em] text-[#1d1d1f] dark:text-white group-hover/link:text-[#0071e3] transition-colors truncate">
                              {project.title}
                            </div>
                            <div className="text-[12px] text-[#86868b] truncate max-w-[280px]">
                              {project.description || "No description"}
                            </div>
                          </div>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#86868b] opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${meta.color}`}>
                          {project.template}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] text-[#515154] dark:text-[#a1a1a6]">
                          <Clock className="h-3.5 w-3.5 text-[#86868b]" />
                          {format(new Date(project.createdAt), "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Image
                            src={project.user.image || "/placeholder.svg"}
                            alt={project.user.name}
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full object-cover border border-black/5"
                          />
                          <span className="text-[13px] text-[#1d1d1f] dark:text-white font-medium truncate max-w-[120px]">
                            {project.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            aria-label="Open project actions"
                          >
                            <MoreHorizontal className="h-4 w-4 text-[#86868b]" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem>
                              <Link href={`/playground/${project.id}`} className="flex items-center w-full">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Project
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(project)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateProject(project)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyProjectUrl(project.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(project)}
                              className="text-[#ff3b30] focus:text-[#ff3b30]"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: Card grid */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {projects.map((project) => {
            const meta = templateMeta[project.template] || templateMeta.REACT;
            return (
              <Link
                key={project.id}
                href={`/playground/${project.id}`}
                className="rounded-[16px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/10 p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="h-10 w-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center flex-shrink-0">
                  <Image src={meta.icon} alt="" width={20} height={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#1d1d1f] dark:text-white truncate">{project.title}</div>
                  <div className="text-[12px] text-[#86868b] flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${meta.color}`}>{project.template}</span>
                    <span>•</span>
                    <span>{format(new Date(project.createdAt), "MMM d")}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#86868b] flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Edit Dialog - Apple style */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-[18px] sm:max-w-[480px] bg-white dark:bg-[#1c1c1e]">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-semibold tracking-[-0.02em]">Edit Project</DialogTitle>
            <DialogDescription className="text-[13px] text-[#6e6e73]">
              Make changes to your project details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-[12px] font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="h-9 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 focus-visible:ring-2 focus-visible:ring-[#0071e3]/30"
                placeholder="My awesome project"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[12px] font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="min-h-[80px] rounded-[12px] bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 focus-visible:ring-2 focus-visible:ring-[#0071e3]/30 resize-none"
                placeholder="What is this project about?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isLoading} variant="brand" className="rounded-full">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[18px] bg-white dark:bg-[#1c1c1e]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[17px] font-semibold">Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] leading-5 text-[#6e6e73]">
              This will permanently delete &quot;{selectedProject?.title}&quot; and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoading}
              className="rounded-full bg-[#ff3b30] hover:bg-[#ff3b30]/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
