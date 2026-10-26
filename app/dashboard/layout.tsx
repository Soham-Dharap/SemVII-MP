import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/features/dashboard/actions";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import React from "react";
import { Separator } from "@/components/ui/separator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const playgroundData = await getAllPlaygroundForUser();

  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };

  const formattedPlaygroundData =
    playgroundData?.map((playground: any) => ({
      id: playground.id,
      name: playground.title,
      starred: playground.Starmark?.[0]?.isMarked || false,
      icon: technologyIconMap[playground.template] || "Code2",
    })) || [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#fbfbfd] dark:bg-black">
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
        <SidebarInset className="bg-[#fbfbfd] dark:bg-black">
          {/* Top bar like Apple Finder */}
          <header className="sticky top-0 z-10 flex h-[52px] items-center gap-4 border-b border-black/[0.06] dark:border-white/10 bg-[rgba(251,251,253,0.8)] dark:bg-black/60 backdrop-blur-xl px-6">
            <SidebarTrigger className="rounded-full" />
            <Separator orientation="vertical" className="h-4 bg-black/10 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <h1 className="text-[14px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-white">Dashboard</h1>
              <span className="hidden sm:inline text-[12px] text-[#86868b]">• {formattedPlaygroundData.length} projects</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 px-3 py-1.5 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-[#34c759] animate-pulse" />
                <span className="text-[12px] font-medium text-[#1d1d1f] dark:text-white">All systems operational</span>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
