import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ROUTES from "@/constants/routes";
import { UserRole } from "./constants/enums";

/** Routes that must never be intercepted by this proxy. */
const EXCLUDED_PREFIXES = ["/api", "/_next", "/favicon.ico"];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Backend API envelope wrapping the actual identity payload.
 */
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Identity payload inside the envelope returned by /identity/me.
 */
interface IdentityPayload {
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
 * Checks the user's session and role via the backend identity endpoint.
 * Returns the user's role or null if unauthenticated / unreachable.
 */
async function getUserRole(
  request: NextRequest,
): Promise<string | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/identity/me`,
      {
        headers: { Cookie: request.headers.get("cookie") || "" },
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    const body = (await response.json()) as ApiEnvelope<IdentityPayload>;
    return body.data?.user?.role ?? null;
  } catch {
    return null;
  }
}

/**
 * Centralised proxy (Next.js 16).
 *
 * Responsibilities:
 *  - Protect authenticated-only routes; redirect unauthenticated users to login.
 *  - Redirect authenticated users away from auth pages (login, register, etc.).
 *  - Role-based routing:
 *      * ADMIN users visiting "/" are redirected to "/admin".
 *      * Non-ADMIN users visiting "/admin" are redirected to "/".
 *      * Unauthenticated users visiting "/admin" are sent to login.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for excluded paths (API routes, static assets, etc.)
  if (isExcluded(pathname)) {
    return NextResponse.next();
  }

  const isHome = pathname === "/";
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminRoute = pathname.startsWith("/admin");

  // Fast-path: not a route we handle — pass through.
  if (!isHome && !isAuthPage && !isAdminRoute) {
    return NextResponse.next();
  }

  // --- From here on we handle auth pages, admin routes, and home ---

  const role = await getUserRole(request);
  const isAuthenticated = role !== null;

  // ── Auth pages (login, register, forgot-password, etc.) ───────────
  if (isAuthPage) {
    if (isAuthenticated) {
      // Already logged in — redirect away from auth pages.
      // Respect any "redirect" query param that was set before login.
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      if (role === UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(
        new URL(redirectParam || ROUTES.HOME, request.url),
      );
    }
    return NextResponse.next();
  }

  // ── Admin routes (/admin, /admin/users, /admin/verifications) ─────
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
    return NextResponse.next();
  }

  // ── Home (/) — redirect ADMIN users to /admin ──────────────────────
  if (isHome && isAuthenticated && role === UserRole.ADMIN) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
