import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-[#fbfbfd] dark:bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Apple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fbfbfd] to-[#f5f5f7] dark:from-black dark:via-[#0a0a0a] dark:to-[#1c1c1e] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-[#0071e3]/[0.06] via-[#42a5f5]/[0.04] to-transparent blur-[80px] rounded-full pointer-events-none" />
      <div className="relative w-full max-w-[420px]">
        {/* Apple window chrome decoration */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 px-3 py-1.5 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <div className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
            <div className="h-2 w-2 rounded-full bg-[#28ca42]" />
            <span className="ml-2 text-[11px] font-medium text-[#86868b]">CodePilot</span>
          </div>
        </div>
        {children}
        <p className="mt-6 text-center text-[11px] leading-4 text-[#86868b]">
          By continuing, you agree to CodePilot&apos;s{" "}
          <a href="#" className="underline hover:text-[#1d1d1f] dark:hover:text-white">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-[#1d1d1f] dark:hover:text-white">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;
