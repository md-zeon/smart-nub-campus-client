import serverApi from "@/lib/server-api";
import { CONNECTION_MUTATION_TAGS, TAGS } from "@/lib/cache-tags";
import type {
  ConnectionWithUser,
  ConnectionOtherUser,
  SuggestedPerson,
  SearchPeopleResponse,
  ConnectionOverview,
  PaginationMeta,
} from "@/types";

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        searchParams.set(key, value.join(","));
      } else {
        searchParams.set(key, String(value));
      }
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Connection module service — wraps all `/connections` endpoints.
 * Mirrors the server connection module (Phase 5).
 */
export const connectionService = {
  /** Search discoverable people with optional filters. */
  async searchPeople(params: {
    query?: string;
    department?: string;
    semester?: string;
    skills?: string[];
    page?: number;
    limit?: number;
  }): Promise<SearchPeopleResponse> {
    const query = buildQueryString({
      query: params.query,
      department: params.department,
      semester: params.semester,
      skills: params.skills,
      page: params.page,
      limit: params.limit,
    });
    const response = await serverApi.get<SearchPeopleResponse>(
      `/connections/search${query}`,
      { tags: [TAGS.CONNECTIONS] },
    );
    return response.data!;
  },

  /** People You May Know suggestions. */
  async getSuggestions(): Promise<SuggestedPerson[]> {
    const response = await serverApi.get<SuggestedPerson[]>(
      "/connections/suggestions",
      { tags: [TAGS.CONNECTIONS] },
    );
    return response.data ?? [];
  },

  /** Incoming pending connection requests (received). */
  async getPendingRequests(): Promise<ConnectionWithUser[]> {
    const response = await serverApi.get<ConnectionWithUser[]>(
      "/connections/pending",
      { tags: [TAGS.CONNECTION_REQUESTS] },
    );
    return response.data ?? [];
  },

  /** Users the current user has blocked. */
  async getBlockedUsers(): Promise<ConnectionOtherUser[]> {
    const response = await serverApi.get<ConnectionOtherUser[]>(
      "/connections/blocked",
      { tags: [TAGS.CONNECTIONS] },
    );
    return response.data ?? [];
  },

  /** Outgoing pending connection requests (sent). */
  async getSentRequests(): Promise<ConnectionWithUser[]> {
    const response = await serverApi.get<ConnectionWithUser[]>(
      "/connections/sent",
      { tags: [TAGS.CONNECTION_REQUESTS] },
    );
    return response.data ?? [];
  },

  /** Established connections with semester-based filters. */
  async getMyConnections(
    filter: "ALL" | "SENIORS" | "JUNIORS" | "SAME_SEMESTER" | "FAVORITES" = "ALL",
    page = 1,
    limit = 12,
  ): Promise<{ data: ConnectionWithUser[]; meta: PaginationMeta }> {
    const query = buildQueryString({ filter, page, limit });
    const response = await serverApi.get<{ data: ConnectionWithUser[]; meta: PaginationMeta }>(
      `/connections${query}`,
      { tags: [TAGS.CONNECTIONS] },
    );
    return response.data!;
  },

  /** Aggregate counts for the overview card. */
  async getOverview(): Promise<ConnectionOverview> {
    const [connections, pending, sent] = await Promise.all([
      this.getMyConnections("ALL", 1, 1),
      this.getPendingRequests(),
      this.getSentRequests(),
    ]);

    const favorites = await this.getMyConnections("FAVORITES", 1, 1);
    const blockedUsers = await this.getBlockedUsers();

    return {
      totalConnections: connections.meta.total,
      pending: pending.length,
      sent: sent.length,
      favorites: favorites.meta.total,
      blocked: blockedUsers.length,
    };
  },

  /** Send a connection request to a user. */
  async sendRequest(receiverId: string, note?: string): Promise<void> {
    await serverApi.post(
      "/connections/request",
      { receiverId, note: note ?? undefined },
      { invalidatesTags: [...CONNECTION_MUTATION_TAGS] },
    );
  },

  /** Accept an incoming connection request. */
  async acceptRequest(connectionId: string): Promise<void> {
    await serverApi.put(
      `/connections/${connectionId}/accept`,
      {},
      { invalidatesTags: [...CONNECTION_MUTATION_TAGS] },
    );
  },

  /** Reject an incoming connection request. */
  async rejectRequest(connectionId: string): Promise<void> {
    await serverApi.put(
      `/connections/${connectionId}/reject`,
      {},
      { invalidatesTags: [...CONNECTION_MUTATION_TAGS] },
    );
  },

  /** Cancel an outgoing (sent) connection request. */
  async cancelRequest(connectionId: string): Promise<void> {
    await serverApi.del(`/connections/${connectionId}`, {
      invalidatesTags: [...CONNECTION_MUTATION_TAGS],
    });
  },

  /** Toggle favorite flag on a connection. */
  async toggleFavorite(connectionId: string): Promise<void> {
    await serverApi.put(
      `/connections/${connectionId}/favorite`,
      {},
      { invalidatesTags: [...CONNECTION_MUTATION_TAGS] },
    );
  },

  /** Remove an established connection. */
  async removeConnection(connectionId: string): Promise<void> {
    await serverApi.del(`/connections/${connectionId}`, {
      invalidatesTags: [...CONNECTION_MUTATION_TAGS],
    });
  },

  /** Block a user. */
  async blockUser(blockedId: string): Promise<void> {
    await serverApi.post(
      "/connections/block",
      { blockedId },
      { invalidatesTags: [...CONNECTION_MUTATION_TAGS] },
    );
  },

  /** Unblock a previously blocked user. */
  async unblockUser(blockedId: string): Promise<void> {
    await serverApi.del(`/connections/block/${blockedId}`, {
      invalidatesTags: [...CONNECTION_MUTATION_TAGS],
    });
  },
};
