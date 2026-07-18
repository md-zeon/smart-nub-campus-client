import serverApi from "@/lib/server-api";
import type {
  ConnectionRequest,
  ConnectionListResponse,
} from "@/types/connection.types";

export const connectionService = {
  async listConnections(
    params: { filter?: string; page?: number; limit?: number } = {},
  ): Promise<ConnectionListResponse> {
    const searchParams = new URLSearchParams();
    if (params.filter) searchParams.set("filter", params.filter);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    const response = await serverApi.get<ConnectionListResponse>(
      `/connections${qs ? `?${qs}` : ""}`,
      { tags: ["connections-list"] },
    );
    return response.data!;
  },

  async sendRequest(receiverId: string): Promise<ConnectionRequest> {
    const response = await serverApi.post<ConnectionRequest>(
      "/connections/request",
      { receiverId },
    );
    return response.data!;
  },

  async acceptRequest(connectionId: string): Promise<unknown> {
    const response = await serverApi.put<unknown>(
      `/connections/${connectionId}/accept`,
      {},
    );
    return response.data!;
  },

  async rejectRequest(connectionId: string): Promise<unknown> {
    const response = await serverApi.put<unknown>(
      `/connections/${connectionId}/reject`,
      {},
    );
    return response.data!;
  },

  async removeConnection(connectionId: string): Promise<void> {
    await serverApi.del(`/connections/${connectionId}`);
  },

  async blockUser(userId: string): Promise<void> {
    await serverApi.post("/connections/block", { userId });
  },

  async unblockUser(blockedId: string): Promise<void> {
    await serverApi.del(`/connections/block/${blockedId}`);
  },

  async toggleFavorite(connectionId: string): Promise<unknown> {
    const response = await serverApi.put<unknown>(
      `/connections/${connectionId}/favorite`,
      {},
    );
    return response.data!;
  },

  async getPendingRequests(): Promise<ConnectionRequest[]> {
    const response = await serverApi.get<ConnectionRequest[]>(
      "/connections/pending",
    );
    return response.data!;
  },

  async getSentRequests(): Promise<ConnectionRequest[]> {
    const response = await serverApi.get<ConnectionRequest[]>(
      "/connections/sent",
    );
    return response.data!;
  },

  async getSuggestedPeople(): Promise<unknown[]> {
    const response = await serverApi.get<unknown[]>(
      "/connections/suggestions",
    );
    return response.data!;
  },

  async searchPeople(params: {
    query?: string;
    department?: string;
    semester?: string;
    skills?: string;
    page?: number;
    limit?: number;
  }): Promise<unknown> {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }
    const response = await serverApi.get<unknown>(
      `/connections/search?${searchParams.toString()}`,
    );
    return response.data!;
  },

  async addSkill(name: string): Promise<unknown> {
    const response = await serverApi.post<unknown>("/connections/skills", { name });
    return response.data!;
  },

  async removeSkill(skillId: string): Promise<void> {
    await serverApi.del(`/connections/skills/${skillId}`);
  },

  async getUserSkills(userId: string): Promise<unknown> {
    const response = await serverApi.get<unknown>(
      `/connections/skills/${userId}`,
    );
    return response.data!;
  },
};
