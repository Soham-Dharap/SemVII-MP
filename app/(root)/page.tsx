"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Eye, Layers, Terminal, Check, Copy, Play, Sparkles, GitBranch, FileCode, Monitor } from "lucide-react";

function HeroDemo() {
  const [variant, setVariant] = useState<"default" | "ghost" | "soft">("default");
  const [count, setCount] = useState(0);

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#101010] shadow-[0_16px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between px-4 h-10 border-b border-black/[0.06] dark:border-white/10 bg-[#f8f8f8] dark:bg-[#0f0f0f]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-black/5" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-black/5" />
            <span className="h-3 w-3 rounded-full bg-[#28ca42] border border-black/5" />
          </div>
          <span className="hidden sm:block ml-3 text-[11px] font-medium text-[#888]">App.tsx — CodePilot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#00c950] animate-pulse" />
          <span className="text-[11px] font-medium text-[#666] dark:text-[#aaa]">Live</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] min-h-[320px]">
        <div className="p-4 bg-[#0a0a0a] text-[#e6e6e6] font-mono text-[12.5px] leading-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 text-[11px] text-[#888]">
            <FileCode className="h-3.5 w-3.5" />
            <span>App.tsx</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] border border-white/10">TSX</span>
          </div>
          <pre className="text-[12px] leading-5 overflow-x-auto">
            <code>
              <span className="text-[#ff7ab2]">import</span> <span className="text-[#e6e6e6]">{"{ Button }"} </span><span className="text-[#ff7ab2]">from</span> <span className="text-[#82aaff]">"./components/button"</span>{`\n\n`}
              <span className="text-[#ff7ab2]">export default function</span> <span className="text-[#ffc66d]">App</span>() {` {\n`}
              {`  `}<span className="text-[#ff7ab2]">return</span> (<br />
              {`    `}<span className="text-[#888]">&lt;div className="p-6"&gt;</span><br />
              {`      `}<span className="text-[#888]">&lt;h1&gt;</span><span className="text-[#e6e6e6]">Hello, CodePilot</span><span className="text-[#888]">&lt;/h1&gt;</span><br />
              {`      `}<span className="text-[#82aaff]">&lt;Button</span> <span className="text-[#ffc66d]">variant</span>=<span className="text-[#c3e88d]">"{variant}"</span><span className="text-[#82aaff]">&gt;</span><br />
              {`        `}<span className="text-[#e6e6e6]">Count: {count}</span><br />
              {`      `}<span className="text-[#82aaff]">&lt;/Button&gt;</span><br />
              {`    `}<span className="text-[#888]">&lt;/div&gt;</span><br />
              {`  `})<br />
              {`}`}
            </code>
          </pre>

          <div className="mt-4 flex gap-2">
            {(["default", "ghost", "soft"] as const).map(v => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${variant === v ? "bg-white text-black border-white" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10 bg-[#fcfcfc] dark:bg-[#0a0a0a] p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#888]">Preview</span>
            <span className="text-[11px] text-[#888]">Updated just now</span>
          </div>
          <div className="mt-6 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6 shadow-sm flex-1 flex flex-col justify-center">
            <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-[#111] dark:text-white">Hello, CodePilot</h3>
            <p className="text-[12px] text-[#666] dark:text-[#999] mt-1">Interactive preview — change variant above</p>
            <button
              onClick={() => setCount(c => c + 1)}
              className={`mt-5 inline-flex h-8 items-center justify-center rounded-md px-4 text-[12px] font-medium transition-all active:scale-[0.98] ${
                variant === "default" ? "bg-[#111] text-white dark:bg-white dark:text-black hover:bg-black" :
                variant === "ghost" ? "bg-transparent border border-black/10 dark:border-white/15 text-[#111] dark:text-white hover:bg-black/5" :
                "bg-[#f5f5f5] dark:bg-white/10 text-[#111] dark:text-white hover:bg-[#eee]"
              }`}
            >
              Count: {count}
            </button>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#999]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00c950]" />
              Ready • {variant}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-[#888]">
            <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> 100% • 60fps</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col bg-[#fcfcfc] dark:bg-[#0a0a0a]">
      {/* Hero - Interactive, beautiful, professional */}
      <section className="relative overflow-hidden border-b border-black/[0.04] dark:border-white/[0.04]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#fcfcfc] dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)] opacity-[0.15] dark:opacity-[0.1]" />
          {/* Warm spotlight */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-gradient-to-b from-[#ffefe0] via-[#fff4e6]/50 to-transparent dark:from-[#1a1a0a]/20 dark:via-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-[1120px] px-6 pt-12 sm:pt-16 pb-8">
          <div className="mx-auto max-w-[720px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-white/[0.06] backdrop-blur px-3 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[#111] dark:bg-white animate-pulse" />
              </span>
              <span className="text-[11px] font-medium tracking-wide text-[#111] dark:text-white">Public beta • No waitlist</span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-[#111] dark:bg-white text-white dark:text-black px-2 py-0.5 text-[10px] font-semibold">What’s new →</span>
            </div>

            <h1 className="mt-6 text-[36px] sm:text-[48px] lg:text-[52px] font-[650] leading-[0.9] tracking-[-0.04em] text-[#0a0a0a] dark:text-white">
              The editor that
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">keeps you in flow.</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#ffebc2]/60 dark:bg-[#332a00]/40 -rotate-[0.5deg] -z-0" />
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-6 text-[#555] dark:text-[#999]">
              A fast, focused workspace for professional teams. Monaco editor, live preview, and file system — works in your browser, no plugins.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button className="h-10 rounded-full bg-[#111] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-white/90 px-6 text-[13px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                  Open workspace
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
              <button className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#111] px-5 text-[13px] font-medium text-[#111] dark:text-white hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors">
                <Copy className="h-3.5 w-3.5" />
                npx codepilot create
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-[#888]">
              <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[#00c950]" /> Free</span>
              <span className="h-3 w-px bg-black/10 dark:bg-white/10" />
              <span>No credit card</span>
              <span className="h-3 w-px bg-black/10 dark:bg-white/10" />
              <span>2-min setup</span>
            </div>
          </div>

          <div className="mt-10">
            <HeroDemo />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#888]">
            <span>Try the live preview above — click the variants</span>
            <span className="hidden sm:inline h-3 w-px bg-black/10 dark:bg-white/10" />
            <span className="hidden sm:inline">Press ⌘ S to save in the editor</span>
          </div>
        </div>
      </section>

      {/* Trusted strip - professional, not fake */}
      <section className="border-b border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1120px] px-6 py-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#999]">
              Built for teams who ship
            </p>
            <div className="flex items-center gap-6 text-[12px] text-[#666] dark:text-[#999]">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#111] dark:bg-white" /> No telemetry</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#111] dark:bg-white" /> Keyboard-first</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#111] dark:bg-white" /> Private by default</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento features - interactive, beautiful */}
      <section className="mx-auto max-w-[1120px] px-6 py-14 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#0a0a0a] dark:text-white">
              Opinionated. And fast.
            </h2>
            <p className="mt-2 max-w-[520px] text-[13px] leading-5 text-[#666] dark:text-[#999]">
              We removed the noise. What’s left is a focused tool that feels native.
            </p>
          </div>
          <Link href="#" className="text-[13px] font-medium text-[#111] dark:text-white hover:underline">View all features →</Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Large card - Editor */}
          <div className="md:col-span-7 group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6 hover:border-black/15 dark:hover:border-white/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-[#f5f5f5] to-transparent dark:from-white/[0.04] rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111] dark:bg-white text-white dark:text-black">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-[#111] dark:text-white">Monaco inside</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-[#666] dark:text-[#999] max-w-[420px]">
                The same engine as VS Code. Autocomplete, multi-cursor, command palette, Vim bindings. Familiar on day one.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="rounded-full bg-[#111] dark:bg-white text-white dark:text-black px-3 py-1 text-[11px] font-medium">⌘ P Quick open</span>
                <span className="rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#1a1a1a] px-3 py-1 text-[11px] font-medium text-[#666] dark:text-[#aaa]">⇧ ⌘ P Commands</span>
              </div>
            </div>
          </div>

          {/* Stacked small cards */}
          <div className="md:col-span-5 grid gap-4">
            <div className="group rounded-2xl border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#0f0f0f] p-5 hover:bg-white dark:hover:bg-[#111] hover:shadow-sm transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-white/10 border border-black/5 dark:border-white/10">
                <Eye className="h-4 w-4 text-[#111] dark:text-white" />
              </div>
              <h3 className="mt-3 text-[13px] font-semibold text-[#111] dark:text-white">Live preview</h3>
              <p className="mt-1 text-[12.5px] leading-5 text-[#666] dark:text-[#999]">Updates as you type. Split view, responsive checks, console.</p>
            </div>
            <div className="group rounded-2xl border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#0f0f0f] p-5 hover:bg-white dark:hover:bg-[#111] hover:shadow-sm transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-white/10 border border-black/5 dark:border-white/10">
                <GitBranch className="h-4 w-4 text-[#111] dark:text-white" />
              </div>
              <h3 className="mt-3 text-[13px] font-semibold text-[#111] dark:text-white">File system</h3>
              <p className="mt-1 text-[12.5px] leading-5 text-[#666] dark:text-[#999]">Nested folders, rename, drag, create. Feels like your local machine.</p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="md:col-span-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-5 group hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/10 flex items-center justify-center">
                <Layers className="h-4 w-4 text-[#111] dark:text-white" />
              </div>
              <div className="text-[12px] font-medium text-[#111] dark:text-white">Templates</div>
              <span className="ml-auto text-[11px] text-[#888]">6 included</span>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#0f0f0f] px-3 py-2 text-center text-[11px] font-medium">React</span>
              <span className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#0f0f0f] px-3 py-2 text-center text-[11px] font-medium">Next.js</span>
              <span className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#0f0f0f] px-3 py-2 text-center text-[11px] font-medium">Vue</span>
            </div>
          </div>

          <div className="md:col-span-4 rounded-2xl border border-black/10 dark:border-white/10 bg-[#111] dark:bg-white p-5 text-white dark:text-black">
            <div className="flex items-center gap-2 text-[12px] font-medium">
              <Terminal className="h-4 w-4" />
              Keyboard first
            </div>
            <p className="mt-2 text-[12.5px] leading-5 opacity-70">Every action has a shortcut. Stay in flow, hands on keyboard.</p>
            <div className="mt-3 flex gap-1.5">
              <span className="rounded bg-white/10 dark:bg-black/10 px-1.5 py-0.5 text-[10px] font-mono">⌘S</span>
              <span className="rounded bg-white/10 dark:bg-black/10 px-1.5 py-0.5 text-[10px] font-mono">⌘B</span>
              <span className="rounded bg-white/10 dark:bg-black/10 px-1.5 py-0.5 text-[10px] font-mono">⌘P</span>
            </div>
          </div>

          <div className="md:col-span-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-5">
            <h3 className="text-[13px] font-semibold text-[#111] dark:text-white">Private & secure</h3>
            <p className="mt-1 text-[12.5px] leading-5 text-[#666] dark:text-[#999]">Your code is private until you share. No tracking in editor.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#111] dark:text-white">
              Security overview <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Code showcase tabs */}
      <section className="border-y border-black/[0.06] dark:border-white/[0.06] bg-[#fcfcfc] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1120px] px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111] dark:text-white">Choose your stack</h3>
              <p className="text-[12.5px] text-[#666] dark:text-[#999] mt-1">All templates are minimal, typed, and ready to ship.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 p-1">
              {["React", "Next.js", "Express"].map(t => (
                <span key={t} className={`px-3 py-1 rounded-full text-[12px] font-medium ${t === "React" ? "bg-[#111] text-white dark:bg-white dark:text-black" : "text-[#666] dark:text-[#999]"}`}>{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 grid md:grid-cols-6 gap-6 opacity-70">
            <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-[#666] dark:text-[#999]"><Image src="/react.svg" alt="" width={20} height={20} /> React</div>
            <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-[#666] dark:text-[#999]"><Image src="/nextjs-icon.svg" alt="" width={20} height={20} className="dark:invert" /> Next.js</div>
            <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-[#666] dark:text-[#999]"><Image src="/vuejs-icon.svg" alt="" width={20} height={20} /> Vue</div>
            <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-[#666] dark:text-[#999]"><Image src="/angular-2.svg" alt="" width={20} height={20} /> Angular</div>
            <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-[#666] dark:text-[#999]"><Image src="/expressjs-icon.svg" alt="" width={20} height={20} className="dark:invert" /> Express</div>
            <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-[#666] dark:text-[#999]"><Image src="/hono.svg" alt="" width={20} height={20} /> Hono</div>
          </div>
        </div>
      </section>

      {/* Final CTA - Beautiful, not gradient spam */}
      <section className="mx-auto max-w-[1120px] px-6 py-12 w-full">
        <div className="relative overflow-hidden rounded-2xl bg-[#111] dark:bg-white px-8 py-10 sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-white/[0.04] dark:bg-black/[0.04] rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white dark:text-black">
                Ready to build?
              </h2>
              <p className="mt-1.5 text-[13px] leading-5 text-white/60 dark:text-black/60 max-w-[480px]">
                Open a workspace and start in seconds. Free for solo developers, upgrade for teams.
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="h-9 rounded-full bg-white text-black hover:bg-white/90 dark:bg-black dark:text-white dark:hover:bg-black/80 px-6 text-[13px] font-medium shrink-0">
                Open workspace
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
