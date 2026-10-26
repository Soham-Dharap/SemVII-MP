import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/features/dashboard/actions";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const playgroundData = await getAllPlaygroundForUser();
  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };
  const formattedPlaygroundData = playgroundData?.map((playground: any) => ({
    id: playground.id,
    name: playground.title,
    starred: playground.Starmark?.[0]?.isMarked || false,
    icon: technologyIconMap[playground.template] || "Code2",
  })) || [];
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-10 flex h-[52px] items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6">
            <SidebarTrigger className="rounded-full" />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-[14px] font-semibold tracking-[-0.01em]">Dashboard</h1>
              <span className="hidden sm:inline text-[12px] text-muted-foreground">• {formattedPlaygroundData.length} projects</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[12px] font-medium">All systems operational</span>
              </div>
            </div>
          </header>
          <main className="flex-1 bg-background">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
