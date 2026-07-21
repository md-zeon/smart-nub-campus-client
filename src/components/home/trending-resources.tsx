"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, FileImage, Presentation, File } from "lucide-react";
import { listResources } from "@/actions/resource.actions";
import type { Resource } from "@/types/resource.types";

/** Returns a lucide icon based on file type extension. */
function getFileIcon(fileType: string) {
  const ext = fileType.toLowerCase();
  if (ext.includes("pdf")) return FileText;
  if (ext.includes("doc") || ext.includes("word")) return FileText;
  if (ext.includes("ppt") || ext.includes("presentation")) return Presentation;
  if (ext.includes("image") || ext.includes("png") || ext.includes("jpg")) return FileImage;
  return File;
}

/** Loading skeleton for a single resource card. */
function ResourceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-5 w-12 rounded-full bg-muted" />
            <div className="h-5 w-16 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Trending resources section — fetches top 3 resources by upvote count. */
export function TrendingResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchResources() {
      try {
        const result = await listResources({
          sort: "popular",
          limit: 3,
        } as Parameters<typeof listResources>[0]);
        if (!cancelled && result.success && result.data) {
          const data = result.data as { data: Resource[] };
          setResources(data.data ?? []);
        }
      } catch {
        // Empty state handled by checking resources.length
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchResources();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Trending Resources
        </h2>
        <Link
          href="/resources"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      {/* ── Loading skeletons ─────────────────────────────────────── */}
      {loading && (
        <div className="space-y-3">
          <ResourceCardSkeleton />
          <ResourceCardSkeleton />
          <ResourceCardSkeleton />
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {!loading && resources.length === 0 && (
        <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
          No resources yet. Be the first to upload!
        </p>
      )}

      {/* ── Resource cards ────────────────────────────────────────── */}
      {!loading && resources.length > 0 && (
        <div className="space-y-3">
          {resources.map((resource) => {
            const FileIcon = getFileIcon(resource.fileType);
            return (
              <Link
                key={resource.id}
                href={`/resources/${resource.id}`}
                className="flex items-start gap-3 rounded-xl border bg-card p-4 ring-1 ring-foreground/10 transition-all hover:shadow-md"
              >
                {/* File type icon */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileIcon className="size-5 text-primary" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-foreground">
                    {resource.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {resource.course?.code} — {resource.course?.name}
                  </p>

                  {/* Tags */}
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
                    </div>
                  )}
                </div>

                {/* Upvote count */}
                <div className="shrink-0 text-center">
                  <span className="text-sm font-semibold text-foreground">
                    {resource.upvoteCount}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    upvotes
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
