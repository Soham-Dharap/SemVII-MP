"use client";

import React, { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TemplateSelectionModal from "./template-selection-modal";
import { createPlayground } from "../actions";
import type { TemplateName } from "../type";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    template: TemplateName;
    description?: string;
  }): Promise<boolean> => {
    const result = await createPlayground(data);
    if (!result) {
      toast.error("Could not create the project. Please try again.");
      return false;
    }
    toast.success("Project created — opening your editor");
    router.push(`/playground/${result.id}`);
    return true;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group flex h-full w-full flex-col justify-between gap-8 rounded-2xl border border-iris/25 bg-iris-soft/40 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-iris/50 hover:shadow-lg hover:shadow-iris/10"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-iris text-white shadow-sm shadow-iris/30 transition-transform duration-300 group-hover:scale-105">
          <Plus className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            New project
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Pick a starter stack and open the editor in seconds.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-iris">
            Start building
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
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
