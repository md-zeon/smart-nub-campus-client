import { OnboardingStepValue, UserRole } from "@/constants/enums";
import { VerificationRequestData } from "./verification.types";

/**
 * Response from POST /account/create
 */
export interface CreateAccountResponse {
  currentStep: OnboardingStepValue;
  verificationRequest: VerificationRequestData;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}
