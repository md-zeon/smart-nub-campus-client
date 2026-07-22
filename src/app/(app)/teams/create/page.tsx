import { teamService } from "@/services/team.service";
import { TeamCreateForm } from "@/components/teams/team-create-form";
import type { Tag } from "@/types/resource.types";

/**
 * Create Team Request page.
 * Full-width layout (no PageLayout). Fetches available skill tags for the form.
 */
export default async function CreateTeamPage() {
  let tags: Tag[] = [];

  try {
    const fetched = await teamService.listTags();
    tags = fetched ?? [];
  } catch {
    tags = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <TeamCreateForm tags={tags} />
    </div>
  );
}
