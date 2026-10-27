import EmptyState from "@/components/ui/empty-state";
import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getAllPlaygroundForUser,
} from "@/features/dashboard/actions";
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepoButton from "@/features/dashboard/components/add-repo-button";
import ProjectCards from "@/features/dashboard/components/project-cards";
import type { Project } from "@/features/dashboard/type";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  const projects = (playgrounds ?? []) as Project[];

  return (
    <div className="mx-auto w-full max-w-5xl animate-fade-up px-4 py-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-iris">
            Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Your projects
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Spin up a new stack or jump back into a recent workspace.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <AddRepoButton />
          <AddNewButton />
        </div>
      </header>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to see it here."
          imageSrc="/empty-state.svg"
        />
      ) : (
        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              All projects · {projects.length}
            </h2>
          </div>
          <ProjectCards
            projects={projects}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            onDuplicateProject={duplicateProjectById}
          />
        </section>
      )}
    </div>
  );
};

export default Page;
