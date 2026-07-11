"use server";

import { verificationService } from "@/services/verification.service";
import {
  CreateVerificationRequestPayload,
  CreateVerificationRequestResponse,
} from "@/types";

export const verificationAction = {
  createVerificationRequest: async (
    payload: CreateVerificationRequestPayload,
  ): Promise<CreateVerificationRequestResponse> => {
    const response =
      await verificationService.createVerificationRequest(payload);

    return response;
  },
};
