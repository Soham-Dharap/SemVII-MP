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

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  const hasProjects = playgrounds && playgrounds.length > 0;

  return (
    <div className="bg-[#FFFEFB] min-h-[70vh]">
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Masthead — editorial, not centered card */}
        <div className="flex items-start justify-between gap-6 border-b border-[#0F0E0C] pb-6">
          <div>
            <div className="mono text-[11px] tracking-[0.12em] uppercase text-[#6B6560]">Workspace</div>
            <h1 className="display text-[28px] mt-1 text-[#0F0E0C]">Playgrounds</h1>
            <p className="mt-2 mono text-[11px] leading-5 text-[#6B6560]">
              {hasProjects ? `${playgrounds.length} playground${playgrounds.length !== 1 ? "s" : ""} · Private by default` : "No playgrounds yet — create one from a template."}
            </p>
          </div>
          <div className="hidden sm:block text-right mono text-[10px] leading-4 text-[#6B6560]">
            <div>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
            <div className="text-[#0F0E0C]">● All systems operational</div>
          </div>
        </div>

        {/* Quick actions — dense, hairline, not rounded cards */}
        <div className="mt-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7"><AddNewButton /></div>
          <div className="col-span-12 md:col-span-5"><AddRepoButton /></div>
        </div>

        {/* Projects */}
        <div className="mt-8">
          {!hasProjects ? (
            <div className="border border-[#E8E0CC] bg-white p-8">
              <EmptyState
                title="No playgrounds"
                description="Choose a template — React, Next.js, Vue, Angular, Express, Hono — and start typing."
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
    </div>
  );
};

export default Page;
