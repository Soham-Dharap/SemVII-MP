import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FileCode2,
  FolderTree,
  Globe,
  MonitorPlay,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: FolderTree,
    title: "Thoughtful file explorer",
    description:
      "Every folder and file one click away, with a collapsible tree that stays out of your way while you think.",
  },
  {
    icon: FileCode2,
    title: "A focused code editor",
    description:
      "Syntax highlighting, multiple tabs, autosave and a calm typing surface designed for long sessions.",
  },
  {
    icon: MonitorPlay,
    title: "Live preview",
    description:
      "Your HTML, CSS and React render instantly beside the code, with phone, tablet and desktop widths.",
  },
  {
    icon: Sparkles,
    title: "AI, when it is ready",
    description:
      "An in-editor assistant is on the Version 2 roadmap — Version 1 ships fast, stable and distraction-free.",
    badge: "v2",
  },
];

const TEMPLATES = [
  { name: "React", icon: "/react.svg" },
  { name: "Next.js", icon: "/nextjs-icon.svg" },
  { name: "Express", icon: "/expressjs-icon.svg" },
  { name: "Vue", icon: "/vuejs-icon.svg" },
  { name: "Hono", icon: "/hono.svg" },
  { name: "Angular", icon: "/angular-2.svg" },
];

const STEPS = [
  {
    number: "01",
    title: "Sign in",
    description: "Use your Google or GitHub account — no passwords to remember.",
  },
  {
    number: "02",
    title: "Pick a template",
    description: "Six production-shaped starters, each preloaded with real files.",
  },
  {
    number: "03",
    title: "Code and preview",
    description: "Edit in the browser, watch the preview update, and autosave keeps work safe.",
  },
];

function EditorMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-300/40">
      <div className="flex h-9 items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 rounded-md bg-white px-3 py-1 font-mono text-[11px] text-zinc-400 ring-1 ring-zinc-200">
          localhost:3000
        </span>
      </div>
      <div className="grid h-80 grid-cols-[20%_1fr_30%] text-left">
        <div className="space-y-2 border-r border-zinc-100 bg-zinc-50/60 p-3">
          {["src", "index.html", "App.jsx", "styles.css", "package.json"].map(
            (file, index) => (
              <div
                key={file}
                className={`h-3.5 rounded ${index === 2 ? "w-full bg-blue-100" : "w-4/5 bg-zinc-200"}`}
              />
            ),
          )}
        </div>
        <div className="space-y-2.5 p-4">
          {[90, 70, 82, 60, 75, 45, 88, 65].map((width, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-4 text-right font-mono text-[10px] text-zinc-300">
                {index + 1}
              </span>
              <div
                className={`h-3 rounded ${index % 3 === 0 ? "bg-indigo-200" : "bg-zinc-200"}`}
                style={{ width: `${width}%` }}
              />
            </div>
          ))}
        </div>
        <div className="border-l border-zinc-100 bg-[#f5f5f7] p-4">
          <div className="h-full rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
            <div className="mb-3 h-4 w-2/3 rounded bg-zinc-800" />
            <div className="mb-2 h-2.5 w-full rounded bg-zinc-200" />
            <div className="mb-4 h-2.5 w-4/5 rounded bg-zinc-200" />
            <div className="h-7 w-24 rounded-lg bg-zinc-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center sm:pt-28">
        <Badge
          variant="outline"
          className="mb-7 rounded-full border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm"
        >
          <Sparkles className="mr-1.5 size-3.5 text-blue-600" />
          Codepilot Version 1 — now available
        </Badge>

        <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-950 sm:text-7xl">
          Your whole dev environment,
          <br />
          <span className="font-display italic font-normal text-zinc-500">
            beautifully in the browser.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-500 sm:text-xl">
          Codepilot pairs a focused code editor with a live preview and an
          organized file explorer — so ideas become running projects without a
          single setup step.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button variant="brand" size="lg" className="h-11 rounded-full px-6 text-[15px]">
              Start coding free
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-zinc-300 bg-white px-6 text-[15px]"
            >
              See what is inside
            </Button>
          </a>
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          Free during Version 1 · Sign in with Google or GitHub
        </p>

        <div className="mx-auto mt-16 max-w-5xl">
          <EditorMock />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Features
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Designed like a product,
              <span className="font-display italic font-normal text-zinc-500">
                {" "}
                built like a tool.
              </span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-zinc-200 bg-[#fbfbfd] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                    <feature.icon className="size-5" />
                  </div>
                  {feature.badge && (
                    <Badge className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50">
                      Coming in {feature.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold tracking-tight text-zinc-950">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-7 text-zinc-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Templates
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Start from a real stack
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500">
              Every template arrives with sensible files and a preview that
              works from the first click.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TEMPLATES.map((template) => (
              <div
                key={template.name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-zinc-200"
              >
                <Image
                  src={template.icon}
                  alt={template.name}
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
                <span className="text-sm font-medium text-zinc-700">
                  {template.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-5 text-sm text-zinc-500">
            <Image
              src="/github.svg"
              alt="GitHub"
              width={16}
              height={16}
              className="opacity-60"
            />
            Importing an existing GitHub repository is planned for Version 2.
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Workflow
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              From sign-in to shipping in minutes
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-zinc-200 bg-[#fbfbfd] p-8"
              >
                <span className="font-display text-4xl italic text-blue-600">
                  {step.number}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-zinc-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-20 text-center">
          <Globe className="mx-auto mb-6 size-8 text-blue-400" />
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your next project is one click away
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
            No install, no configuration, no credit card. Just open Codepilot and
            start building.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button
              variant="brand"
              size="lg"
              className="h-11 rounded-full bg-white px-6 text-[15px] text-zinc-950 hover:bg-zinc-200"
            >
              Open the dashboard
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
