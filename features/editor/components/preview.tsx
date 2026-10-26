"use client";

import { useEffect, useState } from "react";
import { Eye, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewProps {
  files: { name: string; content: string | null }[];
  template: string;
}

function buildPreviewHtml(files: { name: string; content: string | null }[], template: string) {
  // Simple client-side preview: combine files into a single HTML doc
  // For React/Next/Vue we render a minimal preview with Babel
  const mainFile = files.find(f => f.name.includes("App")) || files[0];
  const code = mainFile?.content || "// No content";

  // Escape for HTML
  const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // For Express/Hono/Angular we show raw + note
  if (["EXPRESS", "HONO"].includes(template)) {
    return `<!doctype html><html><body style="font-family: system-ui; padding: 24px; color:#111;">
      <h2 style="font-size:16px; font-weight:600;">Server template preview</h2>
      <p style="color:#666; font-size:13px; margin-top:8px;">This is a backend template (Express/Hono). Run it locally with <code>node server.js</code>.</p>
      <pre style="margin-top:16px; background:#f5f5f5; padding:16px; border-radius:8px; font-size:12px; overflow:auto;">${escaped}</pre>
    </body></html>`;
  }

  // Generic live preview via iframe srcDoc with simple React via CDN (for demo)
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: white; color: #111; }
    #root { padding: 24px; }
    pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow: auto; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      ${code.includes("export default") ? code.replace("export default", "function AppWrapper() { return (") + "); const root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(AppWrapper));" : `document.getElementById('root').innerHTML = '<pre>' + \`${escaped}\` + '</pre>'`}
    } catch (e) {
      document.getElementById('root').innerHTML = '<div style="color:#c00; padding:16px; font-size:13px;"><b>Preview error:</b> ' + e.message + '</div>';
      console.error(e);
    }
  </script>
</body>
</html>`;
}

export function Preview({ files, template }: PreviewProps) {
  const [srcDoc, setSrcDoc] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    setSrcDoc(buildPreviewHtml(files, template));
  }, [files, template, key]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-3 h-8 border-b border-black/[0.06] dark:border-white/10 bg-[#fafafa] dark:bg-[#111]">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-[#888]">
          <Eye className="h-3.5 w-3.5" />
          Preview
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={() => setKey(k => k + 1)} className="h-6 w-6 rounded-md">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <a href="#" target="_blank" rel="noreferrer" className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10">
              <ExternalLink className="h-3.5 w-3.5 text-[#888]" />
          </a>
        </div>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          key={key}
          title="Live Preview"
          srcDoc={srcDoc}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <div className="px-3 py-2 border-t border-black/[0.06] dark:border-white/10 bg-[#fafafa] dark:bg-[#111] text-[11px] text-[#888]">
        Auto-refresh on save • Template: {template}
      </div>
    </div>
  );
}
