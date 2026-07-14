"use server";

import { authService } from "@/services/auth.service";

export async function getEmailByStudentId(studentId: string): Promise<string> {
  return await authService.getEmailByStudentId(studentId);
}

export async function requestPasswordReset(email: string): Promise<void> {
  return await authService.forgotPassword(email);
}

export async function requestPasswordResetByIdentifier(
  identifier: string,
): Promise<string> {
  return await authService.forgotPasswordWithIdentifier(identifier);
}
