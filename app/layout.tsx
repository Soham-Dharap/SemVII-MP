import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/600.css";
import "@fontsource/newsreader/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CodePilot — Own Your Code, Shape Your Future",
  description: "Premium code playground. Monaco, live preview, real file system. Built for creators who ship.",
  icons: { icon: "/logo.svg" },
};

async function AuthSession({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await auth(); } catch (e) { console.error("Auth session failed", e); session = null; }
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className="antialiased bg-background text-foreground overflow-x-hidden min-w-0 selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Toaster richColors closeButton position="top-center" />
          <Suspense fallback={null}><AuthSession>{children}</AuthSession></Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
