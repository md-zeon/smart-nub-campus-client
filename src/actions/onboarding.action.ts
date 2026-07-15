"use server";

import { onboardingService } from "@/services/onboarding.service";
import type { OnboardingStateResponse } from "@/types";

export async function getCurrentStep(): Promise<OnboardingStateResponse> {
  const response = await onboardingService.getCurrentStep();
  return response;
}

export async function completeOnboarding(
  email: string,
): Promise<{ success: boolean }> {
  const response = await onboardingService.completeOnboarding(email);
  return response;
}
