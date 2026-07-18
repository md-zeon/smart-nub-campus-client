/**
 * Team API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  TeamRequest,
  TeamApplication,
  TeamRequestStatus,
  ListTeamRequestsParams,
  TeamRequestListResponse,
} from "@/types/team.types";

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

export const teamService = {
  /** List team requests with pagination and filtering. */
  async listTeamRequests(
    params: ListTeamRequestsParams = {},
  ): Promise<TeamRequestListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<TeamRequestListResponse>(
      `/teams${query}`,
      { tags: ["teams-list"] },
    );
    return response.data!;
  },

  /** Get a single team request by ID. */
  async getTeamRequestById(id: string): Promise<TeamRequest> {
    const response = await serverApi.get<TeamRequest>(`/teams/${id}`, {
      tags: ["team-detail"],
    });
    return response.data!;
  },

  /** Apply to a team request. */
  async applyToTeam(
    teamRequestId: string,
    data: { message?: string },
  ): Promise<TeamApplication> {
    const response = await serverApi.post<TeamApplication>(
      `/teams/${teamRequestId}/applications`,
      data,
    );
    return response.data!;
  },

  /** Review (accept/reject) a team application. */
  async reviewApplication(
    teamRequestId: string,
    applicationId: string,
    data: { status: "ACCEPTED" | "REJECTED" },
  ): Promise<TeamApplication> {
    const response = await serverApi.patch<TeamApplication>(
      `/teams/${teamRequestId}/applications/${applicationId}`,
      data,
    );
    return response.data!;
  },

  /** Withdraw an application. */
  async withdrawApplication(
    teamRequestId: string,
    applicationId: string,
  ): Promise<void> {
    await serverApi.del(`/teams/${teamRequestId}/applications/${applicationId}`);
  },

  /** Leave a team. */
  async leaveTeam(teamRequestId: string): Promise<void> {
    await serverApi.del(`/teams/${teamRequestId}/leave`);
  },

  /** Update team request status. */
  async updateTeamStatus(
    teamRequestId: string,
    status: TeamRequestStatus,
  ): Promise<void> {
    await serverApi.patch(`/teams/${teamRequestId}`, { status });
  },
};
