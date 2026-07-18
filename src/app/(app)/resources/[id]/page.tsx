"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ResourceDetail } from "@/components/resources/resource-detail";
import { getResource } from "@/actions/resource.actions";
import type { Resource } from "@/types/resource.types";

/** Loading skeleton for the resource detail page. */
function ResourceDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="flex items-start gap-4">
        <div className="size-14 animate-pulse rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-48 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

/**
 * Resource detail page — full-width layout (no PageLayout sidebars).
 * Loads resource by ID from URL params and renders ResourceDetail component.
 */
export default function ResourceDetailPage() {
  const params = useParams();
  const resourceId = params.id as string;

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchResource() {
      try {
        const result = await getResource(resourceId);
        if (!cancelled) {
          if (result.success && result.data) {
            const data = result.data as { data?: Resource };
            setResource(data.data ?? (result.data as Resource));
          } else {
            setError(result.message || "Resource not found.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load resource.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchResource();
    return () => { cancelled = true; };
  }, [resourceId]);

  if (loading) {
    return <ResourceDetailSkeleton />;
  }

  if (error || !resource) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <AlertCircle className="mx-auto size-12 text-destructive/50" />
        <p className="mt-4 text-lg font-medium text-foreground">
          {error || "Resource not found."}
        </p>
        <Link
          href="/resources"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-outline bg-success/2 px-4 py-2 text-sm font-medium text-success/90 transition-colors hover:bg-success/5"
        >
          <ArrowLeft className="size-4" />
          Back to Resources
        </Link>
      </div>
    );
  }

  return <ResourceDetail resource={resource} />;
}
