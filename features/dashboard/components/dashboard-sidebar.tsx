"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  FileCode2,
  FilePlus2,
  FlameIcon,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  LucideIcon,
  Star,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/brand";
import UserButton from "@/features/auth/components/user-button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { ChevronsUpDown } from "lucide-react";

interface PlaygroundDataProps {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
  Zap,
  Lightbulb,
  Database,
  Compass,
  FlameIcon,
  Terminal,
  Code2,
  FilePlus2,
  FileCode2,
};

export const DashboardSidebar = ({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundDataProps[];
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const [starredPlaygrounds] = useState(
    initialPlaygroundData.filter((p) => p.starred),
  );
  const [recentPlaygrounds] = useState(initialPlaygroundData);

  const isEmpty =
    starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0;

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <Link
          href="/dashboard"
          aria-label="Go to dashboard"
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
        >
          <BrandMark size={32} />
          <span className="text-[15px] font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Codepilot
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/"}
                tooltip="Home"
                onClick={() => router.push("/")}
              >
                <Home className="size-4" />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/dashboard"}
                tooltip="Dashboard"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Star className="mr-2 size-4" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 ? (
                <span className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                  No starred projects yet
                </span>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComponent =
                    lucideIconMap[playground.icon] || Code2;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                        onClick={() =>
                          router.push(`/playground/${playground.id}`)
                        }
                      >
                        <IconComponent className="size-4" />
                        <span className="truncate">{playground.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <History className="mr-2 size-4" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isEmpty ? (
                <span className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Create your first project
                </span>
              ) : (
                recentPlaygrounds.map((playground) => {
                  const IconComponent =
                    lucideIconMap[playground.icon] || Code2;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                        onClick={() =>
                          router.push(`/playground/${playground.id}`)
                        }
                      >
                        <IconComponent className="size-4" />
                        <span className="truncate">{playground.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {pathname !== "/dashboard" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="All projects"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="size-4" />
                <span>All projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
              <UserButton />
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">
                  {user?.name ?? "Account"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email ?? "Manage profile"}
                </p>
              </div>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
