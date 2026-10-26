"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STARTER_FILES: Record<string, string> = {
  "App.tsx": `export default function App() {
  const [n, setN] = useState(0)
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>Hello CodePilot</h1>
      <p style={{ color: '#64748B', fontSize: 13 }}>Edit code — preview updates live.</p>
      <button onClick={() => setN(n+1)}
        style={{ marginTop: 16, background: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: 999, padding: '8px 14px', fontWeight: 600, border: 'none' }}>
        Count: {n}
      </button>
    </div>
  )
}`,
  "styles.css": `body { background: white; color: #0A0E1A; }`,
};

function buildMiniPreview(code: string, css: string) {
  const cleaned = code.replace(/^import.*?;?$/gm, "").replace(/export\s+default\s+function/g, "function App").replace(/export\s+/g, "");
  const hasApp = /function\s+App/.test(cleaned);
  const render = hasApp ? `${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));` : `function App(){ return React.createElement('pre', null, 'No App'); } const root=ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{margin:0;font-family:system-ui}*{box-sizing:border-box} ${css}</style></head><body><div id="root"></div><script type="text/babel" data-presets="react">try{${render}}catch(e){document.body.innerHTML='<pre style="padding:16px;color:#EF4444">'+e.message+'</pre>'}</script></body></html>`;
}

function HeroEditor() {
  const [active, setActive] = useState("App.tsx");
  const [code, setCode] = useState(STARTER_FILES["App.tsx"]);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => { setCode(STARTER_FILES[active] || ""); }, [active]);
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildMiniPreview(code, `body{margin:0;font-family:system-ui}`)), 220); return () => clearTimeout(t); }, [code]);
  return (
    <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
      <div className="flex items-center h-[36px] px-4 border-b border-border bg-muted/30">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-border" />
          <span className="h-3 w-3 rounded-full bg-border" />
          <span className="h-3 w-3 rounded-full bg-border" />
        </div>
        <div className="ml-3 hidden sm:flex items-center gap-1">
          <span className={`px-2.5 py-1 rounded-full mono text-[11px] font-medium ${active==="App.tsx" ? "bg-foreground text-background" : "text-muted-foreground"}`}>App.tsx</span>
          <span className="mono text-[10px] text-muted-foreground">• Live preview</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 mono text-[10px] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Live</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
        <div className="bg-[#0A0A0B] p-3 flex flex-col border-b lg:border-b-0 lg:border-r border-border">
          <div className="mono text-[10px] text-white/50 mb-2">App.tsx</div>
          <textarea value={code} onChange={e=>setCode(e.target.value)} className="flex-1 w-full bg-transparent text-[#E2E8F0] mono text-[11px] leading-5 resize-none focus:outline-none min-h-[180px]" spellCheck={false} />
        </div>
        <div className="bg-white flex flex-col min-h-[220px]"><iframe title="preview" srcDoc={srcDoc} className="w-full h-full min-h-[260px] border-0" sandbox="allow-scripts allow-same-origin" /></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero — clean, airy */}
      <section className="mx-auto max-w-[1100px] px-6 pt-14 pb-10">
        <div className="max-w-[640px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mono text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" /> New — Monaco + live preview
          </div>
          <h1 className="display text-[40px] sm:text-[48px] mt-4 leading-[0.95] tracking-[-0.03em]">
            A browser editor<br />
            <span className="text-primary">that feels local.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-6 text-muted-foreground max-w-[520px]">
            Monaco with file system, instant preview, and git-backed saves. Paste your Vite config and it just runs.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="inline-flex h-[40px] items-center bg-primary text-primary-foreground px-5 rounded-full mono text-[13px] font-semibold hover:opacity-90">Open workspace →</Link>
            <span className="mono text-[11px] text-muted-foreground">Free • No credit card</span>
          </div>
        </div>

        <div className="mt-10">
          <HeroEditor />
        </div>
      </section>

      {/* Single feature row — 3 clean cards */}
      <section className="mx-auto max-w-[1100px] px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-[16px] p-6">
            <div className="h-8 w-8 rounded-[10px] bg-primary text-primary-foreground flex items-center justify-center mono text-[12px] font-bold">01</div>
            <h3 className="font-semibold mt-3 text-[15px]">Monaco, not a textarea</h3>
            <p className="mono text-[12px] leading-5 text-muted-foreground mt-1.5">Autocomplete, go-to definition, and multi-cursor. Familiar on day one.</p>
          </div>
          <div className="bg-card border border-border rounded-[16px] p-6">
            <div className="h-8 w-8 rounded-[10px] bg-secondary border border-border flex items-center justify-center mono text-[12px] font-bold">02</div>
            <h3 className="font-semibold mt-3 text-[15px]">Preview as you type</h3>
            <p className="mono text-[12px] leading-5 text-muted-foreground mt-1.5">350ms live update with CSS injection and error overlay.</p>
          </div>
          <div className="bg-card border border-border rounded-[16px] p-6">
            <div className="h-8 w-8 rounded-[10px] bg-secondary border border-border flex items-center justify-center mono text-[12px] font-bold">03</div>
            <h3 className="font-semibold mt-3 text-[15px]">Ship without lock-in</h3>
            <p className="mono text-[12px] leading-5 text-muted-foreground mt-1.5">Export, duplicate, or push to git. Private by default.</p>
          </div>
        </div>
      </section>

      {/* Templates — minimal strip */}
      <section className="mx-auto max-w-[1100px] px-6 pb-8">
        <div className="flex items-center justify-between">
          <h3 className="mono text-[11px] font-semibold tracking-widest">TEMPLATES</h3>
          <Link href="/dashboard" className="mono text-[11px] text-muted-foreground hover:text-foreground">Create →</Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["React","Next.js","Vue","Angular","Express","Hono"].map(n=> (
            <span key={n} className="px-3 py-1.5 rounded-full bg-card border border-border mono text-[11px]">{n}</span>
          ))}
        </div>
      </section>

      {/* Final CTA — single */}
      <section className="mx-auto max-w-[1100px] px-6 pb-10">
        <div className="rounded-[16px] border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Open a workspace and start.</div>
            <div className="mono text-[11px] text-muted-foreground mt-1">Free playgrounds • Live in seconds</div>
          </div>
          <Link href="/dashboard" className="inline-flex h-[36px] items-center bg-primary text-primary-foreground px-5 rounded-full mono text-[12px] font-semibold">Open workspace →</Link>
        </div>
      </section>
    </div>
  );
}
