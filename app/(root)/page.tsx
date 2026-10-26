"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// --- Hero interactive: minimal real editor ---
const STARTER_FILES: Record<string, string> = {
  "App.tsx": `export default function App() {
  const [n, setN] = useState(0);
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>Hello, CodePilot</h1>
      <p style={{ color: '#666', fontSize: 13 }}>Edit the code — preview updates live.</p>
      <button onClick={() => setN(n+1)}
        style={{ marginTop: 16, background: '#0F0E0C', color: 'white', border: 'none', padding: '8px 12px', fontSize: 12 }}>
        Count: {n}
      </button>
    </div>
  )
}`,
  "Button.tsx": `export function Button({ children, onClick }: any) {
  return <button onClick={onClick}
    style={{ background: '#0F0E0C', color: '#FFFEFB', padding: '8px 14px', fontSize: 12, border: '1px solid #0F0E0C' }}>
    {children}
  </button>
}`,
  "styles.css": `body { background: #FFFEFB; color: #0F0E0C; }
button:active { transform: scale(0.98); }`,
};

function buildMiniPreview(code: string, css: string) {
  const cleaned = code
    .replace(/^import.*?;?$/gm, "")
    .replace(/export\s+default\s+function/g, "function App")
    .replace(/export\s+/g, "");
  const hasApp = /function\s+App/.test(cleaned);
  const render = hasApp
    ? `${cleaned}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));`
    : `function App(){ return React.createElement('pre', null, 'No App component'); } const root=ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>body{margin:0;font-family:system-ui}*{box-sizing:border-box} ${css}</style>
</head><body><div id="root"></div><script type="text/babel" data-presets="react">try{${render}}catch(e){document.body.innerHTML='<pre style=\"padding:16px;color:#B42318\">'+e.message+'</pre>'}</script></body></html>`;
}

function HeroEditor() {
  const [active, setActive] = useState("App.tsx");
  const [code, setCode] = useState(STARTER_FILES["App.tsx"]);
  const [css] = useState(STARTER_FILES["styles.css"]);
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => { setCode(STARTER_FILES[active] || ""); }, [active]);

  useEffect(() => {
    const t = setTimeout(() => setSrcDoc(buildMiniPreview(code, css)), 200);
    return () => clearTimeout(t);
  }, [code, css]);

  return (
    <div className="border border-[#0F0E0C] bg-white overflow-hidden">
      {/* Top bar: file tabs + window controls — thin, editorial */}
      <div className="flex items-stretch border-b border-[#E8E0CC] bg-[#F6F2E6] h-[30px]">
        <div className="flex items-center gap-1.5 px-3 border-r border-[#E8E0CC]">
          <span className="h-2 w-2 rounded-full bg-[#0F0E0C]" />
          <span className="h-2 w-2 rounded-full border border-[#0F0E0C]" />
          <span className="h-2 w-2 rounded-full border border-[#0F0E0C]" />
        </div>
        <div className="flex items-stretch">
          {Object.keys(STARTER_FILES).map(name => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`px-3 mono text-[11px] border-r border-[#E8E0CC] ${active === name ? "bg-white text-[#0F0E0C]" : "text-[#6B6560] hover:text-[#0F0E0C]"}`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 mono text-[10px] text-[#6B6560]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B4A] animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-12 min-h-[360px]">
        {/* File tree — dense, left-aligned, mono */}
        <div className="hidden sm:block col-span-3 border-r border-[#E8E0CC] bg-[#FFFEFB] p-3">
          <div className="mono text-[10px] tracking-[0.08em] uppercase text-[#6B6560] mb-2">Explorer</div>
          <div className="space-y-1 mono text-[11px] leading-4">
            <div className="text-[#0F0E0C]">› src</div>
            <div className="pl-3 space-y-1 text-[#6B6560]">
              {Object.keys(STARTER_FILES).map(n => (
                <div key={n} onClick={() => setActive(n)} className={`cursor-pointer px-1 py-0.5 ${active === n ? "bg-[#0F0E0C] text-[#FFFEFB]" : "hover:bg-[#F6F2E6] text-[#0F0E0C]"}`}>{n}</div>
              ))}
              <div className="text-[#9A9590]">› components</div>
            </div>
            <div className="pt-2 mono text-[10px] text-[#6B6560] border-t border-[#E8E0CC] mt-3">3 files · UTF-8 · LF</div>
          </div>
        </div>

        {/* Code — editable textarea (mono) */}
        <div className="col-span-12 sm:col-span-5 border-r border-[#E8E0CC] bg-[#0F0E0C] flex flex-col">
          <div className="px-3 h-[24px] flex items-center justify-between bg-[#141413] border-b border-[#2A2A28]">
            <span className="mono text-[10px] tracking-[0.06em] uppercase text-[#9A9590]">{active} — TSX</span>
            <span className="mono text-[10px] text-[#6B6560]">Ln 1, Col 1</span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-[#0F0E0C] text-[#E8E0CC] p-3 mono text-[11px] leading-5 resize-none focus:outline-none"
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </div>

        {/* Preview — live iframe */}
        <div className="col-span-12 sm:col-span-4 bg-white flex flex-col">
          <div className="px-3 h-[24px] flex items-center justify-between border-b border-[#E8E0CC] bg-[#F6F2E6]">
            <span className="mono text-[10px] tracking-[0.08em] uppercase text-[#0F0E0C]">Preview</span>
            <span className="mono text-[10px] text-[#6B6560]">100% · 60fps</span>
          </div>
          <div className="flex-1 bg-white">
            <iframe title="preview" srcDoc={srcDoc} className="w-full h-full min-h-[280px] border-0" sandbox="allow-scripts allow-same-origin" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 h-[24px] border-t border-[#E8E0CC] bg-[#F6F2E6] mono text-[10px] text-[#6B6560]">
        <span>⌘S to save · ⌘P to open · ⌘B to preview</span>
        <span className="hidden sm:inline">Type in the editor — preview updates live</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="bg-[#FFFEFB] text-[#0F0E0C]">
      {/* 00 — Top index bar (like a journal's running head) */}
      <div className="border-b border-[#0F0E0C]">
        <div className="mx-auto max-w-[1280px] px-6 h-[28px] flex items-center justify-between mono text-[10px] tracking-[0.06em] uppercase">
          <div className="flex items-center gap-3 text-[#6B6560]">
            <span>Vol. 01 — Editor</span>
            <span className="hidden sm:inline text-[#E8E0CC]">|</span>
            <span className="hidden sm:inline">Six templates · Zero lock-in</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[#6B6560]">Jan 2026 · Typeset in Instrument Serif & JetBrains Mono</span>
            <span className="text-[#0F0E0C]">No. 001</span>
          </div>
        </div>
      </div>

      {/* HERO — asymmetric editorial, left-aligned, dense */}
      <section className="mx-auto max-w-[1280px] px-6 pt-8 pb-10">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left: manifesto — 5 cols */}
          <div className="col-span-12 lg:col-span-5">
            <div className="mono text-[11px] tracking-[0.12em] uppercase text-[#6B6560]">00 — The promise</div>
            <h1 className="display text-[42px] sm:text-[52px] text-[#0F0E0C] mt-3 max-w-[520px]">
              A browser editor that behaves like your local&nbsp;one.
            </h1>
            <p className="mt-4 text-[14px] leading-6 text-[#1A1917] max-w-[480px]" style={{ fontFamily: "var(--font-serif-body)" }}>
              Monaco, live preview, nested file system. Writes to disk via git, no synthetic cloud FS. Paste your Vite config — it runs. Keyboard-first by default.
            </p>

            {/* Dense spec line — not pills */}
            <div className="mt-5 mono text-[11px] leading-4 text-[#6B6560] border-y border-[#E8E0CC] py-3">
              React · Next.js · Vue · Angular · Express · Hono <span className="text-[#0F0E0C]">— six templates, zero vendor API.</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="inline-flex h-[36px] items-center bg-[#0F0E0C] text-[#FFFEFB] px-4 mono text-[12px] tracking-[0.02em] hover:bg-[#1A1917] transition-colors">
                Open workspace →
              </Link>
              <Link href="#" className="mono text-[12px] underline decoration-[#E8E0CC] underline-offset-4 decoration-1 hover:decoration-[#0F0E0C]">Read the manual ↗</Link>
            </div>

            <div className="mt-4 flex items-center gap-2 mono text-[11px] text-[#6B6560]">
              <span className="border border-[#E8E0CC] bg-white px-1.5 py-0.5">⌘K</span>
              <span>to jump ·</span>
              <span className="border border-[#E8E0CC] bg-white px-1.5 py-0.5">⌘S</span>
              <span>to save</span>
              <span className="hidden sm:inline text-[#E8E0CC]">·</span>
              <span className="hidden sm:inline">Private until you share.</span>
            </div>

            {/* Quote — editorial detail, not testimonial carousel */}
            <figure className="mt-8 border-l border-[#0F0E0C] pl-4">
              <blockquote className="prose-serif text-[13px] leading-5 text-[#0F0E0C] italic">
                “We missed ⌘P. So we rebuilt it.”
              </blockquote>
              <figcaption className="mono text-[10px] tracking-[0.06em] uppercase text-[#6B6560] mt-1">— Founding note, 2025</figcaption>
            </figure>
          </div>

          {/* Right: product UI as hero — 7 cols */}
          <div className="col-span-12 lg:col-span-7">
            <HeroEditor />
            <div className="mt-3 mono text-[10px] leading-4 text-[#6B6560] flex flex-wrap gap-x-4 gap-y-1">
              <span>Fig. 01 — File tree, editor, and live preview. Try typing.</span>
              <span className="text-[#E8E0CC]">|</span>
              <span>Monaco 0.52 · React 19 · Next 16</span>
            </div>
          </div>
        </div>
      </section>

      {/* In this issue — thin publication TOC like Linear */}
      <div className="border-y border-[#0F0E0C] bg-[#F6F2E6]">
        <div className="mx-auto max-w-[1280px] px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 mono text-[11px]">
          <span className="tracking-[0.12em] uppercase text-[#0F0E0C]">In this issue</span>
          <a href="#write" className="text-[#6B6560] hover:text-[#0F0E0C]">01 Write — Monaco, not a textarea <span className="text-[#9A9590]">p. 02</span></a>
          <span className="text-[#E8E0CC]">—</span>
          <a href="#preview" className="text-[#6B6560] hover:text-[#0F0E0C]">02 Preview — updates as you type <span className="text-[#9A9590]">p. 03</span></a>
          <span className="text-[#E8E0CC]">—</span>
          <a href="#ship" className="text-[#6B6560] hover:text-[#0F0E0C]">03 Ship — git, export, no lock-in <span className="text-[#9A9590]">p. 04</span></a>
          <span className="ml-auto text-[#6B6560] hidden lg:inline">Printed on warm paper · Ink only</span>
        </div>
      </div>

      {/* Chapters — dense, numbered, left rail sticky */}
      <section className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Sticky index rail */}
          <div className="hidden lg:block col-span-3">
            <div className="sticky top-[52px] mono text-[11px] leading-5">
              <div className="tracking-[0.12em] uppercase text-[#0F0E0C] border-b border-[#0F0E0C] pb-2">Chapters</div>
              <div className="mt-3 space-y-3">
                <a href="#write" className="flex gap-3 text-[#0F0E0C]"><span className="text-[#6B6560]">01</span><span>Write</span></a>
                <a href="#preview" className="flex gap-3 text-[#6B6560] hover:text-[#0F0E0C]"><span>02</span><span>Preview</span></a>
                <a href="#ship" className="flex gap-3 text-[#6B6560] hover:text-[#0F0E0C]"><span>03</span><span>Ship</span></a>
              </div>
              <div className="mt-6 border border-[#E8E0CC] bg-white p-3">
                <div className="mono text-[10px] tracking-[0.08em] uppercase text-[#6B6560]">Specs at a glance</div>
                <div className="mt-2 mono text-[11px] leading-5 text-[#0F0E0C] space-y-1">
                  <div className="flex justify-between"><span className="text-[#6B6560]">Editor</span><span>Monaco 0.52</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6560]">Runtime</span><span>Browser (no server)</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6560]">Save</span><span>⌘S · 800ms auto-save</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6560]">Preview</span><span>350ms debounce</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6560]">Files</span><span>Nested, rename, drag</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-12">
            {/* 01 */}
            <div id="write" className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4">
                <div className="mono text-[11px] tracking-[0.12em] uppercase text-[#6B6560]">01 — Write</div>
                <h2 className="display text-[24px] mt-2">Monaco, not a textarea.</h2>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <p className="text-[13px] leading-6 text-[#1A1917]" style={{ fontFamily: "var(--font-serif-body)" }}>
                  The same engine as VS Code. Completion, multi-cursor, command palette <span className="mono text-[11px] bg-[#F6F2E6] border border-[#E8E0CC] px-1">⇧⌘P</span>, Vim bindings. Familiar on day one — no new syntax to learn.
                </p>
                <div className="mt-4 border border-[#E8E0CC] divide-y divide-[#E8E0CC] bg-white mono text-[11px]">
                  {[
                    ["Completion", "Type-aware, per file. No network round-trip."],
                    ["Multi-cursor", "⌥ Click to add cursors. Copy lines with ⇧⌘L."],
                    ["Palette", "⌘P quick open · ⇧⌘P commands · ⌘S save"],
                    ["Vim", "Optional. :w maps to save."],
                    ["Files", "Nested folders via / in name. Rename preserves path."],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-4 px-3 py-2">
                      <span className="w-[110px] shrink-0 tracking-[0.06em] uppercase text-[#6B6560]">{k}</span>
                      <span className="text-[#0F0E0C]">{v}</span>
                    </div>
                  ))}
                </div>
                {/* Figure — small code specimen with caption, not a card */}
                <figure className="mt-4 border border-[#0F0E0C]">
                  <div className="bg-[#F6F2E6] mono text-[10px] tracking-[0.08em] uppercase px-3 py-1.5 border-b border-[#0F0E0C]">Specimen — App.tsx</div>
                  <pre className="mono text-[11px] leading-5 p-3 bg-white overflow-x-auto">{`export default function App() {
  return <Button onClick={() => setN(n+1)}>Count: {n}</Button>
}`}</pre>
                  <figcaption className="mono text-[10px] text-[#6B6560] px-3 py-2 border-t border-[#E8E0CC] bg-[#FFFEFB]">Fig. 02 — Minimal React. No wrapper div required.</figcaption>
                </figure>
              </div>
            </div>

            {/* 02 */}
            <div id="preview" className="grid grid-cols-12 gap-6 border-t border-[#0F0E0C] pt-10">
              <div className="col-span-12 lg:col-span-4">
                <div className="mono text-[11px] tracking-[0.12em] uppercase text-[#6B6560]">02 — Preview</div>
                <h2 className="display text-[24px] mt-2">Updates as you type.</h2>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <p className="text-[13px] leading-6 text-[#1A1917]" style={{ fontFamily: "var(--font-serif-body)" }}>
                  Split view, responsive checks, console. Imports are stripped for preview; hooks work. CSS files are injected into the frame. Backend templates show logs, not a white screen.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 mono text-[11px]">
                  <div className="border border-[#E8E0CC] bg-white p-3">
                    <div className="tracking-[0.08em] uppercase text-[#6B6560]">Latency</div>
                    <div className="display text-[18px] mt-1">350ms</div>
                    <div className="text-[#6B6560]">debounce on type</div>
                  </div>
                  <div className="border border-[#E8E0CC] bg-white p-3">
                    <div className="tracking-[0.08em] uppercase text-[#6B6560]">Runtime</div>
                    <div className="display text-[18px] mt-1">Browser</div>
                    <div className="text-[#6B6560]">React 18 + Babel</div>
                  </div>
                  <div className="border border-[#E8E0CC] bg-white p-3">
                    <div className="tracking-[0.08em] uppercase text-[#6B6560]">Status</div>
                    <div className="flex items-center gap-1.5 mt-1"><span className="h-2 w-2 rounded-full bg-[#2E6B4A]" /><span className="display text-[18px]">Live</span></div>
                    <div className="text-[#6B6560]">error boundary on</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 03 */}
            <div id="ship" className="grid grid-cols-12 gap-6 border-t border-[#0F0E0C] pt-10">
              <div className="col-span-12 lg:col-span-4">
                <div className="mono text-[11px] tracking-[0.12em] uppercase text-[#6B6560]">03 — Ship</div>
                <h2 className="display text-[24px] mt-2">Git, export, no lock-in.</h2>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <p className="text-[13px] leading-6 text-[#1A1917]" style={{ fontFamily: "var(--font-serif-body)" }}>
                  Your code is private until you share. Export a zip, push to GitHub, or keep iterating here. No “workspace credits.”
                </p>
                <div className="mt-4 mono text-[11px] border border-[#E8E0CC] bg-white">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[#E8E0CC]">
                    <span className="tracking-[0.08em] uppercase text-[#6B6560]">Install</span>
                    <button
                      ref={copyRef}
                      onClick={async () => { await navigator.clipboard.writeText("npx codepilot create"); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
                      className="border border-[#0F0E0C] bg-[#0F0E0C] text-[#FFFEFB] px-2 py-1 hover:bg-[#1A1917]"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="px-3 py-2.5 flex items-center gap-3">
                    <span className="text-[#6B6560]">$</span>
                    <span className="text-[#0F0E0C]">npx codepilot create</span>
                    <span className="text-[#6B6560]">--template react</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dense spec table — high information density, not whispered */}
      <section className="border-y border-[#0F0E0C] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-[20px]">What’s inside</h3>
            <span className="mono text-[10px] tracking-[0.08em] uppercase text-[#6B6560]">Spec · rev. 2026-01</span>
          </div>
          <div className="mt-6 border border-[#0F0E0C] overflow-x-auto">
            <table className="w-full mono text-[11px] leading-4">
              <thead>
                <tr className="bg-[#0F0E0C] text-[#FFFEFB] text-left">
                  <th className="px-3 py-2 font-medium tracking-[0.08em] uppercase w-[160px]">Capability</th>
                  <th className="px-3 py-2 font-medium tracking-[0.08em] uppercase">Detail</th>
                  <th className="px-3 py-2 font-medium tracking-[0.08em] uppercase w-[120px] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0CC]">
                {[
                  ["Editor", "Monaco 0.52, TypeScript, JS/TS/JSX/TSX/JSON/CSS/HTML/Vue. Autocomplete, hover docs, go-to definition.", "Stable"],
                  ["File system", "Paths with /. Nested folders, rename preserves dir, delete confirms. Local fallback if DB offline.", "Stable"],
                  ["Save", "Update on change (800ms) + ⌘S. Writes via PlaygroundFile model (Mongo). Timestamp shown.", "Stable"],
                  ["Preview", "React CDN + Babel, import strip. CSS injection. Logs mock for Express/Hono. Error boundary.", "Stable"],
                  ["Templates", "6 starters: React, Next.js, Vue, Angular, Express, Hono. Seeded on first open if empty.", "Stable"],
                  ["Keyboard", "⌘S save · ⌘P open · ⇧⌘P palette · ⌘B preview. All buttons reachable.", "Stable"],
                  ["Privacy", "Playgrounds scoped to user. No telemetry in editor. Share via explicit action only.", "Policy"],
                  ["Export", "Download zip (planned) / copy code. Git push not yet.", "Roadmap"],
                ].map(([a, b, c]) => (
                  <tr key={a} className="hover:bg-[#F6F2E6]">
                    <td className="px-3 py-2.5 text-[#0F0E0C] font-medium whitespace-nowrap">{a}</td>
                    <td className="px-3 py-2.5 text-[#1A1917]">{b}</td>
                    <td className="px-3 py-2.5 text-[#6B6560] text-right">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 mono text-[10px] text-[#6B6560]">Table 01 — Full spec. No marketing adjectives were harmed.</div>
        </div>
      </section>

      {/* Templates — horizontal editorial list, not centered cloud */}
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex items-baseline justify-between">
          <h3 className="mono text-[11px] tracking-[0.12em] uppercase text-[#0F0E0C]">Templates</h3>
          <span className="mono text-[10px] text-[#6B6560]">Choose — copy your config and it runs</span>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mono text-[11px]">
          {[
            ["React", "App.tsx", "Client, hooks, CSS"],
            ["Next.js", "app/page.tsx", "App router, Server"],
            ["Vue", "App.vue", "SFC, setup()"],
            ["Angular", "app.component.ts", "Standalone"],
            ["Express", "server.js", "GET /, /api/health"],
            ["Hono", "src/index.ts", "fetch() handler"],
          ].map(([name, file, note]) => (
            <div key={name} className="border border-[#E8E0CC] bg-white p-3 hover:border-[#0F0E0C] transition-colors">
              <div className="text-[#0F0E0C] font-medium">{name}</div>
              <div className="text-[#6B6560] mt-1">{file}</div>
              <div className="text-[#9A9590] text-[10px] mt-1">{note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA — dense, ink block, not gradient spam */}
      <section className="mx-auto max-w-[1280px] px-6 pb-10">
        <div className="border border-[#0F0E0C] bg-[#0F0E0C] text-[#FFFEFB] px-6 py-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <h3 className="display text-[24px] leading-[0.95]">Open a workspace and see for yourself.</h3>
            <p className="mono text-[11px] leading-5 text-[#9A9590] mt-2 max-w-[520px]">Free. No credit card. Your first playground seeds with the template files so you can type immediately.</p>
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
            <Link href="/dashboard" className="inline-flex h-[36px] items-center bg-[#FFFEFB] text-[#0F0E0C] px-4 mono text-[12px] font-medium hover:bg-white">Open workspace →</Link>
            <span className="mono text-[10px] text-[#9A9590]">or press <span className="border border-white/20 px-1">⌘K</span> anywhere</span>
          </div>
        </div>
      </section>
    </div>
  );
}
