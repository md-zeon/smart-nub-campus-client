"use client";

import { Stepper, StepperList, StepperItem } from "@/components/ui/stepper"; //

const STEPS = [
  { value: "verify-identity", label: "Verify Identity" },
  { value: "admin-review", label: "Admin Review" },
  { value: "create-account", label: "Create Account" },
  { value: "success", label: "Done" },
] as const;

interface VerificationStepperProps {
  currentStep: "verify-identity" | "admin-review" | "create-account"; // add more steps as needed
}

export function VerificationStepper({ currentStep }: VerificationStepperProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.value === currentStep);

  return (
    <div className="w-full rounded-3xl border bg-card p-6 shadow-sm">
      <Stepper
        value={currentStep}
        steps={STEPS} // Controlled purely by form state indicators
        className="w-full"
      >
        <StepperList className="w-full justify-between">
          {STEPS.map((step, idx) => (
            <StepperItem
              key={step.value}
              value={step.value}
              completed={currentStepIndex > idx} // Controlled purely by form state indicators
              className="pointer-events-none" // Controlled purely by form state indicators
            >
              {step.label}
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
    </div>
  );
}
