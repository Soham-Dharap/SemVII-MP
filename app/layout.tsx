import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CodePilot — Code like u mean it.",
  description: "The Gen-Z code playground. Monaco + live preview + brutalist file system. No AI slop. Just ship.",
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
      <body className="antialiased bg-[#0A0A0B] text-[#F4F4F0] selection:bg-[#D6FF00] selection:text-black">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Toaster richColors closeButton theme="dark" />
          <Suspense fallback={null}><AuthSession>{children}</AuthSession></Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
