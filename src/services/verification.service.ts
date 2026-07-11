import serverApi from "@/lib/server-api";
import type {
  CreateVerificationRequestPayload,
  CreateVerificationRequestResponse,
  // ListVerificationParams,
  // ListVerificationResponse,
  // VerificationDetailResponse,
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
  // async listVerificationRequests(
  //   params: ListVerificationParams,
  // ): Promise<ListVerificationResponse> {
  //   const searchParams = new URLSearchParams();
  //   searchParams.set("page", String(params.page));
  //   searchParams.set("limit", String(params.limit));
  //   if (params.status) searchParams.set("status", params.status);
  //   if (params.search) searchParams.set("search", params.search);
  //   if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  //   if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  //   const response = await serverApi.get<ListVerificationResponse>(
  //     `/verification?${searchParams.toString()}`,
  //   );
  //   return response.data!;
  // },

  /**
   * Get single verification request (admin only)
   */
  // async getVerificationRequest(
  //   id: string,
  // ): Promise<VerificationDetailResponse> {
  //   const response = await serverApi.get<VerificationDetailResponse>(
  //     `/verification/${id}`,
  //   );
  //   return response.data!;
  // },

  /**
   * Approve verification request (admin only)
   */
  // async approveVerificationRequest(id: string): Promise<void> {
  //   await serverApi.patch(`/verification/${id}/approve`, {});
  // },

  /**
   * Reject verification request (admin only)
   */
  // async rejectVerificationRequest(id: string, note: string): Promise<void> {
  //   await serverApi.patch(`/verification/${id}/reject`, { note });
  // },
};
