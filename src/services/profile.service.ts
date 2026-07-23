import serverApi from "@/lib/server-api";
import { TAGS } from "@/lib/cache-tags";
import type { UserProfile, ProfileUser, UpdateProfilePayload } from "@/types/profile.types";

export const profileService = {
  async getMyProfile(): Promise<UserProfile | null> {
    const response = await serverApi.get<UserProfile | null>("/identity/profile", {
      tags: [TAGS.PROFILE],
    });
    return response.data ?? null;
  },

  async getPublicProfile(userId: string): Promise<ProfileUser> {
    const response = await serverApi.get<ProfileUser>(`/identity/profile/${userId}`, {
      tags: [TAGS.PROFILE],
    });
    return response.data!;
  },

  async updateProfile(data: UpdateProfilePayload): Promise<UserProfile> {
    const response = await serverApi.patch<UserProfile>("/identity/profile", data, {
      invalidatesTags: [TAGS.PROFILE],
    });
    return response.data!;
  },
};
