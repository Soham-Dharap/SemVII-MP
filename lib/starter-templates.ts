import type { TemplateName } from "@/features/dashboard/type";

export interface StarterFile {
  path: string;
  content: string;
  language: string;
  isDirectory?: boolean;
}

const reactFiles: StarterFile[] = [
  { path: "src", content: "", language: "plaintext", isDirectory: true },
  {
    path: "index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Starter</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel" data-presets="react" src="/src/App.jsx"></script>
    <script type="text/babel" data-presets="react" src="/src/main.jsx"></script>
  </body>
</html>
`,
  },
  {
    path: "src/App.jsx",
    language: "jsx",
    content: `function App() {
  const [count, setCount] = React.useState(0);

  return (
    <main className="app">
      <span className="badge">React</span>
      <h1>Welcome to Codepilot</h1>
      <p>
        Edit this file and the preview on the right updates instantly.
      </p>
      <button className="button" onClick={() => setCount(count + 1)}>
        Clicked {count} {count === 1 ? "time" : "times"}
      </button>
    </main>
  );
}
`,
  },
  {
    path: "src/main.jsx",
    language: "jsx",
    content: `const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
`,
  },
  {
    path: "src/styles.css",
    language: "css",
    content: `* {
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  background: #f5f5f7;
  color: #1d1d1f;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.app {
  text-align: center;
  padding: 48px 32px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  max-width: 440px;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

p {
  color: #6e6e73;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 28px;
}

.button {
  border: none;
  background: #1d1d1f;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.button:hover {
  opacity: 0.88;
}

.button:active {
  transform: scale(0.97);
}
`,
  },
  {
    path: "package.json",
    language: "json",
    content: `{
  "name": "codepilot-react-starter",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# React Starter

A minimal React playground bootstrapped by Codepilot.

- Edit \`src/App.jsx\` to change the UI.
- The live preview compiles JSX directly in your browser.
- Add new files from the file explorer on the left.
`,
  },
];

const nextjsFiles: StarterFile[] = [
  { path: "app", content: "", language: "plaintext", isDirectory: true },
  { path: "public", content: "", language: "plaintext", isDirectory: true },
  {
    path: "app/layout.tsx",
    language: "tsx",
    content: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codepilot Next.js Starter",
  description: "Created with Codepilot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  },
  {
    path: "app/page.tsx",
    language: "tsx",
    content: `export default function Home() {
  return (
    <main className="page">
      <h1>Next.js Starter</h1>
      <p>
        This project runs on the Next.js App Router. Full server rendering is
        planned for Codepilot v2.
      </p>
    </main>
  );
}
`,
  },
  {
    path: "app/globals.css",
    language: "css",
    content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  background: #f5f5f7;
  color: #1d1d1f;
}

.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 96px 24px;
}

h1 {
  letter-spacing: -0.02em;
}
`,
  },
  {
    path: "public/index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Next.js Starter</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
        background: #f5f5f7;
        color: #1d1d1f;
      }
      .card {
        text-align: center;
        background: #fff;
        padding: 48px 40px;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
      }
      .badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 999px;
        background: #ecfdf5;
        color: #047857;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 16px;
      }
      p { color: #6e6e73; }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">Next.js</span>
      <h1>Your Next.js project is ready</h1>
      <p>Server-rendered preview arrives in Codepilot v2.</p>
    </div>
  </body>
</html>
`,
  },
  {
    path: "package.json",
    language: "json",
    content: `{
  "name": "codepilot-nextjs-starter",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# Next.js Starter

App Router project structure created by Codepilot.

- Routes live in the \`app/\` directory.
- Static assets live in \`public/\`.
- Full framework runtime preview is planned for v2.
`,
  },
];

const expressFiles: StarterFile[] = [
  { path: "src", content: "", language: "plaintext", isDirectory: true },
  { path: "public", content: "", language: "plaintext", isDirectory: true },
  {
    path: "src/index.js",
    language: "javascript",
    content: `const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "codepilot-express-starter" });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
  },
  {
    path: "public/index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Express API</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
        background: #f5f5f7;
        color: #1d1d1f;
      }
      .card {
        background: #fff;
        padding: 44px 40px;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        max-width: 420px;
      }
      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #22c55e;
        margin-right: 8px;
      }
      code {
        display: block;
        margin-top: 16px;
        padding: 12px 16px;
        background: #1d1d1f;
        color: #a5f3fc;
        border-radius: 12px;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1><span class="dot"></span>Express API</h1>
      <p>Your backend service is configured and ready.</p>
      <code>GET /api/health</code>
    </div>
  </body>
</html>
`,
  },
  {
    path: "package.json",
    language: "json",
    content: `{
  "name": "codepilot-express-starter",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  }
}
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# Express Starter

Minimal Express API created by Codepilot.

- \`src/index.js\` — server entry point.
- \`public/\` — static files, including the landing page.
- Health check: \`GET /api/health\`.
`,
  },
];

const vueFiles: StarterFile[] = [
  { path: "src", content: "", language: "plaintext", isDirectory: true },
  {
    path: "index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Starter</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div id="app">
      <main class="app">
        <span class="badge">Vue 3</span>
        <h1>{{ message }}</h1>
        <p>Edit <code>src/app.js</code> and watch the preview update.</p>
        <button class="button" @click="count++">
          Clicked {{ count }} {{ count === 1 ? "time" : "times" }}
        </button>
      </main>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="/src/app.js"></script>
  </body>
</html>
`,
  },
  {
    path: "src/app.js",
    language: "javascript",
    content: `const { createApp, ref } = Vue;

createApp({
  setup() {
    const message = ref("Welcome to Codepilot");
    const count = ref(0);

    return { message, count };
  },
}).mount("#app");
`,
  },
  {
    path: "src/style.css",
    language: "css",
    content: `* {
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  background: #f5f5f7;
  color: #1d1d1f;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.app {
  text-align: center;
  padding: 48px 32px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  max-width: 440px;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

p {
  color: #6e6e73;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 28px;
}

.button {
  border: none;
  background: #1d1d1f;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
`,
  },
  {
    path: "package.json",
    language: "json",
    content: `{
  "name": "codepilot-vue-starter",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "vue": "^3.5.0"
  }
}
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# Vue Starter

Vue 3 playground using the global build, created by Codepilot.

- Edit \`src/app.js\` for logic.
- Edit \`src/style.css\` for styling.
- The preview renders directly in your browser.
`,
  },
];

const honoFiles: StarterFile[] = [
  { path: "src", content: "", language: "plaintext", isDirectory: true },
  { path: "public", content: "", language: "plaintext", isDirectory: true },
  {
    path: "src/index.ts",
    language: "typescript",
    content: `import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./public" }));

app.get("/api/health", (c) =>
  c.json({ status: "ok", service: "codepilot-hono-starter" }),
);

export default app;
`,
  },
  {
    path: "public/index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hono API</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
        background: #f5f5f7;
        color: #1d1d1f;
      }
      .card {
        background: #fff;
        padding: 44px 40px;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        max-width: 420px;
      }
      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f97316;
        margin-right: 8px;
      }
      code {
        display: block;
        margin-top: 16px;
        padding: 12px 16px;
        background: #1d1d1f;
        color: #fed7aa;
        border-radius: 12px;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1><span class="dot"></span>Hono API</h1>
      <p>A lightweight service built on Web Standards.</p>
      <code>GET /api/health</code>
    </div>
  </body>
</html>
`,
  },
  {
    path: "package.json",
    language: "json",
    content: `{
  "name": "codepilot-hono-starter",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "hono": "^4.6.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0"
  }
}
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# Hono Starter

Lightweight Hono API created by Codepilot.

- \`src/index.ts\` — application entry point.
- \`public/\` — static assets and landing page.
`,
  },
];

const angularFiles: StarterFile[] = [
  { path: "src", content: "", language: "plaintext", isDirectory: true },
  { path: "src/app", content: "", language: "plaintext", isDirectory: true },
  {
    path: "src/app/app.component.ts",
    language: "typescript",
    content: `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  template: \`
    <main class="app">
      <span class="badge">Angular</span>
      <h1>Welcome to Codepilot</h1>
      <p>Your standalone Angular component is ready to build on.</p>
    </main>
  \`,
})
export class AppComponent {
  title = "codepilot-angular-starter";
}
`,
  },
  {
    path: "src/main.ts",
    language: "typescript",
    content: `import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent).catch((err) => console.error(err));
`,
  },
  {
    path: "index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Angular Starter</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
        background: #f5f5f7;
        color: #1d1d1f;
      }
      .card {
        text-align: center;
        background: #fff;
        padding: 48px 40px;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        max-width: 440px;
      }
      .badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 20px;
      }
      p { color: #6e6e73; }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">Angular</span>
      <h1>Your Angular workspace is ready</h1>
      <p>Compiled framework preview arrives in Codepilot v2.</p>
    </div>
  </body>
</html>
`,
  },
  {
    path: "package.json",
    language: "json",
    content: `{
  "name": "codepilot-angular-starter",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "ng serve"
  },
  "dependencies": {
    "@angular/core": "^19.0.0"
  }
}
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# Angular Starter

Standalone Angular workspace created by Codepilot.

- Components live in \`src/app/\`.
- \`src/main.ts\` bootstraps the application.
- Full build pipeline preview is planned for v2.
`,
  },
];

// Empty workspace — the user brings every file themselves.
const blankFiles: StarterFile[] = [
  { path: "src", content: "", language: "plaintext", isDirectory: true },
  {
    path: "README.md",
    language: "markdown",
    content: `# My project

Start from scratch — create files with the + buttons in the explorer.
`,
  },
];

// Plain HTML + CSS + JS, no framework. Fully previewable in the browser.
const vanillaFiles: StarterFile[] = [
  {
    path: "index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vanilla JS App</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="card">
      <span class="badge">HTML · CSS · JS</span>
      <h1>Hello from vanilla code</h1>
      <p>Edit the files and watch the preview refresh instantly.</p>
      <button id="counter" type="button">Clicked 0 times</button>
    </main>
    <script src="/script.js"></script>
  </body>
</html>
`,
  },
  {
    path: "styles.css",
    language: "css",
    content: `:root {
  color-scheme: light dark;
  font-family: Inter, system-ui, -apple-system, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f6f5fb;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(79, 70, 229, 0.12);
  text-align: center;
}

.badge {
  display: inline-block;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
}

button {
  margin-top: 16px;
  border: 0;
  border-radius: 12px;
  padding: 10px 18px;
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #4338ca;
}
`,
  },
  {
    path: "script.js",
    language: "javascript",
    content: `let count = 0;
const button = document.getElementById("counter");

button.addEventListener("click", () => {
  count += 1;
  button.textContent = \`Clicked \${count} time\${count === 1 ? "" : "s"}\`;
});
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# Vanilla JS Starter

No frameworks, no build step.

- \`index.html\` — page markup
- \`styles.css\` — styling
- \`script.js\` — interactivity
`,
  },
];

// Python scripting workspace — syntax highlighting works; server runtimes
// arrive in v2, so there is no live preview for Python projects yet.
const pythonFiles: StarterFile[] = [
  { path: "src", content: "", language: "plaintext", isDirectory: true },
  {
    path: "src/main.py",
    language: "python",
    content: `def greet(name: str) -> str:
    return f"Hello, {name}!"


def main() -> None:
    names = ["world", "Codepilot"]
    for name in names:
        print(greet(name))


if __name__ == "__main__":
    main()
`,
  },
  {
    path: "requirements.txt",
    language: "plaintext",
    content: `# Pin your dependencies here, e.g.
# requests==2.32.3
`,
  },
  {
    path: "README.md",
    language: "markdown",
    content: `# Python Starter

A clean scripting layout with syntax highlighting.

- Code lives in \`src/main.py\`.
- Add dependencies to \`requirements.txt\`.
- In-browser Python execution arrives in Version 2.
`,
  },
];

export const STARTER_TEMPLATES: Record<TemplateName, StarterFile[]> = {
  BLANK: blankFiles,
  VANILLA: vanillaFiles,
  PYTHON: pythonFiles,
  REACT: reactFiles,
  NEXTJS: nextjsFiles,
  EXPRESS: expressFiles,
  VUE: vueFiles,
  HONO: honoFiles,
  ANGULAR: angularFiles,
};
