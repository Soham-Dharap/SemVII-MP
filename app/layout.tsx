import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CodePilot — A browser editor that feels local",
  description: "Monaco, live preview, nested file system. Writes to disk via git, no synthetic cloud FS. Six templates, zero lock-in.",
  icons: { icon: "/logo.svg" },
};

async function AuthSession({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await auth(); } catch (e) { console.error("Auth session failed (DB not ready?)", e); session = null; }
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#FFFEFB] text-[#0F0E0C] selection:bg-[#0F0E0C] selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <Toaster richColors closeButton theme="light" />
          <Suspense fallback={null}><AuthSession>{children}</AuthSession></Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
