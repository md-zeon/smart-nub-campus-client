import { z } from "zod";

export const verifyEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain only numbers."),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
