import serverApi from "@/lib/server-api";

export const authService = {
  async getEmailByStudentId(studentId: string): Promise<string> {
    const response = await serverApi.get<{ email: string }>(
      `/account/email-by-student-id/${studentId}`,
    );

    if (!response.data || !response.data.email) {
      throw new Error("Invalid student ID or Password. Please try again.");
    }
    return response.data.email;
  },
  /**
   * Send email verification OTP
   */
  // async sendVerificationOTP(email: string): Promise<void> {
  //   await serverApi.post("/auth/email-otp/send-verification-otp", { email });
  // },

  /**
   * Verify email with OTP
   */
  // async verifyEmail(email: string, otp: string): Promise<void> {
  //   await serverApi.post("/auth/email-otp/verify-email", { email, otp });
  // },

  /**
   * Request password reset OTP
   */
  // async forgotPassword(email: string): Promise<void> {
  //   await serverApi.post("/auth/email-otp/request-password-reset", { email });
  // },

  /**
   * Reset password with OTP
   */
  // async resetPassword(
  //   email: string,
  //   otp: string,
  //   password: string,
  // ): Promise<void> {
  //   await serverApi.post("/auth/email-otp/reset-password", {
  //     email,
  //     otp,
  //     password,
  //   });
  // },
};
