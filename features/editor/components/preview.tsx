"use client";

import { useEffect, useState, useMemo } from "react";
import { Eye, RefreshCw, ExternalLink, CheckCircle2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewProps {
  files: { name: string; content: string | null }[];
  template: string;
}

function buildPreviewHtml(files: { name: string; content: string | null }[], template: string) {
  const mainFile = files.find(f => f.name.toLowerCase().includes("app") && f.name.endsWith(".tsx")) 
    || files.find(f => f.name.includes("App")) 
    || files.find(f => !f.name.endsWith("/.keep"))
    || files[0];
  
  const rawCode = mainFile?.content || "// No file selected";
  const cssFiles = files.filter(f => f.name.endsWith(".css")).map(f => f.content).join("\n");
  const escaped = rawCode.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (["EXPRESS", "HONO"].includes(template)) {
    const allContent = files.map(f => `// ${f.name}\n${f.content || ""}`).join("\n\n");
    const escapedAll = allContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><style>body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#e5e5e5;padding:24px;line-height:1.6}.badge{display:inline-flex;align-items:center;gap:6px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:20px;padding:4px 10px;font-size:11px;color:#888}.dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}pre{background:#111;border:1px solid #222;border-radius:8px;padding:16px;font-size:12px;overflow:auto;color:#e5e5e5;line-height:1.6}code{font-family:ui-monospace,Menlo,monospace}h2{font-size:16px;font-weight:600;color:white;margin:0}p{color:#888;font-size:13px;margin:8px 0 0 0}.log{margin-top:16px;background:#111;border:1px solid #222;border-radius:8px;overflow:hidden}.log-header{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#1a1a1a;border-bottom:1px solid #222;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#888}.log-line{padding:8px 12px;font-family:ui-monospace,monospace;font-size:12px;border-bottom:1px solid #1a1a1a;display:flex;gap:8px}.log-time{color:#666;min-width:60px}.log-msg{color:#e5e5e5}</style></head><body><div class="badge"><span class="dot"></span> ${template} Server • Running</div><h2 style="margin-top:16px">Server template preview</h2><p>This is a backend template. Run locally with <code>node ${mainFile?.name || "server.js"}</code>. Preview shows file contents and mock logs.</p><div class="log"><div class="log-header"><span>●</span> Server logs — 3 entries</div><div class="log-line"><span class="log-time">08:59:01</span><span class="log-msg">[GET] / → 200 OK (12ms)</span></div><div class="log-line"><span class="log-time">08:59:02</span><span class="log-msg">[GET] /api/health → 200 { status: "ok" }</span></div><div class="log-line"><span class="log-time">08:59:03</span><span class="log-msg">Server running on http://localhost:3000</span></div></div><pre style="margin-top:16px">${escapedAll}</pre></body></html>`;
  }

  let cleanedCode = rawCode
    .replace(/^import.*?from.*?['"].*?['"];?\s*$/gm, "")
    .replace(/^import\s+.*?;/gm, "")
    .replace(/export\s+default\s+function/g, "function App")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+/g, "");

  const hasComponent = /function\s+App|const\s+App\s*=|class\s+App/.test(cleanedCode);
  const renderCode = hasComponent 
    ? `${cleanedCode}\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));`
    : `function App(){ return React.createElement('div', {style:{padding:24, fontFamily:'system-ui'}}, React.createElement('pre', {style:{background:'#f5f5f5',padding:16,borderRadius:8, fontSize:12}}, \`${escaped}\`)); } const root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(App));`;

  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:white;color:#111;line-height:1.5}#root{ min-height: 100vh; }.error{ margin:16px; padding:12px 16px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; color:#dc2626; font-size:13px; font-family:ui-monospace,monospace; }.error b{ color:#991b1b; }${cssFiles}</style></head><body><div id="root"></div><div id="error" style="display:none"></div><script>window.onerror = function(msg, src, line, col, err){const el = document.getElementById('error');el.style.display='block';el.innerHTML = '<div class="error"><b>Runtime error:</b> ' + msg + ' <span style="color:#666;font-size:11px">[line ' + line + ']</span></div>';};</script><script type="text/babel" data-presets="react">try {${renderCode}} catch(e){document.getElementById('root').innerHTML = '<div class="error"><b>Compile error:</b> ' + e.message + '</div>';console.error(e);}</script></body></html>`;
}

export function Preview({ files, template }: PreviewProps) {
  const [srcDoc, setSrcDoc] = useState("");
  const [key, setKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const codeHash = useMemo(() => JSON.stringify(files.map(f => f.content).join("")) + template, [files, template]);

  useEffect(() => {
    setStatus("loading");
    const t = setTimeout(() => {
      setSrcDoc(buildPreviewHtml(files, template));
      setStatus("ready");
      setLastUpdate(new Date());
    }, 350);
    return () => clearTimeout(t);
  }, [codeHash, template]);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between px-3 h-8 border-b border-border bg-muted/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase">
            <Eye className="h-3.5 w-3.5" />
            Preview
          </div>
          <span className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${status === "ready" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border"}`}>
            {status === "ready" ? <CheckCircle2 className="h-3 w-3" /> : <Terminal className="h-3 w-3" />}
            {status === "ready" ? "Live" : status === "loading" ? "Updating…" : "Idle"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={() => setKey(k => k + 1)} className="h-6 w-6 rounded-md" title="Refresh preview">
            <RefreshCw className={`h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
          </Button>
          <a href="#" target="_blank" rel="noreferrer" className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </div>
      </div>

      <div className="flex-1 bg-white relative overflow-hidden">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Building preview…
            </div>
          </div>
        )}
        <iframe
          key={key}
          title="Live Preview"
          srcDoc={srcDoc}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <div className="px-3 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] shrink-0">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Auto-refresh • {template}
        </span>
        <span className="text-muted-foreground hidden sm:inline">
          {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Waiting for changes"}
        </span>
      </div>
    </div>
  );
}
