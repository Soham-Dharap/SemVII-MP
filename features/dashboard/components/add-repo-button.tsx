"use client";
import React from "react";
const AddRepoButton = () => {
  return (
    <div className="bg-card border border-border rounded-[16px] p-5 flex flex-col">
      <div className="mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground">Import</div>
      <div className="display text-[16px] mt-1">From GitHub</div>
      <div className="mono text-[11px] leading-5 text-muted-foreground mt-1">Clone and edit directly — no local setup. Public repos only for now.</div>
      <div className="mt-3 mono text-[10px] tracking-[0.06em] uppercase bg-secondary border border-border px-2 py-1 w-fit rounded-full text-muted-foreground">Coming soon</div>
    </div>
  );
};
export default AddRepoButton;
