"use server";

import { onboardingService } from "@/services/onboarding.service";
import { OnboardingStateResponse } from "@/types";

export const onboardingAction = {
  getCurrentStep: async (): Promise<OnboardingStateResponse> => {
    const response = await onboardingService.getCurrentStep();
    return response;
  },
};
