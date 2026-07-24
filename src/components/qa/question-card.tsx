"use client";

import Link from "next/link";
import { MessageCircle, Eye, CheckCircle } from "lucide-react";
import type { Question } from "@/types/qa.types";
import { VoteButtons, type VoteState } from "@/components/qa/vote-buttons";
import { formatRelativeTime } from "@/components/resources/file-type-utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

/** Color classes per question category slug. */
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

interface QuestionCardProps {
  question: Question;
  onVote: (questionId: string, currentVote: VoteState) => void;
  onBookmark: (questionId: string, currentBookmarked: boolean) => void;
}

/**
 * Q&A question card with a prominent vote control on the left column.
 * Shows title, answer/view counts, tags, author, and relative time.
 * The answer count is highlighted with a ✅ when an accepted answer exists.
 */
export function QuestionCard({
  question,
  onVote,
  onBookmark,
}: QuestionCardProps) {
  const upvoted = question.userVote === "UP";
  const bookmarked = question.isBookmarked ?? false;
  const tags = question.questionTags ?? [];
  const canVote = question.authorId !== undefined;

  return (
    <div className="flex gap-3 rounded-xl border bg-card p-4 ring-1 ring-foreground/10 transition-all hover:shadow-md">
      {/* ── Left: vote control (prominent) ─────────────────────── */}
      <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
        <VoteButtons
          voteCount={question.upvoteCount}
          userVote={(question.userVote ?? null) as VoteState}
          onVote={() => onVote(question.id, (question.userVote ?? null) as VoteState)}
          orientation="vertical"
          disabled={!canVote}
        />
      </div>

      {/* ── Right: content ─────────────────────────────────────── */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/qa/${question.id}`}
            className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            {question.title}
          </Link>
          <button
            onClick={() => onBookmark(question.id, bookmarked)}
            aria-label="Bookmark"
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors",
              bookmarked
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {bookmarked ? "★" : "☆"}
          </button>
        </div>

        {/* Category + meta */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {question.category && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                categoryColor(question.category.slug),
              )}
            >
              {question.category.name}
            </span>
          )}
          {question.course && (
            <span className="text-[10px] text-muted-foreground">
              {question.course.code}
            </span>
          )}
          {question.author && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {question.author.image ? (
                <Image
                  src={question.author.image}
                  alt={question.author.name ?? "Author"}
                  width={16}
                  height={16}
                  unoptimized
                  className="size-4 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-4 items-center justify-center rounded-full bg-muted text-[8px] font-medium">
                  {question.author.name?.charAt(0) ?? "?"}
                </span>
              )}
              {question.author.name ?? "Unknown"}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">
            {formatRelativeTime(question.createdAt)}
          </span>
        </div>

        {/* Tags (max 4) */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((qt) => (
              <Link
                key={qt.id}
                href={`/qa?tag=${qt.tag?.slug ?? ""}`}
                className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {qt.tag?.name}
              </Link>
            ))}
          </div>
        )}

        {/* Footer: counts */}
        <div className="mt-3 flex items-center gap-3 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
          <span
            className={cn(
              "flex items-center gap-1",
              question.isAnswered && "font-semibold text-success",
            )}
          >
            <MessageCircle className="size-3.5" />
            {question.answerCount} answers
            {question.isAnswered && <CheckCircle className="size-3.5 text-success" />}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {question.viewCount} views
          </span>
          {upvoted && <span className="text-primary">voted</span>}
        </div>
      </div>
    </div>
  );
}
