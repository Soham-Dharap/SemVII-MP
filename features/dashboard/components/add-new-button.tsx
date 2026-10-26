"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TemplateSelectionModal from "./template-selection-modal";
import { createPlayground } from "../actions";
import { toast } from "sonner";
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
    toast.success("Project created successfully");
    setIsModalOpen(false);
    router.push(`/playground/${result.id}`);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Create a new project"
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setIsModalOpen(true);
        }}
        className="group flex cursor-pointer flex-row items-center justify-between rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
      >
        <div className="flex flex-row items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-white transition-colors group-hover:border-blue-300 group-hover:text-blue-600"
          >
            <Plus size={26} />
          </Button>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              Add new
            </h2>
            <p className="max-w-60 text-sm text-zinc-500">
              Create a project from a ready-made template
            </p>
          </div>
        </div>
        <div className="relative hidden overflow-hidden sm:block">
          <Image
            src="/add-new.svg"
            alt="Create a new project"
            width={110}
            height={110}
            className="transition-transform duration-300 group-hover:scale-105"
          />
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
