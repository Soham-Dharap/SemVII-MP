"use client";

import React, { useState } from "react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { GitHubComingSoonDialog } from "@/components/coming-soon-dialog";

const AddRepoButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-dashed border-border bg-muted/40 p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-iris/40 hover:bg-card hover:shadow-lg"
      >
        <div>
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-foreground text-white transition-transform duration-300 group-hover:scale-105">
            <ArrowDownToLine className="size-5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            Import from GitHub
          </h2>
          <p className="mt-1 max-w-60 text-sm text-muted-foreground">
            Clone an existing repository — arriving in Version 2
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            Roadmap
            <ArrowUpRight className="size-3" />
          </span>
        </div>
        <Image
          src="/github.svg"
          alt=""
          width={120}
          height={120}
          unoptimized
          className="absolute -bottom-4 -right-4 size-28 opacity-50 transition-transform duration-300 group-hover:scale-110 sm:size-32"
        />
      </button>

      <GitHubComingSoonDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default AddRepoButton;
