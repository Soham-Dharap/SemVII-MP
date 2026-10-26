"use client";
import React from "react";

const AddRepoButton = () => {
  return (
    <div className="border border-[#E8E0CC] bg-white p-4 flex flex-col">
      <div className="mono text-[10px] tracking-[0.08em] uppercase text-[#6B6560]">Import</div>
      <div className="display text-[16px] mt-1 text-[#0F0E0C]">From GitHub</div>
      <div className="mono text-[11px] leading-5 text-[#6B6560] mt-1">Clone and edit directly — no local setup. Public repos only for now.</div>
      <div className="mt-3 mono text-[10px] tracking-[0.06em] uppercase border border-[#E8E0CC] bg-[#F6F2E6] px-2 py-1 w-fit text-[#6B6560]">Coming soon</div>
    </div>
  );
};

export default AddRepoButton;
