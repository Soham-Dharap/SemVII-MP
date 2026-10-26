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
      <div className="border border-border bg-card rounded-[20px] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 h-[44px] bg-muted/40 border-b border-border">
          <h2 className="label text-[11px]">Recent playgrounds</h2><span className="mono text-[11px] bg-card border border-border px-3 py-1 rounded-full shadow-sm">{projects.length} total</span>
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full mono text-[12px]">
            <thead><tr className="bg-muted/30 text-muted-foreground border-b border-border text-left"><th className="px-6 py-3 font-semibold label text-[11px]">PROJECT</th><th className="px-3 py-3 font-semibold label text-[11px]">TEMPLATE</th><th className="px-3 py-3 font-semibold label text-[11px]">CREATED</th><th className="px-3 py-3 font-semibold label text-[11px]">OWNER</th><th className="w-12" /></tr></thead>
            <tbody className="divide-y divide-border">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition bg-card">
                  <td className="px-6 py-4">
                    <Link href={`/playground/${p.id}`} className="flex items-center gap-3 group">
                      <span className="h-9 w-9 rounded-xl bg-foreground text-background flex items-center justify-center mono text-[11px] font-bold shrink-0 shadow-sm">{p.template[0]}</span>
                      <div className="min-w-0"><div className="text-[13px] font-bold group-hover:text-primary transition truncate max-w-[280px]">{p.title}</div><div className="text-[11px] text-muted-foreground truncate max-w-[280px]">{p.description || "No description"}</div></div>
                    </Link>
                  </td>
                  <td className="px-3 py-3"><span className="bg-secondary border border-border px-3 py-1 rounded-full text-[11px] font-bold">{p.template}</span></td>
                  <td className="px-3 py-3 text-muted-foreground mono text-[11px]">{format(new Date(p.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><Image src={p.user.image || "/placeholder.svg"} alt="" width={20} height={20} className="h-5 w-5 rounded-full border border-border" /><span className="truncate max-w-[100px] text-[12px] font-medium">{p.user.name}</span></div></td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent shadow-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="mono text-[12px] min-w-[170px] z-50 rounded-xl">
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
            <div key={p.id} className="flex items-center gap-3 px-4 py-4 hover:bg-muted/30">
              <Link href={`/playground/${p.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <span className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center mono text-[11px] font-bold shrink-0">{p.template[0]}</span>
                <div className="flex-1 min-w-0"><div className="text-[13px] font-bold truncate">{p.title}</div><div className="mono text-[11px] text-muted-foreground">{p.template} · {format(new Date(p.createdAt), "MMM d")}</div></div>
                <span className="h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center text-[12px] shrink-0">→</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border bg-card shadow-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mono text-[12px] min-w-[160px] z-50 rounded-xl">
                  <DropdownMenuItem onClick={() => router.push(`/playground/${p.id}`)}><ExternalLink className="h-3.5 w-3.5 mr-2" />Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditClick(p)}><Edit3 className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(p)}><Copy className="h-3.5 w-3.5 mr-2" />Duplicate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyUrl(p.id)}><Copy className="h-3.5 w-3.5 mr-2" />Copy link</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setSelectedProject(p); setDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
        <div className="px-6 h-[32px] flex items-center justify-between bg-muted/30 border-t border-border mono text-[11px] text-muted-foreground"><span>{projects.length} playgrounds</span><span>Private by default</span></div>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}><DialogContent className="bg-card border-border max-w-[520px] w-[95vw] rounded-[20px]"><DialogHeader><DialogTitle className="display text-[20px]">Edit playground</DialogTitle><DialogDescription className="text-[13px] text-muted-foreground">Make changes to your playground details.</DialogDescription></DialogHeader><div className="grid gap-4 py-2"><div className="grid gap-2"><Label className="label text-[11px]">TITLE</Label><Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="h-10 bg-background rounded-xl" /></div><div className="grid gap-2"><Label className="label text-[11px]">DESCRIPTION</Label><Textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className="min-h-[80px] bg-background rounded-xl resize-none" /></div></div><DialogFooter><Button variant="ghost" onClick={() => setEditDialogOpen(false)} className="rounded-full">Cancel</Button><Button onClick={handleEditSubmit} disabled={isLoading} className="bg-primary text-primary-foreground rounded-full">Save changes</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><AlertDialogContent className="bg-card border-border max-w-[420px] w-[95vw] rounded-[20px]"><AlertDialogHeader><AlertDialogTitle className="display text-[20px]">Delete playground?</AlertDialogTitle><AlertDialogDescription className="text-[13px]">This will permanently delete “{selectedProject?.title}”. Cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} disabled={isLoading} className="bg-destructive text-destructive-foreground rounded-full">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
