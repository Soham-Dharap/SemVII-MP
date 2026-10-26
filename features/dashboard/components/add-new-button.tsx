"use client";

import React, { useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import Image from "next/image";
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
  }) => {
    const result = await createPlayground(data);
    if (!result) {
      toast.error("Could not create the project. Please try again.");
      return;
    }
    toast.success("Project created");
    setIsModalOpen(false);
    router.push(`/playground/${result.id}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-iris/40 hover:shadow-lg"
      >
        <div>
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-iris text-white shadow-sm shadow-iris/30 transition-transform duration-300 group-hover:scale-105">
            <Plus className="size-5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            New project
          </h2>
          <p className="mt-1 max-w-60 text-sm text-muted-foreground">
            Start from a React, Next.js, Vue and more template
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-iris">
            Create
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
        <Image
          src="/add-new.svg"
          alt=""
          width={120}
          height={120}
          unoptimized
          className="absolute -bottom-4 -right-4 size-28 opacity-60 transition-transform duration-300 group-hover:scale-110 sm:size-32"
        />
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
