import { OnboardingFlow } from "./_components/OnboardingFlow";
import { onboardingService } from "@/services/onboarding.service";

export default async function OnboardingPage() {
  // Get current onboarding step
  const onboarding = await onboardingService.getCurrentStep();
  const step = onboarding.currentStep;
  const verificationRequest = onboarding.verificationRequest;

  return (
    <OnboardingFlow
      initialStep={step}
      initialVerificationRequest={verificationRequest}
    />
  );
}
