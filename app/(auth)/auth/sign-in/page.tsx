import React from "react";
import SignInFormClient from "@/features/auth/components/signin-form-client";
import { BrandMark } from "@/components/brand";

const SignInPage = () => {
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <BrandMark size={64} className="mb-6" />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Welcome to Codepilot
        </h1>
        <p className="mt-2 text-[15px] text-zinc-500">
          Sign in to open your editor and projects.
        </p>
      </div>
      <SignInFormClient />
    </div>
  );
};

export default SignInPage;
