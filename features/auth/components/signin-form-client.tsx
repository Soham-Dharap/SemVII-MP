"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { Shield, Sparkles } from "lucide-react";

const GoogleIcon = () => {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M21.35 12.27c0-.73-.06-1.43-.18-2.09H12v3.95h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.25Z" />
      <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.5Z" />
      <path fill="#FBBC05" d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.88H3.29A9.5 9.5 0 0 0 2.5 12c0 1.48.35 2.88.79 4.12l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.25 2.53C7.31 8.1 9.46 6.38 12 6.38Z" />
    </svg>
  );
};

const GithubIcon = () => {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1.01.08 1.54 1.07 1.54 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 7.17c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.6c0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
};

async function handleGoogleSignIn() {
  await signIn("google");
}

async function handleGithubSignIn() {
  await signIn("github");
}

const SignInFormClient = () => {
  return (
    <Card className="w-full max-w-md mx-auto rounded-[18px] border border-black/5 dark:border-white/10 bg-white dark:bg-[#1c1c1e] shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden">
      <CardHeader className="space-y-1 pt-6 pb-2 text-center">
        <CardTitle className="text-[19px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-white">
          Sign in to CodePilot
        </CardTitle>
        <CardDescription className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6]">
          Choose your preferred sign-in method
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3 px-6 pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-full bg-white dark:bg-[#2c2c2e] border border-black/10 dark:border-white/10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] text-[14px] font-medium"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-black border-transparent hover:bg-black dark:hover:bg-[#f5f5f7] text-[14px] font-medium"
          onClick={handleGithubSignIn}
        >
          <GithubIcon />
          <span>Continue with GitHub</span>
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-black/5 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-[#1c1c1e] px-3 text-[#86868b] text-[11px] font-medium">
              Secure authentication
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-[#86868b]">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> Encrypted
          </span>
          <span className="h-3 w-px bg-black/10 dark:bg-white/10" />
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Fast
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-2">
        <p className="text-[11px] leading-4 text-center text-[#86868b] w-full">
          By signing in, you agree to our{" "}
          <a href="#" className="font-medium text-[#1d1d1f] dark:text-white hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-[#1d1d1f] dark:text-white hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInFormClient;
