import { Skeleton } from "@/components/ui/skeleton";

export default function SignInLoading() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-5 lg:hidden">
        <Skeleton className="size-[52px] rounded-2xl" />
      </div>
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-56 rounded-xl" />
        <Skeleton className="h-4 w-72 max-w-full rounded-full" />
      </div>
      <div className="grid gap-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="mx-auto mt-4 h-3 w-40 rounded-full" />
        <Skeleton className="mx-auto mt-2 h-3 w-64 max-w-full rounded-full" />
      </div>
    </div>
  );
}
