"use client";

import React, { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubComingSoonDialog } from "@/components/coming-soon-dialog";

const AddRepoButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-full px-5"
        onClick={() => setOpen(true)}
      >
        <ArrowDownToLine className="size-4" />
        Import from GitHub
      </Button>

      <GitHubComingSoonDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default AddRepoButton;
