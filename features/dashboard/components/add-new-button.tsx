"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowUpRight } from "lucide-react";
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
    toast.success("Project created successfully");
    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col justify-between rounded-[18px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/10 p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 overflow-hidden"
      >
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d1d1f] dark:bg-white text-white dark:text-black group-hover:scale-105 transition-transform">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f5f7] dark:bg-white/10 group-hover:bg-[#1d1d1f] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="relative mt-6">
          <h3 className="text-[17px] font-semibold tracking-[-0.022em] text-[#1d1d1f] dark:text-white">
            New Project
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-[#6e6e73] dark:text-[#a1a1a6]">
            Start from a template. React, Next.js, Vue and more.
          </p>
        </div>

        <div className="relative mt-5 flex items-center gap-2">
          <div className="flex -space-x-1.5">
            <div className="h-6 w-6 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] border-2 border-white dark:border-[#1c1c1e] flex items-center justify-center">
              <img src="/react.svg" alt="" className="h-3.5 w-3.5" />
            </div>
            <div className="h-6 w-6 rounded-full bg-white dark:bg-[#1c1c1e] border-2 border-white dark:border-[#1c1c1e] flex items-center justify-center">
              <img src="/nextjs-icon.svg" alt="" className="h-3.5 w-3.5 dark:invert" />
            </div>
            <div className="h-6 w-6 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] border-2 border-white dark:border-[#1c1c1e] flex items-center justify-center">
              <img src="/vuejs-icon.svg" alt="" className="h-3.5 w-3.5" />
            </div>
          </div>
          <span className="text-[12px] font-medium text-[#86868b]">6 templates</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-2.5 py-1 text-[11px] font-semibold text-white">
            <Sparkles className="h-3 w-3" />
            AI Ready
          </span>
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
