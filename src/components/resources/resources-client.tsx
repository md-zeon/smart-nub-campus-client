"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { ResourcesSidebar } from "@/components/resources/resources-sidebar";
import { ResourcesTrending } from "@/components/resources/resources-trending";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listResources } from "@/actions/resource.actions";
import type { Resource, ResourceCategory, PaginationMeta } from "@/types/resource.types";
import { cn } from "@/lib/utils";

type TabOption = "all" | "bookmarks" | "uploads";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Upvoted" },
  { value: "downloads", label: "Most Downloads" },
] as const;

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

interface ResourcesClientProps {
  initialResources: Resource[];
  initialMeta: PaginationMeta | null;
  categories: (ResourceCategory & { _count: { resources: number } })[];
  courses: { id: string; code: string; name: string; department: string; _count: { resources: number } }[];
  initialFilters: {
    search: string;
    category: string | null;
    tag: string | null;
    sort: string;
  };
}

export function ResourcesClient({
  initialResources,
  initialMeta,
  categories,
  courses,
  initialFilters,
}: ResourcesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const sort = searchParams.get("sort") ?? "newest";

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOption>("all");
  const [searchInput, setSearchInput] = useState(search);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset to page 1 when filters change (unless changing page itself)
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  // Sync search input with URL on initial load
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounced search → update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput || null });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  // Fetch resources when URL params change
  useEffect(() => {
    // Skip the very first render — data comes from server
    if (!initialized) {
      setInitialized(true);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetchData() {
      try {
        const params: Record<string, unknown> = { page, limit: 12 };
        if (search) params.search = search;
        if (category) params.categoryId = category;
        if (tag) params.tag = tag;
        if (sort) params.sort = sort;

        const result = await listResources(params as Parameters<typeof listResources>[0]);
        if (!cancelled && result.success && result.data) {
          const data = result.data as { data?: Resource[]; meta?: PaginationMeta };
          setResources(data.data ?? []);
          setMeta(data.meta ?? null);
        }
      } catch {
        // Empty state handled by checking resources.length
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [page, search, category, tag, sort, initialized]);

  return (
    <PageLayout
      leftSidebar={
        <ResourcesSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedCategoryId={category}
          onCategoryChange={(id) => updateParams({ category: id })}
          selectedTag={tag}
          onTagChange={(t) => updateParams({ tag: t })}
          categories={categories}
          courses={courses}
          onCourseChange={(id) => updateParams({ category: null, tag: null })}
        />
      }
      rightSidebar={<ResourcesTrending onTagClick={(t) => updateParams({ tag: t })} />}
    >
      <div className="space-y-4">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover and access study materials shared by the community.
          </p>
        </div>

        {/* ── Search + Filters Bar ────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for notes..."
              className="h-9 pl-9"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>

          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="h-9 rounded-md border bg-transparent px-2.5 text-sm outline-none ring-1 ring-foreground/10"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Mobile Filters Panel ────────────────────────────────── */}
        {showMobileFilters && (
          <div className="rounded-xl border bg-card p-4 ring-1 ring-foreground/10 lg:hidden">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select
                  value={category ?? ""}
                  onChange={(e) => updateParams({ category: e.target.value || null })}
                  className="mt-1 h-8 w-full rounded-md border bg-transparent px-2 text-xs outline-none ring-1 ring-foreground/10"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Course</label>
                <select
                  onChange={(e) => {
                    const courseId = e.target.value;
                    if (courseId) {
                      window.location.href = `/resources?category=${courseId}`;
                    }
                  }}
                  className="mt-1 h-8 w-full rounded-md border bg-transparent px-2 text-xs outline-none ring-1 ring-foreground/10"
                >
                  <option value="">All Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Active Filters Display ──────────────────────────────── */}
        {(search || category || tag) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {search && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                Search: &ldquo;{search}&rdquo;
                <button onClick={() => updateParams({ search: null })}>
                  <X className="size-3" />
                </button>
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                Category: {categories.find((c) => c.id === category)?.name ?? category}
                <button onClick={() => updateParams({ category: null })}>
                  <X className="size-3" />
                </button>
              </span>
            )}
            {tag && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                Tag: {tag}
                <button onClick={() => updateParams({ tag: null })}>
                  <X className="size-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ── Resource Cards Grid ─────────────────────────────────── */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center ring-1 ring-foreground/10">
            <Search className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-foreground">No resources found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────────── */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(page - 1) })}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (meta.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= meta.totalPages - 2) {
                  pageNum = meta.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateParams({ page: pageNum === 1 ? null : String(pageNum) })}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      pageNum === page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(page + 1) })}
              disabled={page >= meta.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
