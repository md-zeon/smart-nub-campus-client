import serverApi from "@/lib/server-api";
import type { CreateAccountResponse } from "@/types";

export const accountService = {
  /**
   * Create account after verification approval.
   * Only password is sent — email and name come from the verification request on the backend.
   * Matches backend POST /account/create response
   */
  createAccount: async (
    password: string,
    gender?: string,
    image?: string,
    imagePublicId?: string,
  ): Promise<CreateAccountResponse> => {
    const response = await serverApi.post<CreateAccountResponse>(
      "/account/create",
      {
        password,
        gender,
        image,
        imagePublicId,
      },
    );

    return response.data!;
  },

  getEmailByStudentId: async (studentId: string): Promise<string | null> => {
    try {
      const response = await serverApi.get<{ email: string }>(
        `/account/email-by-student-id/${studentId}`,
      );
      return response.data?.email ?? null;
    } catch {
      return null;
    }
  },
};
