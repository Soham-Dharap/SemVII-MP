"use client";
import React from "react";
import { ArrowUpRight, GitFork, Star, Code2 } from "lucide-react";

const AddRepoButton = () => {
  return (
    <div className="group relative flex flex-col justify-between rounded-[18px] bg-[#1d1d1f] dark:bg-black text-white p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1d1d1f]">
          <Code2 className="h-5 w-5" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 group-hover:bg-white group-hover:text-black transition-colors">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="relative mt-6">
        <h3 className="text-[17px] font-semibold tracking-[-0.022em] text-white">
          Import from GitHub
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-white/60">
          Connect a repository and start editing instantly.
        </p>
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[12px] text-white/60">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Auto-sync
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            Private & public
          </span>
        </div>
        <div className="hidden sm:flex h-6 items-center rounded-full bg-white/10 px-2.5 text-[11px] font-medium text-white/90">
          Soon
        </div>
      </div>
    </div>
  );
};

export default AddRepoButton;
