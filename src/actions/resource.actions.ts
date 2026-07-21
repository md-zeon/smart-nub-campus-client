"use server";

import { resourceService } from "@/services/resource.service";
import type { ApiResponse } from "@/types";
import type { ListResourcesParams } from "@/types/resource.types";

/** List resources with pagination and filtering. */
export async function listResources(
  params: ListResourcesParams = {},
): Promise<ApiResponse> {
  try {
    const data = await resourceService.listResources(params);
    return { success: true, message: "Resources fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch resources.";
    return { success: false, message };
  }
}

/** Get a single resource by ID. */
export async function getResource(id: string): Promise<ApiResponse> {
  try {
    const data = await resourceService.getResourceById(id);
    return { success: true, message: "Resource fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch resource.";
    return { success: false, message };
  }
}

/** Upvote or downvote a resource. */
export async function voteResource(
  resourceId: string,
  type: "UP" | "DOWN",
): Promise<ApiResponse> {
  try {
    if (type === "UP") {
      await resourceService.upvoteResource(resourceId);
    } else {
      await resourceService.downvoteResource(resourceId);
    }
    return { success: true, message: "Vote recorded." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record vote.";
    return { success: false, message };
  }
}

/** Toggle bookmark on a resource. */
export async function bookmarkResource(
  resourceId: string,
): Promise<ApiResponse> {
  try {
    await resourceService.toggleBookmark(resourceId);
    return { success: true, message: "Bookmark toggled." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle bookmark.";
    return { success: false, message };
  }
}

/** Add a comment to a resource. */
export async function addResourceComment(
  resourceId: string,
  data: { content: string; parentId?: string },
): Promise<ApiResponse> {
  try {
    const comment = await resourceService.addComment(resourceId, data);
    return { success: true, message: "Comment added.", data: comment };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add comment.";
    return { success: false, message };
  }
}

/** Report a resource. */
export async function reportResource(
  resourceId: string,
  data: { reason: string; description?: string },
): Promise<ApiResponse> {
  try {
    await resourceService.reportResource(resourceId, data);
    return { success: true, message: "Report submitted." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit report.";
    return { success: false, message };
  }
}
