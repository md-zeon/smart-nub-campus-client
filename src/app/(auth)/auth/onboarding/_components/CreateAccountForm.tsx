"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/forms/fields/password-field";
import { createAccount } from "@/actions/account.action";
import { parseStudentId } from "@/lib/student-id-parser";
import {
  createAccountSchema,
  type CreateAccountFormValues,
} from "@/schemas/onboarding/account.schema";
import { OnboardingStepValue } from "@/constants/enums";
import { VerificationRequestData } from "@/types";

interface CreateAccountFormProps {
  defaultName: string;
  defaultStudentId: string;
  defaultEmail: string;
  setCurrentStep: (step: OnboardingStepValue) => void;
  setVerificationRequest: (
    verificationRequest: VerificationRequestData,
  ) => void;
}

export function CreateAccountForm({
  defaultName,
  defaultStudentId,
  defaultEmail,
  setCurrentStep,
  setVerificationRequest,
}: CreateAccountFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const studentIdInfo = parseStudentId(defaultStudentId);

  const { control, handleSubmit } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = useCallback(async (values: CreateAccountFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createAccount(values.password);
      sessionStorage.setItem("pending_verification_email", result.user.email);
      sessionStorage.setItem("pending_verification_source", "signup");
      setCurrentStep(result.currentStep);
      setVerificationRequest(result.verificationRequest);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Account creation failed.";
      setError(message);
      setIsSubmitting(false);
    }
  }, [setCurrentStep, setVerificationRequest]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Student ID - Read only */}
      <div className="space-y-2">
        <Label>Student ID</Label>
        <Input value={defaultStudentId} disabled className="bg-muted/50" />
      </div>

      {/* Full Name - Read only */}
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input value={defaultName} disabled className="bg-muted/50" />
      </div>

      {/* Department - Read only */}
      <div className="space-y-2">
        <Label>Department</Label>
        <Input
          value={studentIdInfo.data?.department.fullName}
          disabled
          className="bg-muted/50"
        />
      </div>

      {/* Admission Year - Read only */}
      <div className="space-y-2">
        <Label>Admission Year</Label>
        <Input
          value={studentIdInfo.data?.admissionYear}
          disabled
          className="bg-muted/50"
        />
      </div>

      {/* Email - Read only */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          value={defaultEmail}
          type="email"
          disabled
          className="bg-muted/50"
        />
      </div>

      {/* Password */}
      <PasswordField
        control={control}
        name="password"
        label="Password *"
        description="Password must be at least 8 characters with uppercase, lowercase, and numbers."
        showStrength
        disabled={isSubmitting}
      />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Account..." : "Create Account & Verify Email"}
      </Button>
    </form>
  );
}
