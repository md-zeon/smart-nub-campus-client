"use client";

import Link from "next/link";
import {
  MessageCircle,
  Eye,
  Pin,
  Lock,
  CheckCircle,
  ChevronUp,
  Bookmark,
} from "lucide-react";
import type { Discussion } from "@/types/discussion.types";
import { formatRelativeTime } from "@/components/resources/file-type-utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

/** Color classes per discussion category slug. */
const CATEGORY_COLORS: Record<string, string> = {
  academics: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  programming: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  projects: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  career: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  events: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  general: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  internships: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  research: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function categoryColor(slug?: string): string {
  return (slug && CATEGORY_COLORS[slug]) || CATEGORY_COLORS.general;
}

interface DiscussionCardProps {
  discussion: Discussion;
  onVote?: (disussionId: string, currentVote: Discussion["userVote"]) => void;
  onBookmark?: (disussionId: string, currentBookmarked: boolean) => void;
}

/**
 * Thread card showing title, category badge, author, time, reply/view counts,
 * status indicators (pinned/locked/solved), tags, and vote/bookmark actions.
 * Pinned discussions render with a 📌 indicator. Clicking navigates to detail.
 */
export function DiscussionCard({
  discussion,
  onVote,
  onBookmark,
}: DiscussionCardProps) {
  const upvoted = discussion.userVote === "UP";
  const bookmarked = discussion.isBookmarked ?? false;
  const stop = (e: React.MouseEvent) => e.preventDefault();

  const tags = discussion.discussionTags ?? [];

  return (
    <Link
      href={`/discussions/${discussion.id}`}
      className="group block rounded-xl border bg-card p-4 ring-1 ring-foreground/10 transition-all hover:shadow-md"
    >
      {/* ── Header: pinned + title + status ───────────────────────── */}
      <div className="flex items-start gap-2">
        {discussion.isPinned && (
          <Pin className="mt-0.5 size-4 shrink-0 text-primary" aria-label="Pinned" />
        )}
        <h3 className="flex-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {discussion.isPinned && <span className="mr-1">📌</span>}
          {discussion.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          {discussion.isLocked && (
            <Lock className="size-3.5 text-muted-foreground" aria-label="Locked" />
          )}
          {discussion.isSolved && (
            <CheckCircle
              className="size-3.5 text-success"
              aria-label="Solved"
            />
          )}
        </div>
      </div>

      {/* ── Category badge + author + meta ───────────────────────── */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {discussion.category && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              categoryColor(discussion.category.slug),
            )}
          >
            {discussion.category.name}
          </span>
        )}
        {discussion.course && (
          <span className="text-[10px] text-muted-foreground">
            {discussion.course.code}
          </span>
        )}
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {discussion.author?.image ? (
            <Image
              src={discussion.author.image}
              alt={discussion.author.name ?? "Author"}
              width={16}
              height={16}
              unoptimized
              className="size-4 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-4 items-center justify-center rounded-full bg-muted text-[8px] font-medium">
              {discussion.author?.name?.charAt(0) ?? "?"}
            </span>
          )}
          {discussion.author?.name ?? "Unknown"}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {formatRelativeTime(discussion.createdAt)}
        </span>
      </div>

      {/* ── Tags (max 3) ─────────────────────────────────────────── */}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((dt) => (
            <span
              key={dt.id}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
            >
              {dt.tag?.name}
            </span>
          ))}
        </div>
      )}

      {/* ── Footer: counts + actions ─────────────────────────────── */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {discussion.replyCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {discussion.viewCount}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
            {discussion.visibility}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onVote && (
            <button
              onClick={(e) => {
                stop(e);
                onVote(discussion.id, discussion.userVote);
              }}
              className={cn(
                "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors",
                upvoted
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="Upvote"
            >
              <ChevronUp className="size-3.5" />
              {discussion.upvoteCount}
            </button>
          )}
          {onBookmark && (
            <button
              onClick={(e) => {
                stop(e);
                onBookmark(discussion.id, bookmarked);
              }}
              className={cn(
                "flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors",
                bookmarked
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="Bookmark"
            >
              <Bookmark className={cn("size-3.5", bookmarked && "fill-current")} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
