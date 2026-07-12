import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  basePath: "/api/v1/auth", // change default path from /api/auth to /api/v1/auth
  plugins: [emailOTPClient()],
});
