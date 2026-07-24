import type { Metadata } from "next";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getTeamRequest } from "@/actions/team.actions";
import { TeamDetailWrapper } from "@/components/teams/team-detail-wrapper";
import type { TeamRequest } from "@/types/team.types";

export const metadata: Metadata = {
  title: "Team Details | Smart NUB Campus",
  description: "View team details and apply to join at Smart NUB Campus.",
};

/**
 * Team detail page — Server Component.
 * Fetches team data server-side and passes to client wrapper for interactivity.
 */
export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let team: TeamRequest | null = null;
  let error: string | null = null;

  try {
    const result = await getTeamRequest(id);
    if (result.success && result.data) {
      const data = result.data as { data?: TeamRequest } | TeamRequest;
      team = "data" in data && data.data ? data.data : (data as TeamRequest);
    } else {
      error = result.message || "Team request not found.";
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load team.";
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

  return <TeamDetailWrapper team={team} />;
}
