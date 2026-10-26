import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8">
      <div className="mb-9 space-y-3">
        <Skeleton className="h-3.5 w-24 rounded-full" />
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
