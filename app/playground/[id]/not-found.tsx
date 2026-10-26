import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function PlaygroundNotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-5 bg-[#f5f5f7] px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
        <FileQuestion className="size-6 text-zinc-500" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Project not found
        </h1>
        <p className="max-w-sm text-sm leading-6 text-zinc-500">
          The project you are looking for does not exist, or you do not have
          access to it.
        </p>
      </div>
      <Link href="/dashboard">
        <Button variant="brand" size="lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
