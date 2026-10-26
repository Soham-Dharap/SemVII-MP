"use client";
import React from "react";
const AddRepoButton = () => {
  return (
    <div className="bg-card border border-border rounded-[20px] p-6 flex flex-col premium-card">
      <div className="label text-[11px]">Import</div>
      <div className="display text-[18px] mt-2">From GitHub</div>
      <div className="text-[12px] leading-5 text-muted-foreground mt-2">Clone and edit directly — no local setup. Public repos only for now.</div>
      <div className="mt-4 mono text-[11px] font-medium bg-secondary border border-border px-3 py-1 w-fit rounded-full text-muted-foreground">Coming soon • Q1 2026</div>
    </div>
  );
};
export default AddRepoButton;
