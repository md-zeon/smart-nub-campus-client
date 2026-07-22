import type { Metadata } from "next";
import { Suspense } from "react";
import { eventService } from "@/services/event.service";
import { PageLayout } from "@/components/layout/page-layout";
import { EventsListClient } from "@/components/events/events-list-client";
import type { Event } from "@/types/event.types";
import type { PaginationMeta } from "@/types/resource.types";

export const metadata: Metadata = {
  title: "Events | Smart NUB Campus",
  description:
    "Browse upcoming campus events at North South University — workshops, seminars, and more.",
  openGraph: {
    title: "Events | Smart NUB Campus",
    description: "Browse upcoming campus events at NSU.",
    type: "website",
  },
};

function PageSkeleton() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border bg-card p-4 ring-1 ring-foreground/10"
            >
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;

  let events: Event[] = [];
  let meta: PaginationMeta | null = null;

  try {
    const result = await eventService.listEvents({
      page,
      limit: 12,
      search,
      status: status as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED" | undefined,
    });
    events = result.data ?? [];
    meta = result.meta ?? null;
  } catch {
    // Client component handles empty state gracefully
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <EventsListClient
        initialEvents={events}
        initialMeta={meta}
        initialFilters={{ search: search ?? "", status: status ?? null, page }}
      />
    </Suspense>
  );
}
