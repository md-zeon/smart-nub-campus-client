"use client";

import type { ReactNode } from "react";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  useStepperItem,
} from "@/components/ui/stepper";
import {
  OnboardingStepValue,
  type VerificationStatus,
} from "@/constants/enums";

const STEPS = [
  { value: OnboardingStepValue.VERIFICATION_FORM, label: "Verify Identity" },
  { value: OnboardingStepValue.ADMIN_REVIEW, label: "Admin Review" },
  { value: OnboardingStepValue.ACCOUNT_CREATION, label: "Create Account" },
  { value: OnboardingStepValue.VERIFY_EMAIL, label: "Verify Email" },
  { value: OnboardingStepValue.COMPLETED, label: "Done" },
] as const;

type StepValue = (typeof STEPS)[number]["value"];

interface VerificationStepperProps {
  currentStep: StepValue;
  verificationStatus?: VerificationStatus;
}

function StaticStepperTrigger({ children }: { children: ReactNode }) {
  const { stepState, orientation, isActive } = useStepperItem();

  return (
    <div
      data-state={stepState}
      data-orientation={orientation}
      aria-current={isActive ? "step" : undefined}
      className={
        "group flex w-full flex-col items-center gap-2 text-center text-sm font-medium " +
        "text-muted-foreground data-[state=active]:text-foreground " +
        "data-[state=completed]:text-foreground data-[state=error]:text-destructive"
      }
    >
      <StepperIndicator />
      <StepperLabel>{children}</StepperLabel>
    </div>
  );
}

export function VerificationStepper({
  currentStep,
  verificationStatus,
}: VerificationStepperProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.value === currentStep);

  // Convert VerificationStatus to lowercase for comparison
  const statusLower = verificationStatus?.toLowerCase() as
    | "pending"
    | "approved"
    | "rejected"
    | undefined;

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-6 shadow-sm overflow-x-auto">
      <Stepper value={currentStep} steps={STEPS} className="w-full min-w-[480px] sm:min-w-0">
        <StepperList
          aria-label={`Onboarding progress: step ${currentStepIndex + 1} of ${STEPS.length}`}
        >
          {STEPS.map((step, idx) => (
            <StepperItem
              key={step.value}
              value={step.value}
              completed={currentStepIndex > idx}
              error={
                step.value === OnboardingStepValue.ADMIN_REVIEW &&
                statusLower === "rejected"
              }
              defaultTrigger={false}
            >
              <StaticStepperTrigger>{step.label}</StaticStepperTrigger>
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
    </div>
  );
}
