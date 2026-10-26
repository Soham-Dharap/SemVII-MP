"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GitHubComingSoonDialog({
  open,
  onOpenChange,
}: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-zinc-900">
            <Image src="/github.svg" alt="GitHub" width={22} height={22} />
          </div>
          <DialogTitle>GitHub import</DialogTitle>
          <DialogDescription>
            Cloning a repository straight into Codepilot is being built for the
            Version 2 release. In the meantime you can create a project from a
            template and bring your code over manually.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-3 text-sm text-blue-800">
          <Sparkles className="size-4 shrink-0 text-blue-600" />
          Planned for Version 2 — repository sync, branch awareness and
          one-click pull requests.
        </div>

        <DialogFooter>
          <Button variant="brand" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
