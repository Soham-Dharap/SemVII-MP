"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Code2,
  Compass,
  Database,
  FlameIcon,
  History,
  Home,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Star,
  Terminal,
  Zap,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface PlaygroundDataProps {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
  Zap: Zap,
  Lightbulb: Terminal,
  Database: Database,
  Compass: Compass,
  FlameIcon: FlameIcon,
  Terminal: Terminal,
  Code2: Code2,
};

export const DashboardSidebar = ({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundDataProps[];
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [starredPlaygrounds] = useState(initialPlaygroundData.filter((p) => p.starred));
  const [recentPlaygrounds] = useState(initialPlaygroundData);

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-border bg-card">
      <SidebarHeader className="py-4">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background flex-shrink-0">
            <Code2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-[15px] font-semibold tracking-[-0.022em] leading-none">CodePilot</span>
            <span className="text-[11px] text-muted-foreground font-medium">Workspace</span>
          </div>
        </div>
        <div className="mx-3 mt-3 h-px bg-border" />
      </SidebarHeader>

      <SidebarContent className="px-2 gap-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/"}
                  onClick={() => router.push("/")}
                  className="h-8 rounded-full data-[active=true]:bg-foreground data-[active=true]:text-background font-medium"
                  tooltip="Home"
                >
                  <Home className="size-4" />
                  <span className="text-[13px]">Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard"}
                  onClick={() => router.push("/dashboard")}
                  className="h-8 rounded-full data-[active=true]:bg-primary data-[active=true]:text-primary-foreground font-medium"
                  tooltip="Dashboard"
                >
                  <LayoutDashboard className="size-4" />
                  <span className="text-[13px]">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-2 my-1 h-px bg-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground px-2 h-6">
            <Star className="size-3 mr-1.5" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 ? (
                <div className="px-2 py-6 text-center">
                  <div className="mx-auto h-8 w-8 rounded-full bg-secondary flex items-center justify-center mb-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-4">No starred projects</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">Star to pin here</p>
                </div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComponent = lucideIconMap[playground.icon] || Code2;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                        onClick={() => router.push(`/playground/${playground.id}`)}
                        className="h-7 rounded-full data-[active=true]:bg-secondary"
                      >
                        <IconComponent className="size-3.5 text-muted-foreground" />
                        <span className="text-[13px] truncate">{playground.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground px-2 h-6 flex items-center justify-between">
            <span className="flex items-center">
              <History className="size-3 mr-1.5" />
              Recent
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {recentPlaygrounds.length === 0 ? (
                <div className="px-2 py-3 text-[12px] text-muted-foreground">Create your first project</div>
              ) : (
                recentPlaygrounds.slice(0, 8).map((playground) => {
                  const IconComponent = lucideIconMap[playground.icon] || Code2;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                        onClick={() => router.push(`/playground/${playground.id}`)}
                        className="h-7 rounded-full"
                      >
                        <IconComponent className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[13px] truncate">{playground.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
              {recentPlaygrounds.length > 3 && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="View all"
                    onClick={() => router.push("/dashboard")}
                    className="h-7 rounded-full text-primary"
                  >
                    <span className="text-[12px] font-medium">View all →</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" onClick={() => {}} className="h-8 rounded-full text-muted-foreground hover:text-foreground">
                  <Settings className="size-4" />
                  <span className="text-[13px]">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="m-2 rounded-2xl bg-card border border-border p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold leading-none">Upgrade to Pro</div>
              <div className="text-[11px] text-muted-foreground">Unlimited projects</div>
            </div>
          </div>
          <button className="mt-3 w-full h-7 rounded-full bg-foreground text-background text-[12px] font-medium hover:opacity-90 transition-opacity">
            Upgrade
          </button>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};
