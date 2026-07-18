import Link from "next/link";
import type { Leaderboard } from "@/types/gamification.types";

interface TopContributorsProps {
  contributors: Leaderboard[];
}

/** Top contributors section — renders top users by reputation (server-fetched). */
export function TopContributors({ contributors }: TopContributorsProps) {
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

      {/* ── Empty state ───────────────────────────────────────────── */}
      {contributors.length === 0 && (
        <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
          No contributors yet.
        </p>
      )}

      {/* ── Contributor cards ─────────────────────────────────────── */}
      {contributors.length > 0 && (
        <div className="space-y-2">
          {contributors.map((contributor) => (
            <div
              key={contributor.userId}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 ring-1 ring-foreground/10"
            >
              {/* Rank */}
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {contributor.rank}
              </span>
              {/* Name */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-foreground">
                  {contributor.name ?? "Unknown"}
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
