"use server";

import { discussionService } from "@/services/discussion.service";
import type { ApiResponse } from "@/types";
import type { ListDiscussionsParams } from "@/types/discussion.types";

/** List discussions with pagination and filtering. */
export async function listDiscussions(
  params: ListDiscussionsParams = {},
): Promise<ApiResponse> {
  try {
    const data = await discussionService.listDiscussions(params);
    return { success: true, message: "Discussions fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch discussions.";
    return { success: false, message };
  }
}

/** Get a single discussion by ID. */
export async function getDiscussion(id: string): Promise<ApiResponse> {
  try {
    const data = await discussionService.getDiscussionById(id);
    return { success: true, message: "Discussion fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch discussion.";
    return { success: false, message };
  }
}

/** Upvote or downvote a discussion. */
export async function voteDiscussion(
  discussionId: string,
  type: "UP" | "DOWN",
): Promise<ApiResponse> {
  try {
    const data = await discussionService.voteDiscussion(discussionId, type);
    return { success: true, message: "Vote recorded.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record vote.";
    return { success: false, message };
  }
}

/** Toggle bookmark on a discussion. */
export async function bookmarkDiscussion(
  discussionId: string,
): Promise<ApiResponse> {
  try {
    await discussionService.toggleBookmark(discussionId);
    return { success: true, message: "Bookmark toggled." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle bookmark.";
    return { success: false, message };
  }
}

/** Post a reply to a discussion. */
export async function postDiscussionReply(
  discussionId: string,
  data: { content: string; parentId?: string },
): Promise<ApiResponse> {
  try {
    const reply = await discussionService.postReply(discussionId, data);
    return { success: true, message: "Reply posted.", data: reply };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to post reply.";
    return { success: false, message };
  }
}
