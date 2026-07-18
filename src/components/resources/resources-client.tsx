"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { ResourcesSidebar } from "@/components/resources/resources-sidebar";
import { ResourcesTrending } from "@/components/resources/resources-trending";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listResources } from "@/actions/resource.actions";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import type { Resource, ResourceCategory, PaginationMeta } from "@/types/resource.types";
import { cn } from "@/lib/utils";

type TabOption = "all" | "bookmarks" | "uploads";

/** Filter dropdown option. */
interface FilterOption {
  value: string;
  label: string;
}

/** Semester filter options. */
const SEMESTER_OPTIONS: FilterOption[] = [
  { value: "spring-2026", label: "Spring 2026" },
  { value: "summer-2025", label: "Summer 2025" },
  { value: "fall-2025", label: "Fall 2025" },
  { value: "spring-2025", label: "Spring 2025" },
];

/** Sort filter options. */
const SORT_OPTIONS: FilterOption[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Upvoted" },
  { value: "downloads", label: "Most Downloads" },
  { value: "views", label: "Most Viewed" },
];

/** Resource card loading skeleton. */
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
  categories: ResourceCategory[];
}

/**
 * Client-side resources page — receives server-fetched data as props.
 * Handles search, filtering, sorting, and pagination via client-side state + server actions.
 */
export function ResourcesClient({
  initialResources,
  initialMeta,
  categories,
}: ResourcesClientProps) {
  const { page, setPage } = usePagination({ pageSize: 12, syncWithUrl: true });

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOption>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const isDefaultView = page === 1 && !debouncedSearch && !selectedCategoryId && sortBy === "newest" && activeTab === "all";

  /** Reset to page 1 when filters change (except page itself). */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategoryId, sortBy, activeTab]);

  /** Fetch resources when filters or page change (skip initial load — data comes from server). */
  useEffect(() => {
    if (isDefaultView && !hasFetched) {
      setHasFetched(true);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetchData() {
      try {
        const params: Record<string, unknown> = {
          page,
          limit: 12,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedCategoryId) params.categoryId = selectedCategoryId;

        switch (sortBy) {
          case "popular":
            params.sort = "popular";
            break;
          case "downloads":
            params.sort = "downloads";
            break;
          case "views":
            params.sort = "downloads";
            break;
          default:
            params.sort = "newest";
        }

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
  }, [page, debouncedSearch, selectedCategoryId, sortBy, isDefaultView, hasFetched]);

  return (
    <PageLayout
      leftSidebar={
        <ResourcesSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          categories={categories}
        />
      }
      rightSidebar={<ResourcesTrending />}
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
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for notes..."
              className="h-9 pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
              {/* Categories quick filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select
                  value={selectedCategoryId ?? ""}
                  onChange={(e) => setSelectedCategoryId(e.target.value || null)}
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

              {/* Semester filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Semester</label>
                <select className="mt-1 h-8 w-full rounded-md border bg-transparent px-2 text-xs outline-none ring-1 ring-foreground/10">
                  <option value="">All Semesters</option>
                  {SEMESTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Active Filters Display ──────────────────────────────── */}
        {(selectedCategoryId || debouncedSearch) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {debouncedSearch && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                Search: &ldquo;{debouncedSearch}&rdquo;
                <button onClick={() => setSearchQuery("")}>
                  <X className="size-3" />
                </button>
              </span>
            )}
            {selectedCategoryId && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                Category filter
                <button onClick={() => setSelectedCategoryId(null)}>
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
              onClick={() => setPage(page - 1)}
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
                    onClick={() => setPage(pageNum)}
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
              onClick={() => setPage(page + 1)}
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
