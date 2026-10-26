import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2, Zap, Layers, Shield, Cpu, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Announcement bar - Apple style */}
      <div className="w-full bg-[#f5f5f7] dark:bg-[#1c1c1e] border-b border-black/[0.04] dark:border-white/5">
        <div className="mx-auto max-w-[980px] px-6 py-2.5 flex items-center justify-center gap-2 text-center">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            NEW
          </span>
          <p className="text-[12px] leading-5 tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
            <span className="font-semibold">CodePilot 2.0</span> is here. Faster builds, smarter AI, beautiful by default.
            <Link href="/dashboard" className="ml-1.5 font-medium text-[#06c] hover:underline dark:text-[#2997ff]">
              Learn more &gt;
            </Link>
          </p>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[980px] px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1 shadow-sm dark:border-white/10 dark:bg-[#1c1c1e]">
            <Sparkles className="h-3.5 w-3.5 text-[#0071e3]" />
            <span className="text-[12px] font-medium tracking-[-0.01em] text-[#1d1d1f] dark:text-white">
              AI-Native Code Editor
            </span>
            <span className="h-3 w-px bg-black/10 dark:bg-white/10" />
            <span className="text-[12px] text-[#86868b]">Trusted by 50k+ builders</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-[680px] text-[40px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] dark:text-white">
            Code beautifully.
            <br />
            <span className="bg-gradient-to-r from-[#0071e3] via-[#42a5f5] to-[#7b68ee] bg-clip-text text-transparent">
              Ship intelligently.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[600px] text-[17px] sm:text-[19px] leading-[1.42] tracking-[-0.022em] text-[#6e6e73] dark:text-[#a1a1a6] font-normal">
            The editor that understands your code. Instant setup, collaborative, and powered by AI that actually helps you write better software.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button variant="brand" size="lg" className="h-10 rounded-full px-6 text-[15px] gap-2 shadow-sm">
                Start building — it&apos;s free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#demo" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e8ed] dark:bg-[#2c2c2e] px-6 text-[14px] font-medium text-[#1d1d1f] dark:text-white hover:bg-[#d2d2d7] dark:hover:bg-[#3a3a3c] transition-colors">
              <Play className="h-3.5 w-3.5" />
              Watch intro — 45s
            </Link>
          </div>

          <p className="mt-3 text-[12px] text-[#86868b]">No credit card required • 30-second setup</p>

          {/* Hero Visual - Apple Mac window */}
          <div className="relative mt-10 sm:mt-14 mx-auto max-w-[900px]">
            {/* Glow behind */}
            <div className="absolute -inset-6 bg-gradient-to-b from-[#0071e3]/10 via-[#42a5f5]/5 to-transparent blur-3xl rounded-[32px] pointer-events-none" />

            <div className="relative rounded-[18px] bg-white dark:bg-[#1c1c1e] shadow-[0_20px_60px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-black/[0.06] dark:border-white/10 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 h-10 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-b border-black/[0.06] dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-black/5" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-black/5" />
                  <span className="h-3 w-3 rounded-full bg-[#28ca42] border border-black/5" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 rounded-full bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 px-3 py-1">
                    <div className="h-2 w-2 rounded-full bg-[#34c759]" />
                    <span className="text-[11px] font-medium text-[#1d1d1f] dark:text-white">my-project — CodePilot</span>
                  </div>
                </div>
                <div className="w-12" />
              </div>

              {/* Content: Split into sidebar + code */}
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] min-h-[380px] text-left">
                {/* File tree mock */}
                <div className="hidden lg:flex flex-col border-r border-black/[0.04] dark:border-white/5 bg-[#fbfbfd] dark:bg-[#101010] p-3">
                  <div className="text-[11px] font-semibold tracking-wide text-[#86868b] uppercase mb-2 px-2">Explorer</div>
                  <div className="space-y-1 text-[12px]">
                    <div className="flex items-center gap-2 rounded-md bg-[#0071e3]/10 px-2 py-1.5 text-[#0071e3] font-medium">
                      <Code2 className="h-3.5 w-3.5" /> App.tsx
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-[#515154] dark:text-[#a1a1a6]"> <Layers className="h-3.5 w-3.5 opacity-60" /> components</div>
                    <div className="flex items-center gap-2 px-2 py-1 text-[#515154] dark:text-[#a1a1a6] pl-6">button.tsx</div>
                    <div className="flex items-center gap-2 px-2 py-1 text-[#515154] dark:text-[#a1a1a6] pl-6">card.tsx</div>
                    <div className="flex items-center gap-2 px-2 py-1 text-[#515154] dark:text-[#a1a1a6]"><Cpu className="h-3.5 w-3.5 opacity-60" /> api.ts</div>
                    <div className="flex items-center gap-2 px-2 py-1 text-[#515154] dark:text-[#a1a1a6]"><Shield className="h-3.5 w-3.5 opacity-60" /> utils.ts</div>
                  </div>
                  <div className="mt-auto rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0071e3] to-[#42a5f5] flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#1d1d1f] dark:text-white">AI Assistant</div>
                        <div className="text-[11px] text-[#86868b]">Ready to help</div>
                      </div>
                      <div className="ml-auto h-2 w-2 rounded-full bg-[#34c759] animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Code area */}
                <div className="bg-white dark:bg-[#1c1c1e] p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#86868b]">
                      <span className="rounded bg-[#f5f5f7] dark:bg-[#2c2c2e] px-2 py-1 font-medium text-[#1d1d1f] dark:text-white">App.tsx</span>
                      <span>•</span>
                      <span>Auto-saved</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="text-[11px] text-[#86868b]">AI suggestion</span>
                      <span className="rounded-full bg-[#34c759] px-2 py-0.5 text-[10px] font-semibold text-white">ACCEPT</span>
                    </div>
                  </div>
                  <pre className="text-[12.5px] leading-6 font-mono overflow-x-auto">
                    <code className="text-[#1d1d1f] dark:text-[#f5f5f7]">
                      <span className="text-[#af52de]">import</span> <span className="text-[#1d1d1f] dark:text-white">{"{ Button }"} </span><span className="text-[#af52de]">from</span> <span className="text-[#0a84ff]">&quot;@/components/ui/button&quot;</span>{`\n\n`}
                      <span className="text-[#af52de]">export default function</span> <span className="text-[#0071e3]">Hero</span>() {` {\n`}
                      {"  "}<span className="text-[#af52de]">return</span> (<br />
                      {"    "}<span className="text-[#86868b]">{"<section className=\"hero\">"}</span><br />
                      {"      "}<span className="text-[#0071e3]">{"<h1>"}</span><span className="text-[#1d1d1f] dark:text-white">Build fast, stay beautiful</span><span className="text-[#0071e3]">{"</h1>"}</span><br />
                      {"      "}<span className="text-[#0071e3]">{"<Button"}</span> <span className="text-[#d12f1b]">variant</span>=<span className="text-[#0a84ff]">&quot;brand&quot;</span><span className="text-[#0071e3]">{">"}</span><br />
                      {"        "}<span className="text-[#1d1d1f] dark:text-white">Get Started</span><br />
                      {"      "}<span className="text-[#0071e3]">{"</Button>"}</span><br />
                      {"    "}<span className="text-[#86868b]">{"</section>"}</span><br />
                      {"  "})<br />
                      {`}\n`}
                    </code>
                  </pre>
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] p-3">
                    <div className="h-8 w-8 rounded-full bg-[#0071e3] flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-[#1d1d1f] dark:text-white">AI: I optimized your component for accessibility & performance.</div>
                      <div className="text-[11px] text-[#86868b]">+12% faster, WCAG AA compliant • Press Tab to apply</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="hidden lg:flex absolute -right-6 top-12 items-center gap-2 rounded-full bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 px-3 py-2 shadow-lg">
              <div className="h-2 w-2 rounded-full bg-[#34c759]" />
              <span className="text-[12px] font-medium text-[#1d1d1f] dark:text-white">Build succeeded in 0.8s</span>
            </div>
            <div className="hidden lg:flex absolute -left-4 bottom-16 items-center gap-2 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 px-3 py-2 shadow-lg">
              <Image src="/react.svg" alt="React" width={20} height={20} />
              <span className="text-[12px] font-medium text-[#1d1d1f] dark:text-white">React • Next.js • Vue</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid - Apple style */}
      <section className="mx-auto max-w-[980px] px-6 py-12 sm:py-16 w-full">
        <div className="text-center max-w-[640px] mx-auto">
          <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.022em] text-[#1d1d1f] dark:text-white">
            Powerful features. <span className="text-[#86868b] dark:text-[#a1a1a6]">Beautifully simple.</span>
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-[#515154] dark:text-[#a1a1a6]">
            Everything you need to go from idea to production — without the complexity.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "AI that understands code",
              desc: "Context-aware suggestions, refactors, and documentation. It feels like pairing with a senior engineer.",
              color: "from-[#0071e3] to-[#42a5f5]",
            },
            {
              icon: Zap,
              title: "Instant preview & deploy",
              desc: "See changes live. Ship to the edge with one click. No config, no waiting.",
              color: "from-[#34c759] to-[#30d158]",
            },
            {
              icon: Layers,
              title: "Templates for everything",
              desc: "React, Next.js, Vue, Express, Hono, Angular — start from polished, production-ready templates.",
              color: "from-[#af52de] to-[#ff2d55]",
            },
          ].map((f) => (
            <div key={f.title} className="group rounded-[18px] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/10 p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-sm`}>
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-white">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#6e6e73] dark:text-[#a1a1a6]">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[18px] bg-[#1d1d1f] dark:bg-black text-white p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/20 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">Collaborative by design</h3>
              <p className="mt-2 text-[13px] leading-5 text-white/70 max-w-[420px]">
                Real-time editing, comments, and version history. Work together as if you&apos;re in the same room.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/32?img=11" alt="" className="h-7 w-7 rounded-full border-2 border-[#1d1d1f]" />
                  <img src="https://i.pravatar.cc/32?img=14" alt="" className="h-7 w-7 rounded-full border-2 border-[#1d1d1f]" />
                  <img src="https://i.pravatar.cc/32?img=32" alt="" className="h-7 w-7 rounded-full border-2 border-[#1d1d1f]" />
                </div>
                <span className="text-[12px] text-white/60">3 collaborators editing</span>
                <span className="ml-2 h-2 w-2 rounded-full bg-[#30d158] animate-pulse" />
              </div>
            </div>
          </div>
          <div className="rounded-[18px] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 p-7">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e]">
              <Shield className="h-4 w-4 text-[#1d1d1f] dark:text-white" />
            </div>
            <h3 className="mt-4 text-[17px] font-semibold text-[#1d1d1f] dark:text-white">Secure & private</h3>
            <p className="mt-2 text-[13px] leading-5 text-[#6e6e73] dark:text-[#a1a1a6]">
              Your code stays yours. Encrypted, isolated workspaces with enterprise-grade security and backups.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-[#0071e3]">
              Learn about security <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack strip */}
      <section className="border-y border-black/[0.04] dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/50 backdrop-blur">
        <div className="mx-auto max-w-[980px] px-6 py-8">
          <p className="text-center text-[12px] font-medium tracking-wide text-[#86868b] uppercase">
            Built for modern stacks
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
            <Image src="/react.svg" alt="React" width={36} height={36} className="grayscale hover:grayscale-0 transition-all hover:scale-110" />
            <Image src="/nextjs-icon.svg" alt="Next.js" width={36} height={36} className="dark:invert" />
            <Image src="/vuejs-icon.svg" alt="Vue" width={36} height={36} />
            <Image src="/angular-2.svg" alt="Angular" width={36} height={36} />
            <Image src="/expressjs-icon.svg" alt="Express" width={36} height={36} className="dark:invert" />
            <Image src="/hono.svg" alt="Hono" width={36} height={36} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[980px] px-6 py-12 sm:py-16 w-full">
        <div className="rounded-[24px] bg-gradient-to-br from-[#0071e3] via-[#0077ed] to-[#42a5f5] p-[1px]">
          <div className="rounded-[23px] bg-gradient-to-br from-[#0071e3] to-[#0058b0] px-8 py-10 sm:px-12 sm:py-14 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="relative">
              <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.03em] leading-tight">
                Start building today.
                <br />
                <span className="font-normal opacity-90">You&apos;ll love how it feels.</span>
              </h2>
              <p className="mx-auto mt-3 max-w-[540px] text-[15px] leading-6 text-white/80">
                Join thousands of developers who switched to CodePilot for a faster, more joyful workflow.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="h-10 rounded-full bg-white text-[#0071e3] hover:bg-white/90 font-medium px-7 shadow-lg">
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <span className="text-[13px] text-white/70">No credit card required • Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
