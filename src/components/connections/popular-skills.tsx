"use client";

import { cn } from "@/lib/utils";

interface PopularSkillsProps {
  skills: { id: string; name: string; slug: string; count?: number }[];
  onSelect?: (id: string) => void;
  active?: string[];
}

/**
 * Clickable skill chips for skills-based people discovery.
 */
export function PopularSkills({
  skills,
  onSelect,
  active = [],
}: PopularSkillsProps) {
  if (skills.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No popular skills yet.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => {
        const isActive = active.includes(skill.id);
        return (
          <button
            key={skill.id}
            onClick={() => onSelect?.(skill.id)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {skill.name}
          </button>
        );
      })}
    </div>
  );
}
