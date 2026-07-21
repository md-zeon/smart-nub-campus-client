"use client";

import { CheckCircle } from "lucide-react";
import type { Answer } from "@/types/qa.types";
import { VoteButtons, type VoteState } from "@/components/qa/vote-buttons";
import { formatRelativeTime } from "@/components/resources/file-type-utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AnswerCardProps {
  answer: Answer;
  isQuestionAuthor: boolean;
  onVote: (answerId: string, currentVote: VoteState) => void;
  onAccept: (answerId: string) => void;
}

/**
 * Single answer card with a vote control, rendered content, author info,
 * and an accept button (visible only to the question author).
 * Accepted answers are highlighted with a ✅ badge.
 */
export function AnswerCard({
  answer,
  isQuestionAuthor,
  onVote,
  onAccept,
}: AnswerCardProps) {
  const userVote = (answer.userVote ?? null) as VoteState;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border bg-card p-4 ring-1 ring-foreground/10",
        answer.isAccepted && "border-success/40 bg-success/5",
      )}
    >
      {/* ── Vote control ──────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
        <VoteButtons
          voteCount={answer.upvoteCount}
          userVote={userVote}
          onVote={() => onVote(answer.id, userVote)}
          orientation="vertical"
        />
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="min-w-0 flex-1">
        {answer.isAccepted && (
          <div className="mb-2 flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            <CheckCircle className="size-3.5" />
            ACCEPTED ANSWER
          </div>
        )}

        <div className="prose prose-sm max-w-none dark:prose-invert">
          {answer.content}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
          {/* Author */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {answer.author?.image ? (
              <Image
                src={answer.author.image}
                alt={answer.author.name ?? "Author"}
                width={20}
                height={20}
                unoptimized
                className="size-5 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[8px] font-medium">
                {answer.author?.name?.charAt(0) ?? "?"}
              </span>
            )}
            <span className="text-foreground/80">{answer.author?.name ?? "Unknown"}</span>
            <span>·</span>
            <span>{formatRelativeTime(answer.createdAt)}</span>
          </div>

          {/* Accept button (question author only) */}
          {isQuestionAuthor && (
            <button
              onClick={() => onAccept(answer.id)}
              disabled={answer.isAccepted}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                answer.isAccepted
                  ? "cursor-default bg-success/10 text-success"
                  : "bg-muted text-muted-foreground hover:bg-success/10 hover:text-success",
              )}
            >
              {answer.isAccepted ? "Accepted" : "Accept Answer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
