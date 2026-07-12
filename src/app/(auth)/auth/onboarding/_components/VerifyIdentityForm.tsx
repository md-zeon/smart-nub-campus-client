"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/forms/fields/text-field";
import { DateField } from "@/components/forms/date-field";
import { FileUploadField } from "@/components/forms/file-upload-field";
import { Button } from "@/components/ui/button";
import {
  verificationSchema,
  type VerificationFormValues,
} from "@/schemas/onboarding/verification.schema";

interface VerifyIdentityFormProps {
  onSubmit: (data: VerificationFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function VerifyIdentityForm({
  onSubmit,
  isSubmitting,
}: VerifyIdentityFormProps) {
  const { control, handleSubmit } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      studentId: "",
      idCardImage: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <TextField
          control={control}
          name="name"
          label={
            <>
              Full Name <span className="text-destructive">*</span>
            </>
          }
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        <TextField
          control={control}
          name="email"
          type="email"
          label={
            <>
              Email Address <span className="text-destructive">*</span>
            </>
          }
          placeholder="Enter your email address"
          disabled={isSubmitting}
        />
        <DateField
          control={control}
          name="dateOfBirth"
          label={
            <>
              Date of Birth <span className="text-destructive">*</span>
            </>
          }
        />
        <TextField
          control={control}
          name="studentId"
          label={
            <>
              Student ID <span className="text-destructive">*</span>
            </>
          }
          placeholder="Enter your 11-digit student ID"
          disabled={isSubmitting}
          maxLength={11}
        />
        <FileUploadField
          control={control}
          name="idCardImage"
          context="verification"
          label={
            <>
              Student ID Card <span className="text-destructive">*</span>
            </>
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit for Verification"}
      </Button>
    </form>
  );
}
