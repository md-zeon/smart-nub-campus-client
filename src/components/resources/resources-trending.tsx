"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Tag, Users, FileText, ChevronRight } from "lucide-react";
import { listResources } from "@/actions/resource.actions";
import { getLeaderboard } from "@/actions/gamification.actions";
import type { Resource } from "@/types/resource.types";

interface LeaderboardEntry {
  rank: number;
  user: { id: string; name: string; image?: string | null } | null;
  totalPoints: number;
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse rounded-lg bg-muted/50 p-2">
          <div className="size-8 rounded bg-muted" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="h-2.5 w-1/2 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ResourcesTrendingProps {
  onTagClick?: (tag: string) => void;
}

export function ResourcesTrending({ onTagClick }: ResourcesTrendingProps) {
  const [trending, setTrending] = useState<Resource[]>([]);
  const [contributors, setContributors] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [resourcesResult, leaderboardResult] = await Promise.all([
          listResources({ sort: "popular", limit: 3 }),
          getLeaderboard(1, 5),
        ]);

        if (!cancelled) {
          if (resourcesResult.success && resourcesResult.data) {
            const data = resourcesResult.data as { data?: Resource[] };
            setTrending(data.data ?? []);
          }
          if (leaderboardResult.success && leaderboardResult.data) {
            const data = leaderboardResult.data as { data?: LeaderboardEntry[] };
            setContributors(data.data ?? []);
          }
        }
      } catch {
        // Empty state handled by checking array lengths
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Collect unique tags from trending resources
  const trendingTags = Array.from(
    new Map(
      trending
        .flatMap((r) => r.resourceTags ?? [])
        .filter((rt) => rt.tag)
        .map((rt) => [rt.tag!.id, rt.tag!])
    ).values()
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* ── Trending Resources ───────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Trending Resources</h3>
        </div>
        {loading ? (
          <SidebarSkeleton />
        ) : trending.length > 0 ? (
          <div className="space-y-2">
            {trending.map((resource, idx) => (
              <Link
                key={resource.id}
                href={`/resources/${resource.id}`}
                className="flex items-start gap-3 rounded-lg border bg-card p-2.5 ring-1 ring-foreground/10 transition-all hover:shadow-sm"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-xs font-medium text-foreground">
                    {resource.title}
                  </h4>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {resource.upvoteCount} upvotes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border bg-card p-3 text-center text-xs text-muted-foreground ring-1 ring-foreground/10">
            No trending resources yet.
          </p>
        )}
      </div>

      {/* ── Popular Tags ─────────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Tag className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {trendingTags.length > 0 ? (
            trendingTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagClick?.(tag.slug)}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {tag.name}
              </button>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No tags yet.</p>
          )}
        </div>
      </div>

      {/* ── Top Contributors ──────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Top Contributors</h3>
        </div>
        {loading ? (
          <SidebarSkeleton />
        ) : contributors.length > 0 ? (
          <div className="space-y-1.5">
            {contributors.map((entry) => (
              <div
                key={entry.user?.id ?? entry.rank}
                className="flex items-center gap-2.5 rounded-lg bg-card p-2 ring-1 ring-foreground/10"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {entry.rank}
                </span>
                {entry.user?.image ? (
                  <img
                    src={entry.user.image}
                    alt={entry.user.name}
                    className="size-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                    {entry.user?.name?.charAt(0) ?? "?"}
                  </div>
                )}
                <span className="truncate text-xs font-medium text-foreground">
                  {entry.user?.name ?? "Unknown"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border bg-card p-3 text-center text-xs text-muted-foreground ring-1 ring-foreground/10">
            No contributors yet.
          </p>
        )}
      </div>

      {/* ── Request Resource ──────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Need something?</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Can&apos;t find what you need? Request it from the community.
        </p>
        <Link
          href="/resources/upload"
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-success bg-success/2 px-2.5 py-1.5 text-xs font-medium text-success/90 transition-colors hover:bg-success/5"
        >
          Request Resource
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
