/**
 * Discussion API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  Discussion,
  DiscussionCategory,
  DiscussionReply,
  ListDiscussionsParams,
  DiscussionListResponse,
} from "@/types/discussion.types";

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const discussionService = {
  /** List discussions with pagination, filtering, and sorting. */
  async listDiscussions(
    params: ListDiscussionsParams = {},
  ): Promise<DiscussionListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<DiscussionListResponse>(
      `/discussions${query}`,
      { tags: ["discussions-list"] },
    );
    return response.data!;
  },

  /** Get a single discussion by ID. */
  async getDiscussionById(id: string): Promise<Discussion> {
    const response = await serverApi.get<Discussion>(`/discussions/${id}`, {
      tags: ["discussion-detail"],
    });
    return response.data!;
  },

  /** List discussion categories. */
  async listCategories(): Promise<DiscussionCategory[]> {
    const response = await serverApi.get<DiscussionCategory[]>(
      "/discussions/categories",
      { tags: ["discussion-categories"] },
    );
    return response.data!;
  },

  /** Upvote a discussion. */
  async upvoteDiscussion(discussionId: string): Promise<void> {
    await serverApi.post(`/discussions/${discussionId}/vote`, { type: "UP" });
  },

  /** Downvote a discussion. */
  async downvoteDiscussion(discussionId: string): Promise<void> {
    await serverApi.post(`/discussions/${discussionId}/vote`, { type: "DOWN" });
  },

  /** Toggle bookmark on a discussion. */
  async toggleBookmark(discussionId: string): Promise<void> {
    await serverApi.post(`/discussions/${discussionId}/bookmark`, {});
  },

  /** Post a reply to a discussion. */
  async postReply(
    discussionId: string,
    data: { content: string; parentId?: string },
  ): Promise<DiscussionReply> {
    const response = await serverApi.post<DiscussionReply>(
      `/discussions/${discussionId}/replies`,
      data,
    );
    return response.data!;
  },

  /** List replies for a discussion. */
  async listReplies(
    discussionId: string,
    page = 1,
    limit = 20,
  ): Promise<{ replies: DiscussionReply[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const response = await serverApi.get<{ replies: DiscussionReply[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
      `/discussions/${discussionId}/replies?page=${page}&limit=${limit}`,
    );
    return response.data!;
  },
};
