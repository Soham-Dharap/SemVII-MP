import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FileCode2,
  FolderTree,
  MonitorPlay,
  Save,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EditorMockup from "@/features/home/components/editor-mockup";

const BENTO = [
  {
    icon: FolderTree,
    title: "A file tree that respects you",
    body: "Folders, nested files and instant search in a calm collapsible tree. Create, rename and delete without modal fatigue — everything autosaves.",
    className: "sm:col-span-2",
  },
  {
    icon: Save,
    title: "Autosave, always on",
    body: "Keystrokes are debounced and persisted to MongoDB. Close the tab, come back, nothing is lost.",
    className: "",
  },
  {
    icon: FileCode2,
    title: "Syntax that feels native",
    body: "Shiki highlighting, multiple tabs, a fixed line gutter and the same keyboard feel as a desktop editor.",
    className: "",
  },
  {
    icon: MonitorPlay,
    title: "Live preview, zero setup",
    body: "HTML and CSS render instantly in a sandboxed frame. React and JSX compile right in the browser. Toggle phone, tablet and desktop widths.",
    className: "sm:col-span-2",
  },
];

const TEMPLATES = [
  { name: "React", icon: "/react.svg", note: "JSX live preview" },
  { name: "Next.js", icon: "/nextjs-icon.svg", note: "App Router layout" },
  { name: "Express", icon: "/expressjs-icon.svg", note: "API + static" },
  { name: "Vue", icon: "/vuejs-icon.svg", note: "Composition API" },
  { name: "Hono", icon: "/hono.svg", note: "Edge-ready API" },
  { name: "Angular", icon: "/angular-2.svg", note: "Standalone components" },
];

const STEPS = [
  {
    number: "01",
    title: "Sign in",
    body: "One tap with Google or GitHub. No passwords, no onboarding maze.",
  },
  {
    number: "02",
    title: "Pick a stack",
    body: "Six real project structures, each pre-seeded with files that actually run.",
  },
  {
    number: "03",
    title: "Build in the browser",
    body: "Edit on the left, preview on the right, autosave underneath. Ship when ready.",
  },
];

export default function Home() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="relative px-6 pb-20 pt-36 sm:pt-44">
        <div className="dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="bg-noise pointer-events-none absolute inset-0 -z-10 opacity-[0.35]" />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/auth/sign-in"
              className="animate-fade-up group inline-flex items-center gap-2 rounded-full border border-border bg-white/80 py-1.5 pl-2 pr-3.5 text-sm shadow-sm backdrop-blur transition-colors hover:border-iris/40"
            >
              <span className="rounded-full bg-iris px-2.5 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <span className="text-muted-foreground">
                Codepilot v1 — the browser editor is live
              </span>
              <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <h1 className="animate-fade-up stagger-1 mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-7xl">
              Your IDE,
              <br />
              <span className="font-display italic font-normal text-muted-foreground">
                minus the setup.
              </span>
            </h1>

            <p className="animate-fade-up stagger-2 mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              A focused code editor, organized file explorer and live preview —
              running entirely in your browser. Open a project and start typing
              in under ten seconds.
            </p>

            <div className="animate-fade-up stagger-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/sign-in">
                <Button
                  variant="brand"
                  size="lg"
                  className="h-12 rounded-full px-7 text-[15px]"
                >
                  Start building — free
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-border bg-white px-7 text-[15px]"
                >
                  See the workspace
                </Button>
              </a>
            </div>

            <p className="animate-fade-up stagger-4 mt-5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground/70">
              No install · No credit card · GitHub &amp; Google sign-in
            </p>
          </div>

          <div className="animate-fade-up stagger-4 relative mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="absolute -inset-x-8 -top-10 -z-10 h-72 rounded-[3rem] bg-gradient-to-b from-iris/12 to-transparent blur-2xl" />
            <EditorMockup />
          </div>
        </div>
      </section>

      {/* Bento features */}
      <section id="features" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-iris">
              Features
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Built like a tool,
              <span className="font-display italic font-normal text-muted-foreground">
                {" "}
                polished like a product.
              </span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {BENTO.map((feature) => (
              <div
                key={feature.title}
                className={`group rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-iris/30 hover:shadow-lg ${feature.className}`}
              >
                <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-iris-soft text-iris transition-colors group-hover:bg-iris group-hover:text-white">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-7 text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}

            {/* AI roadmap tile */}
            <div className="relative overflow-hidden rounded-2xl bg-foreground p-7 text-background sm:col-span-3">
              <div className="bg-noise pointer-events-none absolute inset-0 opacity-20" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                    <Sparkles className="size-3.5" />
                    Roadmap — Version 2
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    AI pair programming &amp; GitHub import
                  </h3>
                  <p className="mt-2 text-[15px] leading-7 text-background/65">
                    In-editor refactors, code generation from plain language and
                    one-click repository cloning. Version 1 stays fast, stable
                    and distraction-free.
                  </p>
                </div>
                <Terminal className="hidden size-16 shrink-0 text-background/25 sm:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="scroll-mt-24 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-iris">
              Templates
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Six stacks, zero configuration
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              Every project opens with a sensible file structure and a preview
              that works on the first click.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TEMPLATES.map((template) => (
              <div
                key={template.name}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-background px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-iris/30 hover:shadow-md"
              >
                <Image
                  src={template.icon}
                  alt={template.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="size-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    {template.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {template.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-iris">
              Workflow
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              From sign-in to shipping in minutes
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <span className="font-display text-5xl italic text-iris/80">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-foreground px-8 py-20 text-center text-background sm:py-24">
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.13]" />
            <div className="bg-noise pointer-events-none absolute inset-0 opacity-20" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris/40 blur-3xl" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Your next project is one click away
              </h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-background/60">
                No install, no configuration, no credit card. Just open
                Codepilot and start building.
              </p>
              <Link href="/auth/sign-in" className="mt-9 inline-block">
                <Button
                  variant="default"
                  size="lg"
                  className="h-12 rounded-full bg-white px-7 text-[15px] text-foreground hover:bg-white/90"
                >
                  Open the dashboard
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
