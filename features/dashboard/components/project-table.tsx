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
import { useState } from "react";
import { MoreHorizontal, Edit3, Trash2, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { Project } from "../type";
interface ProjectTableProps { projects: Project[]; onUpdateProject?: Function; onDeleteProject?: Function; onDuplicateProject?: Function; }
export default function ProjectTable({ projects, onDeleteProject, onDuplicateProject, onUpdateProject }: ProjectTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleEditClick = (project: Project) => { setSelectedProject(project); setEditData({ title: project.title, description: project.description || "" }); setEditDialogOpen(true); };
  const handleEditSubmit = async () => { if (!selectedProject || !onUpdateProject) return; setIsLoading(true); try { await onUpdateProject(selectedProject.id, editData); toast.success("Project updated ✦"); setEditDialogOpen(false); } catch { toast.error("Failed"); } finally { setIsLoading(false); } };
  const copyUrl = async (id: string) => { await navigator.clipboard.writeText(`${window.location.origin}/playground/${id}`); toast.success("Link copied"); };
  const handleDuplicate = async (project: Project) => { if (!onDuplicateProject) return; setIsLoading(true); try { await onDuplicateProject(project.id); toast.success("Duplicated ✦"); } catch { toast.error("Failed"); } finally { setIsLoading(false); } };
  const confirmDelete = async () => { if (!selectedProject || !onDeleteProject) return; setIsLoading(true); try { await onDeleteProject(selectedProject.id); toast.success("Deleted"); setDeleteDialogOpen(false); } catch { toast.error("Failed"); } finally { setIsLoading(false); } };
  if (projects.length === 0) return null;
  const tmpl: Record<string,string> = { REACT: "REACT", NEXTJS: "NEXT.JS", EXPRESS: "EXPRESS", VUE: "VUE", HONO: "HONO", ANGULAR: "ANGULAR" };
  return (
    <>
      <div className="border-[3px] border-black bg-white shadow-[6px_6px_0_#F4F4F0] overflow-hidden">
        <div className="flex items-center justify-between px-4 h-[40px] bg-black text-white border-b-[3px] border-black">
          <h2 className="mono text-[11px] font-black tracking-[0.12em]">RECENT PLAYGROUNDS ✦</h2><span className="mono text-[11px] font-black bg-[#D6FF00] text-black px-2 py-1 border-2 border-white">{projects.length} TOTAL</span>
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full mono text-[11px] font-bold">
            <thead><tr className="bg-[#D6FF00] text-black border-b-[3px] border-black text-left"><th className="px-4 py-2">PROJECT</th><th className="px-3 py-2">TEMPLATE</th><th className="px-3 py-2">CREATED</th><th className="px-3 py-2">OWNER</th><th className="w-10" /></tr></thead>
            <tbody className="divide-y-[3px] divide-black">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-[#F4F4F0] bg-white text-black">
                  <td className="px-4 py-3">
                    <Link href={`/playground/${p.id}`} className="flex items-center gap-3 group">
                      <span className="h-7 w-7 border-2 border-black bg-black text-[#D6FF00] flex items-center justify-center mono text-[10px] font-black">{tmpl[p.template]?.[0] || "R"}</span>
                      <div className="min-w-0"><div className="text-[12px] font-black group-hover:underline truncate max-w-[260px]">{p.title}</div><div className="text-[11px] font-bold text-black/60 truncate max-w-[260px]">{p.description || "No description"}</div></div>
                    </Link>
                  </td>
                  <td className="px-3 py-3"><span className="bg-black text-white px-1.5 py-0.5 border-2 border-black">{tmpl[p.template] || p.template}</span></td>
                  <td className="px-3 py-3 text-black/60">{format(new Date(p.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><Image src={p.user.image || "/placeholder.svg"} alt="" width={18} height={18} className="h-[18px] w-[18px] rounded-full border-2 border-black" /><span className="truncate max-w-[100px]">{p.user.name}</span></div></td>
                  <td className="px-3 py-3">
                    <DropdownMenu><DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center bg-white border-2 border-black hover:bg-[#D6FF00]"><MoreHorizontal className="h-3.5 w-3.5" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="mono text-[11px] font-bold border-2 border-black">
                        <DropdownMenuItem><Link href={`/playground/${p.id}`} className="flex items-center w-full"><ExternalLink className="h-3.5 w-3.5 mr-2" />Open</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(p)}><Edit3 className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(p)}><Copy className="h-3.5 w-3.5 mr-2" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyUrl(p.id)}><Copy className="h-3.5 w-3.5 mr-2" />Copy link</DropdownMenuItem>
                        <DropdownMenuSeparator /><DropdownMenuItem onClick={() => { setSelectedProject(p); setDeleteDialogOpen(true); }} className="text-[#FF2B6E]"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden divide-y-[3px] divide-black">
          {projects.map((p) => (
            <Link key={p.id} href={`/playground/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F4F0]">
              <span className="h-8 w-8 border-2 border-black bg-black text-[#D6FF00] flex items-center justify-center mono text-[10px] font-black">{tmpl[p.template]?.[0] || "R"}</span>
              <div className="flex-1 min-w-0"><div className="text-[12px] font-black truncate">{p.title}</div><div className="mono text-[10px] font-bold text-black/60">{p.template} · {format(new Date(p.createdAt), "MMM d")}</div></div><span className="mono text-[12px] font-black">→</span>
            </Link>
          ))}
        </div>
        <div className="px-4 h-[28px] flex items-center justify-between bg-black text-white border-t-[3px] border-black mono text-[10px] font-black"><span>{projects.length} PLAYGROUNDS ✦</span><span className="text-[#D6FF00]">PRIVATE BY DEFAULT</span></div>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}><DialogContent className="bg-white border-[3px] border-black text-black"><DialogHeader><DialogTitle className="display text-[18px]">EDIT PLAYGROUND ✦</DialogTitle><DialogDescription className="mono text-[11px] font-bold">Make changes.</DialogDescription></DialogHeader><div className="grid gap-3 py-2"><div className="grid gap-1.5"><Label className="mono text-[10px] font-black">TITLE</Label><Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="h-9 border-2 border-black bg-white mono text-[12px] font-bold" /></div><div className="grid gap-1.5"><Label className="mono text-[10px] font-black">DESCRIPTION</Label><Textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className="min-h-[70px] border-2 border-black bg-white mono text-[11px] font-bold resize-none" /></div></div><DialogFooter><Button variant="ghost" onClick={() => setEditDialogOpen(false)} className="mono text-[11px] font-black">Cancel</Button><Button onClick={handleEditSubmit} disabled={isLoading} className="bg-black text-white mono text-[11px] font-black border-2 border-black hover:bg-[#D6FF00] hover:text-black">Save ✦</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><AlertDialogContent className="bg-white border-[3px] border-black text-black"><AlertDialogHeader><AlertDialogTitle className="display text-[18px]">DELETE PLAYGROUND?</AlertDialogTitle><AlertDialogDescription className="mono text-[11px] font-bold">This will permanently delete “{selectedProject?.title}”. No undo fr.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="mono text-[11px] font-black border-2 border-black">Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} disabled={isLoading} className="bg-[#FF2B6E] hover:bg-[#E11A5A] mono text-[11px] font-black border-2 border-black">Delete ✦</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
