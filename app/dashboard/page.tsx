import EmptyState from "@/components/ui/empty-state";
import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getAllPlaygroundForUser,
} from "@/features/dashboard/actions";
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepoButton from "@/features/dashboard/components/add-repo-button";
import ProjectTable from "@/features/dashboard/components/project-table";
import React from "react";
import { Sparkles, Clock, Folder, TrendingUp } from "lucide-react";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();

  const hasProjects = playgrounds && playgrounds.length > 0;

  return (
    <div className="mx-auto max-w-[1060px] px-6 py-8">
      {/* Greeting header - Apple style */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-white leading-tight">
              Good morning.
            </h1>
            <p className="mt-1 text-[15px] leading-6 text-[#6e6e73] dark:text-[#a1a1a6] max-w-[520px]">
              Here&apos;s what&apos;s happening with your projects today. Pick up where you left off.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 px-3 py-2 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-[#86868b]" />
              <span className="text-[12px] font-medium text-[#1d1d1f] dark:text-white">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats cards - Apple overview */}
        {hasProjects && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-[16px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/10 p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#0071e3] flex items-center justify-center flex-shrink-0">
                <Folder className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#86868b]">Total Projects</div>
                <div className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-white leading-none mt-0.5">
                  {playgrounds.length}
                </div>
              </div>
              <TrendingUp className="ml-auto h-4 w-4 text-[#34c759]" />
            </div>
            <div className="rounded-[16px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/10 p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#34c759] flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#86868b]">AI Assists</div>
                <div className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-white leading-none mt-0.5">
                  1.2k
                </div>
              </div>
              <span className="ml-auto rounded-full bg-[#34c759]/10 px-2 py-1 text-[11px] font-semibold text-[#34c759]">+12%</span>
            </div>
            <div className="rounded-[16px] bg-[#1d1d1f] dark:bg-black border border-black/10 p-4 flex items-center gap-3 text-white">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-[13px] font-medium text-white/60">Time saved</div>
                <div className="text-[20px] font-semibold tracking-[-0.02em] leading-none mt-0.5">18.4h</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddNewButton />
        <AddRepoButton />
      </div>

      {/* Projects */}
      <div className="mt-8">
        {!hasProjects ? (
          <div className="rounded-[18px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/10 p-8">
            <EmptyState
              title="No projects yet"
              description="Create your first project to get started. Choose from 6 beautiful templates."
              imageSrc="/empty-state.svg"
            />
            <div className="mt-6 flex justify-center">
              <p className="text-[12px] text-[#86868b] text-center max-w-[360px]">
                Tip: Try &quot;React&quot; for UI or &quot;Next.js&quot; for fullstack. Your project will be ready in seconds.
              </p>
            </div>
          </div>
        ) : (
          <ProjectTable
            // @ts-ignore
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            onDuplicateProject={duplicateProjectById}
          />
        )}
      </div>

      {/* Footer tip - Apple style */}
      <div className="mt-8 rounded-[16px] bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.04] dark:border-white/5 p-4 flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-[#0071e3] flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#1d1d1f] dark:text-white">New in CodePilot 2.0 — AI Code Review</div>
          <div className="text-[12px] leading-5 text-[#515154] dark:text-[#a1a1a6] mt-0.5">
            Get instant feedback on performance, accessibility, and security. Try it on your next project.
          </div>
        </div>
        <button className="hidden sm:inline-flex h-7 items-center rounded-full bg-white dark:bg-[#2c2c2e] border border-black/5 dark:border-white/10 px-3 text-[12px] font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] transition-colors flex-shrink-0">
          Try now
        </button>
      </div>
    </div>
  );
};

export default Page;
