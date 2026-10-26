export const dynamic = 'force-dynamic';

import Image from "next/image";
import React from "react";
import SignInFormClient from "@/features/auth/components/signin-form-client";

const SignInPage = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#1d1d1f] dark:bg-white text-white dark:text-black shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor" />
            <path d="M8 13l-2 2 2 2M16 13l2 2-2 2M13 10l-2 8" stroke="white" className="dark:stroke-black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-[14px] leading-5 text-[#6e6e73] dark:text-[#a1a1a6]">
          Sign in to your workspace to continue
        </p>
      </div>
      <SignInFormClient />
      <p className="mt-4 text-center text-[12px] text-[#86868b]">
        New to CodePilot?{" "}
        <a href="#" className="font-medium text-[#0071e3] hover:underline">
          Create an account
        </a>
      </p>
    </div>
  );
};

export default SignInPage;
