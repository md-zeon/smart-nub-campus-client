import { Suspense } from "react";
import { resourceService } from "@/services/resource.service";
import { ResourcesClient } from "@/components/resources/resources-client";
import { PageLayout } from "@/components/layout/page-layout";
import type {
  Resource,
  ResourceCategory,
  PaginationMeta,
} from "@/types/resource.types";

interface CourseWithCount {
  id: string;
  code: string;
  name: string;
  department: string;
  _count: { resources: number };
}

/** Page loading skeleton. */
function PageSkeleton() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border bg-card p-4 ring-1 ring-foreground/10"
            >
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
 * Reads URL search params for initial filters, fetches data on the server.
 */
export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;
  const search = typeof params.search === "string" ? params.search : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  let initialResources: Resource[] = [];
  let initialMeta: PaginationMeta | null = null;
  let categories: (ResourceCategory & { _count: { resources: number } })[] = [];
  let courses: CourseWithCount[] = [];

  try {
    const [resourcesResult, categoriesResult, coursesResult] = await Promise.all([
      resourceService.listResources({ page, limit: 12, search, categoryId: category, tag, sort: sort as "newest" | "popular" | "downloads" }),
      resourceService.listCategories(),
      resourceService.listCourses(),
    ]);

    initialResources = resourcesResult.data ?? [];
    initialMeta = resourcesResult.meta ?? null;
    categories = (categoriesResult as unknown as (ResourceCategory & { _count: { resources: number } })[]) ?? [];
    courses = (coursesResult as unknown as CourseWithCount[]) ?? [];
  } catch {
    // Client component handles empty state gracefully
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ResourcesClient
        initialResources={initialResources}
        initialMeta={initialMeta}
        categories={categories}
        courses={courses}
        initialFilters={{ search: search ?? "", category: category ?? null, tag: tag ?? null, sort }}
      />
    </Suspense>
  );
}
