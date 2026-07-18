"use client";

import Link from "next/link";
import { ChevronUp } from "lucide-react";
import type { Resource } from "@/types/resource.types";
import { FileIcon, getFileColor, getFileLabel, formatFileSize } from "@/components/resources/file-type-utils";

interface ResourceCardProps {
  resource: Resource;
}

/**
 * Compact resource card showing file icon, title, course, tags, author, and upvote count.
 * Clicking navigates to the resource detail page.
 */
export function ResourceCard({ resource }: ResourceCardProps) {
  const fileColor = getFileColor(resource.fileType);
  const fileLabel = getFileLabel(resource.fileType);

  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group flex flex-col rounded-xl border bg-card p-4 ring-1 ring-foreground/10 transition-all hover:shadow-md"
    >
      {/* ── Header: icon + title ─────────────────────────────────── */}
      <div className="flex items-start gap-3">
        {/* File type icon with label */}
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${fileColor}`}>
          <FileIcon fileType={resource.fileType} className="size-5" />
        </div>

        {/* Title + verified badge */}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          {resource.isVerified && (
            <span className="ml-1 inline-block text-xs text-primary">✓</span>
          )}
        </div>
      </div>

      {/* ── Course info ──────────────────────────────────────────── */}
      {resource.course && (
        <p className="mt-2 text-xs text-muted-foreground">
          {resource.course.code} — {resource.course.name}
        </p>
      )}

      {/* ── Tags ─────────────────────────────────────────────────── */}
      {resource.resourceTags && resource.resourceTags.length > 0 && (
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

      {/* ── Footer: author + meta ────────────────────────────────── */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-2">
          {/* Author avatar */}
          {resource.uploader?.image ? (
            <img
              src={resource.uploader.image}
              alt={resource.uploader.name}
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {resource.uploader?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {resource.uploader?.name ?? "Unknown"}
          </span>
        </div>

        {/* Upvote count */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <ChevronUp className="size-3.5" />
          <span className="text-xs font-medium">{resource.upvoteCount}</span>
        </div>
      </div>

      {/* ── File type badge + size ────────────────────────────────── */}
      <div className="mt-2 flex items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${fileColor}`}>
          {fileLabel}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {formatFileSize(resource.fileSize)}
        </span>
      </div>
    </Link>
  );
}
