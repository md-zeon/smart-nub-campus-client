/**
 * Centralized cache tag constants for Next.js revalidation.
 *
 * All `invalidatesTags` and `tags` usage MUST reference these constants
 * to avoid typo-related cache bugs. Import from this file only.
 *
 * @example
 * ```ts
 * import { TAGS } from "@/lib/cache-tags";
 * serverApi.get("/resources", { tags: [TAGS.RESOURCES] });
 * serverApi.post("/resources", data, { invalidatesTags: [TAGS.RESOURCES] });
 * ```
 */

export const TAGS = {
  /** Resource list + categories + courses (all read together). */
  RESOURCES: "resources",

  /** Single resource detail page. */
  RESOURCE_DETAIL: "resource-detail",

  /** Trending resources sidebar. */
  RESOURCES_TRENDING: "resources-trending",

  /** Leaderboard / gamification. */
  LEADERBOARD: "leaderboard",
} as const;

/** All tags that should be invalidated when any resource is created/updated/deleted. */
export const RESOURCE_MUTATION_TAGS = [TAGS.RESOURCES, TAGS.RESOURCES_TRENDING] as const;
