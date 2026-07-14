import { z } from "zod";

export const verificationSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  studentId: z
    .string()
    .min(11, "Student ID must be 11 digits")
    .max(11, "Student ID must be 11 digits")
    .regex(/^\d{11}$/, "Student ID must contain only digits"),
  idCardImage: z.string().min(1, "Please upload your student ID card"),
  idCardImagePublicId: z.string().optional(),
});

export type VerificationFormValues = z.infer<typeof verificationSchema>;
