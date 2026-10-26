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
    toast.success("Project created ✦");
    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`);
  };
  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="group w-full text-left bg-[#D6FF00] text-black border-[3px] border-black shadow-[6px_6px_0_#F4F4F0] p-5 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_#F4F4F0] transition-all flex flex-col rotate-[-0.4deg]">
        <div className="flex items-start justify-between w-full"><div className="mono text-[10px] font-black tracking-[0.12em]">NEW PLAYGROUND ✦</div><span className="text-[16px] font-black">→</span></div>
        <div className="display text-[22px] mt-2 leading-none">START FROM TEMPLATE</div>
        <div className="mono text-[11px] font-bold leading-5 text-black/70 mt-1">React / Next / Vue / Angular / Express / Hono — 6 starters. Paste config and it runs fr fr.</div>
        <div className="mt-3 mono text-[10px] font-black flex gap-3"><span className="bg-black text-white px-1.5 py-0.5">6 TEMPLATES</span><span className="bg-white text-black border-2 border-black px-1.5 py-0.5">TAKES 10s ✦</span></div>
      </button>
      <TemplateSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};
export default AddNewButton;
