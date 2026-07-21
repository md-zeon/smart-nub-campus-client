/**
 * Connection API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  ConnectionRequest,
  ConnectionStatus,
  ListConnectionsParams,
  ConnectionListResponse,
} from "@/types/connection.types";

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

export const connectionService = {
  /** List connections with pagination and filtering. */
  async listConnections(
    params: ListConnectionsParams = {},
  ): Promise<ConnectionListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<ConnectionListResponse>(
      `/connections${query}`,
      { tags: ["connections-list"] },
    );
    return response.data!;
  },

  /** Send a connection request. */
  async sendRequest(receiverId: string): Promise<ConnectionRequest> {
    const response = await serverApi.post<ConnectionRequest>("/connections", {
      receiverId,
    });
    return response.data!;
  },

  /** Accept a connection request. */
  async acceptRequest(connectionId: string): Promise<void> {
    await serverApi.patch(`/connections/${connectionId}`, {
      status: "ACCEPTED" as ConnectionStatus,
    });
  },

  /** Reject a connection request. */
  async rejectRequest(connectionId: string): Promise<void> {
    await serverApi.patch(`/connections/${connectionId}`, {
      status: "REJECTED" as ConnectionStatus,
    });
  },

  /** Remove a connection. */
  async removeConnection(connectionId: string): Promise<void> {
    await serverApi.del(`/connections/${connectionId}`);
  },

  /** Block a user. */
  async blockUser(userId: string): Promise<void> {
    await serverApi.post(`/connections/block`, { userId });
  },

  /** Toggle favorite on a connection. */
  async toggleFavorite(connectionId: string): Promise<void> {
    await serverApi.patch(`/connections/${connectionId}/favorite`, {});
  },
};
