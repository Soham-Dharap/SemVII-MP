import React from "react";
import { BrandMark } from "@/components/brand";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-dvh bg-background">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-foreground p-12 text-background lg:flex">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-iris/35 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <BrandMark size={34} />
          <span className="text-lg font-semibold tracking-tight">
            Codepilot
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.03em]">
            The entire dev environment,
            <span className="font-display italic font-normal text-background/70">
              {" "}
              in one tab.
            </span>
          </h2>
          <ul className="mt-10 space-y-5">
            {[
              "Six ready-made framework templates",
              "Live preview with in-browser JSX compilation",
              "Autosave — your work persists automatically",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-background/75">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-iris" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-xs uppercase tracking-[0.16em] text-background/40">
          Version 1 · Browser-native editor
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
