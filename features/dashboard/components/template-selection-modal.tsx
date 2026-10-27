"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ChevronRight,
  Code2,
  Database,
  FileCode2,
  FilePlus2,
  Globe,
  Loader2,
  Search,
  Sparkles,
  Check,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TemplateId =
  | "BLANK"
  | "VANILLA"
  | "REACT"
  | "NEXTJS"
  | "EXPRESS"
  | "VUE"
  | "HONO"
  | "ANGULAR"
  | "PYTHON";

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: TemplateId;
    description?: string;
  }) => Promise<boolean>;
};

interface TemplateOption {
  id: string;
  template: TemplateId;
  name: string;
  description: string;
  icon?: string;
  lucideIcon?: LucideIcon;
  tags: string[];
  features: string[];
  category: "frontend" | "backend" | "fullstack" | "other";
  mono?: boolean;
  dashed?: boolean;
}

const templates: TemplateOption[] = [
  {
    id: "blank",
    template: "BLANK",
    name: "Start from scratch",
    description:
      "An empty workspace with a src folder — bring every file and framework yourself.",
    lucideIcon: FilePlus2,
    tags: ["Empty", "Any language", "No framework"],
    features: ["Empty src folder", "Full freedom", "Pick your own stack"],
    category: "other",
    dashed: true,
  },
  {
    id: "vanilla",
    template: "VANILLA",
    name: "HTML · CSS · JS",
    description:
      "Plain HTML, CSS and JavaScript with no build step and a live preview.",
    lucideIcon: FileCode2,
    tags: ["HTML", "CSS", "JavaScript"],
    features: ["index.html entry", "styles.css", "script.js"],
    category: "frontend",
  },
  {
    id: "python",
    template: "PYTHON",
    name: "Python",
    description:
      "A clean Python scripting layout with syntax highlighting. In-browser execution arrives in v2.",
    lucideIcon: Terminal,
    tags: ["Python", "Scripting", "Backend"],
    features: ["src/main.py", "requirements.txt", "README guide"],
    category: "backend",
  },
  {
    id: "react",
    template: "REACT",
    name: "React",
    description:
      "Component-based UI library with JSX and a live in-browser preview.",
    icon: "/react.svg",
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-based", "Virtual DOM", "JSX support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    template: "NEXTJS",
    name: "Next.js",
    description:
      "The React framework with App Router layouts, server components and API routes.",
    icon: "/nextjs-icon.svg",
    mono: true,
    tags: ["React", "SSR", "Fullstack"],
    features: ["App Router", "API routes", "File-based routing"],
    category: "fullstack",
  },
  {
    id: "express",
    template: "EXPRESS",
    name: "Express",
    description:
      "Minimalist Node.js framework for APIs and server-rendered web apps.",
    icon: "/expressjs-icon.svg",
    mono: true,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP utilities"],
    category: "backend",
  },
  {
    id: "vue",
    template: "VUE",
    name: "Vue.js",
    description:
      "Progressive framework with reactive data binding and an approachable API.",
    icon: "/vuejs-icon.svg",
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Reactive binding", "SFC components", "Virtual DOM"],
    category: "frontend",
  },
  {
    id: "hono",
    template: "HONO",
    name: "Hono",
    description:
      "Ultra-lightweight, standards-based framework for any JS runtime.",
    icon: "/hono.svg",
    tags: ["Node.js", "TypeScript", "Backend"],
    features: ["Edge-ready", "TypeScript", "Tiny footprint"],
    category: "backend",
  },
  {
    id: "angular",
    template: "ANGULAR",
    name: "Angular",
    description:
      "Batteries-included framework for fast, reliable enterprise applications.",
    icon: "/angular-2.svg",
    tags: ["Fullstack", "TypeScript"],
    features: ["Standalone components", "Dependency injection", "TypeScript"],
    category: "fullstack",
  },
];

const CATEGORY_ICON = {
  frontend: Code2,
  backend: Database,
  fullstack: Globe,
  other: Sparkles,
} as const;

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<
    "all" | "frontend" | "backend" | "fullstack" | "other"
  >("all");
  const [projectName, setProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      category === "all" || template.category === category;
    return matchesSearch && matchesCategory;
  });

  const resetAndClose = () => {
    onClose();
    setStep("select");
    setSelectedTemplate(null);
    setProjectName("");
    setSearchQuery("");
    setCategory("all");
    setIsSubmitting(false);
  };

  const handleCreateProject = async () => {
    if (!selectedTemplate || isSubmitting) return;
    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        title: projectName.trim() || `New ${template.name} project`,
        template: template.template,
        description: template.description,
      });
      // Only close on success — failures keep the dialog open with the
      // user's input intact so they can retry immediately.
      if (ok) resetAndClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const selected = templates.find((t) => t.id === selectedTemplate);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) resetAndClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Sparkles className="size-5 text-iris" />
                Start from a template
              </DialogTitle>
              <DialogDescription>
                Every template ships with a real file structure and a preview
                that works on the first click.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search templates…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Tabs
                  value={category}
                  className="w-full sm:w-auto"
                  onValueChange={(value) =>
                    setCategory(
                      value as
                        | "all"
                        | "frontend"
                        | "backend"
                        | "fullstack"
                        | "other",
                    )
                  }
                >
                  <TabsList className="grid w-full grid-cols-5 sm:w-auto">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <RadioGroup
                value={selectedTemplate ?? ""}
                onValueChange={setSelectedTemplate}
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template, index) => {
                      const CategoryIcon =
                        CATEGORY_ICON[template.category];
                      const isActive = selectedTemplate === template.id;
                      return (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={cn(
                            "group animate-fade-up relative cursor-pointer rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-iris/40 hover:shadow-md",
                            template.dashed && "border-dashed",
                            isActive &&
                              "border-iris shadow-lg shadow-iris/10 ring-1 ring-iris",
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {isActive && (
                            <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-iris text-white">
                              <Check className="size-3" />
                            </span>
                          )}
                          <div className="flex items-start gap-3.5">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                              {template.lucideIcon ? (
                                <template.lucideIcon className="size-7 text-iris" />
                              ) : (
                                <Image
                                  src={template.icon ?? ""}
                                  alt={`${template.name} icon`}
                                  width={28}
                                  height={28}
                                  unoptimized
                                  className={cn(
                                    "object-contain",
                                    template.mono &&
                                      "dark:invert dark:opacity-90",
                                  )}
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-base font-semibold tracking-tight">
                                  {template.name}
                                </h3>
                                <CategoryIcon className="size-3.5 text-muted-foreground" />
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                {template.description}
                              </p>
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {template.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <RadioGroupItem
                            value={template.id}
                            id={template.id}
                            className="sr-only"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-10 text-center">
                      <Search className="size-8 text-muted-foreground/50" />
                      <h3 className="text-sm font-semibold">
                        No templates found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>

              <div className="flex justify-end gap-3 border-t border-border/70 pt-4">
                <Button variant="outline" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button
                  variant="brand"
                  disabled={!selectedTemplate}
                  onClick={() => setStep("configure")}
                >
                  Continue
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-tight">
                Configure your project
              </DialogTitle>
              <DialogDescription>
                {selected?.name} — name it and you&apos;re one click away from
                the editor.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-5 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project name</Label>
                <Input
                  id="project-name"
                  autoFocus
                  placeholder="my-awesome-project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateProject();
                  }}
                />
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <h3 className="mb-3 text-sm font-semibold">
                  What&apos;s included
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {selected?.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="size-3.5 shrink-0 text-iris" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between gap-3 border-t border-border/70 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("select")}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button
                  variant="brand"
                  onClick={handleCreateProject}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create project"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
