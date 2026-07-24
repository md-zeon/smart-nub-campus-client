"use client";

import { useState } from "react";
import {
  UserPlus,
  Users,
  Clock,
  Send,
  Ban,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { ConnectionFilters } from "./connection-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConnectionFilterState } from "./connection-filters";

export type ConnectionTab =
  | "all"
  | "pending"
  | "sent"
  | "blocked";

interface ConnectionsSidebarProps {
  activeTab: ConnectionTab;
  onTabChange: (tab: ConnectionTab) => void;
  counts: { all: number; pending: number; sent: number; blocked: number };
  filters: ConnectionFilterState;
  onFiltersChange: (filters: ConnectionFilterState) => void;
  skills?: { id: string; name: string; slug: string }[];
  /** Triggered when the Find People button is pressed. */
  onFindPeople: () => void;
}

const TABS: { id: ConnectionTab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Connections", icon: <Users className="size-4" /> },
  { id: "pending", label: "Pending Requests", icon: <Clock className="size-4" /> },
  { id: "sent", label: "Sent Requests", icon: <Send className="size-4" /> },
  { id: "blocked", label: "Blocked Users", icon: <Ban className="size-4" /> },
];

/**
 * Left sidebar for the Connections page: a Find People CTA, the main tabs
 * (with counts), discovery filters, and a Grow Network prompt.
 */
export function ConnectionsSidebar({
  activeTab,
  onTabChange,
  counts,
  filters,
  onFiltersChange,
  skills = [],
  onFindPeople,
}: ConnectionsSidebarProps) {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="space-y-6">
      {/* Find People CTA */}
      <Button className="w-full" onClick={onFindPeople}>
        <UserPlus className="size-4" />
        Find People
      </Button>

      {/* Tabs */}
      <nav className="space-y-1">
        {TABS.map((tab) => {
          const count =
            tab.id === "pending"
              ? counts.pending
              : tab.id === "sent"
                ? counts.sent
                : tab.id === "blocked"
                  ? counts.blocked
                  : counts.all;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {tab.icon}
              <span className="flex-1 text-left">{tab.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                    tab.id === "pending"
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Filters */}
      <div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5" />
            Filters
          </span>
          <span>{showFilters ? "Hide" : "Show"}</span>
        </button>
        {showFilters && (
          <div className="mt-3">
            <ConnectionFilters
              filters={filters}
              onChange={onFiltersChange}
              skills={skills}
            />
          </div>
        )}
      </div>

      {/* Grow Network CTA */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="size-4" />
          Grow Your Network
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Connect with classmates, seniors, and juniors to expand your campus
          network.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={onFindPeople}
        >
          <UserPlus className="size-3.5" />
          Connect with classmates
        </Button>
      </div>
    </div>
  );
}
