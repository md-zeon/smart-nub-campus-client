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
  async createTeamRequest(data: {
    title: string;
    description: string;
    category: string;
    skills?: string[];
    lookingFor?: string;
  }): Promise<TeamRequest> {
    const response = await serverApi.post<TeamRequest>("/teams", data);
    return response.data!;
  },

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

  async getTeamRequestById(id: string): Promise<TeamRequest> {
    const response = await serverApi.get<TeamRequest>(`/teams/${id}`, {
      tags: ["team-detail"],
    });
    return response.data!;
  },

  async updateTeamRequest(
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      skills?: string[];
      lookingFor?: string;
      status?: TeamRequestStatus;
    },
  ): Promise<TeamRequest> {
    const response = await serverApi.put<TeamRequest>(`/teams/${id}`, data);
    return response.data!;
  },

  async deleteTeamRequest(id: string): Promise<void> {
    await serverApi.del(`/teams/${id}`);
  },

  async applyToTeam(
    teamRequestId: string,
    data: { message?: string },
  ): Promise<TeamApplication> {
    const response = await serverApi.post<TeamApplication>(
      `/teams/${teamRequestId}/apply`,
      data,
    );
    return response.data!;
  },

  async reviewApplication(
    teamRequestId: string,
    applicationId: string,
    data: { status: "ACCEPTED" | "REJECTED" },
  ): Promise<TeamApplication> {
    const response = await serverApi.put<TeamApplication>(
      `/teams/${teamRequestId}/applications/${applicationId}`,
      data,
    );
    return response.data!;
  },

  async withdrawApplication(teamRequestId: string): Promise<void> {
    await serverApi.del(`/teams/${teamRequestId}/applications/withdraw`);
  },

  async getTeamMembers(teamRequestId: string): Promise<unknown[]> {
    const response = await serverApi.get<unknown[]>(
      `/teams/${teamRequestId}/members`,
    );
    return response.data!;
  },

  async leaveTeam(teamRequestId: string): Promise<void> {
    await serverApi.post(`/teams/${teamRequestId}/leave`, {});
  },

  async removeMember(teamRequestId: string, memberId: string): Promise<void> {
    await serverApi.del(`/teams/${teamRequestId}/members/${memberId}`);
  },
};
