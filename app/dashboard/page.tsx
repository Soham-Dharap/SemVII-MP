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

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  const hasProjects = playgrounds && playgrounds.length > 0;

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-8">
      {/* Header - Professional, no AI slop */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.025em] text-[#0a0a0a] dark:text-white">
            Workspace
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#666] dark:text-[#999]">
            {hasProjects ? `${playgrounds.length} project${playgrounds.length !== 1 ? "s" : ""} • Updated just now` : "Create your first project to get started."}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[12px] text-[#888] border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5 bg-white dark:bg-[#111]">
          <span className="h-2 w-2 rounded-full bg-[#111] dark:bg-white" />
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Quick actions - Clean */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddNewButton />
        <AddRepoButton />
      </div>

      {/* Projects */}
      <div className="mt-8">
        {!hasProjects ? (
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-8">
            <EmptyState
              title="No projects yet"
              description="Choose a template to create your first project. You can import or start from scratch."
              imageSrc="/empty-state.svg"
            />
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
    </div>
  );
};

export default Page;
