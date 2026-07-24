import serverApi from "@/lib/server-api";
import type {
  UserBadge,
  ReputationPoint,
  LeaderboardResponse,
} from "@/types/gamification.types";
import type { PaginationMeta } from "@/types/resource.types";

export const gamificationService = {
  async getMyPoints(): Promise<{ totalPoints: number }> {
    const response = await serverApi.get<{ totalPoints: number }>(
      "/gamification/points/me",
    );
    return response.data!;
  },

  async getMyReputationHistory(
    page = 1,
    limit = 20,
  ): Promise<{ logs: ReputationPoint[]; meta: PaginationMeta }> {
    const response = await serverApi.get<{ logs: ReputationPoint[]; meta: PaginationMeta }>(
      `/gamification/history/me?page=${page}&limit=${limit}`,
      { tags: ["reputation-log"] },
    );
    return response.data!;
  },

  async getMyBadges(): Promise<UserBadge[]> {
    const response = await serverApi.get<UserBadge[]>("/gamification/badges/me", {
      tags: ["user-badges"],
    });
    return response.data!;
  },

  async getUserPoints(userId: string): Promise<{ totalPoints: number }> {
    const response = await serverApi.get<{ totalPoints: number }>(
      `/gamification/points/${userId}`,
    );
    return response.data!;
  },

  async getUserReputationHistory(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ logs: ReputationPoint[]; meta: PaginationMeta }> {
    const response = await serverApi.get<{ logs: ReputationPoint[]; meta: PaginationMeta }>(
      `/gamification/history/${userId}?page=${page}&limit=${limit}`,
      { tags: ["reputation-log"] },
    );
    return response.data!;
  },

  async getLeaderboard(
    page = 1,
    limit = 50,
  ): Promise<LeaderboardResponse> {
    const response = await serverApi.get<LeaderboardResponse>(
      `/gamification/leaderboard?page=${page}&limit=${limit}`,
      { tags: ["leaderboard"] },
    );
    return response.data!;
  },
};
