export const dynamic = 'force-dynamic';

import React from "react";
import SignInFormClient from "@/features/auth/components/signin-form-client";

const SignInPage = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-foreground text-background shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor" />
            <path d="M8 13l-2 2 2 2M16 13l2 2-2 2M13 10l-2 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">Welcome back</h1>
        <p className="mt-1 text-[14px] leading-5 text-muted-foreground">Sign in to your workspace to continue</p>
      </div>
      <SignInFormClient />
      <p className="mt-4 text-center text-[12px] text-muted-foreground">
        New to CodePilot?{" "}
        <a href="#" className="font-medium text-primary hover:underline">Create an account</a>
      </p>
    </div>
  );
};

export default SignInPage;
