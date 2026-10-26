"use client";
import Image from "next/image";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal, Edit3, Trash2, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { Project } from "../type";
interface ProjectTableProps { projects: Project[]; onUpdateProject?: Function; onDeleteProject?: Function; onDuplicateProject?: Function; }
export default function ProjectTable({ projects, onDeleteProject, onDuplicateProject, onUpdateProject }: ProjectTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleEditClick = (project: Project) => { setSelectedProject(project); setEditData({ title: project.title, description: project.description || "" }); setEditDialogOpen(true); };
  const handleEditSubmit = async () => { if (!selectedProject || !onUpdateProject) return; setIsLoading(true); try { await onUpdateProject(selectedProject.id, editData); toast.success("Project updated"); setEditDialogOpen(false); } catch { toast.error("Failed"); } finally { setIsLoading(false); } };
  const copyUrl = async (id: string) => { await navigator.clipboard.writeText(`${window.location.origin}/playground/${id}`); toast.success("Link copied"); };
  const handleDuplicate = async (project: Project) => { if (!onDuplicateProject) return; setIsLoading(true); try { await onDuplicateProject(project.id); toast.success("Duplicated"); } catch { toast.error("Failed"); } finally { setIsLoading(false); } };
  const confirmDelete = async () => { if (!selectedProject || !onDeleteProject) return; setIsLoading(true); try { await onDeleteProject(selectedProject.id); toast.success("Deleted"); setDeleteDialogOpen(false); } catch { toast.error("Failed"); } finally { setIsLoading(false); } };
  if (projects.length === 0) return null;
  return (
    <>
      <div className="border border-border bg-card rounded-[16px] overflow-hidden">
        <div className="flex items-center justify-between px-3 sm:px-4 h-[40px] bg-muted border-b border-border">
          <h2 className="mono text-[11px] font-semibold tracking-widest">Recent playgrounds</h2><span className="mono text-[10px] bg-secondary border border-border px-2 py-1 rounded-full">{projects.length} total</span>
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full mono text-[11px]">
            <thead><tr className="bg-muted text-muted-foreground border-b border-border text-left"><th className="px-4 py-2 font-medium">PROJECT</th><th className="px-3 py-2 font-medium">TEMPLATE</th><th className="px-3 py-2 font-medium">CREATED</th><th className="px-3 py-2 font-medium">OWNER</th><th className="w-10" /></tr></thead>
            <tbody className="divide-y divide-border">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-accent bg-card">
                  <td className="px-3 sm:px-4 py-3">
                    <Link href={`/playground/${p.id}`} className="flex items-center gap-3 group">
                      <span className="h-7 w-7 rounded-[8px] bg-foreground text-background flex items-center justify-center mono text-[10px] font-bold shrink-0">{p.template[0]}</span>
                      <div className="min-w-0"><div className="text-[12px] font-semibold group-hover:underline truncate max-w-[260px]">{p.title}</div><div className="text-[11px] text-muted-foreground truncate max-w-[260px]">{p.description || "No description"}</div></div>
                    </Link>
                  </td>
                  <td className="px-3 py-3"><span className="bg-secondary border border-border px-2 py-1 rounded-full text-[10px] font-semibold">{p.template}</span></td>
                  <td className="px-3 py-3 text-muted-foreground">{format(new Date(p.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><Image src={p.user.image || "/placeholder.svg"} alt="" width={18} height={18} className="h-[18px] w-[18px] rounded-full border border-border" /><span className="truncate max-w-[100px]">{p.user.name}</span></div></td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="mono text-[11px] min-w-[160px] z-50">
                        <DropdownMenuItem onClick={() => router.push(`/playground/${p.id}`)}><ExternalLink className="h-3.5 w-3.5 mr-2" />Open</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(p)}><Edit3 className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(p)}><Copy className="h-3.5 w-3.5 mr-2" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyUrl(p.id)}><Copy className="h-3.5 w-3.5 mr-2" />Copy link</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setSelectedProject(p); setDeleteDialogOpen(true); }} className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden divide-y divide-border">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-accent">
              <Link href={`/playground/${p.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <span className="h-8 w-8 rounded-[10px] bg-foreground text-background flex items-center justify-center mono text-[10px] font-bold shrink-0">{p.template[0]}</span>
                <div className="flex-1 min-w-0"><div className="text-[12px] font-semibold truncate">{p.title}</div><div className="mono text-[10px] text-muted-foreground">{p.template} · {format(new Date(p.createdAt), "MMM d")}</div></div>
                <span className="mono text-[12px] shrink-0">→</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:bg-accent bg-card shrink-0 focus-visible:outline-none">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mono text-[11px] min-w-[160px] z-50">
                  <DropdownMenuItem onClick={() => router.push(`/playground/${p.id}`)}><ExternalLink className="h-3.5 w-3.5 mr-2" />Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditClick(p)}><Edit3 className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(p)}><Copy className="h-3.5 w-3.5 mr-2" />Duplicate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyUrl(p.id)}><Copy className="h-3.5 w-3.5 mr-2" />Copy link</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setSelectedProject(p); setDeleteDialogOpen(true); }} className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
        <div className="px-4 h-[28px] flex items-center justify-between bg-muted border-t border-border mono text-[10px] text-muted-foreground"><span>{projects.length} playgrounds</span><span>Private by default</span></div>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}><DialogContent className="bg-card border-border max-w-[520px] w-[95vw]"><DialogHeader><DialogTitle className="display text-[18px]">Edit playground</DialogTitle><DialogDescription className="mono text-[11px] text-muted-foreground">Make changes to your playground details.</DialogDescription></DialogHeader><div className="grid gap-3 py-2"><div className="grid gap-1.5"><Label className="mono text-[10px] font-semibold">TITLE</Label><Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="h-9 bg-background mono text-[12px]" /></div><div className="grid gap-1.5"><Label className="mono text-[10px] font-semibold">DESCRIPTION</Label><Textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className="min-h-[70px] bg-background mono text-[11px] resize-none" /></div></div><DialogFooter><Button variant="ghost" onClick={() => setEditDialogOpen(false)} className="mono text-[11px]">Cancel</Button><Button onClick={handleEditSubmit} disabled={isLoading} className="bg-primary text-primary-foreground mono text-[11px]">Save changes</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><AlertDialogContent className="bg-card border-border max-w-[420px] w-[95vw]"><AlertDialogHeader><AlertDialogTitle className="display text-[18px]">Delete playground?</AlertDialogTitle><AlertDialogDescription className="mono text-[11px]">This will permanently delete “{selectedProject?.title}”. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="mono text-[11px]">Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} disabled={isLoading} className="bg-destructive text-destructive-foreground mono text-[11px]">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
