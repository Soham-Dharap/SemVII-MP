import EmptyState from "@/components/ui/empty-state";
import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from "@/features/dashboard/actions";
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepoButton from "@/features/dashboard/components/add-repo-button";
import ProjectTable from "@/features/dashboard/components/project-table";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  const hasProjects = playgrounds && playgrounds.length > 0;
  return (
    <div className="bg-background min-h-[70vh]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mono text-[11px] font-bold tracking-wide text-primary">
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" /> WORKSPACE
            </div>
            <h1 className="hero-title text-[28px] sm:text-[36px] mt-3">Playgrounds</h1>
            <p className="mt-2 text-[13px] text-muted-foreground max-w-[480px]">{hasProjects ? `${playgrounds.length} playgrounds • Premium workspace with live sync` : "No playgrounds yet — create one from a template to start shipping."}</p>
          </div>
          <div className="hidden lg:block text-right shrink-0">
            <div className="mono text-[11px] text-muted-foreground">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 mt-2 mono text-[11px] font-medium shadow-sm">
              <span className="h-2 w-2 bg-primary rounded-full animate-pulse" /> All systems operational
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8"><AddNewButton /></div>
          <div className="col-span-12 md:col-span-4"><AddRepoButton /></div>
        </div>

        <div className="mt-8">
          {!hasProjects ? (
            <div className="border border-border bg-card rounded-[24px] p-8 sm:p-10 shadow-sm">
              <EmptyState title="No playgrounds yet" description="Choose a template — React, Next.js, Vue, Angular, Express, Hono — and start building. Your first project is free." imageSrc="/empty-state.svg" />
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
    </div>
  );
};
export default Page;
