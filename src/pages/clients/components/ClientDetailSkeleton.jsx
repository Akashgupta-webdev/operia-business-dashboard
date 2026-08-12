import { Skeleton } from "@/components/ui/skeleton";

export function ClientDetailSkeleton() {
  return (
    <div aria-label="Loading client profile" className="space-y-4">
      <Skeleton className="h-32 rounded-xl sm:h-28" />
      <Skeleton className="h-11 rounded-none" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
