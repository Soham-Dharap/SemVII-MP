"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const STARTER_FILES: Record<string, string> = {
  "App.tsx": `export default function App() {
  const [n, setN] = useState(0)
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 20, fontWeight: 800 }}>yo. CodePilot →</h1>
      <p style={{ color: '#666', fontSize: 13 }}>edit me — preview is live fr fr</p>
      <button onClick={() => setN(n+1)}
        style={{ marginTop: 16, background: '#D6FF00', color: 'black', border: '2px solid black', padding: '8px 14px', fontWeight: 800 }}>
        Count: {n} ✦
      </button>
    </div>
  )
}`,
  "Button.tsx": `export function Button({ children, onClick }: any) {
  return <button onClick={onClick} style={{ background: '#0A0A0B', color: '#D6FF00', padding: '8px 14px', border: '2px solid black', fontWeight: 800 }}>{children}</button>
}`,
  "styles.css": `body { background: #0A0A0B; color: #F4F4F0; }`,
};

function buildMiniPreview(code: string, css: string) {
  const cleaned = code.replace(/^import.*?;?$/gm, "").replace(/export\s+default\s+function/g, "function App").replace(/export\s+/g, "");
  const hasApp = /function\s+App/.test(cleaned);
  const render = hasApp ? `${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));` : `function App(){ return React.createElement('pre', null, 'No App'); } const root=ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{margin:0;font-family:system-ui}*{box-sizing:border-box} ${css}</style></head><body><div id="root"></div><script type="text/babel" data-presets="react">try{${render}}catch(e){document.body.innerHTML='<pre style="padding:16px;color:#FF2B6E">'+e.message+'</pre>'}</script></body></html>`;
}

function HeroEditor() {
  const [active, setActive] = useState("App.tsx");
  const [code, setCode] = useState(STARTER_FILES["App.tsx"]);
  const [css] = useState(STARTER_FILES["styles.css"]);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => { setCode(STARTER_FILES[active] || ""); }, [active]);
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildMiniPreview(code, css)), 220); return () => clearTimeout(t); }, [code, css]);
  return (
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_#0A0A0B] overflow-hidden rotate-[0.4deg]">
      <div className="flex items-stretch bg-black text-white h-[36px] border-b-[3px] border-black">
        <div className="flex items-center gap-2 px-3">
          <span className="h-3 w-3 rounded-full bg-[#FF2B6E] border-2 border-white" />
          <span className="h-3 w-3 rounded-full bg-[#D6FF00] border-2 border-white" />
          <span className="h-3 w-3 rounded-full bg-[#00E5FF] border-2 border-white" />
        </div>
        <div className="flex items-stretch ml-2">
          {Object.keys(STARTER_FILES).map(name => (
            <button key={name} onClick={() => setActive(name)} className={`px-3 mono text-[11px] font-black border-r-2 border-white/20 ${active===name ? "bg-[#D6FF00] text-black" : "text-white/70 hover:text-white"}`}>{name}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 mono text-[10px] font-black"><span className="h-2 w-2 bg-[#D6FF00] animate-pulse" />LIVE</div>
      </div>
      <div className="grid grid-cols-12 min-h-[360px]">
        <div className="hidden sm:block col-span-3 bg-[#0A0A0B] text-white p-3 border-r-[3px] border-black">
          <div className="mono text-[10px] font-black tracking-[0.12em] text-[#D6FF00] mb-2">EXPLORER ✦</div>
          <div className="space-y-1 mono text-[11px] font-bold">
            <div className="text-white">› src/</div>
            <div className="pl-3 space-y-1">
              {Object.keys(STARTER_FILES).map(n => (
                <div key={n} onClick={() => setActive(n)} className={`cursor-pointer px-1.5 py-0.5 border-2 ${active===n ? "bg-[#D6FF00] text-black border-black" : "bg-white/5 text-white border-transparent hover:bg-white/10"}`}>{n}</div>
              ))}
            </div>
            <div className="pt-2 mono text-[10px] text-white/50 border-t-2 border-white/10 mt-3">3 FILES · BRUTALIST FS</div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-5 bg-[#0A0A0B] flex flex-col border-r-[3px] border-black">
          <div className="px-3 h-[28px] flex items-center justify-between bg-[#1C1C1F] border-b-2 border-black">
            <span className="mono text-[10px] font-black tracking-[0.08em] text-[#D6FF00]">{active} — TSX</span>
            <span className="mono text-[10px] text-white/60">⌘S</span>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} className="flex-1 w-full bg-[#0A0A0B] text-[#D6FF00] p-3 mono text-[11px] leading-5 resize-none focus:outline-none" />
        </div>
        <div className="col-span-12 sm:col-span-4 bg-white flex flex-col">
          <div className="px-3 h-[28px] flex items-center justify-between bg-[#D6FF00] border-b-2 border-black">
            <span className="mono text-[10px] font-black text-black">PREVIEW ✦ LIVE</span>
            <span className="mono text-[10px] font-bold text-black/60">100%</span>
          </div>
          <div className="flex-1 bg-white"><iframe title="preview" srcDoc={srcDoc} className="w-full h-full min-h-[280px] border-0" sandbox="allow-scripts allow-same-origin" /></div>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 h-[28px] bg-[#D6FF00] border-t-[3px] border-black mono text-[10px] font-black text-black">
        <span>{`{}`} BUILD → SHIP → REPEAT</span><span className="hidden sm:inline">TYPE — IT'S LIVE FR FR</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-[#0A0A0B] text-[#F4F4F0] overflow-x-hidden">
      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-6 pb-8">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-6 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D6FF00] text-black border-2 border-black mono text-[11px] font-black rotate-[-1.5deg] shadow-[3px_3px_0_#F4F4F0]">NEW ✦ NO AI SLOP — JUST CODE ◧</div>
            <h1 className="display text-[46px] sm:text-[64px] lg:text-[72px] mt-4 leading-[0.85] tracking-[-0.04em]">
              <span className="block text-white">CODE LIKE</span>
              <span className="block text-[#D6FF00] stroke-text">U MEAN IT<span className="text-white">.</span></span>
              <span className="block text-white/10 text-[28px] sm:text-[36px] mono font-black tracking-[0.16em] mt-2">{"{<>} // TODO: SHIP"}</span>
            </h1>
            <p className="mt-4 mono text-[12px] leading-6 text-white/70 max-w-[520px] border-l-4 border-[#D6FF00] pl-4">
              Monaco. Live preview. Brutalist file system. Writes to git, no fake cloud FS. Paste your Vite config — <span className="text-white font-black">it just runs.</span> Keyboard-first, zero cap.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 mono text-[10px] font-black">
              <span className="px-2 py-1 bg-white text-black border-2 border-black rotate-[-0.5deg]">REACT</span>
              <span className="px-2 py-1 bg-[#D6FF00] text-black border-2 border-black rotate-[0.5deg]">NEXT.JS</span>
              <span className="px-2 py-1 bg-[#00E5FF] text-black border-2 border-black rotate-[-0.5deg]">VUE</span>
              <span className="px-2 py-1 bg-[#FF2B6E] text-white border-2 border-black rotate-[0.5deg]">HONO</span>
              <span className="px-2 py-1 bg-[#7B61FF] text-white border-2 border-black">EXPRESS</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="inline-flex h-[44px] items-center bg-[#D6FF00] text-black px-6 mono text-[13px] font-black border-2 border-black shadow-[4px_4px_0_#F4F4F0] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_#F4F4F0] transition-all">OPEN WORKSPACE ✦ →</Link>
              <Link href="#" className="inline-flex h-[44px] items-center bg-white text-black px-5 mono text-[12px] font-black border-2 border-black shadow-[4px_4px_0_#F4F4F0]">READ MANUAL ↗</Link>
            </div>
            <div className="mt-4 flex items-center gap-2 mono text-[11px] font-bold">
              <span className="px-2 py-1 bg-[#1C1C1F] border-2 border-white text-white">⌘K</span><span className="text-white/60">to jump ·</span><span className="px-2 py-1 bg-[#1C1C1F] border-2 border-white text-white">⌘S</span><span className="text-white/60">to save · private till u share</span>
            </div>
            {/* stickers */}
            <div className="hidden lg:flex absolute -right-6 top-[40%] flex-col gap-2">
              <div className="px-3 py-1 bg-[#FF2B6E] text-white border-2 border-black mono text-[10px] font-black rotate-[3deg] shadow-[3px_3px_0_black]">{"{ }"} STICKER</div>
              <div className="px-3 py-1 bg-[#00E5FF] text-black border-2 border-black mono text-[10px] font-black rotate-[-2deg] shadow-[3px_3px_0_black]">{"< >"} BRUTAL</div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 relative">
            <div className="absolute -top-3 -left-3 px-2 py-1 bg-white text-black border-2 border-black mono text-[10px] font-black rotate-[-2deg] shadow-[3px_3px_0_black] z-10">Fig. 01 — IT'S ALIVE ✦</div>
            <HeroEditor />
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-[#1C1C1F] border-2 border-[#F4F4F0] text-white mono text-[10px] font-bold rotate-[0.5deg]">MONACO 0.52</span>
              <span className="px-2 py-1 bg-[#D6FF00] text-black border-2 border-black mono text-[10px] font-black rotate-[-0.5deg]">LIVE PREVIEW</span>
              <span className="px-2 py-1 bg-white text-black border-2 border-black mono text-[10px] font-bold">BRUTALIST FS</span>
            </div>
          </div>
        </div>
      </section>

      {/* BIG STATS — brutalist */}
      <section className="border-y-[3px] border-[#F4F4F0] bg-[#D6FF00] text-black">
        <div className="mx-auto max-w-[1440px] px-0 grid grid-cols-1 sm:grid-cols-3 divide-y-[3px] sm:divide-y-0 sm:divide-x-[3px] divide-black">
          <div className="px-6 py-5 flex items-baseline justify-between"><div><div className="display text-[36px]">0</div><div className="mono text-[11px] font-black tracking-[0.12em]">TELEMETRY</div></div><div className="mono text-[11px] font-bold max-w-[140px] text-right">We don't track u. Fr.</div></div>
          <div className="px-6 py-5 flex items-baseline justify-between bg-black text-white"><div><div className="display text-[36px] text-[#D6FF00]">350ms</div><div className="mono text-[11px] font-black tracking-[0.12em]">PREVIEW</div></div><div className="mono text-[11px] font-bold max-w-[140px] text-right">Type → preview. No spin.</div></div>
          <div className="px-6 py-5 flex items-baseline justify-between"><div><div className="display text-[36px]">6</div><div className="mono text-[11px] font-black tracking-[0.12em]">TEMPLATES</div></div><div className="mono text-[11px] font-bold max-w-[140px] text-right">React Next Vue etc. Paste config.</div></div>
        </div>
      </section>

      {/* CHAPTERS — huge numbers */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div id="write" className="col-span-12 lg:col-span-4 bg-white text-black border-[3px] border-black shadow-[6px_6px_0_#F4F4F0] p-5 rotate-[-0.3deg]">
            <div className="mono text-[11px] font-black tracking-[0.12em]">01 — WRITE</div>
            <div className="display text-[28px] mt-1 leading-none">MONACO,<br/>NOT A<br/><span className="bg-black text-white px-1">TEXTAREA.</span></div>
            <p className="mono text-[11px] leading-5 mt-3 text-black/70">Completion, multi-cursor, palette ⇧⌘P, Vim. Familiar on day one.</p>
            <div className="mt-4 grid grid-cols-1 gap-2 mono text-[10px] font-bold">
              <div className="flex justify-between border-2 border-black px-2 py-1.5 bg-[#D6FF00]"><span>COMPLETION</span><span>TYPE-AWARE ✦</span></div>
              <div className="flex justify-between border-2 border-black px-2 py-1.5"><span>MULTI-CURSOR</span><span>⌥ CLICK</span></div>
              <div className="flex justify-between border-2 border-black px-2 py-1.5 bg-black text-white"><span>PALETTE</span><span>⌘P · ⌘S</span></div>
            </div>
          </div>
          <div id="preview" className="col-span-12 lg:col-span-4 bg-[#7B61FF] text-white border-[3px] border-black shadow-[6px_6px_0_#F4F4F0] p-5 rotate-[0.4deg]">
            <div className="mono text-[11px] font-black tracking-[0.12em] text-[#D6FF00]">02 — PREVIEW</div>
            <div className="display text-[28px] mt-1 leading-none">UPDATES<br/>AS U<br/>TYPE<span className="text-[#D6FF00]">.</span></div>
            <p className="mono text-[11px] leading-5 mt-3 text-white/80">Split view, responsive, console. CSS injected, backend logs mocked.</p>
            <div className="mt-4 grid grid-cols-3 gap-2 mono text-[10px] font-black">
              <div className="bg-white text-black border-2 border-black p-2 text-center"><div className="display text-[18px]">350ms</div>DEBOUNCE</div>
              <div className="bg-[#D6FF00] text-black border-2 border-black p-2 text-center"><div className="display text-[18px]">BROWSER</div>RUNTIME</div>
              <div className="bg-black text-white border-2 border-white p-2 text-center"><div className="display text-[18px]">LIVE</div>ERROR BOUND</div>
            </div>
          </div>
          <div id="ship" className="col-span-12 lg:col-span-4 bg-[#FF2B6E] text-white border-[3px] border-black shadow-[6px_6px_0_#F4F4F0] p-5 rotate-[-0.2deg]">
            <div className="mono text-[11px] font-black tracking-[0.12em]">03 — SHIP</div>
            <div className="display text-[28px] mt-1 leading-none">GIT,<br/>EXPORT,<br/>NO LOCK<span className="bg-white text-black px-1">IN.</span></div>
            <p className="mono text-[11px] leading-5 mt-3 text-white/80">Private till u share. Export zip, push to GitHub. No credits bs.</p>
            <div className="mt-4 bg-black border-2 border-white p-2 flex items-center justify-between mono text-[10px] font-black">
              <span className="text-white">$ npx codepilot create</span>
              <button onClick={async()=>{await navigator.clipboard.writeText("npx codepilot create"); setCopied(true); setTimeout(()=>setCopied(false),1200)}} className="bg-[#D6FF00] text-black px-2 py-1 border-2 border-white">{copied ? "COPIED ✓" : "COPY"}</button>
            </div>
          </div>
        </div>
      </section>

      {/* SPEC TABLE — brutalist */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 pb-6">
        <div className="bg-white text-black border-[3px] border-black shadow-[8px_8px_0_#F4F4F0]">
          <div className="flex items-center justify-between px-4 h-[44px] bg-black text-white border-b-[3px] border-black">
            <div className="display text-[18px]">WHAT'S INSIDE ✦ SPEC</div><span className="mono text-[11px] font-black bg-[#D6FF00] text-black px-2 py-1 border-2 border-white">REV 2026.01</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mono text-[11px] font-bold">
              <thead><tr className="bg-[#D6FF00] text-black border-b-[3px] border-black"><th className="px-3 py-2 text-left">CAPABILITY</th><th className="px-3 py-2 text-left">DETAIL</th><th className="px-3 py-2 text-right">STATUS</th></tr></thead>
              <tbody className="divide-y-2 divide-black">
                <tr><td className="px-3 py-2.5">EDITOR</td><td className="px-3 py-2.5 font-normal">Monaco 0.52, TS/JS/TSX/JSON/CSS/HTML/Vue. Go-to def, hover docs.</td><td className="px-3 py-2.5 text-right"><span className="bg-black text-white px-1.5 py-0.5">STABLE</span></td></tr>
                <tr className="bg-[#F4F4F0]"><td className="px-3 py-2.5">FILE SYSTEM</td><td className="px-3 py-2.5 font-normal">Nested via /. Rename keeps dir, delete confirms. Local fallback.</td><td className="px-3 py-2.5 text-right"><span className="bg-black text-white px-1.5 py-0.5">STABLE</span></td></tr>
                <tr><td className="px-3 py-2.5">SAVE</td><td className="px-3 py-2.5 font-normal">Auto 800ms + ⌘S. Writes PlaygroundFile (Mongo). Timestamp.</td><td className="px-3 py-2.5 text-right"><span className="bg-[#D6FF00] text-black border-2 border-black px-1.5 py-0.5">LIVE</span></td></tr>
                <tr className="bg-[#F4F4F0]"><td className="px-3 py-2.5">PREVIEW</td><td className="px-3 py-2.5 font-normal">React CDN+Babel, strip imports, inject CSS, mock logs.</td><td className="px-3 py-2.5 text-right"><span className="bg-black text-white px-1.5 py-0.5">STABLE</span></td></tr>
                <tr><td className="px-3 py-2.5">TEMPLATES</td><td className="px-3 py-2.5 font-normal">React, Next, Vue, Angular, Express, Hono. Seeded if empty.</td><td className="px-3 py-2.5 text-right"><span className="bg-black text-white px-1.5 py-0.5">6 STARTERS</span></td></tr>
                <tr className="bg-[#F4F4F0]"><td className="px-3 py-2.5">PRIVACY</td><td className="px-3 py-2.5 font-normal">Scoped to user. No telemetry in editor. Share explicit.</td><td className="px-3 py-2.5 text-right"><span className="bg-[#00E5FF] text-black border-2 border-black px-1.5 py-0.5">POLICY</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TEMPLATES as trading cards */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 pb-6">
        <div className="flex items-baseline justify-between">
          <h3 className="display text-[20px] text-white">TEMPLATES ✦ COLLECT ’EM</h3><span className="mono text-[11px] font-black text-white/60">CHOOSE — PASTE CONFIG AND IT RUNS</span>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            ["REACT", "App.tsx", "lime", "#D6FF00", "black"],
            ["NEXT.JS", "app/page.tsx", "white", "#FFFFFF", "black"],
            ["VUE", "App.vue", "cyan", "#00E5FF", "black"],
            ["ANGULAR", "app.ts", "pink", "#FF2B6E", "white"],
            ["EXPRESS", "server.js", "violet", "#7B61FF", "white"],
            ["HONO", "index.ts", "amber", "#FFB800", "black"],
          ].map(([name, file, _a, bg, fg]) => (
            <div key={name} style={{ background: bg, color: fg }} className="border-[3px] border-black shadow-[4px_4px_0_#F4F4F0] p-3 rotate-[-0.6deg] hover:rotate-[0.6deg] transition-transform">
              <div className="mono text-[11px] font-black">{name}</div><div className="mono text-[10px] font-bold opacity-70">{file}</div><div className="mt-2 mono text-[9px] font-black border-t-2 border-black/20 pt-1">READY 2 SHIP ✦</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA brutal */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 pb-8">
        <div className="bg-[#D6FF00] text-black border-[3px] border-black shadow-[8px_8px_0_#F4F4F0] px-6 py-6 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="display text-[28px] leading-none">OPEN A WORKSPACE<br/>AND SEE 4 URSELF ✦</div>
            <div className="mono text-[11px] font-bold mt-2">Free. No CC. First playground seeds so u can type instantly. Fr.</div>
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-wrap items-center justify-end gap-3">
            <Link href="/dashboard" className="inline-flex h-[40px] items-center bg-black text-white px-5 mono text-[12px] font-black border-2 border-black shadow-[3px_3px_0_white] hover:shadow-[2px_2px_0_white]">OPEN WORKSPACE →</Link>
            <span className="mono text-[10px] font-black bg-white border-2 border-black px-2 py-1 rotate-[1deg]">PRESS ⌘K ANYWHERE</span>
          </div>
        </div>
      </section>

      <style>{`.stroke-text{ -webkit-text-stroke: 2px #F4F4F0; color: transparent; }`}</style>
    </div>
  );
}
