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
  FolderPlus,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  LucideIcon,
  Plus,
  Settings,
  Star,
  Terminal,
  Zap,
} from "lucide-react";
import Image from "next/image";
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
  Lightbulb: Lightbulb,
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
  const [starredPlaygrounds] = useState(
    initialPlaygroundData.filter((p) => p.starred),
  );
  const [recentPlaygrounds] = useState(initialPlaygroundData);

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r border-black/[0.06] dark:border-white/10 bg-[#fbfbfd] dark:bg-[#101010]"
    >
      <SidebarHeader className="py-4">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1d1d1f] dark:bg-white text-white dark:text-black flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor" opacity="0.95" />
              <path d="M8 13l-2 2 2 2M16 13l2 2-2 2M13 10l-2 8" stroke="white" className="dark:stroke-black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-[15px] font-semibold tracking-[-0.022em] text-[#1d1d1f] dark:text-white leading-none">CodePilot</span>
            <span className="text-[11px] text-[#86868b] font-medium">Workspace</span>
          </div>
        </div>
        <div className="mx-3 mt-3 h-px bg-black/[0.06] dark:bg-white/10" />
      </SidebarHeader>

      <SidebarContent className="px-2 gap-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/"}
                  onClick={() => router.push("/")}
                  className="h-8 rounded-full data-[active=true]:bg-[#1d1d1f] data-[active=true]:text-white dark:data-[active=true]:bg-white dark:data-[active=true]:text-black font-medium"
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
                  className="h-8 rounded-full data-[active=true]:bg-[#0071e3] data-[active=true]:text-white font-medium"
                  tooltip="Dashboard"
                >
                  <LayoutDashboard className="size-4" />
                  <span className="text-[13px]">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-2 my-1 h-px bg-black/[0.04] dark:bg-white/5" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide uppercase text-[#86868b] px-2 h-6">
            <Star className="size-3 mr-1.5" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 ? (
                <div className="px-2 py-6 text-center">
                  <div className="mx-auto h-8 w-8 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center mb-2">
                    <Star className="h-4 w-4 text-[#86868b]" />
                  </div>
                  <p className="text-[12px] text-[#86868b] leading-4">
                    No starred projects
                  </p>
                  <p className="text-[11px] text-[#a1a1a6] mt-1">
                    Star to pin here
                  </p>
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
                        className="h-7 rounded-full data-[active=true]:bg-[#f5f5f7] dark:data-[active=true]:bg-white/10"
                      >
                        <IconComponent className="size-3.5 text-[#86868b]" />
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
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide uppercase text-[#86868b] px-2 h-6 flex items-center justify-between">
            <span className="flex items-center">
              <History className="size-3 mr-1.5" />
              Recent
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {recentPlaygrounds.length === 0 ? (
                <div className="px-2 py-3 text-[12px] text-[#86868b]">Create your first project</div>
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
                        <IconComponent className="h-3.5 w-3.5 text-[#86868b]" />
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
                    className="h-7 rounded-full text-[#0071e3] hover:text-[#0071e3]"
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
                <SidebarMenuButton
                  tooltip="Settings"
                  onClick={() => {}}
                  className="h-8 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                >
                  <Settings className="size-4" />
                  <span className="text-[13px]">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="m-2 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#42a5f5] flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[#1d1d1f] dark:text-white leading-none">Upgrade to Pro</div>
              <div className="text-[11px] text-[#86868b]">Unlimited projects</div>
            </div>
          </div>
          <button className="mt-3 w-full h-7 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-black text-[12px] font-medium hover:opacity-90 transition-opacity">
            Upgrade
          </button>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};
