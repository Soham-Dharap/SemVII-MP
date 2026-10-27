"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TemplateSelectionModal from "./template-selection-modal";
import { createPlayground } from "../actions";
import { Button } from "@/components/ui/button";
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
      <Button
        type="button"
        variant="brand"
        className="h-10 rounded-full px-5"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="size-4" />
        New project
      </Button>

      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
