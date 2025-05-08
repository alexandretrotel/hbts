import { Skeleton } from "@/components/ui/skeleton";

export function HabitSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-16" />
      </div>

      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 30 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-sm" />
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
