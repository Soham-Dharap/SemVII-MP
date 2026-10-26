import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CodePilot — Intelligent Code Editor",
  description: "The beautiful, fast, and intelligent code editor. Crafted for builders who care about details.",
  icons: {
    icon: "/logo.svg",
  }
};

async function AuthSession({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth session fetch failed (DB not ready?):", e);
    // Don't crash the whole site if DB is misconfigured — landing page should still show
    session = null;
  }
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-[#fbfbfd] text-[#1d1d1f]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster richColors closeButton theme="light" />
          <Suspense fallback={null}>
            <AuthSession>{children}</AuthSession>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
