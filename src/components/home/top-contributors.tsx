"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeaderboard } from "@/actions/gamification.actions";

interface LeaderboardEntry {
  rank: number;
  user: { id: string; name: string; image?: string | null } | null;
  totalPoints: number;
}

/** Loading skeleton for a single contributor card. */
function ContributorCardSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      <div className="size-7 rounded-full bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
    </div>
  );
}

/** Top contributors section — fetches top 3 users by reputation. */
export function TopContributors() {
  const [contributors, setContributors] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchLeaderboard() {
      try {
        const result = await getLeaderboard(1, 3);
        if (!cancelled && result.success && result.data) {
          const data = result.data as { data: LeaderboardEntry[] };
          setContributors(data.data ?? []);
        }
      } catch {
        // Empty state handled by checking contributors.length
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLeaderboard();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Top Contributors
        </h2>
        <Link
          href="/leaderboard"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      {/* ── Loading skeletons ─────────────────────────────────────── */}
      {loading && (
        <div className="space-y-2">
          <ContributorCardSkeleton />
          <ContributorCardSkeleton />
          <ContributorCardSkeleton />
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {!loading && contributors.length === 0 && (
        <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
          No contributors yet.
        </p>
      )}

      {/* ── Contributor cards ─────────────────────────────────────── */}
      {!loading && contributors.length > 0 && (
        <div className="space-y-2">
          {contributors.map((contributor) => (
            <div
              key={contributor.user?.id ?? contributor.rank}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 ring-1 ring-foreground/10"
            >
              {/* Rank */}
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {contributor.rank}
              </span>
              {/* Name */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-foreground">
                  {contributor.user?.name ?? "Unknown"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {contributor.totalPoints} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
