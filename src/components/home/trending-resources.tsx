import Link from "next/link";
import { FileText, FileImage, Presentation, File } from "lucide-react";
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

interface TrendingResourcesProps {
  resources: Resource[];
}

/** Trending resources section — renders top resources by upvote count (server-fetched). */
export function TrendingResources({ resources }: TrendingResourcesProps) {
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

      {/* ── Empty state ───────────────────────────────────────────── */}
      {resources.length === 0 && (
        <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
          No resources yet. Be the first to upload!
        </p>
      )}

      {/* ── Resource cards ────────────────────────────────────────── */}
      {resources.length > 0 && (
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
