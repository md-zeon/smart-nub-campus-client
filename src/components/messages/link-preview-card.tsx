"use client";

import { ExternalLink, Globe, FileText, Users, BookOpen, MessageSquare, Briefcase, Calendar, HelpCircle, GraduationCap } from "lucide-react";
import { extractDomain, getUrlDisplayText } from "./link-utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface LinkPreviewData {
  url: string;
  type: "internal" | "external";
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  resourceType?: string;
  metadata?: Record<string, string | number | boolean>;
}

interface LinkPreviewCardProps {
  preview: LinkPreviewData;
  isLoading?: boolean;
}

// ── Resource Type Icons ──────────────────────────────────────────────────────

const resourceIcons: Record<string, typeof Globe> = {
  courses: BookOpen,
  discussions: MessageSquare,
  profile: Users,
  resources: FileText,
  events: Calendar,
  jobs: Briefcase,
  teams: Users,
  mentorship: GraduationCap,
  qa: HelpCircle,
  alumni: Users,
};

// ── Skeleton Loading State ───────────────────────────────────────────────────

function LinkPreviewSkeleton() {
  return (
    <div className="mt-2 w-full max-w-sm animate-pulse overflow-hidden rounded-lg border border-border/40 bg-muted/30">
      <div className="h-32 bg-muted/50" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-muted/50" />
        <div className="h-2 w-full rounded bg-muted/50" />
        <div className="h-2 w-2/3 rounded bg-muted/50" />
      </div>
    </div>
  );
}

// ── Link Preview Card ────────────────────────────────────────────────────────

export function LinkPreviewCard({ preview, isLoading }: LinkPreviewCardProps) {
  if (isLoading) {
    return <LinkPreviewSkeleton />;
  }

  if (!preview.title && !preview.description && !preview.image) {
    return null;
  }

  const domain = extractDomain(preview.url);
  const ResourceIcon = preview.resourceType
    ? resourceIcons[preview.resourceType] || Globe
    : Globe;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link mt-2 block w-full max-w-sm overflow-hidden rounded-lg border border-border/40 bg-muted/20 transition-all duration-200 hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Image */}
      {preview.image && (
        <div className="relative h-32 w-full overflow-hidden bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.image}
            alt={preview.title || "Link preview"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/link:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="flex items-start gap-3 p-3">
        {/* Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ResourceIcon className="h-4 w-4" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          {preview.title && (
            <h4 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover/link:text-primary">
              {preview.title}
            </h4>
          )}

          {/* Description */}
          {preview.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {preview.description}
            </p>
          )}

          {/* Domain + External link icon */}
          <div className="mt-1.5 flex items-center gap-1.5">
            {preview.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.favicon}
                alt=""
                className="h-3 w-3 rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <Globe className="h-3 w-3 text-muted-foreground/60" />
            )}
            <span className="max-w-[200px] truncate text-[11px] text-muted-foreground/70">
              {getUrlDisplayText(preview.url, 45)}
            </span>
            <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground/40 transition-colors group-hover/link:text-primary" />
          </div>
        </div>
      </div>
    </a>
  );
}
