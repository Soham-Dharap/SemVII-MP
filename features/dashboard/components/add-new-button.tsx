"use client";
import React, { useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
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
      <div
        onClick={() => setIsModalOpen(true)}
        className="group flex flex-col justify-between rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-5 cursor-pointer hover:border-black/20 dark:hover:border-white/20 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#111] dark:bg-white text-white dark:text-black">
            <Plus className="h-4 w-4" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#999] group-hover:text-[#111] dark:group-hover:text-white transition-colors" />
        </div>

        <div className="mt-5">
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111] dark:text-white">
            New project
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-[#666] dark:text-[#999]">
            Start from a template — React, Next.js, Vue and more.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[12px] text-[#888]">
          <span>6 templates</span>
          <span className="h-3 w-px bg-black/10 dark:bg-white/10" />
          <span>Takes 10s</span>
        </div>
      </div>

      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
