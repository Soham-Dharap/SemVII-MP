"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateSelectionModal from "./template-selection-modal";
import { createPlayground } from "../actions";
import { toast } from "sonner";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleSubmit = async (data: { title: string; template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR"; description?: string; }) => {
    const res = await createPlayground(data);
    toast.success("Project created ✨");
    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`);
  };
  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="group w-full text-left bg-primary text-primary-foreground rounded-[20px] p-6 hover:opacity-[0.92] transition-all shadow-lg shadow-primary/20 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="relative flex items-start justify-between w-full">
          <div className="label text-[11px] text-primary-foreground/80">New playground</div>
          <span className="h-7 w-7 rounded-full bg-primary-foreground/15 flex items-center justify-center text-[12px] group-hover:translate-x-0.5 transition">→</span>
        </div>
        <div className="relative display text-[20px] mt-3 leading-none">Start from template</div>
        <div className="relative text-[13px] leading-5 opacity-90 mt-2">React, Next.js, Vue, Angular, Express, Hono — six starters, zero config.</div>
        <div className="relative mt-4 flex gap-2 mono text-[11px]">
          <span className="bg-primary-foreground/15 px-2.5 py-1 rounded-full">6 templates</span>
          <span className="bg-primary-foreground/15 px-2.5 py-1 rounded-full">10s setup</span>
        </div>
      </button>
      <TemplateSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};
export default AddNewButton;
