import type {
  OnboardingStepValue,
  VerificationStatus,
} from "@/constants/enums";
import { VerificationRequestData } from "./verification.types";

/**
 * Matches the backend GET /onboarding/current response data
 * VerificationRequest is always included when it exists, null otherwise.
 * idCardImage is excluded from non-admin responses.
 */

/**
 * Response from GET /onboarding/current
 */
export interface OnboardingStateResponse {
  currentStep: OnboardingStepValue;
  verificationStatus: VerificationStatus | null;
  verificationRequest: VerificationRequestData | null;
  note: string | null;
}
