import { Suspense } from "react";
import { resourceService } from "@/services/resource.service";
import { ResourcesClient } from "@/components/resources/resources-client";
import { PageLayout } from "@/components/layout/page-layout";
import type { Resource, ResourceCategory, PaginationMeta } from "@/types/resource.types";

/** Page loading skeleton. */
function PageSkeleton() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

/**
 * Resources list page — Server Component.
 * Fetches initial data on the server, passes to client component for interactivity.
 */
export default async function ResourcesPage() {
  let initialResources: Resource[] = [];
  let initialMeta: PaginationMeta | null = null;
  let categories: ResourceCategory[] = [];

  try {
    const [resourcesResult, categoriesResult] = await Promise.all([
      resourceService.listResources({ limit: 12 }),
      resourceService.listResources({ limit: 100 }),
    ]);

    initialResources = resourcesResult.data ?? [];
    initialMeta = resourcesResult.meta ?? null;

    const allResources = categoriesResult.data ?? [];
    const catMap = new Map<string, ResourceCategory & { _count: number }>();
    for (const r of allResources) {
      if (r.category) {
        const existing = catMap.get(r.category.id);
        if (existing) {
          existing._count += 1;
        } else {
          catMap.set(r.category.id, { ...r.category, _count: 1 });
        }
      }
    }
    categories = Array.from(catMap.values());
  } catch {
    // Client component handles empty state gracefully
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ResourcesClient
        initialResources={initialResources}
        initialMeta={initialMeta}
        categories={categories}
      />
    </Suspense>
  );
}
