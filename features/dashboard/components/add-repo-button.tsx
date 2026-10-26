"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { GitHubComingSoonDialog } from "@/components/coming-soon-dialog";

const AddRepoButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Open a GitHub repository"
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setOpen(true);
        }}
        className="group flex cursor-pointer flex-row items-center justify-between rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
      >
        <div className="flex flex-row items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-white transition-colors group-hover:border-blue-300 group-hover:text-blue-600"
          >
            <ArrowDown size={26} />
          </Button>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              Open GitHub Repository
            </h2>
            <p className="max-w-60 text-sm text-zinc-500">
              Import your repositories — arriving in Version 2
            </p>
          </div>
        </div>
        <div className="relative hidden overflow-hidden sm:block">
          <Image
            src="/github.svg"
            alt="GitHub"
            width={110}
            height={110}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <GitHubComingSoonDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default AddRepoButton;
