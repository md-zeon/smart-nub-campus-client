"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Bookmark, Upload, BookOpen, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ResourceCategory } from "@/types/resource.types";
import { cn } from "@/lib/utils";

/** Tab option for resource list filtering. */
type TabOption = "all" | "bookmarks" | "uploads";

interface ResourcesSidebarProps {
  /** Currently active tab. */
  activeTab: TabOption;
  /** Callback when tab changes. */
  onTabChange: (tab: TabOption) => void;
  /** Currently selected category ID. */
  selectedCategoryId: string | null;
  /** Callback when category is selected. */
  onCategoryChange: (categoryId: string | null) => void;
  /** Categories with counts (fetched server-side). */
  categories?: (ResourceCategory & { _count?: number })[];
}

/**
 * Left sidebar for the resources list page.
 * Contains upload button, tabs, categories with counts, and course filter.
 */
export function ResourcesSidebar({
  activeTab,
  onTabChange,
  selectedCategoryId,
  onCategoryChange,
  categories = [],
}: ResourcesSidebarProps) {
  const [courseSearch, setCourseSearch] = useState("");

  const tabs: { id: TabOption; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Resources", icon: <BookOpen className="size-4" /> },
    { id: "bookmarks", label: "My Bookmarks", icon: <Bookmark className="size-4" /> },
    { id: "uploads", label: "My Uploads", icon: <Upload className="size-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* ── Upload button ────────────────────────────────────────── */}
      <Link
        href="/resources/upload"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand px-10 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand/90 active:translate-y-px"
      >
        <Plus className="size-4" />
        Upload Resource
      </Link>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Categories ───────────────────────────────────────────── */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </h3>
        {categories.length > 0 ? (
          <nav className="space-y-0.5">
            <button
              onClick={() => onCategoryChange(null)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                selectedCategoryId === null
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>All Categories</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                  selectedCategoryId === cat.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="truncate">{cat.name}</span>
                {cat._count != null && (
                  <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                    {cat._count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        ) : (
          <p className="text-xs text-muted-foreground">No categories found.</p>
        )}
      </div>

      {/* ── Filter by Course ──────────────────────────────────────── */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filter by Course
        </h3>
        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
