"use client";
import React from "react";
const AddRepoButton = () => {
  return (
    <div className="bg-white text-black border-[3px] border-black shadow-[6px_6px_0_#F4F4F0] p-5 flex flex-col rotate-[0.3deg]">
      <div className="mono text-[10px] font-black tracking-[0.12em]">IMPORT ✦</div>
      <div className="display text-[18px] mt-1">FROM GITHUB</div>
      <div className="mono text-[11px] font-bold leading-5 text-black/60 mt-1">Clone and edit directly — no local setup. Public repos only for now.</div>
      <div className="mt-3 mono text-[10px] font-black bg-black text-white px-2 py-1 w-fit border-2 border-black">COMING SOON →</div>
    </div>
  );
};
export default AddRepoButton;
