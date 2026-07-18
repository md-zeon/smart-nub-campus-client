"use client";

import Link from "next/link";
import { Plus, Users, Inbox, FolderKanban, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_SKILLS } from "@/constants/team";

export type TeamsTab = "finder" | "applications" | "teams";

interface TeamsSidebarProps {
  activeTab: TeamsTab;
  onTabChange: (tab: TeamsTab) => void;
  /** Selected skill slug used to filter the finder. */
  selectedSkill?: string | null;
  onSkillToggle?: (skill: string) => void;
}

const TABS: { id: TeamsTab; label: string; icon: React.ReactNode }[] = [
  { id: "finder", label: "Team Finder", icon: <Users className="size-4" /> },
  { id: "applications", label: "My Applications", icon: <Inbox className="size-4" /> },
  { id: "teams", label: "My Teams", icon: <FolderKanban className="size-4" /> },
];

/**
 * Left sidebar for the Teams page.
 * Contains the create button, primary tabs, a quick guide, and popular skills chips.
 */
export function TeamsSidebar({
  activeTab,
  onTabChange,
  selectedSkill,
  onSkillToggle,
}: TeamsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* ── Create button ────────────────────────────────────────── */}
      <Link
        href="/teams/create"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand px-10 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand/90 active:translate-y-px"
      >
        <Plus className="size-4" />
        Create
      </Link>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <nav className="space-y-1">
        {TABS.map((tab) => (
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
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Quick Guide ─────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-3 ring-1 ring-foreground/10">
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Guide
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Discover and join project teams at NUB. Browse open requests, apply with a
          short message, or create your own team and invite members with the right
          skills.
        </p>
      </div>

      {/* ── Popular Skills ───────────────────────────────────────── */}
      {onSkillToggle && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((skill) => {
              const active = selectedSkill === skill.toLowerCase();
              return (
                <button
                  key={skill}
                  onClick={() => onSkillToggle(skill.toLowerCase())}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
