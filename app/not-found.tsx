import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <BrandMark size={56} />
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <Compass className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">
          Page not found
        </h1>
        <p className="max-w-sm text-[15px] leading-7 text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button variant="brand" size="lg" className="rounded-full px-6">
            Go to dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg" className="rounded-full px-6">
            Back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
