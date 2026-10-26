"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const STARTER = `export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div style={{ padding: 32, fontFamily: 'Space Grotesk, system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
        Hello CodePilot
      </h1>
      <p style={{ color: '#6B7280', fontSize: 13, marginTop: 8 }}>
        Edit me — preview is live ✨
      </p>
      <button 
        onClick={() => setCount(count + 1)} 
        style={{ marginTop: 16, background: '#6366F1', color: 'white', borderRadius: 999, padding: '10px 18px', fontWeight: 600, border: 'none' }}>
        Count: {count}
      </button>
    </div>
  )
}`;

function buildPreview(code: string) {
  const cleaned = code.replace(/^import.*?;?$/gm, "").replace(/export\s+default\s+function/g, "function App").replace(/export\s+/g, "");
  const render = `try{${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));}catch(e){document.body.innerHTML='<pre style="padding:16px;color:#EF4444">'+e.message+'</pre>'}`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{margin:0;font-family:Space Grotesk,system-ui;background:white;color:#0D0F14}</style></head><body><div id="root"></div><script type="text/babel" data-presets="react">${render}<\/script></body></html>`;
}

export default function Home() {
  const [code, setCode] = useState(STARTER);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildPreview(code)), 300); return () => clearTimeout(t); }, [code]);

  return (
    <div className="bg-[#FCFCF8] overflow-x-hidden">
      {/* ===== MARKLAB HERO — Dark Indigo Gradient ===== */}
      <section className="relative overflow-hidden">
        {/* Deep premium gradient — Marklab exact */}
        <div className="absolute inset-0 bg-[#070A1C]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1040] via-[#2D1B69] to-[#6366F1]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FCFCF8]" />
        {/* Blue glow left */}
        <div className="absolute -left-[20%] top-[20%] w-[800px] h-[600px] bg-[#6366F1] blur-[150px] opacity-[0.35] rounded-full" />
        {/* Vertical bars right — like Marklab */}
        <div className="absolute right-0 top-[20%] bottom-[20%] w-[280px] hidden lg:flex gap-1 opacity-[0.15]">
          {Array.from({length: 8}).map((_,i)=><div key={i} className="flex-1 bg-gradient-to-b from-white to-transparent" style={{opacity: 0.1 + i*0.05}} />)}
        </div>

        {/* Pill Nav — Marklab */}
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 pt-5">
          <nav className="mx-auto max-w-[720px] flex items-center justify-between bg-[#1A1C2E]/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-6 pl-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#6366F1] flex items-center justify-center">
                  <span className="text-white font-black text-[12px]">✦</span>
                </div>
                <span className="text-white font-bold text-[14px] tracking-tight">CodePilot</span>
              </div>
              <div className="hidden md:flex items-center gap-5 text-[12px] text-white/70 font-medium">
                <span className="text-white flex items-center gap-1">Pages ▾</span>
                <span>About</span>
                <span>Templates</span>
                <span>Pricing</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex h-8 w-8 rounded-full bg-white/10 border border-white/10 items-center justify-center text-white/70">♡</span>
              <Link href="/dashboard" className="h-9 px-5 rounded-full bg-white text-[#1A1040] text-[12px] font-bold inline-flex items-center gap-2 hover:bg-white/90 transition">
                Let&apos;s Start <span className="h-6 w-6 rounded-full bg-[#1A1040] text-white flex items-center justify-center text-[10px]">↗</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Hero Content — Marklab Typography */}
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 pt-12 sm:pt-16 pb-20 sm:pb-28 text-center">
          <h1 className="text-white font-bold tracking-[-0.04em] leading-[0.9]">
            <span className="block text-[36px] sm:text-[56px] lg:text-[72px]">Code that</span>
            <span className="block text-[40px] sm:text-[64px] lg:text-[80px] font-normal italic" style={{fontFamily: 'Newsreader, serif'}}>
              moves the <span className="font-bold not-italic" style={{fontFamily: 'Space Grotesk, sans-serif'}}>Needle</span>
            </span>
          </h1>
          <p className="mt-5 text-white/60 text-[13px] sm:text-[14px] leading-6 max-w-[520px] mx-auto">
            Every project here is designed to deliver impact — not just impressions. Build, preview, ship in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="h-11 px-6 rounded-full bg-white text-[#1A1040] text-[13px] font-bold inline-flex items-center gap-2 hover:bg-white/90 transition">
              Let&apos;s Start <span className="h-7 w-7 rounded-full bg-[#1A1040] text-white flex items-center justify-center">↗</span>
            </Link>
            <Link href="#playground" className="h-11 px-6 rounded-full bg-transparent border border-white/20 text-white text-[13px] font-medium inline-flex items-center gap-2 hover:bg-white/10 transition">
              Book a demo ↗
            </Link>
          </div>
          {/* Arrow + Bell */}
          <div className="absolute left-[12%] bottom-[28%] hidden lg:block">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="text-white/50"><path d="M2 35 Q 20 5 55 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/><path d="M55 12 L48 8 L50 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/></svg>
          </div>
          <div className="absolute right-[14%] bottom-[20%] hidden lg:block">
            <div className="relative">
              <div className="w-16 h-20 bg-gradient-to-br from-[#FF6B9D] via-[#6366F1] to-[#4F46E5] rounded-[20px] rounded-b-[28px] shadow-xl flex items-center justify-center rotate-[8deg]">
                <div className="w-8 h-8 bg-white rounded-full animate-pulse" style={{boxShadow: '0 4px 12px rgba(0,0,0,0.3)'}} />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 border-[3px] border-[#FF6B9D] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo strip — Marklab */}
      <section className="bg-white border-y border-black/5 py-6">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <p className="text-center text-[12px] text-black/50 font-medium">Be part of the 100+ teams shipping faster with CodePilot.</p>
          <div className="mt-5 flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-60">
            {["CodePilot", "Vercel ●", "Linear", "Notion", "Stripe", "Figma"].map(l=> (
              <span key={l} className="text-[#6366F1] font-black text-[13px] tracking-tight">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue / Stats — Marklab bottom */}
      <section className="bg-[#EEF0FF]/50 py-8">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 grid md:grid-cols-[1.4fr_0.8fr] gap-6">
          <div className="bg-white border border-black/5 rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full px-3 py-1 text-[11px] font-bold text-[#6366F1]">LIVE PREVIEW</div>
            <h3 className="display text-[22px] mt-4">Ship 3× faster</h3>
            <p className="text-[13px] text-muted-foreground mt-2">Monaco + live preview in 350ms, real files. No Docker, no waiting.</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div><div className="text-[28px] font-black tracking-tight">99<span className="text-[16px]">%</span></div><div className="mono text-[11px] text-muted-foreground">Uptime</div></div>
              <div><div className="text-[28px] font-black tracking-tight">0.8s</div><div className="mono text-[11px] text-muted-foreground">Boot time</div></div>
              <div><div className="text-[28px] font-black tracking-tight">12k+</div><div className="mono text-[11px] text-muted-foreground">Builders</div></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[24px] p-6 text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">◎</div>
            <h3 className="font-bold text-[18px] mt-4 leading-tight">Your code,<br/>your growth.</h3>
            <p className="text-white/70 text-[12px] mt-2">Templates for every stack.</p>
            <Link href="/dashboard" className="mt-4 inline-flex h-8 px-4 rounded-full bg-white text-[#6366F1] text-[11px] font-bold">Explore →</Link>
          </div>
        </div>
      </section>

      {/* ===== ZENTRA FINANCE — Onboarding Phones ===== */}
      <section className="bg-[#070A14] text-white relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '40px 40px'}} />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-white/20 text-[56px] sm:text-[88px] font-black tracking-tighter leading-none select-none">CodePilot</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mt-4 max-w-[900px] mx-auto">
            {/* Left phone — Own Your Money */}
            <div className="bg-[#0F1115] border border-white/10 rounded-[32px] p-3 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
              <div className="bg-gradient-to-b from-[#6366F1]/20 via-[#1A1A2E] to-[#0F1115] rounded-[24px] overflow-hidden min-h-[520px] flex flex-col">
                <div className="flex justify-between px-5 pt-3 mono text-[11px] text-white/50"><span>9:41</span><span>● ● ●</span></div>
                <div className="px-6 pt-8 flex-1">
                  <div className="text-white/70 mono text-[11px] tracking-widest flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-white/30 flex items-center justify-center text-[8px]">∞</span> CodePilot</div>
                  <h3 className="hero-title text-white text-[30px] leading-[0.95] mt-4">Own Your Code,<br/>Shape <span className="text-[#6366F1]">Your Future.</span></h3>
                  <p className="text-white/50 text-[12px] leading-5 mt-3">From writing components to shipping production apps, your journey begins here.</p>
                </div>
                <div className="p-4">
                  <Link href="/dashboard" className="block h-11 rounded-full bg-[#6366F1] text-white font-bold text-[13px] flex items-center justify-center">Next →</Link>
                  <div className="text-center mt-3"><span className="text-white/50 mono text-[11px]">Skip</span></div>
                  <div className="flex justify-center gap-1.5 mt-3"><div className="h-1 w-6 bg-[#6366F1] rounded-full"/><div className="h-1 w-1.5 bg-white/20 rounded-full"/><div className="h-1 w-1.5 bg-white/20 rounded-full"/></div>
                </div>
              </div>
            </div>
            {/* Right phone — More Control */}
            <div className="bg-[#0F1115] border border-white/10 rounded-[32px] p-3 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
              <div className="bg-gradient-to-b from-[#E0E7FF]/30 via-[#1A1A2E] to-[#0F1115] rounded-[24px] overflow-hidden min-h-[520px] flex flex-col">
                <div className="flex justify-between px-5 pt-3 mono text-[11px] text-white/50"><span>9:41</span><span>● ● ●</span></div>
                <div className="px-6 pt-6 text-center">
                  <div className="text-white mono text-[12px] flex items-center justify-center gap-2"><span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center">∞</span> Zentra <span className="h-4 w-4 rounded-full border border-white/30 flex items-center justify-center text-[8px]">×</span></div>
                  <h3 className="text-white font-bold text-[22px] leading-none mt-3">More Control</h3>
                  <p className="text-white/50 text-[11px] mt-1">to ship your features faster!</p>
                </div>
                <div className="mx-4 mt-5 bg-[#1A1C1E] border border-white/10 rounded-[20px] p-1">
                  <div className="flex bg-black rounded-full p-1">
                    <span className="flex-1 bg-[#6366F1] text-white rounded-full py-1.5 text-center mono text-[11px] font-bold">Premium</span>
                    <span className="flex-1 text-white/60 rounded-full py-1.5 text-center mono text-[11px]">infinity</span>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                      <div><div className="text-white text-[12px] font-bold">Advanced Analytics</div><div className="text-white/40 text-[11px] leading-4 mt-1">Get deeper insights & deploy faster!</div></div><span className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">◈</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                      <div><div className="text-white text-[12px] font-bold">Smart Preview</div><div className="text-white/40 text-[11px]">Live 350ms update.</div></div><span className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">◈</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <div><div className="text-white text-[12px] font-bold">Unlimited Playgrounds</div><div className="text-white/40 text-[11px]">No limits, forever.</div></div><span className="h-6 w-6 rounded-full bg-white text-black flex items-center justify-center text-[10px]">✓</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <Link href="/dashboard" className="block h-11 rounded-full bg-[#6366F1] text-white font-bold text-[12px] flex items-center justify-center">Continue — Free →</Link>
                  <div className="text-center mono text-[10px] text-white/30 mt-2">and more!</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6 max-w-[900px] mx-auto">
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mono text-[11px] text-white/70"><img src="https://i.pravatar.cc/40?img=12" className="w-6 h-6 rounded-full" alt=""/> @uix.vikram <span className="hidden sm:inline opacity-60">UI/UX Designer</span></span>
            <span className="mono text-[11px] text-white/40 flex items-center gap-2">⬇ Save for later!</span>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM 55% OFF — Dark pricing ===== */}
      <section className="bg-[#0A0A0F] text-white py-12 sm:py-16 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6366F1] blur-[100px] opacity-[0.12] rounded-full pointer-events-none" />
        <div className="relative mx-auto max-w-[720px] px-4 sm:px-6">
          <div className="relative bg-gradient-to-b from-[#1A1C1E] to-[#0F1115] rounded-[32px] border border-white/10 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <div className="bg-gradient-to-b from-[#0F1115] via-[#0F1115] to-transparent p-6 sm:p-8">
              <div className="flex justify-between items-start">
                <div className="text-[#D6FF00] font-black leading-none"><div className="text-[44px] sm:text-[52px] tracking-tighter">55%</div><div className="text-[32px] sm:text-[36px] -mt-2 opacity-80">off</div></div>
                <div className="text-[#D6FF00] text-[52px] leading-none -rotate-12 opacity-90" style={{fontFamily: 'Newsreader, serif', fontStyle: 'italic'}}>~</div>
              </div>
              <h2 className="text-white font-bold text-[18px] sm:text-[20px] text-center mt-4">Start from only $1.32 /week!</h2>
              <p className="text-white/40 text-[11px] text-center leading-4 mt-2 max-w-[360px] mx-auto">Get yearly access at a discounted price, don&apos;t miss your chance to upgrade now!</p>
              <div className="text-center mt-4"><span className="mono text-[11px] text-white/30">What&apos;s included ▾</span></div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/5 border border-white/5 rounded-[16px] p-4">
                  <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[#D6FF00] text-[12px]">◈</div>
                  <div className="text-white text-[12px] font-bold mt-3">Advanced Analytics</div>
                  <div className="text-white/40 mono text-[11px] leading-4 mt-1">Track progress with detailed data.</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-[16px] p-4">
                  <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[#D6FF00]">✦</div>
                  <div className="text-white text-[12px] font-bold mt-3">AI Code Review</div>
                  <div className="text-white/40 mono text-[11px] mt-1">Instant breakdowns.</div>
                </div>
              </div>
              <div className="mt-6 space-y-2.5">
                {[
                  {n: "1-month Premium", d: "Explore and get started", p: "$0.99", sel: false},
                  {n: "3-month Premium", d: "Build healthy habits", p: "$2.99", sel: true},
                  {n: "12-month Premium", d: "Transform your lifestyle", p: "$5.99", old: "$11.99", sel: false, save: "Save 50%"},
                ].map(o=> (
                  <div key={o.n} className={`relative rounded-full px-4 py-3 flex items-center justify-between border ${o.sel ? 'bg-[#D6FF00]/10 border-[#D6FF00] shadow-[0_0_20px_rgba(214,255,0,0.2)]' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${o.sel ? 'border-[#D6FF00] bg-[#D6FF00]' : 'border-white/20'}`}>{o.sel && <div className="h-2 w-2 bg-black rounded-full"/>}</div>
                      <div><div className="text-white text-[12px] font-bold">{o.n}</div><div className="mono text-[10px] text-white/40">{o.d}</div></div>
                    </div>
                    <div className="text-right"><div className="text-white font-black text-[13px]">{o.p}</div>{o.old && <div className="mono text-[10px] text-white/30 line-through">{o.old}</div>}</div>
                    {o.save && <div className="absolute -top-2 right-6 bg-[#FF8DA1] text-white mono text-[10px] font-bold px-2 py-0.5 rounded-full">{o.save}</div>}
                  </div>
                ))}
              </div>
              <Link href="/dashboard" className="mt-6 block h-12 rounded-full bg-[#D6FF00] text-black font-black text-[13px] flex items-center justify-center hover:brightness-105 transition">Get Premium Plan</Link>
              <div className="flex justify-center gap-1 mt-4 mono text-[10px] text-white/20">★★★★★ <span className="text-white/60">Trusted by 12k devs — “Best editor I’ve tried!”</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LIVE PLAYGROUND — Premium Demo ===== */}
      <section id="playground" className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mono text-[11px] font-bold text-primary">LIVE DEMO</div>
          <h2 className="hero-title text-[32px] sm:text-[40px] mt-4">Try it live.<br/><span className="text-muted-foreground">No signup.</span></h2>
        </div>
        <div className="mt-8 rounded-[24px] border border-border bg-card overflow-hidden shadow-xl">
          <div className="flex items-center justify-between h-[48px] px-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]"/><span className="h-3 w-3 rounded-full bg-[#FFBD2E]"/><span className="h-3 w-3 rounded-full bg-[#28CA42]"/>
              <span className="ml-3 mono text-[11px] font-bold hidden sm:inline">CodePilot — App.tsx • Live</span>
            </div>
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full mono text-[11px] font-bold flex items-center gap-1"><span className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-pulse"/>LIVE</span>
          </div>
          <div className="grid md:grid-cols-[1.15fr_0.85fr] min-h-[380px]">
            <div className="bg-[#0B0F1A] p-4 border-b md:border-b-0 md:border-r border-border">
              <div className="mono text-[10px] tracking-widest text-[#475569] mb-3 flex justify-between"><span>SRC / APP.TSX</span><span className="text-[#D6FF00]">● editing</span></div>
              <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-[300px] bg-transparent text-[#E2E8F0] mono text-[12px] leading-[18px] resize-none focus:outline-none" spellCheck={false} />
            </div>
            <div className="bg-white min-h-[300px] relative">
              <div className="h-6 bg-[#F8FAFC] border-b border-border flex items-center px-3 mono text-[10px] text-muted-foreground gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Preview • 350ms</div>
              <iframe title="preview" srcDoc={srcDoc} className="w-full h-[276px] border-0" sandbox="allow-scripts allow-same-origin" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
