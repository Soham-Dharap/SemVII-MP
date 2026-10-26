"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronDown,
  Loader2,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserButton from "@/features/auth/components/user-button";
import type { PlaygroundMeta, ProjectSwitcherItem } from "./playground-workspace";

const TEMPLATE_LABELS: Record<string, string> = {
  REACT: "React",
  NEXTJS: "Next.js",
  EXPRESS: "Express",
  VUE: "Vue",
  HONO: "Hono",
  ANGULAR: "Angular",
};

const SaveIndicator = ({
  saveStatus,
  isDirty,
}: {
  saveStatus: "idle" | "saving" | "saved" | "error";
  isDirty: boolean;
}) => {
  if (saveStatus === "saving" || (isDirty && saveStatus !== "error")) {
    return (
      <span className="hidden items-center gap-1.5 text-xs text-zinc-500 sm:flex">
        <Loader2 className="size-3.5 animate-spin" />
        Saving
      </span>
    );
  }
  if (saveStatus === "error") {
    return (
      <span className="hidden items-center gap-1.5 text-xs text-red-600 sm:flex">
        <TriangleAlert className="size-3.5" />
        Save failed
      </span>
    );
  }
  return (
    <span className="hidden items-center gap-1.5 text-xs text-zinc-500 sm:flex">
      <Check className="size-3.5 text-emerald-600" />
      Saved
    </span>
  );
};

const EditorTopbar = ({
  playground,
  projects,
  saveStatus,
  isDirty,
}: {
  playground: PlaygroundMeta;
  projects: ProjectSwitcherItem[];
  saveStatus: "idle" | "saving" | "saved" | "error";
  isDirty: boolean;
}) => {
  const router = useRouter();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 px-3 shadow-sm backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        <Link href="/dashboard" aria-label="Back to dashboard">
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <ChevronLeft className="size-4" />
          </Button>
        </Link>

        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/icon.svg"
            alt="Codepilot"
            width={26}
            height={26}
            className="rounded-md"
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-zinc-100">
            <span className="truncate text-sm font-semibold tracking-tight text-zinc-900">
              {playground.title}
            </span>
            <span className="hidden rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 md:inline">
              {TEMPLATE_LABELS[playground.template] ?? playground.template}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-zinc-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel className="text-xs font-medium text-zinc-500">
              Your projects
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => router.push(`/playground/${project.id}`)}
                  className={
                    project.id === playground.id
                      ? "bg-zinc-100 font-medium"
                      : ""
                  }
                >
                  <span className="truncate">{project.title}</span>
                  <span className="ml-auto text-[11px] text-zinc-400">
                    {TEMPLATE_LABELS[project.template] ?? project.template}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              <Plus className="size-4" />
              New project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <SaveIndicator saveStatus={saveStatus} isDirty={isDirty} />
        <Link href="/dashboard" className="hidden sm:block">
          <Button variant="outline" size="sm">
            Dashboard
          </Button>
        </Link>
        <UserButton />
      </div>
    </header>
  );
};

export default EditorTopbar;
