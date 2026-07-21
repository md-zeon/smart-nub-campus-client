/**
 * Resource API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  Resource,
  ResourceCategory,
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
  /** List resources with pagination, filtering, and sorting. */
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

  /** Get a single resource by ID. */
  async getResourceById(id: string): Promise<Resource> {
    const response = await serverApi.get<Resource>(`/resources/${id}`, {
      tags: ["resource-detail"],
    });
    return response.data!;
  },

  /** List all resource categories. */
  async listCategories(): Promise<ResourceCategory[]> {
    const response = await serverApi.get<ResourceCategory[]>(
      "/resources/categories",
      { tags: ["resource-categories"] },
    );
    return response.data!;
  },

  /** Upvote a resource. */
  async upvoteResource(resourceId: string): Promise<void> {
    await serverApi.post(`/resources/${resourceId}/vote`, { type: "UP" });
  },

  /** Downvote a resource. */
  async downvoteResource(resourceId: string): Promise<void> {
    await serverApi.post(`/resources/${resourceId}/vote`, { type: "DOWN" });
  },

  /** Toggle bookmark on a resource. */
  async toggleBookmark(resourceId: string): Promise<void> {
    await serverApi.post(`/resources/${resourceId}/bookmark`, {});
  },

  /** Increment download count. */
  async recordDownload(resourceId: string): Promise<void> {
    await serverApi.post(`/resources/${resourceId}/download`, {});
  },

  /** Add a comment to a resource. */
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

  /** List comments for a resource. */
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

  /** Report a resource. */
  async reportResource(
    resourceId: string,
    data: { reason: string; description?: string },
  ): Promise<void> {
    await serverApi.post(`/resources/${resourceId}/report`, data);
  },
};
