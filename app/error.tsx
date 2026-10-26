"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50">
        <TriangleAlert className="size-6 text-red-500" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">
          Something went wrong
        </h1>
        <p className="max-w-sm text-[15px] leading-7 text-muted-foreground">
          An unexpected error occurred. Your work is autosaved, so trying again
          is safe.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="brand" size="lg" className="rounded-full px-6" onClick={reset}>
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" size="lg" className="rounded-full px-6">
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
