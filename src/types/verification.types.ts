import { OnboardingStepValue, VerificationStatus } from "@/constants/enums";

export interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  studentId: string;
  status: VerificationStatus;
  note: string | null;
  createdAt: string;
}

export interface VerificationRequestData {
  id: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  studentId: string;
  status: VerificationStatus;
  note: string | null;
}

export interface CreateVerificationRequestResponse {
  currentStep: OnboardingStepValue;
  verificationStatus: VerificationStatus | null;
  note: string | null;
  verificationRequest: {
    id: string;
    name: string;
    email: string;
    dateOfBirth: Date;
    studentId: string;
    status: VerificationStatus;
    note: string | null;
  } | null;
}

/**
 * Payload for creating a verification request
 */
export interface CreateVerificationRequestPayload {
  name: string;
  email: string;
  dateOfBirth: string;
  studentId: string;
  idCardImage: string;
}

export interface ListVerificationParams {
  page: number;
  limit: number;
  status?: VerificationStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ListVerificationResponse {
  data: VerificationRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VerificationDetailResponse {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  studentId: string;
  idCardImage: string;
  status: VerificationStatus;
  note: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: {
    id: string;
    email: string;
    name: string;
  } | null;
}
