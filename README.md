# CodePilot — AI-Intelligent Code Editor

> **Beautifully simple. Powerfully intelligent.**

CodePilot is a modern, Apple-inspired code workspace — clean, light, and obsessively detailed. Built with Next.js 16, Tailwind CSS 4, and shadcn/ui.

![Light Theme](https://img.shields.io/badge/theme-light-fbfbfd?style=for-the-badge) ![Apple Inspired](https://img.shields.io/badge/design-Apple_HIG-0071e3?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)

---

## ✨ What’s New — Apple Light Redesign

This branch delivers a complete UI refresh while keeping the **same tech stack**:

- **Design System**: Apple HIG-inspired — `SF Pro` typography, `fbfbfd` background, `0071e3` primary, 18px rounded cards, soft shadows
- **Landing Page**: Minimal hero with macOS window chrome, feature grid, tech strip, and CTA — no more harsh gradients
- **Navigation**: Translucent header (44px, blur 20px) like macOS Finder
- **Dashboard**: Greeting + stats cards + Apple Card-style project list (table on desktop, cards on mobile)
- **Sidebar**: Light, rounded, collapsible with Pro upsell card
- **Auth**: Centered glass card with secure sign-in (Google / GitHub)
- **Modals**: Template picker with window-dot header, category pills, and configure step

All components use `rounded-full` buttons, `border-black/5`, and `backdrop-blur-xl` for that native Apple feel.

---

## 🧱 Tech Stack (unchanged)

- **Framework**: Next.js 16 (App Router, Turbopack, Cache Components)
- **Styling**: Tailwind CSS 4 + `tw-animate-css` + shadcn/ui (base-nova)
- **Auth**: NextAuth v5 (Auth.js) + Prisma + MongoDB
- **UI**: Radix/Base UI, lucide-react, sonner, recharts, shiki
- **Fonts**: System stack — `-apple-system, SF Pro Display, Inter` (no external fetch for offline builds)

---

## 📁 Project Structure

```
app/
  (auth)/auth/sign-in/     — Apple glass auth layout
  (root)/                  — Marketing layout (header + footer)
  dashboard/               — Sidebar + project overview
  layout.tsx               — Root layout (light default)
  globals.css              — Apple design tokens

features/
  home/components/         — Header (translucent), Footer (Apple footer)
  dashboard/components/    — Sidebar, AddNewButton, AddRepoButton, ProjectTable, TemplateModal
  auth/components/         — SignInForm (light card), UserButton

components/ui/             — shadcn primitives (button rounded-full, card 18px)
lib/db.ts                  — Prisma with build-time fallback
prisma/schema.prisma       — MongoDB models
```

---

## 🚀 Getting Started

### 1. Unzip (done on this branch)
The original `Code-Pilot-AI-Editor-main.zip` has been extracted — all code lives at the repo root now. The zip is removed from git.

### 2. Install
```bash
npm install
```

### 3. Env
Create `.env`:
```env
DATABASE_URL="mongodb+srv://..."
AUTH_SECRET="your-secret"
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

### 4. Dev
```bash
npm run dev
# http://localhost:3000
```

### 5. Build (offline-safe)
```bash
npm run build
# Prisma fallback ensures build succeeds even without DB
```

---

## 🎨 Design Principles

- **Light first**: `fbfbfd` background, white cards, `1d1d1f` text, `86868b` secondary
- **Air & rhythm**: 24px grid, 18px cards, 44px nav, generous whitespace
- **Motion**: `hover:-translate-y-0.5`, `shadow-lg`, `backdrop-blur`
- **Accessibility**: 4.5:1 contrast, focus rings, keyboard navigable

---

## 📸 Screenshots

- Landing hero with macOS window
- Dashboard with stats + Apple Table
- Template modal with pill filters

> Run `npm run dev` to see it live.

---

## 📄 License

MIT — Crafted with care in California.
