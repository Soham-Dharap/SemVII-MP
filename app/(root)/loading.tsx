import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="px-6 pb-28 pt-40 sm:pt-48">
        <div className="mx-auto max-w-3xl text-center">
          <Skeleton className="mx-auto h-8 w-72 max-w-full rounded-full" />
          <Skeleton className="mx-auto mt-8 h-16 w-[28rem] max-w-full rounded-2xl" />
          <Skeleton className="mx-auto mt-4 h-16 w-96 max-w-full rounded-2xl" />
          <Skeleton className="mx-auto mt-7 h-5 w-[30rem] max-w-full rounded-full" />
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Skeleton className="h-12 w-52 rounded-full" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </section>

      {/* Template grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="mb-8 h-8 w-56 rounded-xl" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
