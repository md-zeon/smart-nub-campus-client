"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Bookmark, Upload, BookOpen, Check, ChevronDown } from "lucide-react";
import type { ResourceCategory } from "@/types/resource.types";
import { cn } from "@/lib/utils";

type TabOption = "all" | "bookmarks" | "uploads";

const COLLAPSED_LIMIT = 6;

interface ResourcesSidebarProps {
  activeTab: TabOption;
  onTabChange: (tab: TabOption) => void;
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  selectedTags: string[];
  onTagToggle: (slug: string) => void;
  categories?: (ResourceCategory & { _count: { resources: number } })[];
  courses?: { id: string; code: string; name: string; department: string; _count: { resources: number } }[];
  allTags?: { id: string; name: string; slug: string; _count: { resourceTags: number } }[];
  onCourseChange?: (courseId: string | null) => void;
}

export function ResourcesSidebar({
  activeTab,
  onTabChange,
  selectedCategoryId,
  onCategoryChange,
  selectedTags,
  onTagToggle,
  categories = [],
  courses = [],
  allTags = [],
}: ResourcesSidebarProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const tabs: { id: TabOption; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Resources", icon: <BookOpen className="size-4" /> },
    { id: "bookmarks", label: "My Bookmarks", icon: <Bookmark className="size-4" /> },
    { id: "uploads", label: "My Uploads", icon: <Upload className="size-4" /> },
  ];

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, COLLAPSED_LIMIT);
  const visibleTags = showAllTags
    ? allTags
    : [
        ...allTags.filter((t) => selectedTags.includes(t.slug)),
        ...allTags.filter((t) => !selectedTags.includes(t.slug)),
      ].slice(0, COLLAPSED_LIMIT);
  const visibleCourses = showAllCourses ? courses : courses.slice(0, COLLAPSED_LIMIT);

  const toggleButton = (expanded: boolean, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {expanded ? `Show less ${label}` : `Show more ${label}`}
      <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
    </button>
  );

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
          <>
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
              {visibleCategories.map((cat) => (
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
                  <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                    {cat._count.resources}
                  </span>
                </button>
              ))}
            </nav>
            {categories.length > COLLAPSED_LIMIT &&
              toggleButton(showAllCategories, () => setShowAllCategories((v) => !v), "categories")}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No categories found.</p>
        )}
      </div>

      {/* ── Tags (multi-select) ──────────────────────────────────── */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tags
        </h3>
        {allTags.length > 0 ? (
          <>
            <TagMultiSelect
              selectedTags={selectedTags}
              onTagToggle={onTagToggle}
              allTags={visibleTags}
            />
            {allTags.length > COLLAPSED_LIMIT &&
              toggleButton(showAllTags, () => setShowAllTags((v) => !v), "tags")}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No tags available.</p>
        )}
      </div>

      {/* ── Courses ──────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Courses
        </h3>
        {courses.length > 0 ? (
          <>
            <nav className="space-y-0.5">
              {visibleCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/resources?category=${course.id}`}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                    "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="truncate">{course.code} — {course.name}</span>
                  <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                    {course._count.resources}
                  </span>
                </Link>
              ))}
            </nav>
            {courses.length > COLLAPSED_LIMIT &&
              toggleButton(showAllCourses, () => setShowAllCourses((v) => !v), "courses")}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No courses found.</p>
        )}
      </div>
    </div>
  );
}

interface TagMultiSelectProps {
  selectedTags: string[];
  onTagToggle: (slug: string) => void;
  allTags: { id: string; name: string; slug: string; _count: { resourceTags: number } }[];
}

function TagMultiSelect({ selectedTags, onTagToggle, allTags }: TagMultiSelectProps) {
  if (allTags.length === 0) {
    return <p className="text-xs text-muted-foreground">No tags available.</p>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      {allTags.map((tag) => {
        const active = selectedTags.includes(tag.slug);
        return (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.slug)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="truncate">#{tag.name}</span>
            {active && <Check className="size-3.5 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
