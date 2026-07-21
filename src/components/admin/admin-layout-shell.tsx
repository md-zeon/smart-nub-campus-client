"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

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
 * Client-side admin layout shell.
 * Handles fetching user identity and rendering the sidebar + content area.
 */
export function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Admin");
  const [userImage, setUserImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000"}/api/v1/identity/me`,
          { credentials: "include" },
        );

        if (result.ok) {
          const data: IdentityMeResponse = await result.json();
          setUserName(data.user.name);
          setUserImage(data.user.image ?? undefined);
        }
      } catch {
        // Proxy already guarantees only authenticated admins reach this layout.
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserInfo();
  }, []);

  /** Show loading state while fetching user info for the sidebar. */
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar skeleton */}
        <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gray-900">
          <div className="flex h-16 items-center gap-2 border-b border-gray-700 px-6">
            <Skeleton className="size-8 rounded-lg bg-gray-700" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20 bg-gray-700" />
              <Skeleton className="h-3 w-24 bg-gray-700" />
            </div>
          </div>
          <div className="space-y-1 p-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-full rounded-lg bg-gray-700"
              />
            ))}
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="flex-1 ml-64 pt-16 p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar userName={userName} userImage={userImage} />
        <main className="flex-1 ml-64 pt-16">{children}</main>
      </div>
    </div>
  );
}
