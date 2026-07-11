import { OnboardingStepValue, UserRole } from "@/constants/enums";

/**
 * Response from POST /account/create
 */
export interface CreateAccountResponse {
  currentStep: OnboardingStepValue;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}
