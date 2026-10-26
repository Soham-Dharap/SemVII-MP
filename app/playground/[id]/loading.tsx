import { Skeleton } from "@/components/ui/skeleton";

export default function PlaygroundLoading() {
  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="flex min-h-0 flex-1 gap-3">
        <Skeleton className="h-full w-1/5 rounded-xl" />
        <Skeleton className="h-full flex-1 rounded-xl" />
        <Skeleton className="h-full w-[30%] rounded-xl" />
      </div>
    </div>
  );
}
