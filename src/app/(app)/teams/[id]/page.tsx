"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { TeamDetail } from "@/components/teams/team-detail";
import { getTeamRequest } from "@/actions/team.actions";
import { authClient } from "@/lib/auth-client";
import type { TeamRequest } from "@/types/team.types";

/** Loading skeleton for the team detail page. */
function TeamDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="flex items-start gap-4">
        <div className="size-14 animate-pulse rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-48 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

/**
 * Team detail page — full-width layout (no PageLayout sidebars).
 * Loads the team request by ID and renders the full TeamDetail view.
 */
export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id ?? null;

  const [team, setTeam] = useState<TeamRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTeam() {
      try {
        const result = await getTeamRequest(teamId);
        if (!cancelled) {
          if (result.success && result.data) {
            const data = result.data as { data?: TeamRequest } | TeamRequest;
            const teamData =
              "data" in data && data.data ? data.data : (data as TeamRequest);
            setTeam(teamData);
          } else {
            setError(result.message || "Team request not found.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load team.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTeam();
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (loading) {
    return <TeamDetailSkeleton />;
  }

  if (error || !team) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <AlertCircle className="mx-auto size-12 text-destructive/50" />
        <p className="mt-4 text-lg font-medium text-foreground">
          {error || "Team request not found."}
        </p>
        <Link
          href="/teams"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-outline bg-success/2 px-4 py-2 text-sm font-medium text-success/90 transition-colors hover:bg-success/5"
        >
          <ArrowLeft className="size-4" />
          Back to Teams
        </Link>
      </div>
    );
  }

  return <TeamDetail team={team} currentUserId={currentUserId} />;
}
