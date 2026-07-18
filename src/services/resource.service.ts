import serverApi from "@/lib/server-api";
import type {
  Resource,
  Comment,
  ListResourcesParams,
  ResourceListResponse,
} from "@/types/resource.types";
import type { PaginationMeta } from "@/types/resource.types";

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

export const resourceService = {
  async createResource(data: {
    title: string;
    description?: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    courseId: string;
    tags?: string[];
  }): Promise<Resource> {
    const response = await serverApi.post<Resource>("/resources", data);
    return response.data!;
  },

  async listResources(
    params: ListResourcesParams = {},
  ): Promise<ResourceListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<ResourceListResponse>(
      `/resources${query}`,
      { tags: ["resources-list"] },
    );
    return response.data!;
  },

  async getResourceById(id: string): Promise<Resource> {
    const response = await serverApi.get<Resource>(`/resources/${id}`, {
      tags: ["resource-detail"],
    });
    return response.data!;
  },

  async updateResource(id: string, data: Partial<{
    title: string;
    description: string;
    tags: string[];
  }>): Promise<Resource> {
    const response = await serverApi.patch<Resource>(`/resources/${id}`, data);
    return response.data!;
  },

  async deleteResource(id: string): Promise<void> {
    await serverApi.del(`/resources/${id}`);
  },

  async toggleVote(resourceId: string): Promise<{ action: string; upvoteCount: number; downvoteCount: number }> {
    const response = await serverApi.post<{ action: string; upvoteCount: number; downvoteCount: number }>(
      `/resources/${resourceId}/upvote`,
      {},
    );
    return response.data!;
  },

  async toggleBookmark(resourceId: string): Promise<{ action: string }> {
    const response = await serverApi.post<{ action: string }>(
      `/resources/${resourceId}/bookmark`,
      {},
    );
    return response.data!;
  },

  async recordDownload(resourceId: string): Promise<{ fileUrl: string }> {
    const response = await serverApi.post<{ fileUrl: string }>(
      `/resources/${resourceId}/download`,
      {},
    );
    return response.data!;
  },

  async addComment(
    resourceId: string,
    data: { content: string; parentId?: string },
  ): Promise<Comment> {
    const response = await serverApi.post<Comment>(
      `/resources/${resourceId}/comments`,
      data,
    );
    return response.data!;
  },

  async listComments(
    resourceId: string,
    page = 1,
    limit = 20,
  ): Promise<{ comments: Comment[]; meta: PaginationMeta }> {
    const response = await serverApi.get<{ comments: Comment[]; meta: PaginationMeta }>(
      `/resources/${resourceId}/comments?page=${page}&limit=${limit}`,
    );
    return response.data!;
  },

  async deleteComment(commentId: string): Promise<void> {
    await serverApi.del(`/resources/comments/${commentId}`);
  },

  async reportResource(
    resourceId: string,
    data: { reason: string; description?: string },
  ): Promise<void> {
    await serverApi.post(`/resources/${resourceId}/report`, data);
  },
};
