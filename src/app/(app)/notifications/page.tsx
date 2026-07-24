import type { Metadata } from "next";
import { Suspense } from "react";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export const metadata: Metadata = {
  title: "Notifications | Smart NUB Campus",
  description:
    "View your notifications — stay updated on connections, messages, discussions, and more.",
  openGraph: {
    title: "Notifications | Smart NUB Campus",
    description: "View your notifications on Smart NUB Campus.",
    type: "website",
  },
};

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <NotificationsClient />
    </Suspense>
  );
}
