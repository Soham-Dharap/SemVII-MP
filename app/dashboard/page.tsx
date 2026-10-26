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
import type { Project } from "@/features/dashboard/type";
import React from "react";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-10 sm:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Your projects
        </h1>
        <p className="mt-1.5 text-[15px] text-zinc-500">
          Create a new project or reopen one of your recent workspaces.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <AddNewButton />
        <AddRepoButton />
      </div>

      <div className="mt-10 flex w-full flex-col">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState
            title="No project found"
            description="Create a new project to get started"
            imageSrc="/empty-state.svg"
          />
        ) : (
          <ProjectTable
            projects={(playgrounds ?? []) as Project[]}
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
