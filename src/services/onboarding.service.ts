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

  /**
   * Complete onboarding after email verification.
   * Transitions step from VERIFY_EMAIL to COMPLETED and clears cookie.
   */
  completeOnboarding: async (email: string): Promise<{ success: boolean }> => {
    try {
      const response = await serverApi.post<{ success: boolean }>(
        "/onboarding/complete",
        { email },
      );
      return response.data!;
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  },
};
