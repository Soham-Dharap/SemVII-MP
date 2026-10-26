"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STARTER = `export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div style={{ padding: 32, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
        Hello CodePilot
      </h1>
      <p style={{ color: '#6B7280', fontSize: 13, marginTop: 8 }}>
        Edit me — preview is live ✨
      </p>
      <button 
        onClick={() => setCount(count + 1)} 
        style={{ 
          marginTop: 16, 
          background: '#1640FF', 
          color: 'white', 
          borderRadius: 999, 
          padding: '10px 18px', 
          fontWeight: 600, 
          border: 'none',
          cursor: 'pointer'
        }}>
        Count: {count}
      </button>
    </div>
  )
}`;

function buildPreview(code: string) {
  const cleaned = code.replace(/^import.*?;?$/gm, "").replace(/export\s+default\s+function/g, "function App").replace(/export\s+/g, "");
  const render = `try{${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));}catch(e){document.body.innerHTML='<pre style="padding:16px;color:#EF4444;font-family:monospace">'+e.message+'</pre>'}`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{margin:0;font-family:system-ui;background:white;color:#0D0F14;overflow-x:hidden} *{box-sizing:border-box}</style></head><body><div id="root"></div><script type="text/babel" data-presets="react">${render}<\/script></body></html>`;
}

export default function Home() {
  const [code, setCode] = useState(STARTER);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildPreview(code)), 300); return () => clearTimeout(t); }, [code]);

  return (
    <div className="bg-background min-w-0 overflow-x-hidden">
      {/* ===== HERO: Finance App Style — Blue glow + Own Your Code ===== */}
      <section className="relative overflow-hidden bg-background finance-gradient border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent pointer-events-none" />
        
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16">
          {/* Top badge like 55% off */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="mono text-[11px] font-semibold tracking-wide">NEW • Monaco 0.52 + Live Preview</span>
              <span className="hidden sm:inline-flex bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">55% faster</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center mt-8 sm:mt-10">
            {/* Left: Typography */}
            <div className="min-w-0">
              <h1 className="hero-title text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[72px]">
                Own Your Code,
                <span className="block text-foreground/40">Shape Your</span>
                <span className="block text-primary">Future.</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-[15px] sm:text-[16px] leading-6 text-muted-foreground max-w-[480px]">
                From writing clean components to shipping production apps, your development journey begins here. <span className="text-foreground font-medium">No setup. No friction.</span>
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard" className="h-12 px-7 rounded-full bg-primary text-primary-foreground text-[14px] font-bold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-primary/20">
                  Start Building →
                </Link>
                <Link href="#playground" className="h-12 px-7 rounded-full bg-card border border-border text-[14px] font-semibold inline-flex items-center justify-center hover:bg-accent transition">
                  Try Live Demo
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-primary rounded-full" />Trusted by 12k+ devs</span>
                <span className="hidden sm:flex items-center gap-2"><span className="h-px w-6 bg-border" />Free forever</span>
              </div>
            </div>

            {/* Right: Phone mockup like Finance App */}
            <div className="relative lg:h-[560px] flex items-center justify-center min-w-0">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent blur-[80px] rounded-full opacity-60" />
              
              {/* Phone mockup */}
              <div className="relative w-[300px] sm:w-[340px] bg-[#0A0A0F] rounded-[40px] p-2 shadow-[0_32px_80px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden">
                <div className="bg-gradient-to-b from-[#1a1aff]/20 via-[#1640FF]/10 to-transparent rounded-[32px] overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-3 pb-2 text-white/60 mono text-[11px]">
                    <span>9:41</span>
                    <div className="flex gap-1"><span>●●●</span>◐</div>
                  </div>
                  {/* Header */}
                  <div className="px-6 pt-4">
                    <div className="text-white/60 mono text-[11px] tracking-widest uppercase">CodePilot</div>
                    <div className="hero-title text-white text-[28px] leading-none mt-2">
                      Code that
                      <span className="block text-white/60">ships.</span>
                    </div>
                    <p className="text-white/50 text-[12px] leading-4 mt-3">Monaco editor with live preview. Real files, instant results.</p>
                  </div>
                  {/* Code preview card */}
                  <div className="mx-4 mt-6 bg-white rounded-[20px] p-4 shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#28CA42]" />
                      <span className="ml-auto mono text-[10px] text-muted-foreground">App.tsx • Live</span>
                    </div>
                    <div className="bg-[#0B0F1A] rounded-xl p-3 mono text-[10px] leading-4">
                      <div className="text-[#475569]">import {"{useState}"} from &apos;react&apos;</div>
                      <div className="text-[#E2E8F0]">function <span className="text-[#D6FF00]">App</span>() {"{"}</div>
                      <div className="text-[#E2E8F0] pl-3">return &lt;h1&gt;Hello<span className="bg-primary text-primary-foreground px-1 rounded">CodePilot</span>&lt;/h1&gt;</div>
                      <div className="text-[#E2E8F0]">{"}"}</div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 bg-[#1640FF] text-white rounded-full py-2 text-center text-[11px] font-bold">Run →</div>
                      <div className="px-3 bg-secondary border border-border rounded-full py-2 text-[11px] font-medium">Share</div>
                    </div>
                  </div>
                  {/* Bottom dots */}
                  <div className="flex justify-center gap-1.5 py-4">
                    <div className="h-1.5 w-6 bg-white rounded-full" />
                    <div className="h-1.5 w-1.5 bg-white/30 rounded-full" />
                    <div className="h-1.5 w-1.5 bg-white/30 rounded-full" />
                  </div>
                </div>
                {/* Home indicator */}
                <div className="flex justify-center pt-2 pb-1">
                  <div className="h-1 w-24 bg-white/80 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LIVE PLAYGROUND — Interactive ===== */}
      <section id="playground" className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 sm:py-12">
        <div className="rounded-[24px] border border-border bg-card overflow-hidden shadow-xl shadow-black/[0.05]">
          <div className="flex items-center justify-between h-[48px] px-4 sm:px-6 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57] border border-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#28CA42] border border-black/10" />
              </div>
              <span className="mono text-[11px] font-bold hidden sm:inline ml-3">Playground • App.tsx • Live</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[11px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" /> LIVE
              </span>
              <Link href="/dashboard" className="bg-foreground text-background px-4 py-1.5 rounded-full text-[11px] font-bold">Open in App →</Link>
            </div>
          </div>
          <div className="grid md:grid-cols-[1.1fr_0.9fr] min-h-[420px]">
            <div className="bg-[#0B0F1A] p-4 sm:p-5 border-b md:border-b-0 md:border-r border-border">
              <div className="mono text-[10px] tracking-widest text-[#475569] mb-3 flex items-center justify-between">
                <span>SRC / APP.TSX</span>
                <span className="text-[#D6FF00] flex items-center gap-1"><span className="h-1.5 w-1.5 bg-[#D6FF00] rounded-full animate-pulse" /> editing</span>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-[320px] bg-transparent text-[#E2E8F0] mono text-[12px] leading-[18px] resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>
            <div className="bg-white min-h-[320px] relative flex flex-col">
              <div className="h-7 bg-[#F8FAFC] border-b border-border flex items-center px-4 mono text-[10px] text-muted-foreground gap-2 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Preview • 350ms • Live
              </div>
              <iframe title="preview" srcDoc={srcDoc} className="flex-1 w-full border-0 min-h-[280px]" sandbox="allow-scripts allow-same-origin" />
            </div>
          </div>
          <div className="h-8 hidden sm:flex items-center justify-between px-6 bg-muted/30 border-t border-border mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary animate-pulse" />Auto-save • Monaco • Babel</span>
            <span>Try editing → preview updates live</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURES — Finance App Style Cards ===== */}
      <section id="features" className="mx-auto max-w-[1280px] px-4 sm:px-6 py-12">
        <div className="text-center max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mono text-[11px] font-semibold text-primary">Why CodePilot</div>
          <h2 className="hero-title text-[32px] sm:text-[42px] mt-4">Everything you need.<br/><span className="text-muted-foreground">Nothing you don&apos;t.</span></h2>
          <p className="text-[14px] leading-6 text-muted-foreground mt-3">Professional tools with premium experience. Built for developers who ship.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: "◈", title: "Advanced Analytics", desc: "Track your progress with detailed insights.", accent: "bg-primary" },
            { icon: "✦", title: "AI Pair Programming", desc: "Get intelligent code completions instantly.", accent: "bg-[#1640FF]" },
            { icon: "⬢", title: "Instant Preview", desc: "See changes live in 350ms, no reload.", accent: "bg-foreground" },
          ].map(c => (
            <div key={c.title} className="premium-card p-6 sm:p-7 premium-card-hover">
              <div className={`h-10 w-10 rounded-xl ${c.accent} text-white flex items-center justify-center text-[16px] font-bold`}>{c.icon}</div>
              <h3 className="font-bold text-[16px] mt-4">{c.title}</h3>
              <p className="text-[12px] leading-5 text-muted-foreground mt-2">{c.desc}</p>
              <div className="mt-4 mono text-[11px] font-medium text-primary">Learn more →</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TEMPLATES — Bento like Finance App ===== */}
      <section id="templates" className="mx-auto max-w-[1280px] px-4 sm:px-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="mono text-[11px] font-bold tracking-[0.14em] text-primary">TEMPLATES</div>
            <h2 className="display text-[28px] sm:text-[36px] mt-2">Start from anything.</h2>
          </div>
          <div className="hidden sm:flex mono text-[11px] text-muted-foreground gap-2">
            <span>6 starters</span><span className="opacity-30">•</span><span>Pick → code</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4">
          <Link href="/dashboard" className="col-span-12 lg:col-span-7 rounded-[24px] bg-foreground text-background p-7 sm:p-8 flex flex-col min-h-[300px] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-background text-foreground flex items-center justify-center text-[11px] font-black">N</div>
              <div>
                <div className="mono text-[10px] tracking-widest opacity-60">FEATURED</div>
                <div className="font-bold">Next.js 14</div>
              </div>
              <span className="ml-auto hidden sm:inline mono text-[10px] px-3 py-1 rounded-full bg-background/10 border border-white/10">App Router • RSC</span>
            </div>
            <h3 className="relative display text-[28px] sm:text-[34px] leading-[0.9] mt-6 max-w-[420px]">The React framework,<br/>ready in one click.</h3>
            <p className="relative mono text-[12px] leading-5 opacity-60 mt-3 max-w-[420px]">Server components, file routing, API routes. We scaffold correctly.</p>
            <div className="relative mt-auto pt-6 flex items-center gap-3">
              <span className="h-10 px-6 rounded-full bg-background text-foreground mono text-[12px] font-bold inline-flex items-center group-hover:opacity-90 transition">Use Next.js →</span>
              <span className="mono text-[11px] opacity-60">+12k runs</span>
            </div>
          </Link>

          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { n: "React", d: "Vite + HMR", c: "Vite 5", bg: "bg-[#61DAFB] text-black" },
              { n: "Vue", d: "SFC + Vite", c: "Vue 3.4", bg: "bg-[#4FC08D] text-white" },
              { n: "Express", d: "Node server", c: "Node 20", bg: "bg-[#EDEEF2] text-foreground border" },
              { n: "Hono", d: "Edge light", c: "Hono 4", bg: "bg-[#FF6B35] text-white" },
            ].map(t => (
              <Link key={t.n} href="/dashboard" className="rounded-[20px] bg-card border border-border p-5 flex flex-col group hover:border-foreground/10 hover:shadow-lg transition">
                <div className={`h-9 w-9 rounded-xl ${t.bg} flex items-center justify-center text-[10px] font-black border border-border/50`}>{t.n[0]}</div>
                <div className="font-bold mt-3">{t.n}</div>
                <div className="mono text-[11px] text-muted-foreground mt-1">{t.d}</div>
                <div className="mono text-[10px] text-muted-foreground/60 mt-auto pt-4">{t.c}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING — 55% off style from ref ===== */}
      <section className="bg-[#0A0A0F] text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1640FF]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-[560px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#D6FF00] text-black px-3 py-1 rounded-full mono text-[11px] font-black">Limited time</div>
            <h2 className="hero-title text-[42px] sm:text-[56px] leading-[0.85] mt-4">
              <span className="text-[#D6FF00]">55% off</span><br/>Premium
            </h2>
            <p className="text-white/60 text-[14px] leading-5 mt-4">Get yearly access at a discounted price, don&apos;t miss your chance to upgrade now!</p>
          </div>

          <div className="mt-10 max-w-[520px] mx-auto space-y-3">
            {[
              { name: "1-month Premium", price: "$0.99", desc: "Explore and get started", popular: false },
              { name: "3-month Premium", price: "$2.99", desc: "Build healthy habits", popular: true, save: "Most popular" },
              { name: "12-month Premium", price: "$5.99", desc: "Transform your lifestyle", old: "$11.99", popular: false },
            ].map(p => (
              <div key={p.name} className={`relative rounded-[16px] p-4 flex items-center justify-between border ${p.popular ? 'bg-white/[0.06] border-[#D6FF00] shadow-[0_0_20px_rgba(214,255,0,0.2)]' : 'bg-white/[0.04] border-white/10'}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${p.popular ? 'border-[#D6FF00] bg-[#D6FF00]' : 'border-white/20'}`}>
                    {p.popular && <div className="h-2 w-2 bg-black rounded-full" />}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold">{p.name}</div>
                    <div className="mono text-[11px] text-white/50">{p.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[16px] font-black">{p.price}</div>
                  {p.old && <div className="mono text-[11px] text-white/40 line-through">{p.old}</div>}
                </div>
                {p.save && <div className="absolute -top-2 -right-2 bg-[#D6FF00] text-black text-[10px] font-black px-2 py-0.5 rounded-full">{p.save}</div>}
              </div>
            ))}
            <Link href="/dashboard" className="block mt-6 h-12 rounded-full bg-[#D6FF00] text-black text-[14px] font-black flex items-center justify-center hover:brightness-105 transition">
              Get Premium Plan
            </Link>
            <p className="text-center mono text-[11px] text-white/40 mt-3">Works with all templates • Private by default</p>
          </div>
        </div>
      </section>

      {/* ===== CTA — More Control style ===== */}
      <section className="bg-background border-t border-border finance-gradient">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 to-transparent blur-2xl rounded-full" />
              <div className="relative bg-card border border-border rounded-[24px] p-6 sm:p-8 shadow-xl">
                <div className="mono text-[11px] font-bold tracking-widest text-primary">ZENTRA • PREMIUM</div>
                <h3 className="display text-[28px] sm:text-[32px] leading-none mt-3">More Control<br/>to ship faster!</h3>
                <p className="text-[13px] leading-5 text-muted-foreground mt-3">Advanced analytics, unlimited transactions, and priority support.</p>
                <div className="mt-6 space-y-3">
                  {["Advanced Analytics", "Unlimited Transactions", "Priority Support"].map(f => (
                    <div key={f} className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border">
                      <span className="text-[13px] font-semibold">{f}</span>
                      <span className="h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px]">✓</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard" className="mt-6 block h-11 rounded-full bg-primary text-primary-foreground font-bold text-[13px] flex items-center justify-center">
                  Continue — Upgrade $199 →
                </Link>
              </div>
            </div>
            <div>
              <h2 className="hero-title text-[36px] sm:text-[44px] leading-[0.9]">
                More Control<br/><span className="text-primary">to ship faster!</span>
              </h2>
              <p className="text-[14px] leading-6 text-muted-foreground mt-4">Get premium features to accelerate your workflow. Unlimited playgrounds, advanced preview, team sharing.</p>
              <div className="mt-6 flex gap-3">
                <Link href="/dashboard" className="h-11 px-6 rounded-full bg-foreground text-background font-bold text-[13px] inline-flex items-center">Start Free →</Link>
                <span className="h-11 px-5 rounded-full bg-card border border-border mono text-[11px] font-medium inline-flex items-center">No card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
