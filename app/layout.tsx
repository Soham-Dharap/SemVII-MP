import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-sans/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CodePilot — Code like you mean it",
  description: "Minimal code playground. Monaco, live preview, file system. White + blue light, black + neon dark.",
  icons: { icon: "/logo.svg" },
};

async function AuthSession({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await auth(); } catch (e) { console.error("Auth session failed", e); session = null; }
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster richColors closeButton />
          <Suspense fallback={null}><AuthSession>{children}</AuthSession></Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
