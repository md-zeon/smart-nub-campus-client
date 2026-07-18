"use client";

import Link from "next/link";
import { Plus, Bookmark, Upload, BookOpen } from "lucide-react";
import type { ResourceCategory } from "@/types/resource.types";
import { cn } from "@/lib/utils";

type TabOption = "all" | "bookmarks" | "uploads";

interface ResourcesSidebarProps {
  activeTab: TabOption;
  onTabChange: (tab: TabOption) => void;
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  categories?: (ResourceCategory & { _count: { resources: number } })[];
  courses?: { id: string; code: string; name: string; department: string; _count: { resources: number } }[];
  onCourseChange?: (courseId: string | null) => void;
}

export function ResourcesSidebar({
  activeTab,
  onTabChange,
  selectedCategoryId,
  onCategoryChange,
  selectedTag,
  onTagChange,
  categories = [],
  courses = [],
}: ResourcesSidebarProps) {
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
                <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                  {cat._count.resources}
                </span>
              </button>
            ))}
          </nav>
        ) : (
          <p className="text-xs text-muted-foreground">No categories found.</p>
        )}
      </div>

      {/* ── Courses ──────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Courses
        </h3>
        {courses.length > 0 ? (
          <nav className="space-y-0.5">
            {courses.map((course) => (
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
        ) : (
          <p className="text-xs text-muted-foreground">No courses found.</p>
        )}
      </div>
    </div>
  );
}
