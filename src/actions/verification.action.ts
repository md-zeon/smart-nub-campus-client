"use server";

import { verificationService } from "@/services/verification.service";
import type {
  CreateVerificationRequestPayload,
  CreateVerificationRequestResponse,
  ListVerificationParams,
  ListVerificationResponse,
  VerificationDetailResponse,
} from "@/types";

export async function createVerificationRequest(
  payload: CreateVerificationRequestPayload,
): Promise<CreateVerificationRequestResponse> {
  const response = await verificationService.createVerificationRequest(payload);
  return response;
}

export async function listVerificationRequests(
  params: ListVerificationParams,
): Promise<ListVerificationResponse> {
  const response = await verificationService.listVerificationRequests(params);
  return response;
}

export async function getVerificationRequest(
  id: string,
): Promise<VerificationDetailResponse> {
  const response = await verificationService.getVerificationRequest(id);
  return response;
}

export async function approveVerificationRequest(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return await verificationService.approveVerificationRequest(id);
}

export async function rejectVerificationRequest(
  id: string,
  note: string,
): Promise<{ success: boolean; message: string }> {
  return await verificationService.rejectVerificationRequest(id, note);
}
