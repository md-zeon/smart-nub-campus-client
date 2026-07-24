"use client";

import { ConnectionOverview } from "./connection-overview";
import { SuggestedPeople } from "./suggested-people";
import { PopularSkills } from "./popular-skills";
import type { PeopleCardUser } from "./people-card";
import type { ConnectionOverview as Overview } from "@/types";

interface ConnectionsRightPanelProps {
  overview: Overview;
  suggestions: PeopleCardUser[];
  popularSkills: { id: string; name: string; slug: string; count?: number }[];
  onSkillSelect?: (id: string) => void;
  activeSkills?: string[];
  onChanged?: () => void;
}

/**
 * Right sidebar for the Connections page: network overview, suggested people,
 * and popular skills for discovery.
 */
export function ConnectionsRightPanel({
  overview,
  suggestions,
  popularSkills,
  onSkillSelect,
  activeSkills = [],
  onChanged,
}: ConnectionsRightPanelProps) {
  return (
    <div className="space-y-6">
      <ConnectionOverview overview={overview} />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          People You May Know
        </h3>
        <SuggestedPeople people={suggestions} onChanged={onChanged} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Popular Skills
        </h3>
        <PopularSkills
          skills={popularSkills}
          onSelect={onSkillSelect}
          active={activeSkills}
        />
      </div>
    </div>
  );
}
