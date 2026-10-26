"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateSelectionModal from "./template-selection-modal";
import { createPlayground } from "../actions";
import { toast } from "sonner";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    const res = await createPlayground(data);
    toast.success("Project created");
    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group w-full text-left border border-[#0F0E0C] bg-[#0F0E0C] text-[#FFFEFB] p-4 hover:bg-[#1A1917] transition-colors flex flex-col"
      >
        <div className="flex items-start justify-between w-full">
          <div className="mono text-[10px] tracking-[0.08em] uppercase text-white/60">New playground</div>
          <span className="mono text-[12px]">→</span>
        </div>
        <div className="display text-[18px] mt-2">Start from a template</div>
        <div className="mono text-[11px] leading-5 text-white/70 mt-1">React, Next.js, Vue, Angular, Express, Hono — six starters, paste your config and it runs.</div>
        <div className="mt-3 mono text-[10px] tracking-[0.06em] uppercase text-white/50 flex gap-3">
          <span>6 templates</span><span className="text-white/20">·</span><span>Takes 10s</span>
        </div>
      </button>

      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
