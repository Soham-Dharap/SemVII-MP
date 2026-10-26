"use client";
import Image from "next/image";
import { format } from "date-fns";
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
import { MoreHorizontal, Edit3, Trash2, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { Project } from "../type";

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject?: Function;
  onDeleteProject?: Function;
  onDuplicateProject?: Function;
}

export default function ProjectTable({ projects, onDeleteProject, onDuplicateProject, onUpdateProject }: ProjectTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditData({ title: project.title, description: project.description || "" });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedProject || !onUpdateProject) return;
    setIsLoading(true);
    try { await onUpdateProject(selectedProject.id, editData); toast.success("Project updated"); setEditDialogOpen(false); } catch { toast.error("Failed to update"); } finally { setIsLoading(false); }
  };

  const copyUrl = async (id: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/playground/${id}`);
    toast.success("Link copied");
  };

  const handleDuplicate = async (project: Project) => {
    if (!onDuplicateProject) return;
    setIsLoading(true);
    try { await onDuplicateProject(project.id); toast.success("Duplicated"); } catch { toast.error("Failed"); } finally { setIsLoading(false); }
  };

  const confirmDelete = async () => {
    if (!selectedProject || !onDeleteProject) return;
    setIsLoading(true);
    try { await onDeleteProject(selectedProject.id); toast.success("Deleted"); setDeleteDialogOpen(false); } catch { toast.error("Failed"); } finally { setIsLoading(false); }
  };

  if (projects.length === 0) return null;

  const templateMono: Record<string, string> = {
    REACT: "REACT", NEXTJS: "NEXT.JS", EXPRESS: "EXPRESS", VUE: "VUE", HONO: "HONO", ANGULAR: "NGULAR",
  };

  return (
    <>
      <div className="border border-[#0F0E0C] bg-white">
        <div className="flex items-center justify-between px-4 h-[36px] bg-[#F6F2E6] border-b border-[#0F0E0C]">
          <h2 className="mono text-[11px] tracking-[0.08em] uppercase text-[#0F0E0C]">Recent playgrounds</h2>
          <span className="mono text-[11px] text-[#6B6560]">{projects.length} total</span>
        </div>

        {/* Desktop table — dense, hairline */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full mono text-[11px]">
            <thead>
              <tr className="border-b border-[#E8E0CC] bg-white text-left">
                <th className="px-4 py-2 font-medium tracking-[0.08em] uppercase text-[#6B6560]">Project</th>
                <th className="px-3 py-2 font-medium tracking-[0.08em] uppercase text-[#6B6560]">Template</th>
                <th className="px-3 py-2 font-medium tracking-[0.08em] uppercase text-[#6B6560]">Created</th>
                <th className="px-3 py-2 font-medium tracking-[0.08em] uppercase text-[#6B6560]">Owner</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0CC]">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFFEFB]">
                  <td className="px-4 py-3">
                    <Link href={`/playground/${p.id}`} className="flex items-center gap-3 group">
                      <span className="h-6 w-6 border border-[#E8E0CC] bg-[#F6F2E6] flex items-center justify-center mono text-[9px] text-[#0F0E0C]">{templateMono[p.template]?.[0] || "R"}</span>
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium text-[#0F0E0C] group-hover:underline decoration-[#E8E0CC] underline-offset-4 truncate max-w-[280px]">{p.title}</div>
                        <div className="text-[11px] text-[#6B6560] truncate max-w-[280px]">{p.description || "No description"}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[#0F0E0C] tracking-[0.04em]">{templateMono[p.template] || p.template}</td>
                  <td className="px-3 py-3 text-[#6B6560]">{format(new Date(p.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Image src={p.user.image || "/placeholder.svg"} alt="" width={18} height={18} className="h-[18px] w-[18px] rounded-full border border-[#E8E0CC]" />
                      <span className="text-[#0F0E0C] truncate max-w-[100px]">{p.user.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-6 w-6 inline-flex items-center justify-center border border-transparent hover:border-[#E8E0CC] hover:bg-[#F6F2E6]"> <MoreHorizontal className="h-3.5 w-3.5" /> </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="mono text-[11px]">
                        <DropdownMenuItem><Link href={`/playground/${p.id}`} className="flex items-center w-full"><ExternalLink className="h-3.5 w-3.5 mr-2" />Open</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(p)}><Edit3 className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(p)}><Copy className="h-3.5 w-3.5 mr-2" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyUrl(p.id)}><Copy className="h-3.5 w-3.5 mr-2" />Copy link</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setSelectedProject(p); setDeleteDialogOpen(true); }} className="text-[#B42318]"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list — also hairline */}
        <div className="sm:hidden divide-y divide-[#E8E0CC]">
          {projects.map((p) => (
            <Link key={p.id} href={`/playground/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F6F2E6]">
              <span className="h-8 w-8 border border-[#E8E0CC] bg-[#F6F2E6] flex items-center justify-center mono text-[10px]">{templateMono[p.template]?.[0] || "R"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium truncate">{p.title}</div>
                <div className="mono text-[10px] text-[#6B6560]">{p.template} · {format(new Date(p.createdAt), "MMM d")}</div>
              </div>
              <span className="mono text-[11px]">→</span>
            </Link>
          ))}
        </div>

        <div className="px-4 h-[28px] flex items-center justify-between border-t border-[#E8E0CC] bg-[#F6F2E6] mono text-[10px] text-[#6B6560]">
          <span>{projects.length} playgrounds · Drag to reorder (soon)</span>
          <span className="hidden sm:inline">Private by default</span>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#FFFEFB] border border-[#0F0E0C]">
          <DialogHeader><DialogTitle className="display text-[16px]">Edit playground</DialogTitle><DialogDescription className="mono text-[11px] text-[#6B6560]">Make changes to your playground details.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5"><Label className="mono text-[10px] tracking-[0.06em] uppercase">Title</Label><Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="h-8 border-[#E8E0CC] bg-white mono text-[12px]" /></div>
            <div className="grid gap-1.5"><Label className="mono text-[10px] tracking-[0.06em] uppercase">Description</Label><Textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className="min-h-[70px] border-[#E8E0CC] bg-white mono text-[11px] resize-none" /></div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setEditDialogOpen(false)} className="mono text-[11px]">Cancel</Button><Button onClick={handleEditSubmit} disabled={isLoading} className="bg-[#0F0E0C] text-[#FFFEFB] mono text-[11px] hover:bg-[#1A1917]">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#FFFEFB] border border-[#0F0E0C]">
          <AlertDialogHeader><AlertDialogTitle className="display text-[16px]">Delete playground?</AlertDialogTitle><AlertDialogDescription className="mono text-[11px] leading-5 text-[#6B6560]">This will permanently delete “{selectedProject?.title}” and all its files. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="mono text-[11px]">Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} disabled={isLoading} className="bg-[#B42318] hover:bg-[#9A1E14] mono text-[11px]">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
