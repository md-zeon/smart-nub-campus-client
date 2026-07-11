import serverApi from "@/lib/server-api";
import type {
  CreateVerificationRequestPayload,
  CreateVerificationRequestResponse,
  ListVerificationParams,
  ListVerificationResponse,
  VerificationDetailResponse,
} from "@/types";

export const verificationService = {
  /**
   * Create a new verification request.
   * Returns the full onboarding state so the frontend can render immediately.
   * Matches backend POST /verification/request response
   */
  createVerificationRequest: async (
    payload: CreateVerificationRequestPayload,
  ): Promise<CreateVerificationRequestResponse> => {
    const response = await serverApi.post<CreateVerificationRequestResponse>(
      "/verification/request",
      payload,
    );
    return response.data!;
  },

  /**
   * List verification requests (admin only)
   */
  listVerificationRequests: async (
    params: ListVerificationParams,
  ): Promise<ListVerificationResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page));
    searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const response = await serverApi.get<ListVerificationResponse>(
      `/verification?${searchParams.toString()}`,
    );

    return response.data!;
  },

  /**
   * Get single verification request (admin only)
   */
  getVerificationRequest: async (
    id: string,
  ): Promise<VerificationDetailResponse> => {
    const response = await serverApi.get<VerificationDetailResponse>(
      `/verification/${id}`,
    );
    return response.data!;
  },

  /**
   * Approve verification request (admin only)
   */

  approveVerificationRequest: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await serverApi.patch(`/verification/${id}/approve`, {});
    return { success: res.success, message: res.message };
  },

  /**
   * Reject verification request (admin only)
   */
  rejectVerificationRequest: async (
    id: string,
    note: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await serverApi.patch(`/verification/${id}/reject`, { note });
    return { success: res.success, message: res.message };
  },
};
