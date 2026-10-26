export const dynamic = 'force-dynamic';

import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative w-full max-w-[420px]">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1.5 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <div className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
            <div className="h-2 w-2 rounded-full bg-[#34c759]" />
            <span className="ml-2 text-[11px] font-medium text-muted-foreground">CodePilot</span>
          </div>
        </div>
        {children}
        <p className="mt-6 text-center text-[11px] leading-4 text-muted-foreground">
          By continuing, you agree to CodePilot&apos;s{" "}
          <a href="#" className="underline hover:text-foreground">Terms</a> and{" "}
          <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;
