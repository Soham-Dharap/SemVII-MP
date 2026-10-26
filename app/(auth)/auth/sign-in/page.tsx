import React from "react";
import SignInFormClient from "@/features/auth/components/signin-form-client";
import { BrandMark } from "@/components/brand";

const SignInPage = () => {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center text-center lg:hidden">
        <BrandMark size={52} className="mb-5" />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">
          Welcome back
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Sign in to open your editor and projects.
        </p>
      </div>

      <SignInFormClient />
    </div>
  );
};

export default SignInPage;
