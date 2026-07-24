import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton matching UserProfile layout.
 * Shows cover area, avatar, name, bio, and stats.
 */
export function UserProfileSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Cover + avatar area */}
      <div className="relative rounded-xl border bg-card ring-1 ring-foreground/10">
        <Skeleton className="h-32 w-full rounded-t-xl" />
        <div className="-mt-10 px-6 pb-6">
          <Skeleton className="size-20 rounded-full border-4 border-card" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-20" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
