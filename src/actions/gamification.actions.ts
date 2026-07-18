"use server";

import { gamificationService } from "@/services/gamification.service";
import type { ApiResponse } from "@/types";

/** List all badges. */
export async function listBadges(): Promise<ApiResponse> {
  try {
    const data = await gamificationService.listBadges();
    return { success: true, message: "Badges fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch badges.";
    return { success: false, message };
  }
}

/** Get badges earned by a user. */
export async function getUserBadges(userId: string): Promise<ApiResponse> {
  try {
    const data = await gamificationService.getUserBadges(userId);
    return { success: true, message: "User badges fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user badges.";
    return { success: false, message };
  }
}

/** Get the leaderboard. */
export async function getLeaderboard(
  page = 1,
  limit = 50,
): Promise<ApiResponse> {
  try {
    const data = await gamificationService.getLeaderboard(page, limit);
    return { success: true, message: "Leaderboard fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leaderboard.";
    return { success: false, message };
  }
}

/** Get reputation log for a user. */
export async function getReputationLog(
  userId: string,
  page = 1,
  limit = 20,
): Promise<ApiResponse> {
  try {
    const data = await gamificationService.getReputationLog(userId, page, limit);
    return { success: true, message: "Reputation log fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch reputation log.";
    return { success: false, message };
  }
}
