"use client";

import { useState } from "react";
import {
  ChevronUp,
  MessageCircleReply,
  Flag,
} from "lucide-react";
import type { DiscussionReply } from "@/types/discussion.types";
import { formatRelativeTime } from "@/components/resources/file-type-utils";
import { ReplyForm } from "@/components/discussions/reply-form";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ReplyCardProps {
  reply: DiscussionReply;
  isAuthor: boolean;
  isAdmin: boolean;
  onVote: (replyId: string, currentVote: DiscussionReply["userVote"]) => void;
  onReply: (parentId: string, content: string) => Promise<void>;
  onReport?: (replyId: string) => void;
  onDelete?: (replyId: string) => void;
}

/**
 * A single discussion reply with author, content, upvote, reply, and report.
 * Renders one level of nested replies (fetched on demand by the parent).
 */
export function ReplyCard({
  reply,
  isAuthor,
  isAdmin,
  onVote,
  onReply,
  onReport,
  onDelete,
}: ReplyCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const upvoted = reply.userVote === "UP";
  const nested = reply.replies ?? [];

  return (
    <div className="rounded-lg border bg-card p-3 ring-1 ring-foreground/10">
      {/* ── Header: avatar + name + time ──────────────────────── */}
      <div className="flex items-center gap-2">
        {reply.author?.image ? (
          <Image
            src={reply.author.image}
            alt={reply.author.name ?? "Author"}
            width={28}
            height={28}
            unoptimized
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
            {reply.author?.name?.charAt(0) ?? "?"}
          </div>
        )}
        <span className="truncate text-sm font-medium text-foreground">
          {reply.author?.name ?? "Unknown"}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {formatRelativeTime(reply.createdAt)}
        </span>
        {isAuthor && (
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
            Author
          </span>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">
        {reply.content}
      </p>

      {/* ── Actions ───────────────────────────────────────────── */}
      <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
        <button
          onClick={() => onVote(reply.id, reply.userVote)}
          className={cn(
            "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors",
            upvoted ? "bg-primary/10 text-primary" : "hover:bg-muted",
          )}
          aria-label="Upvote reply"
        >
          <ChevronUp className="size-3.5" />
          {reply.upvoteCount}
        </button>
        <button
          onClick={() => setShowReplyForm((v) => !v)}
          className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          <MessageCircleReply className="size-3.5" />
          Reply
        </button>
        {onReport && (
          <button
            onClick={() => onReport(reply.id)}
            className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted"
            aria-label="Report reply"
          >
            <Flag className="size-3.5" />
          </button>
        )}
        {(isAuthor || isAdmin) && onDelete && (
          <button
            onClick={() => onDelete(reply.id)}
            className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            Delete
          </button>
        )}
      </div>

      {/* ── Nested reply form ─────────────────────────────────── */}
      {showReplyForm && (
        <ReplyForm
          
          parentId={reply.id}
          autoFocus
          compact
          placeholder={`Reply to ${reply.author?.name ?? "user"}...`}
          onSubmit={async (content) => {
            await onReply(reply.id, content);
            setShowReplyForm(false);
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* ── Nested replies (1 level) ─────────────────────────── */}
      {nested.length > 0 && (
        <div className="mt-3 space-y-2 border-l-2 border-border/50 pl-3">
          {nested.map((child) => (
            <div key={child.id} className="rounded-lg bg-muted/40 p-2.5">
              <div className="flex items-center gap-2">
                {child.author?.image ? (
                  <Image
                    src={child.author.image}
                    alt={child.author.name ?? "Author"}
                    width={24}
                    height={24}
                    unoptimized
                    className="size-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[9px] font-medium text-muted-foreground">
                    {child.author?.name?.charAt(0) ?? "?"}
                  </div>
                )}
                <span className="truncate text-xs font-medium text-foreground">
                  {child.author?.name ?? "Unknown"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatRelativeTime(child.createdAt)}
                </span>
              </div>
              <p className="mt-1.5 whitespace-pre-line text-xs text-foreground/80">
                {child.content}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
                <button
                  onClick={() => onVote(child.id, child.userVote)}
                  className={cn(
                    "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors",
                    child.userVote === "UP" ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                  aria-label="Upvote reply"
                >
                  <ChevronUp className="size-3" />
                  {child.upvoteCount}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
