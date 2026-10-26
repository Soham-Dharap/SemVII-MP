"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const STARTER = `export default function App() {
  const [n, setN] = useState(0)
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>Hello CodePilot</h1>
      <p style={{ color: '#64748B', fontSize: 13 }}>Edit — preview is live.</p>
      <button onClick={() => setN(n+1)} style={{ marginTop: 14, background: '#2563EB', color: 'white', borderRadius: 999, padding: '8px 14px', fontWeight: 600, border: 'none' }}>
        Count: {n}
      </button>
    </div>
  )
}`;

function buildPreview(code: string) {
  const cleaned = code.replace(/^import.*?;?$/gm, "").replace(/export\s+default\s+function/g, "function App").replace(/export\s+/g, "");
  const render = `try{${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));}catch(e){document.body.innerHTML='<pre style=\"padding:16px;color:#EF4444\">'+e.message+'</pre>'}`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{margin:0;font-family:system-ui;background:white;color:#0F1115}</style></head><body><div id="root"></div><script type="text/babel" data-presets="react">${render}<\/script></body></html>`;
}

const TEMPLATES = [
  { id: "nextjs", name: "Next.js", desc: "App Router, server components, edge.", icon: "/nextjs-icon.svg", accent: "Next.js 14 • +12k runs" },
  { id: "react", name: "React", desc: "Vite + HMR, no config.", icon: "/react.svg", accent: "Vite 5 • +8k runs" },
  { id: "vue", name: "Vue", desc: "SFC, <script setup>, Vite.", icon: "/vuejs-icon.svg", accent: "Vue 3.4 • +3k runs" },
  { id: "angular", name: "Angular", desc: "Standalone components, esbuild.", icon: "/angular-2.svg", accent: "Angular 17 • +2k runs" },
  { id: "express", name: "Express", desc: "Node server, live logs.", icon: "/expressjs-icon.svg", accent: "Node 20 • +5k runs" },
  { id: "hono", name: "Hono", desc: "Edge-first, ultra-light.", icon: "/hono.svg", accent: "Hono 4 • +1k runs" },
];

export default function Home() {
  const [code, setCode] = useState(STARTER);
  const [srcDoc, setSrcDoc] = useState("");
  const [activeFile, setActiveFile] = useState("App.tsx");
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildPreview(code)), 250); return () => clearTimeout(t); }, [code]);

  return (
    <div className="bg-background text-foreground overflow-x-hidden min-w-0 selection:bg-primary selection:text-primary-foreground">
      {/* ── Announcement ── */}
      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 h-8 flex items-center justify-between mono text-[11px]">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="hidden sm:inline text-muted-foreground">LIVE</span>
            <span className="font-medium">1,247 playgrounds running — avg boot 0.8s</span>
          </span>
          <span className="hidden md:flex items-center gap-3 text-muted-foreground">
            <span>Monaco 0.52</span><span className="opacity-30">/</span><span>Babel standalone</span><span className="opacity-30">/</span><span>No Docker</span>
          </span>
        </div>
      </div>

      {/* ── HERO: editorial + embedded editor ── */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-10 lg:pt-10 lg:pb-12 overflow-hidden">
        <div className="grid xl:grid-cols-[560px_1fr] gap-8 xl:gap-10 items-start">
          {/* Left: type */}
          <div className="pt-2 lg:pt-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1.5 shadow-sm mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-medium">Write → Preview → Ship</span>
              <span className="text-muted-foreground hidden sm:inline">— no setup</span>
            </div>

            <h1 className="display text-[30px] xs:text-[34px] sm:text-[44px] lg:text-[52px] leading-[0.95] tracking-[-0.04em] mt-6">
              Your localhost,
              <span className="block font-normal tracking-[-0.03em] text-muted-foreground">in the browser.</span>
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-muted-foreground max-w-[480px] min-w-0">
              A browser editor that behaves like your local one. Real files, nested folders, Monaco with go-to-definition. Paste your <span className="text-foreground font-medium bg-secondary px-1.5 py-0.5 rounded text-[13px]">vite.config.ts</span> and it runs.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="h-11 px-7 rounded-full bg-primary text-primary-foreground mono text-[13px] font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
                Open workspace
                <span className="h-5 w-5 rounded-full bg-primary-foreground/15 flex items-center justify-center text-[11px]">→</span>
              </Link>
              <a href="#play" className="h-11 px-6 rounded-full bg-card border border-border mono text-[13px] font-medium inline-flex items-center hover:bg-accent transition-colors">
                Try live demo
              </a>
              <span className="mono text-[11px] text-muted-foreground hidden sm:inline">Free • Private by default</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-[480px] min-w-0">
              {[
                { k: "0.8s", l: "Avg boot" },
                { k: "Monaco", l: "Same as VS Code" },
                { k: "6", l: "Templates" },
              ].map(s => (
                <div key={s.k} className="rounded-2xl bg-card border border-border p-3">
                  <div className="display text-[18px] leading-none">{s.k}</div>
                  <div className="mono text-[10px] tracking-widest text-muted-foreground mt-1 uppercase">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating editor window — PRODUCT as hero */}
          <div id="play" className="relative lg:sticky lg:top-[64px]">
            {/* grid bg behind */}
            <div className="absolute -inset-4 bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.35] rounded-[28px] pointer-events-none hidden lg:block" />
            <div className="relative rounded-[20px] border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between h-[44px] px-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F57] border border-black/10" />
                  <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/10" />
                  <span className="h-3 w-3 rounded-full bg-[#28CA42] border border-black/10" />
                  <span className="ml-3 mono text-[11px] font-medium hidden sm:inline">CodePilot — App.tsx</span>
                </div>
                <div className="flex items-center gap-2 mono text-[10px]">
                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" /> LIVE
                  </span>
                  <span className="text-muted-foreground">UTF-8 • LF</span>
                </div>
              </div>

              {/* File tabs */}
              <div className="flex items-center gap-1 px-3 h-8 bg-muted/40 border-b border-border overflow-x-auto">
                {["App.tsx", "app.css", "utils.ts"].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFile(f)}
                    className={`h-6 px-3 rounded-full mono text-[11px] font-medium whitespace-nowrap border shrink-0 transition-colors ${activeFile === f ? "bg-foreground text-background border-foreground" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {f}
                  </button>
                ))}
                <span className="ml-auto mono text-[10px] text-muted-foreground hidden sm:inline">Ln 4, Col 12 • Spaces: 2</span>
              </div>

              {/* Split: code + preview */}
              <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] min-h-[360px]">
                <div className="bg-[#0B0F1A] p-4 border-b md:border-b-0 md:border-r border-border">
                  <div className="mono text-[10px] tracking-widest text-[#475569] mb-3 flex items-center justify-between">
                    <span>SRC / APP.TSX</span>
                    <span className="text-primary">● editing</span>
                  </div>
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full h-[240px] sm:h-[280px] bg-transparent min-w-0 text-[#E2E8F0] mono text-[11px] leading-[18px] resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </div>
                <div className="bg-white min-h-[280px] md:min-h-0 relative">
                  <div className="absolute top-0 inset-x-0 h-6 bg-[#F8FAFC] border-b border-[#E2EEF6] flex items-center px-3 mono text-[10px] text-[#64748B] gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Preview • 350ms
                  </div>
                  <div className="pt-6 h-full">
                    <iframe title="preview" srcDoc={srcDoc} className="w-full h-[240px] sm:h-[280px] md:h-[312px] border-0" sandbox="allow-scripts allow-same-origin" />
                  </div>
                </div>
              </div>

              {/* Footer of window */}
              <div className="h-7 flex items-center justify-between px-4 bg-muted/30 border-t border-border mono text-[11px] text-muted-foreground">
                <span>{TEMPLATES.length} templates • Try editing the code →</span>
                <span className="hidden sm:inline">⌘+S to save • Private by default</span>
              </div>
            </div>

            {/* floating badge */}
            <div className="hidden lg:flex absolute -right-2 -bottom-3 rounded-full bg-foreground text-background px-3 py-1.5 mono text-[11px] font-medium shadow-lg items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-background text-foreground flex items-center justify-center text-[11px]">⚡</span>
              No Docker • No cold start
            </div>
          </div>
        </div>
      </section>

      {/* ── Imports ticker — replaces pill pills with CODE ── */}
      <section className="border-y border-border bg-card overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex items-center gap-6 h-[52px] mono text-[12px] overflow-x-auto scrollbar-none">
            <span className="text-muted-foreground whitespace-nowrap">SUPPORTED •</span>
            <code className="whitespace-nowrap"><span className="text-muted-foreground">import</span> <span className="text-foreground font-medium">React</span> <span className="text-muted-foreground">from</span> <span className="text-primary">‘react’</span></code>
            <span className="opacity-20">/</span>
            <code className="whitespace-nowrap"><span className="text-muted-foreground">from</span> <span className="text-primary">‘next/link’</span></code>
            <span className="opacity-20">/</span>
            <code className="whitespace-nowrap"><span className="text-muted-foreground">from</span> <span className="text-primary">‘vue’</span></code>
            <span className="opacity-20">/</span>
            <code className="whitespace-nowrap"><span className="text-muted-foreground">import</span> <span className="text-foreground font-medium">express</span><span className="text-muted-foreground">()</span></code>
            <span className="opacity-20">/</span>
            <code className="whitespace-nowrap"><span className="text-muted-foreground">import</span> <span className="text-foreground font-medium">‘hono’</span></code>
            <span className="opacity-20 hidden sm:inline">/</span>
            <span className="mono text-[11px] text-muted-foreground hidden sm:inline whitespace-nowrap">Paste any starter • Vite config respected</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES: editorial, not 3 cards ── */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-8 lg:gap-10 xl:gap-12">
          <div className="lg:sticky lg:top-[80px] h-fit">
            <div className="mono text-[11px] font-semibold tracking-[0.14em] text-primary">[ THE PRODUCT ]</div>
            <h2 className="display text-[26px] sm:text-[30px] lg:text-[36px] leading-[0.95] tracking-[-0.03em] mt-3">
              Feels like
              <br />VS Code.
              <br /><span className="text-muted-foreground font-normal">Runs like a tab.</span>
            </h2>
            <p className="mono text-[12px] leading-5 text-muted-foreground mt-4 max-w-[360px]">
              No synthetic FS. We write to real files, keep your folder structure, and honor your config. Monaco is not skinned — it’s Monaco.
            </p>
            <div className="mt-6 flex gap-2">
              <Link href="/dashboard" className="h-8 px-4 rounded-full bg-primary text-primary-foreground mono text-[12px] font-medium inline-flex items-center hover:opacity-90">Start writing</Link>
              <span className="h-8 px-3 rounded-full bg-secondary border border-border mono text-[11px] inline-flex items-center text-muted-foreground">⌘K for commands</span>
            </div>
          </div>

          <div className="space-y-0 border border-border rounded-[20px] bg-card overflow-hidden divide-y divide-border">
            {[
              {
                n: "01",
                kicker: "WRITE",
                title: "Monaco, uncompromised",
                desc: "Autocomplete, go-to-definition, multi-cursor, command palette. Your keybindings. Your theme.",
                meta: "TS • JS • CSS • HTML • JSON",
              },
              {
                n: "02",
                kicker: "PREVIEW",
                title: "Live in 350ms",
                desc: "Babel + React in the preview iframe. CSS injected without reload. Errors shown inline, not as an overlay.",
                meta: "HMR • Error overlay • Console",
              },
              {
                n: "03",
                kicker: "SHIP",
                title: "Files, not blobs",
                desc: "Nested folders, .keep for empty dirs, duplicate or download. We keep the real FS so git just works.",
                meta: "Duplicate • Export • Share link",
              },
            ].map(f => (
              <div key={f.n} className="p-6 sm:p-7 flex gap-5 group hover:bg-muted/20 transition-colors">
                <div className="shrink-0">
                  <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center mono text-[11px] font-bold">{f.n}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mono text-[10px] tracking-[0.12em] font-semibold text-primary">{f.kicker}</div>
                  <h3 className="display text-[18px] mt-1">{f.title}</h3>
                  <p className="mono text-[12px] leading-5 text-muted-foreground mt-2 max-w-[520px]">{f.desc}</p>
                  <div className="mono text-[11px] text-muted-foreground/70 mt-3">{f.meta}</div>
                </div>
                <div className="hidden sm:flex h-7 w-7 rounded-full border border-border items-center justify-center mono text-[12px] text-muted-foreground group-hover:border-foreground group-hover:text-foreground transition-colors shrink-0">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES BENTO — new bento, not pills ── */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 pb-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="mono text-[11px] font-semibold tracking-[0.14em] text-primary">[ TEMPLATES ]</div>
            <h2 className="display text-[26px] sm:text-[30px] leading-none mt-2">Start from anything.</h2>
          </div>
          <div className="hidden sm:flex mono text-[11px] text-muted-foreground gap-2">
            <span>6 starters</span><span className="opacity-30">•</span><span>Pick one → edit</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-3 sm:gap-4">
          {/* Featured large */}
          <Link href="/dashboard" className="col-span-12 lg:col-span-7 rounded-[20px] bg-foreground text-background p-6 sm:p-7 flex flex-col justify-between min-h-[240px] sm:min-h-[280px] group overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(214,255,0,0.18),transparent_50%)] dark:opacity-100 opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-background text-foreground flex items-center justify-center">
                  <Image src="/nextjs-icon.svg" alt="" width={22} height={22} className="invert dark:invert-0" />
                </div>
                <div>
                  <div className="mono text-[11px] tracking-widest opacity-70">FEATURED</div>
                  <div className="font-semibold leading-none">Next.js</div>
                </div>
                <span className="ml-auto mono text-[11px] px-2.5 py-1 rounded-full bg-background/10 border border-white/10 hidden sm:inline">App Router • RSC • Edge</span>
              </div>
              <h3 className="display text-[28px] sm:text-[32px] leading-[0.95] tracking-[-0.03em] mt-6 max-w-[420px]">The React framework, ready in one click.</h3>
              <p className="mono text-[12px] leading-5 opacity-70 mt-3 max-w-[420px]">Server components, file-based routing, API routes. We scaffold with your preferences, not ours.</p>
            </div>
            <div className="relative mt-6 flex items-center gap-3">
              <span className="h-9 px-5 rounded-full bg-background text-foreground mono text-[12px] font-semibold inline-flex items-center group-hover:opacity-90">Use Next.js →</span>
              <span className="mono text-[11px] opacity-60">+12k runs this week</span>
            </div>
          </Link>

          {/* Right stack 2x2 */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
            {TEMPLATES.slice(1, 5).map(t => (
              <Link key={t.id} href="/dashboard" className="rounded-[20px] bg-card border border-border p-5 flex flex-col group hover:border-foreground/10 hover:shadow-sm transition-all">
                <div className="h-9 w-9 rounded-xl bg-secondary border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Image src={t.icon} alt="" width={20} height={20} />
                </div>
                <div className="font-semibold mt-3 leading-none">{t.name}</div>
                <div className="mono text-[11px] leading-4 text-muted-foreground mt-1">{t.desc}</div>
                <div className="mono text-[10px] text-muted-foreground/60 mt-auto pt-4">{t.accent}</div>
              </Link>
            ))}
          </div>

          {/* Full width last */}
          <Link href="/dashboard" className="col-span-12 rounded-[20px] bg-card border border-border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-foreground/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                <Image src={TEMPLATES[5].icon} alt="" width={20} height={20} />
              </div>
              <div>
                <div className="font-semibold leading-none">Hono</div>
                <div className="mono text-[11px] text-muted-foreground mt-1">Edge-first, ultra-light — for APIs that need to fly.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mono text-[11px]">
              <span className="hidden sm:inline text-muted-foreground">Hono 4 • +1k runs</span>
              <span className="h-8 px-4 rounded-full bg-primary text-primary-foreground font-medium inline-flex items-center">Use Hono →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FOOTER CTA: inverted, code as bg ── */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 pb-8">
        <div className="rounded-[20px] bg-foreground text-background overflow-hidden border border-foreground">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mono text-[11px] tracking-[0.14em] opacity-60">[ SHIP IT ]</div>
              <h2 className="display text-[26px] sm:text-[30px] lg:text-[36px] leading-[0.9] tracking-[-0.03em] mt-3">
                Start in
                <br />seconds.
                <br /><span className="text-background/60 font-normal">Stay for hours.</span>
              </h2>
              <p className="mono text-[12px] leading-5 opacity-70 mt-4 max-w-[420px]">Free playgrounds. Private by default. Duplicate, share a link, or export to GitHub when ready.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/dashboard" className="h-10 px-6 rounded-full bg-background text-foreground mono text-[13px] font-semibold inline-flex items-center hover:opacity-90">Open workspace →</Link>
                <span className="h-10 px-4 rounded-full bg-background/10 border border-white/10 mono text-[11px] inline-flex items-center opacity-80">No card • No spam</span>
              </div>
            </div>
            <div className="bg-[#0B0F1A] border-t lg:border-t-0 lg:border-l border-white/10 p-4 sm:p-6 flex flex-col">
              <div className="mono text-[10px] tracking-widest text-white/40 flex items-center justify-between">
                <span>TERMINAL / CREATE</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <pre className="mono text-[11px] leading-5 text-[#E2E8F0] mt-4 overflow-x-auto">
{`$ npx create-codepilot@latest my-app
  ✔ Pick a template › Next.js
  ✔ Install deps › done (1.2s)
  ✔ Start dev server › http://localhost:3000

  ● Monaco ready
  ● Preview live (350ms)
  ● Files watching

  → Open in browser`}
              </pre>
              <div className="mt-auto pt-6 flex items-center gap-2 mono text-[10px] text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Built for developers, not demos.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
