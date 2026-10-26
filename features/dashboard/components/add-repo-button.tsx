"use client";
import React from "react";
import { ArrowUpRight, GitBranch } from "lucide-react";

const AddRepoButton = () => {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#111] p-5 hover:border-black/20 dark:hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-[#111] dark:text-white">
          <GitBranch className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-[#999] group-hover:text-[#111] dark:group-hover:text-white transition-colors" />
      </div>

      <div className="mt-5">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111] dark:text-white">
          Import repository
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-[#666] dark:text-[#999]">
          Clone from GitHub and edit directly — no local setup.
        </p>
      </div>

      <div className="mt-4 inline-flex items-center rounded-full bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 px-2.5 py-1 text-[11px] font-medium text-[#666] dark:text-[#999] w-fit">
        Coming soon
      </div>
    </div>
  );
};

export default AddRepoButton;
