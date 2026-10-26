import EmptyState from "@/components/ui/empty-state";
import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from "@/features/dashboard/actions";
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepoButton from "@/features/dashboard/components/add-repo-button";
import ProjectTable from "@/features/dashboard/components/project-table";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  const hasProjects = playgrounds && playgrounds.length > 0;
  return (
    <div className="bg-[#0A0A0B] min-h-[70vh]">
      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="flex items-start justify-between gap-6 border-b-[3px] border-[#F4F4F0] pb-6">
          <div>
            <div className="mono text-[11px] font-black tracking-[0.14em] text-[#D6FF00]">WORKSPACE ✦ GEN-Z</div>
            <h1 className="display text-[36px] mt-1 text-white">PLAYGROUNDS</h1>
            <p className="mt-2 mono text-[11px] font-bold text-white/60">{hasProjects ? `${playgrounds.length} playgrounds · private by default` : "No playgrounds yet — create one from a template."}</p>
          </div>
          <div className="hidden sm:block text-right mono text-[10px] font-bold">
            <div className="text-white/60">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
            <div className="inline-flex items-center gap-1.5 bg-[#D6FF00] text-black px-2 py-1 border-2 border-black mt-1">● ALL SYSTEMS GO</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7"><AddNewButton /></div>
          <div className="col-span-12 md:col-span-5"><AddRepoButton /></div>
        </div>
        <div className="mt-8">
          {!hasProjects ? (
            <div className="border-[3px] border-black bg-white shadow-[6px_6px_0_#F4F4F0] p-8">
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
