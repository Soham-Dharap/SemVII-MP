export type TemplateId = "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";

export interface TemplateFile {
  name: string;
  language: string;
  content: string;
}

export const templateFiles: Record<TemplateId, TemplateFile[]> = {
  REACT: [
    {
      name: "App.tsx",
      language: "typescript",
      content: `import { useState } from "react"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ fontFamily: 'system-ui', padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>React App</h1>
      <p style={{ color: '#666', marginTop: 8 }}>
        Edit <code>App.tsx</code> and save to see live preview.
      </p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          marginTop: 16,
          padding: '8px 16px',
          background: '#111',
          color: 'white',
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Count: {count}
      </button>
    </div>
  )
}
`,
    },
    {
      name: "index.tsx",
      language: "typescript",
      content: `import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

const root = createRoot(document.getElementById("root")!)
root.render(<App />)
`,
    },
    {
      name: "styles.css",
      language: "css",
      content: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #111; }
`,
    },
  ],
  NEXTJS: [
    {
      name: "app/page.tsx",
      language: "typescript",
      content: `export default function Page() {
  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Next.js 15</h1>
      <p style={{ marginTop: 12, color: '#666' }}>
        Welcome to Next.js with App Router. Edit this file to get started.
      </p>
    </main>
  )
}
`,
    },
    {
      name: "app/layout.tsx",
      language: "typescript",
      content: `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
`,
    },
    {
      name: "app/globals.css",
      language: "css",
      content: `body { font-family: system-ui; background: #fff; }`,
    },
  ],
  EXPRESS: [
    {
      name: "server.js",
      language: "javascript",
      content: `const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`)
})
`,
    },
    {
      name: "routes/api.js",
      language: "javascript",
      content: `const express = require('express')
const router = express.Router()

router.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Ada' }, { id: 2, name: 'Grace' }])
})

module.exports = router
`,
    },
  ],
  VUE: [
    {
      name: "App.vue",
      language: "html",
      content: `<template>
  <div style="padding: 32px; font-family: system-ui">
    <h1 style="font-size: 24px; font-weight: 600;">Vue 3 App</h1>
    <p style="color: #666; margin-top: 8px;">Edit App.vue to see live updates.</p>
    <button @click="count++" style="margin-top: 16px; padding: 8px 16px; background: #42b883; color: white; border: none; border-radius: 6px;">
      Count: {{ count }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
`,
    },
    {
      name: "main.js",
      language: "javascript",
      content: `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`,
    },
  ],
  HONO: [
    {
      name: "src/index.ts",
      language: "typescript",
      content: `import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello Hono!' }))
app.get('/api/hello', (c) => c.text('Hello from Hono on Cloudflare'))

export default app
`,
    },
    {
      name: "package.json",
      language: "json",
      content: `{
  "name": "hono-app",
  "scripts": {
    "dev": "wrangler dev src/index.ts",
    "deploy": "wrangler deploy"
  }
}`,
    },
  ],
  ANGULAR: [
    {
      name: "src/app.component.ts",
      language: "typescript",
      content: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <main style="padding: 32px; font-family: system-ui">
      <h1 style="font-size: 24px; font-weight: 600;">Angular App</h1>
      <p style="color: #666; margin-top: 8px;">Edit app.component.ts to see changes.</p>
      <button (click)="count = count + 1" style="margin-top: 16px; padding: 8px 16px;">
        Count: {{count}}
      </button>
    </main>
  \`
})
export class AppComponent {
  count = 0;
}
`,
    },
    {
      name: "src/main.ts",
      language: "typescript",
      content: `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);`,
    },
  ],
};

export function getDefaultFiles(template: TemplateId): TemplateFile[] {
  return templateFiles[template] || templateFiles.REACT;
}
