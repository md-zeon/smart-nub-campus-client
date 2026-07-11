"use server";

import { authService } from "@/services/auth.service";

export async function getEmailByStudentId(studentId: string): Promise<string> {
  return await authService.getEmailByStudentId(studentId);
}
