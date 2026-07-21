import { listTeamRequests } from "@/actions/team.actions";
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
    const result = await listTeamRequests({ page: 1, limit: 1 });
    // Tags are shared with resources; fetch via the team service helper.
    const fetched = await teamService.listTags();
    tags = fetched ?? [];
    void result;
  } catch {
    tags = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <TeamCreateForm tags={tags} />
    </div>
  );
}
