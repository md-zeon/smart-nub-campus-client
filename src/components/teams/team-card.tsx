"use client";

import Link from "next/link";
import { Users, CalendarClock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAM_STATUS_BADGE } from "@/constants/team";
import { formatRelativeTime } from "@/components/resources/file-type-utils";
import type { TeamRequest } from "@/types/team.types";

interface TeamCardProps {
  team: TeamRequest;
  /** Whether the current user is the creator of this request. */
  isAuthor?: boolean;
  /** Whether the current user is a member of this team. */
  isMember?: boolean;
  /** Primary action button: "View" navigates; "Apply" triggers apply flow. */
  onApply?: (team: TeamRequest) => void;
}

/** Formats a deadline as relative ("in 5 days") or absolute date. */
function formatDeadline(deadline?: string | null): string {
  if (!deadline) return "No deadline";
  const date = new Date(deadline);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDay < 0) return "Deadline passed";
  if (diffDay === 0) return "Due today";
  if (diffDay <= 30) return `in ${diffDay} days`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Team request card shown in the finder list.
 * Displays title, project, truncated description, skill chips, author, member count,
 * deadline, and status. Includes View and Apply actions.
 */
export function TeamCard({ team, isAuthor, isMember, onApply }: TeamCardProps) {
  const statusBadge = TEAM_STATUS_BADGE[team.status];
  const canApply = team.status === "OPEN" && !isAuthor && !isMember;

  return (
    <div className="flex flex-col rounded-xl border bg-card p-4 ring-1 ring-foreground/10 transition-all hover:shadow-md">
      {/* ── Header: title + project ─────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/teams/${team.id}`}
            className="line-clamp-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            {team.title}
          </Link>
          {team.projectName && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {team.projectName}
            </p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            statusBadge.className,
          )}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* ── Description (truncated) ─────────────────────────────── */}
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
        {team.description}
      </p>

      {/* ── Skills ──────────────────────────────────────────────── */}
      {team.teamRequestSkills && team.teamRequestSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {team.teamRequestSkills.slice(0, 5).map((skill) => (
            <span
              key={skill.id}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {skill.tag?.name}
            </span>
          ))}
          {team.teamRequestSkills.length > 5 && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              +{team.teamRequestSkills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* ── Footer: author + meta + actions ─────────────────────── */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          {team.creator?.image ? (
            <img
              src={team.creator.image}
              alt={team.creator.name}
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {team.creator?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <span className="truncate text-xs text-muted-foreground">
            {team.creator?.name ?? "Unknown"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {team.currentMemberCount}/{team.lookingForCount + team.currentMemberCount}
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock className="size-3.5" />
            {formatDeadline(team.deadline)}
          </span>
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/teams/${team.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          View
          <ArrowRight className="size-3.5" />
        </Link>
        {canApply && (
          <button
            onClick={() => onApply?.(team)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand/90"
          >
            Apply
          </button>
        )}
      </div>

      {/* ── Created date ────────────────────────────────────────── */}
      <p className="mt-2 text-[10px] text-muted-foreground">
        Posted {formatRelativeTime(team.createdAt)}
      </p>
    </div>
  );
}
