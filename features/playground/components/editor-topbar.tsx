"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownLink,
  SimpleDropdownSeparator,
  SimpleDropdownTrigger,
} from "@/components/ui/simple-dropdown";
import UserButton from "@/features/auth/components/user-button";
import type {
  PlaygroundMeta,
  ProjectSwitcherItem,
} from "./playground-workspace";

const TEMPLATE_LABELS: Record<string, string> = {
  BLANK: "Blank",
  VANILLA: "HTML/CSS/JS",
  REACT: "React",
  NEXTJS: "Next.js",
  EXPRESS: "Express",
  VUE: "Vue",
  HONO: "Hono",
  ANGULAR: "Angular",
  PYTHON: "Python",
};

const SaveIndicator = ({
  saveStatus,
  isDirty,
}: {
  saveStatus: "idle" | "saving" | "saved" | "error";
  isDirty: boolean;
}) => {
  if (saveStatus === "error") {
    return (
      <span className="hidden items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 sm:flex">
        <TriangleAlert className="size-3.5" />
        Save failed
      </span>
    );
  }
  if (saveStatus === "saving" || isDirty) {
    return (
      <span className="hidden items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:flex">
        <Loader2 className="size-3.5 animate-spin" />
        Saving
      </span>
    );
  }
  return (
    <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 sm:flex">
      <Check className="size-3.5" />
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
  return (
    <header className="flex h-13 shrink-0 items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm">
      <div className="flex min-w-0 items-center gap-1.5">
        <Link href="/dashboard" aria-label="Back to dashboard">
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <ChevronLeft className="size-4" />
          </Button>
        </Link>

        <Link href="/dashboard" className="ml-1">
          <Image
            src="/icon.svg"
            alt="Codepilot"
            width={28}
            height={28}
            unoptimized
            className="rounded-[26%]"
          />
        </Link>

        <SimpleDropdown>
          <SimpleDropdownTrigger
            ariaLabel="Switch project"
            className="ml-1 flex min-w-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-muted"
          >
            <span className="truncate text-sm font-semibold tracking-tight">
              {playground.title}
            </span>
            <span className="hidden rounded-full bg-iris-soft px-2.5 py-0.5 text-[11px] font-semibold text-iris md:inline">
              {TEMPLATE_LABELS[playground.template] ?? playground.template}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </SimpleDropdownTrigger>
          <SimpleDropdownContent align="start" className="w-72">
            <p className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
              Switch project
            </p>
            <SimpleDropdownSeparator />
            <div className="max-h-72 overflow-y-auto">
              {projects.map((project) => (
                <SimpleDropdownLink
                  key={project.id}
                  href={`/playground/${project.id}`}
                  className={
                    project.id === playground.id ? "bg-muted font-medium" : ""
                  }
                >
                  <span className="truncate">{project.title}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {TEMPLATE_LABELS[project.template] ?? project.template}
                  </span>
                </SimpleDropdownLink>
              ))}
            </div>
            <SimpleDropdownSeparator />
            <SimpleDropdownLink href="/dashboard">
              <Plus className="size-4" />
              New project
            </SimpleDropdownLink>
          </SimpleDropdownContent>
        </SimpleDropdown>
      </div>

      <div className="flex items-center gap-2">
        <SaveIndicator saveStatus={saveStatus} isDirty={isDirty} />
        <Link href="/dashboard" className="hidden sm:block">
          <Button variant="outline" size="sm" className="rounded-full">
            Dashboard
          </Button>
        </Link>
        <UserButton />
      </div>
    </header>
  );
};

export default EditorTopbar;
