"use server";

import { authService } from "@/services/auth.service";

export const getEmailByStudentId = async (
  studentId: string,
): Promise<string> => {
  return await authService.getEmailByStudentId(studentId);
};
