import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function PlaygroundNotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Project not found
        </h1>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          The project you are looking for does not exist, or you do not have
          access to it.
        </p>
      </div>
      <Link href="/dashboard">
        <Button variant="brand" size="lg" className="rounded-full px-6">
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}
