"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const comingSoon = () =>
  toast.info("Legal pages arrive with Version 2 — check back soon.");

const GoogleIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M21.35 12.27c0-.73-.06-1.43-.18-2.09H12v3.95h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.25Z"
    />
    <path
      fill="#34A853"
      d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.5Z"
    />
    <path
      fill="#FBBC05"
      d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.88H3.29A9.5 9.5 0 0 0 2.5 12c0 1.48.35 2.88.79 4.12l3.25-2.53Z"
    />
    <path
      fill="#EA4335"
      d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.25 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1.01.08 1.54 1.07 1.54 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 7.17c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.6c0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const SignInFormClient = () => {
  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() =>
          signIn("google", undefined, { prompt: "select_account" })
        }
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-[15px] font-medium shadow-sm transition-all hover:-translate-y-px hover:border-iris/40 hover:shadow-md active:translate-y-0"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => signIn("github")}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-foreground px-4 text-[15px] font-medium text-background shadow-sm transition-all hover:-translate-y-px hover:opacity-90 active:translate-y-0"
      >
        <GithubIcon />
        Continue with GitHub
      </button>

      <div className="flex items-center gap-4 py-4">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
          Secure OAuth
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm leading-6 text-muted-foreground">
        By continuing you agree to our{" "}
        <button
          type="button"
          onClick={comingSoon}
          className="underline underline-offset-2 hover:text-foreground"
        >
          Terms
        </button>{" "}
        and{" "}
        <button
          type="button"
          onClick={comingSoon}
          className="underline underline-offset-2 hover:text-foreground"
        >
          Privacy Policy
        </button>
        .
      </p>
    </div>
  );
};

export default SignInFormClient;
