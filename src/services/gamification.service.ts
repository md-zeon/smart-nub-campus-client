/**
 * Gamification API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  Badge,
  UserBadge,
  ReputationPoint,
  LeaderboardResponse,
} from "@/types/gamification.types";
import type { PaginationMeta } from "@/types/resource.types";

export const gamificationService = {
  /** List all badges. */
  async listBadges(): Promise<Badge[]> {
    const response = await serverApi.get<Badge[]>("/gamification/badges", {
      tags: ["badges-list"],
    });
    return response.data!;
  },

  /** Get badges earned by a user. */
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const response = await serverApi.get<UserBadge[]>(
      `/gamification/users/${userId}/badges`,
      { tags: ["user-badges"] },
    );
    return response.data!;
  },

  /** Get the leaderboard. */
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

  /** Get reputation log for a user. */
  async getReputationLog(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ logs: ReputationPoint[]; meta: PaginationMeta }> {
    const response = await serverApi.get<{ logs: ReputationPoint[]; meta: PaginationMeta }>(
      `/gamification/users/${userId}/reputation?page=${page}&limit=${limit}`,
      { tags: ["reputation-log"] },
    );
    return response.data!;
  },

  /** Get current user's total reputation points. */
  async getMyReputation(): Promise<{ totalPoints: number }> {
    const response = await serverApi.get<{ totalPoints: number }>(
      "/gamification/my-reputation",
    );
    return response.data!;
  },
};
