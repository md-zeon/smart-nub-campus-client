import { UserRole, UserStatus } from "@/constants/enums";
import { env } from "@/env";
import { Session, User } from "better-auth";
import { cookies } from "next/headers";

interface SessionResponse {
  success: boolean;
  message: string;
  data: {
    session: Session;
    user: User & {
      role: UserRole;
      status: UserStatus;
      isDeleted: boolean;
      deletedAt: Date | null;
    };
  } | null;
}

export const userService = {
  getSession: async (): Promise<SessionResponse> => {
    const AUTH_URL = env.AUTH_URL;
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store", // always get the latest session data
      });

      const session = await res.json();

      if (session == null) {
        return {
          success: false,
          message: "No active session found.",
          data: null,
        };
      }

      return {
        success: true,
        message: "Session retrieved successfully.",
        data: session,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user session.",
        data: null,
      };
    }
  },
};
