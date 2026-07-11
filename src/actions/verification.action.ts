"use server";

import { verificationService } from "@/services/verification.service";
import {
  CreateVerificationRequestPayload,
  CreateVerificationRequestResponse,
  ListVerificationParams,
  ListVerificationResponse,
  VerificationDetailResponse,
} from "@/types";

export const verificationAction = {
  /**
   * Create a new verification request.
   * @param payload
   * @returns
   */
  createVerificationRequest: async (
    payload: CreateVerificationRequestPayload,
  ): Promise<CreateVerificationRequestResponse> => {
    const response =
      await verificationService.createVerificationRequest(payload);

    return response;
  },
  /**
   * List verification requests (admin only)
   * @param params
   * @returns
   */
  listVerificationRequests: async (
    params: ListVerificationParams,
  ): Promise<ListVerificationResponse> => {
    const response = await verificationService.listVerificationRequests(params);
    return response;
  },
  /**
   * Get single verification request (admin only)
   * @param id
   * @returns
   */
  getVerificationRequest: async (
    id: string,
  ): Promise<VerificationDetailResponse> => {
    const response = await verificationService.getVerificationRequest(id);
    return response;
  },
  /**
   * Approve verification request (admin only)
   * @param id
   * @returns
   */
  approveVerificationRequest: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    return await verificationService.approveVerificationRequest(id);
  },
  /**
   * Reject verification request (admin only)
   * @param id
   * @param note
   * @returns
   */
  rejectVerificationRequest: async (
    id: string,
    note: string,
  ): Promise<{ success: boolean; message: string }> => {
    return await verificationService.rejectVerificationRequest(id, note);
  },
};
