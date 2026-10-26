"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FileNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  initialValue: string;
  onSubmit: (name: string) => Promise<void> | void;
}

function FileNameForm({
  initialValue,
  confirmLabel,
  onSubmit,
  onCancel,
}: {
  initialValue: string;
  confirmLabel: string;
  onSubmit: (name: string) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    await onSubmit(trimmed);
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="space-y-2 py-2">
        <Label htmlFor="file-name">Name</Label>
        <Input
          id="file-name"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              await handleSubmit();
            }
            if (event.key === "Escape") onCancel();
          }}
          placeholder="e.g. src/components/Button.jsx"
          className="font-mono text-sm"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="brand"
          onClick={handleSubmit}
          disabled={!name.trim() || isSubmitting}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </>
  );
}

const FileNameDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  initialValue,
  onSubmit,
}: FileNameDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Keying remounts the form so state initializes from the target. */}
        <FileNameForm
          key={`${title}-${initialValue}`}
          initialValue={initialValue}
          confirmLabel={confirmLabel}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FileNameDialog;
