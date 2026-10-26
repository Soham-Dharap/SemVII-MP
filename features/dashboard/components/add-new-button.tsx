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
    toast.success("Project created");
    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`);
  };
  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="group w-full text-left bg-primary text-primary-foreground border border-border rounded-[16px] p-5 hover:opacity-90 transition-opacity flex flex-col">
        <div className="flex items-start justify-between w-full"><div className="mono text-[10px] tracking-[0.08em] uppercase opacity-80">New playground</div><span className="mono text-[12px]">→</span></div>
        <div className="display text-[18px] mt-2 leading-none">Start from a template</div>
        <div className="mono text-[11px] leading-5 opacity-80 mt-1">React, Next.js, Vue, Angular, Express, Hono — six starters, paste your config and it runs.</div>
        <div className="mt-3 mono text-[10px] tracking-[0.06em] uppercase flex gap-3 opacity-80"><span>6 templates</span><span>•</span><span>Takes 10s</span></div>
      </button>
      <TemplateSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};
export default AddNewButton;
