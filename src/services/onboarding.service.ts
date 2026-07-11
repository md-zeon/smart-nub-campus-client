import serverApi from "@/lib/server-api";
import type { OnboardingStateResponse } from "@/types";

export const onboardingService = {
  /**
   * Get current onboarding step (reads onboarding_step cookie).
   * Matches backend GET /onboarding/current response.
   */
  getCurrentStep: async (): Promise<OnboardingStateResponse> => {
    try {
      const response = await serverApi.get<OnboardingStateResponse>(
        "/onboarding/current",
      );

      return response.data!;
    } catch (error) {
      console.error("Error fetching current onboarding step:", error);
      throw error;
    }
  },
};
