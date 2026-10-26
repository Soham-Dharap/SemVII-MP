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
import { Label } from "@/components/ui/label";
import {
  Search,
  Star,
  Check,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => void;
};

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
  tags: string[];
  features: string[];
  category: "frontend" | "backend" | "fullstack";
}

const templates: TemplateOption[] = [
  {
    id: "react",
    name: "React",
    description: "A JavaScript library for building user interfaces with component-based architecture",
    icon: "/react.svg",
    color: "#61DAFB",
    popularity: 5,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-Based", "Virtual DOM", "JSX Support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "The React framework for production with server-side rendering and static site generation",
    icon: "/nextjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["React", "SSR", "Fullstack"],
    features: ["Server Components", "API Routes", "File-based Routing"],
    category: "fullstack",
  },
  {
    id: "express",
    name: "Express",
    description: "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
    icon: "/expressjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP Utilities"],
    category: "backend",
  },
  {
    id: "vue",
    name: "Vue.js",
    description: "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
    icon: "/vuejs-icon.svg",
    color: "#4FC08D",
    popularity: 4,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Reactive Data Binding", "Component System", "Virtual DOM"],
    category: "frontend",
  },
  {
    id: "hono",
    name: "Hono",
    description: "Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.",
    icon: "/hono.svg",
    color: "#e36002",
    popularity: 3,
    tags: ["Node.js", "TypeScript", "Backend"],
    features: ["Dependency Injection", "TypeScript Support", "Modular Architecture"],
    category: "backend",
  },
  {
    id: "angular",
    name: "Angular",
    description: "Angular is a web framework that empowers developers to build fast, reliable applications.",
    icon: "/angular-2.svg",
    color: "#DD0031",
    popularity: 3,
    tags: ["React", "Fullstack", "JavaScript"],
    features: ["Reactive Data Binding", "Component System", "Virtual DOM"],
    category: "fullstack",
  },
];

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<"all" | "frontend" | "backend" | "fullstack">("all");
  const [projectName, setProjectName] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = category === "all" || template.category === category;
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      setStep("configure");
    }
  };

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < count ? "fill-[#ffcc02] text-[#ffcc02]" : "text-[#d2d2d7]"}
        />
      ));
  };

  const handleCreate = () => {
    if (!selectedTemplate || !projectName.trim()) return;
    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;
    onSubmit({
      title: projectName,
      template: template.id.toUpperCase() as any,
      description: template.description,
    });
    // reset
    setTimeout(() => {
      setStep("select");
      setSelectedTemplate(null);
      setProjectName("");
      setSearchQuery("");
    }, 300);
  };

  const handleClose = () => {
    setStep("select");
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-[760px] w-[95vw] sm:w-full p-0 overflow-hidden rounded-[18px] bg-card border border-border gap-0 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-black/5" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-black/5" />
              <span className="h-3 w-3 rounded-full bg-[#28ca42] border border-black/5" />
            </div>
            <div className="flex-1 text-center">
              <DialogTitle className="text-[15px] font-semibold tracking-[-0.02em]">
                {step === "select" ? "Choose a template" : "Name your project"}
              </DialogTitle>
            </div>
            <div className="hidden sm:block w-[54px]" />
          </div>
          <DialogDescription className="text-center text-[12px] text-muted-foreground mt-1">
            {step === "select" ? "Start from a polished, production-ready template" : "Give your project a memorable name"}
          </DialogDescription>

          {step === "select" && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-full bg-secondary border border-border text-[13px]"
                />
              </div>
              <div className="flex items-center gap-1 p-1 rounded-full bg-secondary border border-border w-fit overflow-x-auto">
                {[
                  { id: "all", label: "All" },
                  { id: "frontend", label: "Frontend" },
                  { id: "backend", label: "Backend" },
                  { id: "fullstack", label: "Fullstack" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap shrink-0 ${
                      category === c.id
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/30">
          {step === "select" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTemplates.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`group relative text-left rounded-[16px] bg-card border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 text-left w-full cursor-pointer ${
                      isSelected
                        ? "border-primary shadow-[0_0_0_3px_var(--ring)] bg-primary/[0.03]"
                        : "border-border hover:border-foreground/10"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                        <Image src={template.icon} alt={template.name} width={24} height={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold tracking-[-0.01em]">{template.name}</div>
                        <div className="mt-1 flex items-center gap-1">{renderStars(template.popularity)}</div>
                      </div>
                    </div>
                    <p className="mt-3 text-[12px] leading-5 text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feat) => (
                        <span key={feat} className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="max-w-[420px] mx-auto py-2 sm:py-4">
              <div className="rounded-[16px] bg-card border border-border p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  {selectedTemplate && (
                    <>
                      <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                        <Image
                          src={templates.find((t) => t.id === selectedTemplate)?.icon || "/react.svg"}
                          alt=""
                          width={24}
                          height={24}
                        />
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold">
                          {templates.find((t) => t.id === selectedTemplate)?.name}
                        </div>
                        <div className="text-[12px] text-muted-foreground">
                          {templates.find((t) => t.id === selectedTemplate)?.category}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-[12px] font-medium">Project name</Label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. my-awesome-app"
                      className="mt-1.5 h-10 rounded-full bg-secondary border border-border text-[14px]"
                      autoFocus
                    />
                    <p className="mt-1.5 text-[11px] text-muted-foreground">Use lowercase, hyphens are allowed</p>
                  </div>
                  <div className="rounded-xl bg-secondary border border-border p-3 flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-[12px] font-medium">Pro tip</div>
                      <div className="text-[12px] leading-4 text-muted-foreground">
                        You can change the name later. We&apos;ll set up everything for you.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card flex items-center justify-between flex-shrink-0">
          <Button variant="ghost" onClick={handleClose} className="rounded-full">
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            {step === "configure" && (
              <Button variant="outline" onClick={() => setStep("select")} className="rounded-full">
                Back
              </Button>
            )}
            {step === "select" ? (
              <Button
                variant="brand"
                onClick={handleContinue}
                disabled={!selectedTemplate}
                className="rounded-full px-6 disabled:opacity-40"
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="brand"
                onClick={handleCreate}
                disabled={!projectName.trim()}
                className="rounded-full px-6 disabled:opacity-40"
              >
                Create project
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
