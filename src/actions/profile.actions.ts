"use server";

import { profileService } from "@/services/profile.service";
import type { ApiResponse } from "@/types";
import type { UpdateProfilePayload } from "@/types/profile.types";

export async function getMyProfile(): Promise<ApiResponse> {
  try {
    const data = await profileService.getMyProfile();
    return { success: true, message: "Profile fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch profile.";
    return { success: false, message };
  }
}

export async function getPublicProfile(userId: string): Promise<ApiResponse> {
  try {
    const data = await profileService.getPublicProfile(userId);
    return { success: true, message: "Profile fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch profile.";
    return { success: false, message };
  }
}

export async function updateProfile(
  data: UpdateProfilePayload,
): Promise<ApiResponse> {
  try {
    const result = await profileService.updateProfile(data);
    return { success: true, message: "Profile updated.", data: result };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile.";
    return { success: false, message };
  }
}
