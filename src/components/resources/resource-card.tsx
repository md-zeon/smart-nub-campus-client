"use client";

import Link from "next/link";
import { ChevronUp, Bookmark } from "lucide-react";
import type { Resource } from "@/types/resource.types";
import { FileIcon, getFileColor, getFileLabel, formatFileSize } from "@/components/resources/file-type-utils";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  variant?: "grid" | "list";
  onVote?: (resourceId: string, currentVote: Resource["userVote"]) => void;
  onBookmark?: (resourceId: string, currentBookmarked: boolean) => void;
}

/**
 * Resource card showing file icon, title, course, tags, author, and vote/bookmark actions.
 * Clicking the card navigates to the resource detail page; vote/bookmark buttons stop propagation.
 */
export function ResourceCard({ resource, variant = "grid", onVote, onBookmark }: ResourceCardProps) {
  const fileColor = getFileColor(resource.fileType);
  const fileLabel = getFileLabel(resource.fileType);

  const upvoted = resource.userVote === "UP";
  const bookmarked = resource.isBookmarked ?? false;

  const stop = (e: React.MouseEvent) => e.preventDefault();

  const cardContent = (
    <>
      {/* ── Header: icon + title ─────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${fileColor}`}>
          <FileIcon fileType={resource.fileType} className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {resource.title}
          </h3>
          {resource.isVerified && (
            <span className="ml-1 inline-block text-xs text-primary">✓</span>
          )}
          {resource.course && (
            <p className="mt-1 text-xs text-muted-foreground">
              {resource.course.code} — {resource.course.name}
            </p>
          )}
        </div>
      </div>

      {/* ── Tags (grid only) ─────────────────────────────────────── */}
      {variant === "grid" && resource.resourceTags && resource.resourceTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {resource.resourceTags.slice(0, 3).map((rt) => (
            <span
              key={rt.id}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {rt.tag?.name}
            </span>
          ))}
          {resource.resourceTags.length > 3 && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              +{resource.resourceTags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* ── Footer: author + meta + actions ──────────────────────── */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          {resource.uploader?.image ? (
            <Image
              src={resource.uploader.image}
              alt={resource.uploader.name}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {resource.uploader?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <span className="truncate text-xs text-muted-foreground">
            {resource.uploader?.name ?? "Unknown"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={(e) => {
              stop(e);
              onVote?.(resource.id, resource.userVote);
            }}
            className={cn(
              "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors",
              upvoted
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
            aria-label="Upvote"
          >
            <ChevronUp className="size-3.5" />
            {resource.upvoteCount}
          </button>
          <button
            onClick={(e) => {
              stop(e);
              onBookmark?.(resource.id, bookmarked);
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
        </div>
      </div>

      {/* ── File type badge + size (grid only) ───────────────────── */}
      {variant === "grid" && (
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${fileColor}`}>
            {fileLabel}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatFileSize(resource.fileSize)}
          </span>
        </div>
      )}
    </>
  );

  return (
    <Link
      href={`/resources/${resource.id}`}
      className={cn(
        "group flex rounded-xl border bg-card ring-1 ring-foreground/10 transition-all hover:shadow-md",
        variant === "grid"
          ? "flex-col p-4"
          : "flex-row items-center gap-3 p-3",
      )}
    >
      {cardContent}
    </Link>
  );
}
