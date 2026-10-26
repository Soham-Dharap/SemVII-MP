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
      <div className="mx-auto max-w-[1240px] px-6 py-8">
        <div className="flex items-start justify-between gap-6 border-b border-border pb-6">
          <div>
            <div className="mono text-[11px] font-semibold tracking-widest text-primary">WORKSPACE</div>
            <h1 className="display text-[32px] mt-1">Playgrounds</h1>
            <p className="mt-2 mono text-[11px] text-muted-foreground">{hasProjects ? `${playgrounds.length} playgrounds • Private by default` : "No playgrounds yet — create one from a template."}</p>
          </div>
          <div className="hidden sm:block text-right mono text-[10px]">
            <div className="text-muted-foreground">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
            <div className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-2 py-1 rounded-full mt-1 font-semibold">● All systems operational</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7"><AddNewButton /></div>
          <div className="col-span-12 md:col-span-5"><AddRepoButton /></div>
        </div>
        <div className="mt-8">
          {!hasProjects ? (
            <div className="border border-border bg-card rounded-[16px] p-8">
              <EmptyState title="No playgrounds" description="Choose a template — React, Next.js, Vue, Angular, Express, Hono — and start typing." imageSrc="/empty-state.svg" />
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
