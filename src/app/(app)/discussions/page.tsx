import type { Metadata } from "next";
import { Suspense } from "react";
import { discussionService } from "@/services/discussion.service";

export const metadata: Metadata = {
  title: "Discussions | Smart NUB Campus",
  description:
    "Join academic discussions, share ideas and collaborate with fellow NSU students.",
  openGraph: {
    title: "Discussions | Smart NUB Campus",
    description: "Academic discussions at North South University.",
    type: "website",
  },
};
import { DiscussionsClient } from "@/components/discussions/discussions-client";
import { PageLayout } from "@/components/layout/page-layout";
import type {
  Discussion,
  DiscussionCategory,
} from "@/types/discussion.types";
import type { PaginationMeta } from "@/types/resource.types";
import type { TopContributor } from "@/components/discussions/discussions-trending";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** Page loading skeleton. */
function PageSkeleton() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border bg-card p-4 ring-1 ring-foreground/10"
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

/**
 * Discussions list page — Server Component.
 * Fetches categories, trending discussions, popular tags, top contributors,
 * and the initial discussion list, then renders the interactive DiscussionsClient.
 */
export default async function DiscussionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;
  const search = typeof params.search === "string" ? params.search : undefined;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const tagSlug = typeof params.tag === "string" ? params.tag : undefined;
  const sort = typeof params.sort === "string" ? (params.sort as "latest" | "popular" | "unanswered") : "latest";
  const tab = typeof params.tab === "string" ? params.tab : "all";

  let initialDiscussions: Discussion[] = [];
  let initialMeta: PaginationMeta | null = null;
  let categories: (DiscussionCategory & { _count: { discussions: number } })[] | null = [];
  let trending: Discussion[] = [];
  let popularTags: { id: string; name: string; slug: string }[] = [];
  let contributors: TopContributor[] = [];

  try {
    const [categoriesResult, tagsResult, trendingResult, contributorsResult] = await Promise.all([
      discussionService.listCategories(),
      discussionService.listTags(),
      discussionService.getTrending(3),
      discussionService.getTopContributors(5),
    ]);

    categories = (categoriesResult as unknown as (DiscussionCategory & { _count: { discussions: number } })[]) ?? [];
    popularTags = (tagsResult as unknown as { id: string; name: string; slug: string; _count: { discussionTags: number } }[])
      .map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        count: t._count?.discussionTags ?? 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 16)
      .map(({ id, name, slug }) => ({ id, name, slug }));
    trending = (trendingResult as unknown as Discussion[]) ?? [];
    contributors = (contributorsResult as unknown as TopContributor[]) ?? [];

    // Initial list fetch (only for the "all" tab on the server).
    if (tab === "all") {
      const listResult = await discussionService.listDiscussions({
        page,
        limit: 12,
        search,
        category: categorySlug,
        tag: tagSlug,
        sort,
      });
      initialDiscussions = listResult.discussions ?? [];
      initialMeta = listResult.meta ?? null;
    }
  } catch {
    // Client component handles empty state gracefully
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <DiscussionsClient
        initialDiscussions={initialDiscussions}
        initialMeta={initialMeta}
        categories={categories}
        trendingDiscussions={trending}
        popularTags={popularTags}
        contributors={contributors}
      />
    </Suspense>
  );
}
