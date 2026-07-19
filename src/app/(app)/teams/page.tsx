import type { Metadata } from "next";
import { Suspense } from "react";
import { listTeamRequests } from "@/actions/team.actions";

export const metadata: Metadata = {
  title: "Teams | Smart NUB Campus",
  description:
    "Find teammates, join projects and collaborate on academic work at North South University.",
  openGraph: {
    title: "Teams | Smart NUB Campus",
    description: "Find teammates and collaborate at NSU.",
    type: "website",
  },
};
import { TeamsClient } from "@/components/teams/teams-client";
import { PageLayout } from "@/components/layout/page-layout";
import type {
  TeamRequest,
  TeamRequestListResponse,
} from "@/types/team.types";
import type { PaginationMeta } from "@/types/resource.types";

/** Loading skeleton for the Teams page. */
function PageSkeleton() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border bg-card p-4 ring-1 ring-foreground/10"
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

/**
 * Teams list page — Server Component.
 * Pre-fetches the initial list (excluding own requests) and suggested teams, then
 * renders the interactive TeamsClient inside PageLayout.
 */
export default async function TeamsPage() {
  let initialTeams: TeamRequest[] = [];
  let initialMeta: PaginationMeta | null = null;
  let suggested: TeamRequest[] = [];

  try {
    const [listResult, suggestedResult] = await Promise.all([
      listTeamRequests({ page: 1, limit: 12 }),
      listTeamRequests({ page: 1, limit: 3, status: "OPEN" }),
    ]);

    if (listResult.success && listResult.data) {
      const data = listResult.data as TeamRequestListResponse;
      initialTeams = data.data ?? [];
      initialMeta = data.meta ?? null;
    }
    if (suggestedResult.success && suggestedResult.data) {
      const data = suggestedResult.data as TeamRequestListResponse;
      suggested = data.data ?? [];
    }
  } catch {
    // Client component handles empty state gracefully
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <TeamsClient
        initialTeams={initialTeams}
        initialMeta={initialMeta}
        suggested={suggested}
      />
    </Suspense>
  );
}
