import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ROUTES from "@/constants/routes";

/**
 * Routes that require authentication.
 * The HOME entry is matched exactly (not as a prefix) to avoid
 * catching every path.
 */
const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.RESOURCES,
  ROUTES.TEAMS,
  ROUTES.DISCUSSIONS,
  ROUTES.QA,
  ROUTES.AI,
  ROUTES.CONNECTIONS,
  ROUTES.MESSAGES,
  ROUTES.NOTIFICATIONS,
  ROUTES.SETTINGS,
];

/** Routes that should only be accessible to unauthenticated users. */
const AUTH_ROUTES = [ROUTES.AUTH];

/** Paths that must never be intercepted by this proxy. */
const EXCLUDED_PREFIXES = ["/api", "/_next", "/favicon.ico"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for excluded paths (API routes, static assets, etc.)
  if (isExcluded(pathname)) {
    return NextResponse.next();
  }

  const needsAuth = isProtectedRoute(pathname);
  const isAuthPage = isAuthRoute(pathname);

  // Fast-path: neither protected nor auth — pass through
  if (!needsAuth && !isAuthPage) {
    return NextResponse.next();
  }

  // Check session by calling the backend identity endpoint
  let isAuthenticated = false;
  try {
    const sessionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/identity/me`,
      {
        headers: { Cookie: request.headers.get("cookie") || "" },
        // Do not cache session checks
        cache: "no-store",
      },
    );
    isAuthenticated = sessionResponse.ok;
  } catch {
    // API unreachable — treat as unauthenticated
  }

  // Redirect unauthenticated users away from protected routes
  if (needsAuth && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    // Respect any "redirect" param that was set before login
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    return NextResponse.redirect(
      new URL(redirectParam || ROUTES.HOME, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
