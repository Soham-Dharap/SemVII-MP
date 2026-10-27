import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/features/dashboard/actions";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import React from "react";

// Auth-gated, data-driven segment — rendered on demand rather than prerendered.
export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const playgroundData = await getAllPlaygroundForUser();

    const technologyIconMap:Record<string, string> = {
        BLANK:"FilePlus2",
        VANILLA:"FileCode2",
        REACT:"Zap",
        NEXTJS:"Lightbulb",
        EXPRESS:"Database",
        VUE:"Compass",
        HONO:"FlameIcon",
        ANGULAR:"Terminal",
        PYTHON:"Terminal",
    }

    const formattedPlaygroundData = (
      playgroundData as Array<{
        id: string;
        title: string;
        template: string;
        Starmark?: { isMarked: boolean }[];
      }>
    )?.map((playground) => ({
      id: playground.id,
      name: playground.title,
      starred: playground.Starmark?.[0]?.isMarked || false,
      icon: technologyIconMap[playground.template] || "Code2",
    })) || [];

    return( 
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
                {/* Todo: Dashboard sidebar implement */}
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData}/>
                <main className="flex-1">{children}</main>
            </div>
        </SidebarProvider>
    )
}
