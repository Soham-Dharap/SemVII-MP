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
      <button onClick={() => setN(n+1)} style={{ marginTop: 14, background: '#1640FF', color: 'white', borderRadius: 999, padding: '8px 14px', fontWeight: 600, border: 'none' }}>
        Count: {n}
      </button>
    </div>
  )
}`;

function buildPreview(code: string) {
  const cleaned = code.replace(/^import.*?;?$/gm, "").replace(/export\s+default\s+function/g, "function App").replace(/export\s+/g, "");
  const render = `try{${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));}catch(e){document.body.innerHTML='<pre style="padding:16px;color:#EF4444">'+e.message+'</pre>'}`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{margin:0;font-family:system-ui;background:white;color:#0F1115;overflow-x:hidden}</style></head><body><div id="root"></div><script type="text/babel" data-presets="react">${render}<\/script></body></html>`;
}

export default function Home() {
  const [code, setCode] = useState(STARTER);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildPreview(code)), 250); return () => clearTimeout(t); }, [code]);

  return (
    <div className="bg-[#F8F9FF] overflow-x-hidden min-w-0 selection:bg-[#D6FF00] selection:text-[#0F1115]">
      {/* ============ VIBRANT BLUE HERO — BASE CLUB STYLE ============ */}
      <div className="bg-[#1640FF] relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Subtle radial glow */}
        <div className="absolute top-[20%] left-[30%] w-[800px] h-[600px] bg-white/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Inside nav pills — mimics reference top bar */}
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left pill nav — like About Club / My stats */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="bg-white text-[#1640FF] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">ABOUT EDITOR</span>
              <Link href="/dashboard" className="bg-white/15 backdrop-blur border border-white/20 text-white px-3 py-1 rounded-full text-[11px] font-medium hover:bg-white/20 transition">MY PLAYGROUNDS</Link>
              <span className="bg-white/15 backdrop-blur border border-white/20 text-white px-3 py-1 rounded-full text-[11px] font-medium">TEMPLATES • 6</span>
            </div>
            {/* Mobile logo substitute */}
            <div className="lg:hidden flex items-center gap-2">
              <span className="bg-white text-[#1640FF] px-3 py-1 rounded-full text-[11px] font-bold">CODEPILOT</span>
            </div>
            {/* Right CTA — Connect wallet style */}
            <Link href="/dashboard" className="shrink-0 bg-white text-[#1640FF] px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-bold hover:bg-[#EEF2FF] transition shadow-lg">
              Open App →
            </Link>
          </div>
        </div>

        {/* HUGE TYPE HERO */}
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="relative">
            {/* Lime # — top left */}
            <div className="absolute -top-2 sm:top-0 left-0 sm:left-[2%] z-20 select-none pointer-events-none">
              <span className="text-[#D6FF00] text-[64px] sm:text-[88px] lg:text-[120px] font-black leading-none tracking-tighter" style={{ transform: 'rotate(-8deg)', display: 'inline-block', fontFamily: 'Space Grotesk, sans-serif' }}>#</span>
            </div>

            {/* Main huge text */}
            <h1 className="text-white font-black uppercase leading-[0.85] tracking-[-0.04em] select-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>
              {/* Line 1: CODE with # overlap */}
              <span className="block text-[64px] sm:text-[96px] md:text-[120px] lg:text-[148px] xl:text-[168px] pl-[38px] sm:pl-[56px] lg:pl-[72px]">CODE</span>
              {/* Line 2: PILOT */}
              <span className="block text-[58px] sm:text-[88px] md:text-[110px] lg:text-[136px] xl:text-[152px] -mt-1 sm:-mt-2">PILOT</span>
              {/* Line 3: FOR DEVS — two words */}
              <span className="block text-[52px] sm:text-[80px] md:text-[100px] lg:text-[124px] xl:text-[138px] -mt-1 sm:-mt-2 flex flex-wrap gap-x-3 sm:gap-x-6 items-center">
                <span>FOR</span>
                <span className="text-white/90">DEVS</span>
                {/* Inline circular badge on desktop — mimics GET STARTED FOR FREE */}
                <span className="hidden xl:inline-flex ml-4 xl:ml-8 translate-y-1">
                  <span className="bg-[#D6FF00] text-[#0F1115] rounded-full w-[96px] h-[96px] flex flex-col items-center justify-center text-[9px] font-black leading-[1] tracking-widest text-center p-2 rotate-[12deg] shadow-xl">
                    <span>GET</span>
                    <span>STARTED</span>
                    <span>FOR FREE</span>
                    <span className="mt-1 text-[14px]">↗</span>
                  </span>
                </span>
              </span>
            </h1>

            {/* Floating glass cards — like pearl.eth */}
            {/* Card 1 — top right */}
            <div className="absolute hidden md:flex top-[18%] right-[2%] lg:right-[6%] z-20 rotate-[6deg] hover:rotate-[3deg] transition-transform duration-300">
              <div className="bg-white/15 backdrop-blur-[16px] border border-white/30 rounded-[20px] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] w-[170px]">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/100?img=12" alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white/50" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-[11px] font-bold leading-none truncate">alex.dev</div>
                    <div className="text-white/70 text-[10px] mono">3 projects</div>
                  </div>
                </div>
                <div className="mt-2 bg-white rounded-full px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[#1640FF] text-[11px] font-bold">Next.js</span>
                  <span className="bg-[#D6FF00] text-[#0F1115] text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
                </div>
              </div>
            </div>

            {/* Card 2 — bottom left */}
            <div className="absolute hidden md:flex bottom-[8%] left-[8%] lg:left-[14%] z-20 -rotate-[5deg] hover:rotate-[-2deg] transition-transform duration-300">
              <div className="bg-white/15 backdrop-blur-[16px] border border-white/30 rounded-[20px] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] w-[168px]">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/100?img=32" alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white/50" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-[11px] font-bold leading-none truncate">mira.codes</div>
                    <div className="text-white/70 text-[10px] mono">12 runs</div>
                  </div>
                </div>
                <div className="mt-2 bg-[#D6FF00] rounded-full px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[#0F1115] text-[11px] font-bold">React • Vite</span>
                  <span className="text-[#0F1115] text-[11px]">↗</span>
                </div>
              </div>
            </div>

            {/* Lime arrows — hand drawn */}
            {/* Top arrow */}
            <svg className="absolute hidden lg:block top-[12%] right-[22%] w-[84px] h-[84px] pointer-events-none z-10" viewBox="0 0 100 100" fill="none">
              <path d="M10 20 C 30 5, 70 5, 85 40 C 75 30, 70 25, 80 20" stroke="#D6FF00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M85 40 L72 28 L78 45" stroke="#D6FF00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            {/* Bottom arrow */}
            <svg className="absolute hidden lg:block bottom-[18%] left-[32%] w-[72px] h-[60px] pointer-events-none z-10" viewBox="0 0 100 80" fill="none">
              <path d="M5 60 C 20 10, 50 5, 90 30" stroke="#D6FF00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M90 30 L78 22 L82 42" stroke="#D6FF00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>

            {/* Mobile badge — below text */}
            <div className="flex xl:hidden justify-end mt-4 sm:mt-6">
              <div className="bg-[#D6FF00] text-[#0F1115] rounded-full w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] flex flex-col items-center justify-center text-[9px] font-black leading-[1] tracking-widest text-center p-2 rotate-[12deg] shadow-xl">
                <span>GET</span>
                <span>STARTED</span>
                <span>FOR FREE</span>
                <span className="mt-1 text-[14px]">↗</span>
              </div>
            </div>

            {/* Subtitle under huge type */}
            <p className="mt-4 sm:mt-6 max-w-[420px] text-white/80 text-[13px] sm:text-[14px] leading-5 sm:leading-6">
              Your localhost, in the browser. Real files, Monaco, 350ms preview. <span className="text-white font-semibold">No Docker. No setup.</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/dashboard" className="bg-white text-[#1640FF] px-6 py-3 rounded-full text-[13px] font-bold hover:bg-[#EEF2FF] transition">Open workspace →</Link>
              <span className="bg-transparent border border-white/30 text-white px-5 py-3 rounded-full text-[12px] font-medium">Free • 0.8s boot</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ WHITE BOTTOM — 3 CARDS ============ */}
      <div className="bg-[#F4F5F7] rounded-t-[24px] sm:rounded-t-[36px] -mt-6 sm:-mt-8 relative z-20 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 pt-8 sm:pt-10 pb-8">
          {/* 3 Feature cards — exact reference layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
            {/* Card 1 */}
            <div className="bg-[#EDEEF2] rounded-[24px] p-6 sm:p-7 relative overflow-hidden group hover:bg-[#E8E9EF] transition">
              <h3 className="font-black text-[#0F1115] text-[17px] sm:text-[18px] leading-[1] tracking-tight uppercase">Start from<br />template</h3>
              <p className="text-[#6B7280] text-[12px] leading-4 mt-2">pick your stack — React, Next, Vue in one click</p>
              <div className="mt-6 flex items-end gap-3">
                <div className="bg-[#1640FF] text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-sm">
                  <img src="https://i.pravatar.cc/100?img=33" alt="" className="w-6 h-6 rounded-full" />
                  <div className="text-[11px] leading-none">
                    <div className="font-bold">react.dev</div>
                    <div className="opacity-70 text-[10px]">6 templates</div>
                  </div>
                </div>
                <div className="bg-[#D6FF00] text-[#0F1115] rounded-full px-3 py-1 text-[11px] font-black">24+</div>
              </div>
              {/* Arrow */}
              <svg className="absolute -right-1 top-[42%] w-[40px] h-[40px] hidden md:block text-[#0F1115]" viewBox="0 0 40 40" fill="none"><path d="M5 20 Q 20 5 35 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/><path d="M35 20 L26 14 L26 26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </div>

            {/* Card 2 */}
            <div className="bg-[#EDEEF2] rounded-[24px] p-6 sm:p-7 relative group hover:bg-[#E8E9EF] transition">
              <h3 className="font-black text-[#0F1115] text-[17px] sm:text-[18px] leading-[1] tracking-tight uppercase">Code live<br />preview</h3>
              <p className="text-[#6B7280] text-[12px] leading-4 mt-2">each save updates in 350ms — no reload</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="bg-[#1640FF] text-white rounded-full px-4 py-2 text-[13px] font-bold tracking-tight">1,247 runs</div>
                <div className="bg-[#D6FF00] text-[#0F1115] w-8 h-8 rounded-full flex items-center justify-center font-black text-[13px]">↗</div>
              </div>
              {/* Arrow */}
              <svg className="absolute -right-1 top-[42%] w-[40px] h-[40px] hidden md:block text-[#0F1115]" viewBox="0 0 40 40" fill="none"><path d="M5 20 Q 20 5 35 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/><path d="M35 20 L26 14 L26 26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </div>

            {/* Card 3 */}
            <div className="bg-[#EDEEF2] rounded-[24px] p-6 sm:p-7 group hover:bg-[#E8E9EF] transition">
              <h3 className="font-black text-[#0F1115] text-[17px] sm:text-[18px] leading-[1] tracking-tight uppercase">Ship &<br />share</h3>
              <p className="text-[#6B7280] text-[12px] leading-4 mt-2">get a link, duplicate, or export to GitHub</p>
              <div className="mt-6">
                <div className="bg-[#D6FF00] rounded-full px-4 py-3 inline-flex flex-col">
                  <span className="text-[#0F1115] text-[10px] font-bold tracking-widest uppercase leading-none">Est. boot 0.8s</span>
                  <span className="text-[#0F1115] text-[18px] font-black leading-none tracking-tight">188.34257<span className="text-[11px] font-bold ml-1">MS</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* ============ LIVE PLAYGROUND PREVIEW — VIBRANT WRAP ============ */}
          <div className="mt-8 sm:mt-10 bg-white rounded-[20px] sm:rounded-[24px] border border-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center justify-between h-[44px] px-4 border-b border-black/5 bg-[#F8F9FF]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57] border border-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#28CA42] border border-black/10" />
                <span className="ml-3 mono text-[11px] font-bold hidden sm:inline">CodePilot — App.tsx • Live</span>
              </div>
              <div className="flex items-center gap-2 mono text-[10px]">
                <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#1640FF] text-white px-2.5 py-1 rounded-full font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
                </span>
                <Link href="/dashboard" className="bg-[#D6FF00] text-[#0F1115] px-3 py-1 rounded-full font-black text-[11px] hover:brightness-105 transition">Try it →</Link>
              </div>
            </div>

            {/* Split */}
            <div className="grid md:grid-cols-[1.15fr_0.85fr] min-h-[380px]">
              <div className="bg-[#0B0F1A] p-4 border-b md:border-b-0 md:border-r border-black/5">
                <div className="mono text-[10px] tracking-widest text-[#475569] mb-3 flex items-center justify-between">
                  <span>SRC / APP.TSX</span>
                  <span className="text-[#D6FF00]">● editing</span>
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full h-[260px] sm:h-[300px] bg-transparent min-w-0 text-[#E2E8F0] mono text-[11px] leading-[18px] resize-none focus:outline-none"
                  spellCheck={false}
                />
              </div>
              <div className="bg-white min-h-[260px] sm:min-h-[300px] relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-[#F8FAFC] border-b border-black/5 flex items-center px-3 mono text-[10px] text-[#64748B] gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Preview • 350ms
                </div>
                <div className="pt-6 h-full">
                  <iframe title="preview" srcDoc={srcDoc} className="w-full h-[260px] sm:h-[300px] border-0" sandbox="allow-scripts allow-same-origin" />
                </div>
              </div>
            </div>

            <div className="h-7 hidden sm:flex items-center justify-between px-4 bg-[#F8F9FF] border-t border-black/5 mono text-[11px] text-[#6B7280]">
              <span>Monaco • Babel • Real files → Try editing the code</span>
              <span>⌘+S to save • Private by default</span>
            </div>
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-8 bg-[#0F1115] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-white font-black text-[22px] sm:text-[26px] leading-none tracking-tight uppercase">Start in seconds.<br/><span className="text-white/60 font-bold">Stay for hours.</span></div>
              <div className="text-white/60 mono text-[11px] mt-2">Free • No card • Private by default</div>
            </div>
            <Link href="/dashboard" className="shrink-0 bg-[#D6FF00] text-[#0F1115] px-6 py-3 rounded-full text-[13px] font-black hover:brightness-105 transition">Open workspace →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
