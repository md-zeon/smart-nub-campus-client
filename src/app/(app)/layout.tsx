import { serverApi } from "@/lib/server-api";
import { AppLayout } from "@/components/layout/app-layout";

interface IdentityMeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string | null;
  };
  student: Record<string, unknown> | null;
  admin: Record<string, unknown> | null;
}

/**
 * Server-side layout for all authenticated (app) routes.
 * Fetches the current user's identity from the backend and passes it
 * down to the client AppLayout shell (TopNav + content area).
 *
 * The middleware guarantees that only authenticated users reach this layout.
 */
export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName: string | undefined;
  let userImage: string | undefined;

  try {
    const result = await serverApi.get<IdentityMeResponse>("/identity/me", {
      cache: "no-store",
    });
    userName = result.data?.user?.name;
    userImage = result.data?.user?.image ?? undefined;
  } catch {
    // Middleware handles auth redirect; this is a safety fallback.
  }

  return (
    <AppLayout userName={userName} userImage={userImage}>
      {children}
    </AppLayout>
  );
}
