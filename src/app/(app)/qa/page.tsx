import { Suspense } from "react";
import { qaService } from "@/services/qa.service";
import { QAClient } from "@/components/qa/qa-client";
import { PageLayout } from "@/components/layout/page-layout";
import type { Question, QuestionCategory } from "@/types/qa.types";
import type { PaginationMeta } from "@/types/resource.types";
import type { TopContributor } from "@/components/qa/qa-trending";

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
              className="h-28 animate-pulse rounded-xl border bg-card p-4 ring-1 ring-foreground/10"
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

/**
 * Q&A list page — Server Component.
 * Fetches categories, trending questions, popular tags, top contributors,
 * and the initial question list, then renders the interactive QAClient.
 */
export default async function QAPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;
  const search = typeof params.search === "string" ? params.search : undefined;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const tagSlug = typeof params.tag === "string" ? params.tag : undefined;
  const sort = typeof params.sort === "string" ? (params.sort as "latest" | "trending" | "most_answered" | "unanswered") : "latest";
  const tab = typeof params.tab === "string" ? params.tab : "all";

  let initialQuestions: Question[] = [];
  let initialMeta: PaginationMeta | null = null;
  let categories: (QuestionCategory & { _count: { questions: number } })[] = [];
  let trendingQuestions: Question[] = [];
  let popularTags: { id: string; name: string; slug: string }[] = [];
  let contributors: TopContributor[] = [];

  try {
    const [categoriesResult, tagsResult, contributorsResult, trendingResult] = await Promise.all([
      qaService.listCategories(),
      qaService.listTags(),
      qaService.getTopContributors(5),
      qaService.getTrending(5),
    ]);

    categories = (categoriesResult as unknown as (QuestionCategory & { _count: { questions: number } })[]) ?? [];
    popularTags = (tagsResult as unknown as { id: string; name: string; slug: string; _count: { questionTags: number } }[])
      .map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        count: t._count?.questionTags ?? 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 16)
      .map(({ id, name, slug }) => ({ id, name, slug }));
    contributors = (contributorsResult as unknown as TopContributor[]) ?? [];
    trendingQuestions = (trendingResult as unknown as Question[]) ?? [];

    // Initial list fetch (server-side for the "all" tab).
    if (tab === "all") {
      const listResult = await qaService.listQuestions({
        page,
        limit: 12,
        search,
        category: categorySlug,
        tag: tagSlug,
        sort,
        answered: null,
      });
      initialQuestions = listResult.data ?? [];
      initialMeta = listResult.meta ?? null;
    }
  } catch {
    // Client component handles empty state gracefully
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <QAClient
        initialQuestions={initialQuestions}
        initialMeta={initialMeta}
        categories={categories}
        trendingQuestions={trendingQuestions}
        popularTags={popularTags}
        contributors={contributors}
      />
    </Suspense>
  );
}
