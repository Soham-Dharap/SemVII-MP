import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-3.5 w-24 rounded-full" />
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-full" />
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-10 w-40 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-5 py-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/70"
          >
            <Skeleton className="size-4 rounded" />
            <Skeleton className="hidden h-3 w-16 rounded-full sm:block" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-48 rounded-full" />
              <Skeleton className="h-3 w-72 max-w-full rounded-full" />
            </div>
            <Skeleton className="hidden h-3 w-20 rounded-full md:block" />
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
