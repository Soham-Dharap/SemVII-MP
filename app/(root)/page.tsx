"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const STARTER_FILES: Record<string, string> = {
  "App.tsx": `export default function App() {
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
}`,
};

function buildMiniPreview(code: string) {
  const cleaned = code.replace(/^import.*?;?$/gm, "").replace(/export\s+default\s+function/g, "function App").replace(/export\s+/g, "");
  const render = `try{${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));}catch(e){document.body.innerHTML='<pre style="padding:16px;color:#EF4444">'+e.message+'</pre>'}`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{margin:0;font-family:system-ui;background:white;color:#0F1115}</style></head><body><div id="root"></div><script type="text/babel" data-presets="react">${render}<\/script></body></html>`;
}

function MinimalEditor() {
  const [code, setCode] = useState(STARTER_FILES["App.tsx"]);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildMiniPreview(code)), 200); return () => clearTimeout(t); }, [code]);
  return (
    <div className="bg-card border border-border rounded-[20px] overflow-hidden">
      <div className="flex items-center justify-between px-4 h-9 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-3 mono text-[11px] text-muted-foreground">App.tsx • Live</span>
        </div>
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="bg-[#0B0B0D] p-4 border-b md:border-b-0 md:border-r border-border">
          <textarea value={code} onChange={e=>setCode(e.target.value)} className="w-full h-[220px] bg-transparent text-[#E2E8F0] mono text-[11px] leading-5 resize-none focus:outline-none" spellCheck={false} />
        </div>
        <div className="bg-white min-h-[220px]"><iframe title="preview" srcDoc={srcDoc} className="w-full h-full min-h-[220px] border-0" sandbox="allow-scripts allow-same-origin" /></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO — most minimalistic: logo + name centre, full viewport */}
      <section className="min-h-[88vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center">
          <div className="h-[72px] w-[72px] rounded-[20px] bg-foreground flex items-center justify-center shadow-sm">
            <Image src="/logo.svg" alt="CodePilot" width={40} height={40} className="h-10 w-10 invert dark:invert-0" />
          </div>
          <h1 className="display text-[32px] sm:text-[36px] mt-5 tracking-tight">CodePilot</h1>
          <p className="mono text-[11px] tracking-widest text-muted-foreground mt-1">CODE • PREVIEW • SHIP</p>
          <p className="mt-5 text-[15px] leading-6 text-muted-foreground max-w-[520px]">
            A minimal playground that feels local. Monaco, instant preview, real files.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <Link href="/dashboard" className="h-10 px-6 rounded-full bg-primary text-primary-foreground mono text-[13px] font-medium inline-flex items-center hover:opacity-90">Open workspace</Link>
            <span className="mono text-[11px] text-muted-foreground">Free • No card</span>
          </div>
          <div className="mt-10 mono text-[10px] tracking-widest text-muted-foreground/60 flex flex-col items-center gap-2">
            <span>SCROLL</span>
            <span className="h-6 w-px bg-border" />
          </div>
        </div>
      </section>

      {/* Scrolled info */}
      <section className="mx-auto max-w-[1160px] px-6 pb-6">
        <div className="rounded-[20px] border border-border bg-card p-6 sm:p-8">
          <div className="max-w-[560px]">
            <h2 className="display text-[22px]">How it works</h2>
            <p className="mono text-[12px] leading-5 text-muted-foreground mt-2">Three steps, no clutter. Everything you need, nothing you don’t.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="mono text-[11px] font-semibold tracking-widest text-muted-foreground">01</div>
              <h3 className="font-semibold mt-2">Write</h3>
              <p className="mono text-[12px] leading-5 text-muted-foreground mt-1">Monaco with autocomplete, go-to definition, and file tree.</p>
            </div>
            <div>
              <div className="mono text-[11px] font-semibold tracking-widest text-muted-foreground">02</div>
              <h3 className="font-semibold mt-2">Preview</h3>
              <p className="mono text-[12px] leading-5 text-muted-foreground mt-1">Live 350ms update. CSS injection handled automatically.</p>
            </div>
            <div>
              <div className="mono text-[11px] font-semibold tracking-widest text-muted-foreground">03</div>
              <h3 className="font-semibold mt-2">Ship</h3>
              <p className="mono text-[12px] leading-5 text-muted-foreground mt-1">Duplicate, export, or share. No lock-in.</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2 mono text-[11px]">
            <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">React</span>
            <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Next.js</span>
            <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Vue</span>
            <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Express</span>
            <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Hono</span>
            <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Angular</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-6 pb-6">
        <MinimalEditor />
        <p className="mono text-[11px] text-muted-foreground mt-3 text-center">Try editing — preview updates live. This is the actual playground.</p>
      </section>

      <section className="mx-auto max-w-[1160px] px-6 pb-10">
        <div className="rounded-[20px] bg-primary text-primary-foreground p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="display text-[20px] leading-none">Start in seconds</div>
            <div className="mono text-[11px] opacity-80 mt-1">Free playgrounds • Private by default</div>
          </div>
          <Link href="/dashboard" className="h-10 px-6 rounded-full bg-background text-foreground mono text-[13px] font-medium inline-flex items-center hover:opacity-90">Open workspace →</Link>
        </div>
      </section>
    </div>
  );
}
