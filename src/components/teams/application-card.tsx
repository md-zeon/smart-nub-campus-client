"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { APPLICATION_STATUS_BADGE } from "@/constants/team";
import { formatRelativeTime } from "@/components/resources/file-type-utils";
import type { TeamApplication } from "@/types/team.types";

interface ApplicationCardProps {
  application: TeamApplication;
  /** Whether the current user can review (author of the team request). */
  canReview?: boolean;
  onAccept?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  reviewing?: boolean;
}

/**
 * Single application row shown in the team detail's applications list.
 * Shows applicant info, message, status badge, and accept/reject actions (author only).
 */
export function ApplicationCard({
  application,
  canReview,
  onAccept,
  onReject,
  reviewing,
}: ApplicationCardProps) {
  const statusBadge = APPLICATION_STATUS_BADGE[application.status];
  const showActions = canReview && application.status === "PENDING";

  return (
    <div className="rounded-lg border bg-card p-3 ring-1 ring-foreground/10">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {application.applicant?.image ? (
            <Image
              src={application.applicant.image}
              alt={application.applicant.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {application.applicant?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {application.applicant?.name ?? "Unknown"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Applied {formatRelativeTime(application.createdAt)}
            </p>
          </div>
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

      {application.message && (
        <p className="mt-2 text-xs text-foreground/80">{application.message}</p>
      )}

      {showActions && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onAccept?.(application.id)}
            disabled={reviewing}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20 disabled:opacity-50"
          >
            <Check className="size-3.5" />
            Accept
          </button>
          <button
            onClick={() => onReject?.(application.id)}
            disabled={reviewing}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
          >
            <X className="size-3.5" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
