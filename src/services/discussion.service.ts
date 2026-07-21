import serverApi from "@/lib/server-api";
import type {
  Discussion,
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
  async createDiscussion(data: {
    title: string;
    content: string;
    tags?: string[];
  }): Promise<Discussion> {
    const response = await serverApi.post<Discussion>("/discussions", data);
    return response.data!;
  },

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

  async getDiscussionById(id: string): Promise<Discussion> {
    const response = await serverApi.get<Discussion>(`/discussions/${id}`, {
      tags: ["discussion-detail"],
    });
    return response.data!;
  },

  async updateDiscussion(
    id: string,
    data: { title?: string; content?: string; tags?: string[] },
  ): Promise<Discussion> {
    const response = await serverApi.put<Discussion>(`/discussions/${id}`, data);
    return response.data!;
  },

  async deleteDiscussion(id: string): Promise<void> {
    await serverApi.del(`/discussions/${id}`);
  },

  async voteDiscussion(
    discussionId: string,
    type: "UP" | "DOWN",
  ): Promise<{ action: string; upvoteCount: number; downvoteCount: number }> {
    const response = await serverApi.post<{ action: string; upvoteCount: number; downvoteCount: number }>(
      `/discussions/${discussionId}/vote`,
      { type },
    );
    return response.data!;
  },

  async toggleBookmark(discussionId: string): Promise<{ action: string }> {
    const response = await serverApi.post<{ action: string }>(
      `/discussions/${discussionId}/bookmark`,
      {},
    );
    return response.data!;
  },

  async listBookmarks(): Promise<Discussion[]> {
    const response = await serverApi.get<Discussion[]>("/discussions/bookmarks");
    return response.data!;
  },

  async togglePin(id: string): Promise<{ pinned: boolean }> {
    const response = await serverApi.put<{ pinned: boolean }>(`/discussions/${id}/pin`, {});
    return response.data!;
  },

  async toggleLock(id: string): Promise<{ locked: boolean }> {
    const response = await serverApi.put<{ locked: boolean }>(`/discussions/${id}/lock`, {});
    return response.data!;
  },

  async markSolved(id: string, commentId: string): Promise<{ solved: boolean; solvedCommentId: string }> {
    const response = await serverApi.put<{ solved: boolean; solvedCommentId: string }>(`/discussions/${id}/solved`, { commentId });
    return response.data!;
  },

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

  async deleteReply(discussionId: string, replyId: string): Promise<void> {
    await serverApi.del(`/discussions/${discussionId}/replies/${replyId}`);
  },

  async voteReply(
    replyId: string,
    type: "UP" | "DOWN",
  ): Promise<{ action: string; upvoteCount: number; downvoteCount: number }> {
    const response = await serverApi.post<{ action: string; upvoteCount: number; downvoteCount: number }>(
      `/discussions/replies/${replyId}/vote`,
      { type },
    );
    return response.data!;
  },
};
