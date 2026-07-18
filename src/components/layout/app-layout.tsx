"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppLayoutProps {
  children: React.ReactNode;
  /** Current user's display name. */
  userName?: string;
  /** Current user's avatar URL. */
  userImage?: string;
}

/**
 * The main app shell that combines the sidebar, topbar, and main content area.
 * Used by authenticated route layouts.
 *
 * @example
 * ```tsx
 * <AppLayout userName={user.name} userImage={user.image}>
 *   <DashboardPage />
 * </AppLayout>
 * ```
 */
export function AppLayout({ children, userName, userImage }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <Sidebar userName={userName} />

      {/* ── Main area ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <Topbar userName={userName} userImage={userImage} />

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
