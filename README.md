# Codepilot — Intelligent Code Editor

Codepilot is a browser-based code editor with a file explorer, multi-tab code
editor, live preview and Google/GitHub authentication. Projects and their
files are persisted in MongoDB through Prisma.

## Highlights

- **Three-pane editor workspace** — file explorer (20%), code editor (50%)
  and preview/AI inspector (30%). On mobile the same panes stack vertically
  with the same proportions.
- **Real file storage** — every project gets a realistic starter file tree
  (React, Next.js, Express, Vue, Hono or Angular) stored as `ProjectFile`
  records, with autosave, create, rename and delete actions.
- **Live preview** — HTML/CSS is inlined into a sandboxed iframe; React/JSX is
  compiled in the browser with Babel Standalone, with phone, tablet and
  desktop widths.
- **Version 2 placeholders** — GitHub repository import and the AI assistant
  show explicit "Arriving in Version 2" states.
- **Auth** — NextAuth v5 with GitHub and Google providers, JWT sessions and a
  Prisma/MongoDB adapter.
- **Designed for the Render free tier** — a single web service plus MongoDB
  Atlas M0. See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
Prisma 6 + MongoDB · NextAuth v5 · Shiki · react-resizable-panels.

## Getting started (local)

```bash
npm install
cp .env.example .env   # fill in the values described below
npx prisma generate
npm run dev
```

Open <http://localhost:3000>.

Required environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MongoDB Atlas connection string |
| `AUTH_SECRET` | JWT/encryption secret (`openssl rand -base64 32`) |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth app |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth client |
| `AUTH_TRUST_HOST` | `true` behind a hosting proxy |


## Road Rash tribute (side quest)

`/roadrash` hosts a from-scratch, non-commercial tribute to *Road Rash* (1991):
pseudo-3D motorcycle racing with punches, kicks, traffic and roadside chaos.
It is plain HTML/CSS/JavaScript in `public/roadrash` — no framework, no build
step, no database — served as a static page and embedded by `app/roadrash/page.tsx`.
See [public/roadrash/README.md](./public/roadrash/README.md) for the mechanics
and the pseudo-3D renderer write-up.

## Project structure

```
app/
  (root)/            Landing page (public)
  roadrash/          Full-bleed host for the Road Rash tribute
  (auth)/            Sign-in
  dashboard/         Project list + sidebar shell
  playground/[id]/   Full-screen editor workspace
  api/auth/          NextAuth route handler
features/
  auth/              Session helpers, sign-in, user menu
  dashboard/         Project CRUD actions + dashboard UI
  playground/        Editor actions and workspace components
  home/              Landing header/footer
lib/
  starter-templates.ts   Seed files per framework
  file-tree.ts           Tree/path helpers
  preview-builder.ts     Self-contained iframe document builder
prisma/schema.prisma  User, Account, Playground, ProjectFile, StarMark
proxy.ts             Route protection (Next 16 proxy convention)
render.yaml          Render blueprint (free web service)
```

## Deployment

Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for the full free-tier walkthrough
(Render blueprint, MongoDB Atlas, GitHub/Google OAuth callback URLs and
troubleshooting).
