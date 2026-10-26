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
  "Button.tsx": `export function Button({ children, onClick }: any) {
  return <button onClick={onClick} style={{ background: '#0A0A0B', color: 'white', padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{children}</button>
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
  const [css] = useState(STARTER_FILES["styles.css"]);
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => { setCode(STARTER_FILES[active] || ""); }, [active]);
  useEffect(() => { const t = setTimeout(() => setSrcDoc(buildMiniPreview(code, css)), 220); return () => clearTimeout(t); }, [code, css]);
  return (
    <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 h-[38px] border-b border-border bg-muted/50">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-border" />
          <span className="h-3 w-3 rounded-full bg-border" />
          <span className="h-3 w-3 rounded-full bg-border" />
        </div>
        <div className="flex items-center gap-1 ml-3">
          {Object.keys(STARTER_FILES).map(name => (
            <button key={name} onClick={() => setActive(name)} className={`px-2.5 py-1 rounded-full mono text-[11px] font-medium transition-colors ${active===name ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{name}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 mono text-[10px] font-medium text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />Live</div>
      </div>
      <div className="grid grid-cols-12 min-h-[380px]">
        <div className="hidden sm:flex col-span-3 flex-col bg-muted/30 border-r border-border p-3">
          <div className="mono text-[10px] font-semibold tracking-widest text-muted-foreground mb-2">EXPLORER</div>
          <div className="space-y-1 mono text-[11px]">
            <div className="text-foreground font-medium">src /</div>
            <div className="pl-3 space-y-1">
              {Object.keys(STARTER_FILES).map(n => (
                <div key={n} onClick={() => setActive(n)} className={`cursor-pointer px-2 py-1 rounded-[8px] transition-colors ${active===n ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{n}</div>
              ))}
            </div>
          </div>
          <div className="mt-auto mono text-[10px] text-muted-foreground pt-3 border-t border-border">3 files • ⌘S to save</div>
        </div>
        <div className="col-span-12 sm:col-span-5 bg-[#0A0A0B] dark:bg-[#09090B] flex flex-col border-r border-border">
          <div className="px-3 h-[30px] flex items-center justify-between border-b border-border bg-[#0A0A0B]">
            <span className="mono text-[11px] font-medium text-white">{active}</span>
            <span className="mono text-[10px] text-white/60">TSX • UTF-8</span>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} className="flex-1 w-full bg-[#0A0A0B] text-[#E2E8F0] p-3 mono text-[11px] leading-5 resize-none focus:outline-none" />
        </div>
        <div className="col-span-12 sm:col-span-4 bg-white flex flex-col">
          <div className="px-3 h-[30px] flex items-center justify-between bg-secondary border-b border-border">
            <span className="mono text-[11px] font-semibold text-foreground">Preview</span>
            <span className="mono text-[10px] text-muted-foreground">100%</span>
          </div>
          <div className="flex-1 bg-white"><iframe title="preview" srcDoc={srcDoc} className="w-full h-full min-h-[310px] border-0" sandbox="allow-scripts allow-same-origin" /></div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-[1240px] px-6 pt-10 pb-10">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mono text-[11px] font-medium text-muted-foreground">Monaco • Real file system • Live preview</div>
            <h1 className="display text-[42px] sm:text-[50px] mt-4 leading-[0.95]">
              <span className="text-foreground">A browser editor</span><br />
              <span className="text-primary">that feels local.</span>
            </h1>
            <p className="mt-4 text-[14px] leading-6 text-muted-foreground max-w-[460px]">
              Monaco, live preview, nested file system. Writes to git, no synthetic cloud FS. Paste your Vite config — it just runs. Professional, private, keyboard-first.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-secondary border border-border mono text-[10px] font-medium text-muted-foreground">React</span>
              <span className="px-2.5 py-1 rounded-full bg-secondary border border-border mono text-[10px] font-medium text-muted-foreground">Next.js</span>
              <span className="px-2.5 py-1 rounded-full bg-secondary border border-border mono text-[10px] font-medium text-muted-foreground">Vue</span>
              <span className="px-2.5 py-1 rounded-full bg-secondary border border-border mono text-[10px] font-medium text-muted-foreground">Hono</span>
              <span className="px-2.5 py-1 rounded-full bg-secondary border border-border mono text-[10px] font-medium text-muted-foreground">Express</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/dashboard" className="inline-flex h-[40px] items-center bg-primary text-primary-foreground px-5 rounded-full mono text-[12px] font-semibold hover:opacity-90 transition-opacity">Open workspace →</Link>
              <Link href="#" className="inline-flex h-[40px] items-center bg-secondary text-secondary-foreground px-5 rounded-full mono text-[12px] font-medium border border-border hover:bg-accent transition-colors">Read docs</Link>
            </div>
            <div className="mt-4 mono text-[11px] text-muted-foreground flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground">⌘K</span> to jump • <span className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground">⌘S</span> to save • Private by default
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <HeroEditor />
            <div className="mt-3 flex flex-wrap gap-2 mono text-[10px] text-muted-foreground">
              <span className="px-2 py-1 rounded-full bg-secondary border border-border">Monaco 0.52</span>
              <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground font-semibold">Live • 350ms</span>
              <span className="px-2 py-1 rounded-full bg-secondary border border-border">Edit and see instantly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-[1240px] px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="py-5 flex items-center justify-between sm:px-6 first:pl-0">
            <div><div className="display text-[28px]">Zero</div><div className="mono text-[11px] text-muted-foreground tracking-widest">TELEMETRY</div></div>
            <div className="mono text-[11px] text-muted-foreground max-w-[140px] text-right">No trackers. Your code stays yours.</div>
          </div>
          <div className="py-5 flex items-center justify-between sm:px-6">
            <div><div className="display text-[28px] text-primary">350ms</div><div className="mono text-[11px] text-muted-foreground tracking-widest">PREVIEW</div></div>
            <div className="mono text-[11px] text-muted-foreground max-w-[140px] text-right">Type → preview. No loading spin.</div>
          </div>
          <div className="py-5 flex items-center justify-between sm:px-6 last:pr-0">
            <div><div className="display text-[28px]">6</div><div className="mono text-[11px] text-muted-foreground tracking-widest">TEMPLATES</div></div>
            <div className="mono text-[11px] text-muted-foreground max-w-[140px] text-right">From React to Hono. All ready.</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1240px] px-6 py-8">
        <div className="grid grid-cols-12 gap-4">
          <div id="write" className="col-span-12 lg:col-span-4 bg-card border border-border rounded-[16px] p-6">
            <div className="mono text-[11px] font-semibold tracking-widest text-muted-foreground">01 — WRITE</div>
            <h3 className="display text-[20px] mt-2">Monaco, not a textarea</h3>
            <p className="mono text-[11px] leading-5 text-muted-foreground mt-2">Completion, multi-cursor, command palette, Vim. Familiar on day one.</p>
            <div className="mt-4 space-y-2 mono text-[11px]">
              <div className="flex justify-between p-2.5 rounded-[10px] bg-secondary border border-border"><span className="text-muted-foreground">Completion</span><span className="font-medium">Type-aware</span></div>
              <div className="flex justify-between p-2.5 rounded-[10px] bg-secondary border border-border"><span className="text-muted-foreground">Go to def</span><span className="font-medium">⌘ Click</span></div>
              <div className="flex justify-between p-2.5 rounded-[10px] bg-primary text-primary-foreground font-semibold"><span>Save</span><span>⌘S • Auto 800ms</span></div>
            </div>
          </div>

          <div id="preview" className="col-span-12 lg:col-span-4 bg-card border border-border rounded-[16px] p-6">
            <div className="mono text-[11px] font-semibold tracking-widest text-muted-foreground">02 — PREVIEW</div>
            <h3 className="display text-[20px] mt-2">Updates as you type</h3>
            <p className="mono text-[11px] leading-5 text-muted-foreground mt-2">Split view, responsive, console. CSS injected. Works for all templates.</p>
            <div className="mt-4 grid grid-cols-3 gap-2 mono text-[10px] text-center">
              <div className="bg-secondary border border-border rounded-[12px] p-3"><div className="display text-[16px]">350ms</div><div className="text-muted-foreground">Debounce</div></div>
              <div className="bg-primary rounded-[12px] p-3"><div className="display text-[16px] text-primary-foreground">Live</div><div className="text-primary-foreground/70">Realtime</div></div>
              <div className="bg-secondary border border-border rounded-[12px] p-3"><div className="display text-[16px]">100%</div><div className="text-muted-foreground">Accurate</div></div>
            </div>
          </div>

          <div id="ship" className="col-span-12 lg:col-span-4 bg-card border border-border rounded-[16px] p-6">
            <div className="mono text-[11px] font-semibold tracking-widest text-muted-foreground">03 — SHIP</div>
            <h3 className="display text-[20px] mt-2">Export. No lock-in.</h3>
            <p className="mono text-[11px] leading-5 text-muted-foreground mt-2">Private until you share. Git push, zip export. Your code, your rules.</p>
            <div className="mt-4 bg-secondary border border-border rounded-[12px] p-3 flex items-center justify-between">
              <span className="mono text-[11px]">$ npx codepilot create</span>
              <button onClick={async()=>{await navigator.clipboard.writeText("npx codepilot create"); setCopied(true); setTimeout(()=>setCopied(false),1200)}} className="mono text-[11px] font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full hover:opacity-90 transition-opacity">{copied ? "Copied" : "Copy"}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Spec */}
      <section className="mx-auto max-w-[1240px] px-6 pb-6">
        <div className="bg-card text-card-foreground rounded-[16px] overflow-hidden border border-border">
          <div className="flex items-center justify-between px-5 h-[44px] bg-muted border-b border-border">
            <div className="mono text-[11px] font-semibold tracking-widest">SPECIFICATION</div>
            <span className="mono text-[10px] font-semibold bg-foreground text-background px-2 py-1 rounded-full">REV 2026.01</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mono text-[11px]">
              <thead><tr className="bg-muted text-muted-foreground border-b border-border"><th className="px-4 py-2.5 text-left font-semibold">CAPABILITY</th><th className="px-4 py-2.5 text-left font-semibold">DETAIL</th><th className="px-4 py-2.5 text-right font-semibold">STATUS</th></tr></thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-4 py-3 font-semibold">Editor</td><td className="px-4 py-3 text-muted-foreground">Monaco 0.52 • TypeScript • JS/TSX/JSON/CSS/HTML/Vue</td><td className="px-4 py-3 text-right"><span className="bg-foreground text-background px-2 py-1 rounded-full mono text-[10px] font-semibold">Stable</span></td></tr>
                <tr><td className="px-4 py-3 font-semibold">File system</td><td className="px-4 py-3 text-muted-foreground">Nested folders via / • Rename preserves path • Local fallback</td><td className="px-4 py-3 text-right"><span className="bg-foreground text-background px-2 py-1 rounded-full mono text-[10px] font-semibold">Stable</span></td></tr>
                <tr><td className="px-4 py-3 font-semibold">Preview</td><td className="px-4 py-3 text-muted-foreground">React CDN + Babel • CSS injection • Backend logs mocked</td><td className="px-4 py-3 text-right"><span className="bg-primary text-primary-foreground px-2 py-1 rounded-full mono text-[10px] font-semibold">Live</span></td></tr>
                <tr><td className="px-4 py-3 font-semibold">Templates</td><td className="px-4 py-3 text-muted-foreground">React • Next.js • Vue • Angular • Express • Hono</td><td className="px-4 py-3 text-right"><span className="bg-foreground text-background px-2 py-1 rounded-full mono text-[10px] font-semibold">6 available</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="mono text-[11px] font-semibold tracking-widest">TEMPLATES</h3>
          <span className="mono text-[11px] text-muted-foreground">Pick one and start — no setup</span>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            ["React", "App.tsx"],
            ["Next.js", "app/page.tsx"],
            ["Vue", "App.vue"],
            ["Angular", "app.component.ts"],
            ["Express", "server.js"],
            ["Hono", "src/index.ts"],
          ].map(([name, file]) => (
            <div key={name} className="bg-card border border-border rounded-[14px] p-4 hover:bg-accent transition-colors">
              <div className="mono text-[11px] font-semibold">{name}</div>
              <div className="mono text-[10px] text-muted-foreground mt-1">{file}</div>
              <div className="mt-3 mono text-[10px] font-medium text-primary">Ready →</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-8">
        <div className="bg-primary rounded-[16px] px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="display text-[22px] text-primary-foreground leading-none">Open a workspace and start.</div>
            <div className="mono text-[11px] text-primary-foreground/70 mt-1">Free. No credit card. Playground seeds instantly.</div>
          </div>
          <Link href="/dashboard" className="inline-flex h-[40px] items-center bg-background text-foreground px-5 rounded-full mono text-[12px] font-semibold hover:opacity-90 transition-opacity">Open workspace →</Link>
        </div>
      </section>
    </div>
  );
}
