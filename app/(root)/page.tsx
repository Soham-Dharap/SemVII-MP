import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Layers, Terminal, GitBranch, Eye, Check } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Hero - Professional, no hype */}
      <section className="relative border-b border-black/[0.04] dark:border-white/[0.04]">
        <div className="mx-auto max-w-[1120px] px-6 pt-16 sm:pt-20 pb-10">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#111] dark:bg-white animate-pulse" />
              <span className="text-[12px] font-medium tracking-[-0.01em] text-[#111] dark:text-white">Now available — Public beta</span>
            </div>

            <h1 className="mt-6 text-[38px] sm:text-[46px] font-semibold leading-[0.95] tracking-[-0.04em] text-[#0a0a0a] dark:text-white">
              A fast editor
              <br />
              for professional teams.
            </h1>

            <p className="mt-4 max-w-[560px] text-[16px] leading-6 text-[#555] dark:text-[#999]">
              CodePilot is a minimal, keyboard-driven workspace. Create projects from templates, edit with Monaco, preview instantly. No setup, no noise.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <Link href="/dashboard">
                <Button className="h-9 rounded-md bg-[#111] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-white/90 px-5 text-[13px] font-medium">
                  Open workspace
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
              <Link href="#" className="inline-flex h-9 items-center rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-[#111] px-4 text-[13px] font-medium text-[#111] dark:text-white hover:bg-black/[0.04] dark:hover:bg-white/10 transition-colors">
                View docs
              </Link>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[12px] text-[#888]">
              <span className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Free to use</span>
              <span>·</span>
              <span>No credit card</span>
              <span>·</span>
              <span>Made for teams of 1–50</span>
            </div>
          </div>

          {/* Window - Professional, no glow, no gradients, no Sparkles */}
          <div className="mt-12 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between px-4 h-10 border-b border-black/[0.06] dark:border-white/10 bg-[#fafafa] dark:bg-[#0f0f0f]">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-black/10 dark:bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-black/10 dark:bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-black/10 dark:bg-white/15" />
              </div>
              <div className="text-[11px] font-medium text-[#888]">my-project — CodePilot</div>
              <div className="text-[11px] text-[#888]">⌘ S to save</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-[360px] text-left">
              <div className="hidden lg:flex flex-col border-r border-black/[0.06] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#0a0a0a] p-3">
                <div className="text-[10px] font-semibold tracking-widest uppercase text-[#999] mb-3 px-2">Explorer</div>
                <div className="space-y-0.5 text-[12.5px]">
                  <div className="flex items-center gap-2 rounded bg-[#111] text-white dark:bg-white dark:text-black px-2.5 py-1.5 font-medium">
                    <Code2 className="h-3.5 w-3.5 opacity-70" /> App.tsx
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 text-[#555] dark:text-[#999]">
                    <Layers className="h-3.5 w-3.5 opacity-50" /> components
                  </div>
                  <div className="pl-7 text-[#777] dark:text-[#888] text-[12px] py-1">Button.tsx</div>
                  <div className="pl-7 text-[#777] dark:text-[#888] text-[12px] py-1">Card.tsx</div>
                  <div className="flex items-center gap-2 px-2.5 py-1 text-[#555] dark:text-[#999]">
                    <Terminal className="h-3.5 w-3.5 opacity-50" /> server.ts
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 text-[#555] dark:text-[#999]">
                    <GitBranch className="h-3.5 w-3.5 opacity-50" /> utils.ts
                  </div>
                </div>
                <div className="mt-auto rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-3">
                  <div className="text-[11px] font-medium text-[#111] dark:text-white">Local • Saved</div>
                  <div className="text-[11px] text-[#888]">All changes autosaved</div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0a0a0a] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-mono text-[#888]">App.tsx — 24 lines</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#888]">Spaces: 2</span>
                    <span className="h-3 w-px bg-black/10 dark:bg-white/10" />
                    <span className="text-[11px] text-[#888]">UTF-8</span>
                  </div>
                </div>
                <pre className="text-[12.5px] leading-6 font-mono text-[#24292e] dark:text-[#e6e8eb] overflow-x-auto">
                  <code>{`export default function Button({ children }) {
  return (
    <button className="px-4 py-2 bg-black text-white rounded-md">
      {children}
    </button>
  )
}

// Preview updates as you type
// Press Cmd+Enter to run`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Professional, muted, no gradients */}
      <section className="mx-auto max-w-[1120px] px-6 py-14 w-full">
        <div className="max-w-[640px]">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#0a0a0a] dark:text-white">
            Everything you need. Nothing you don’t.
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-[#666] dark:text-[#999]">
            A focused set of tools for building and shipping. Designed for speed, clarity, and control.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Code2,
              title: "Editor",
              desc: "Monaco-powered editing with autocomplete, multi-cursor, and Vim bindings. Fast and familiar.",
            },
            {
              icon: Eye,
              title: "Live preview",
              desc: "See changes instantly in the adjacent pane. No reload, no waiting.",
            },
            {
              icon: GitBranch,
              title: "Templates",
              desc: "Start from React, Next.js, Vue, Express, Hono, Angular. Minimal boilerplate, production-ready.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f5f5f5] dark:bg-white/10 border border-black/5 dark:border-white/10">
                <f.icon className="h-4 w-4 text-[#111] dark:text-white" />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold text-[#111] dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-[#666] dark:text-[#999]">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#f9f9f9] dark:bg-[#111] p-6">
            <h3 className="text-[14px] font-semibold text-[#111] dark:text-white">Keyboard first</h3>
            <p className="mt-1.5 text-[13px] leading-5 text-[#666] dark:text-[#999]">
              Every action has a shortcut. Command palette, quick open, and VIM mode for power users.
            </p>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6">
            <h3 className="text-[14px] font-semibold text-[#111] dark:text-white">Private by default</h3>
            <p className="mt-1.5 text-[13px] leading-5 text-[#666] dark:text-[#999]">
              Projects are private until you share them. No telemetry in editor. Your code stays yours.
            </p>
            <div className="mt-3 text-[13px] font-medium text-[#111] dark:text-white">Learn more →</div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-y border-black/[0.06] dark:border-white/[0.06] bg-[#fcfcfc] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1120px] px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[12px] font-medium tracking-wide text-[#888] uppercase">
              Works with modern stacks
            </p>
            <div className="flex items-center gap-8 opacity-70">
              <Image src="/react.svg" alt="React" width={28} height={28} className="grayscale" />
              <Image src="/nextjs-icon.svg" alt="Next.js" width={28} height={28} className="dark:invert" />
              <Image src="/vuejs-icon.svg" alt="Vue" width={28} height={28} />
              <Image src="/angular-2.svg" alt="Angular" width={28} height={28} />
              <Image src="/expressjs-icon.svg" alt="Express" width={28} height={28} className="dark:invert" />
              <Image src="/hono.svg" alt="Hono" width={28} height={28} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Simple, professional */}
      <section className="mx-auto max-w-[1120px] px-6 py-12 w-full">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#111] dark:bg-white px-8 py-10 text-center">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-white dark:text-black">
            Start building today
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-[14px] leading-5 text-white/60 dark:text-black/60">
            Free for individuals. Upgrade when your team grows. No time limits.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button className="h-9 rounded-md bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90 px-6 text-[13px] font-medium">
                Open workspace
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
