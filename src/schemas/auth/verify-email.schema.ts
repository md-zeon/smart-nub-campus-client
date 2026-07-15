import { z } from "zod";

/**
 * Schema for sending verification code (email input step)
 * Used when user enters email directly on verify-email page
 */
export const sendVerificationSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

/**
 * Schema for verifying email with OTP (OTP input step)
 * Email is included for form submission to Better Auth
 */
export const verifyEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain only numbers."),
});

export type SendVerificationFormValues = z.infer<typeof sendVerificationSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
