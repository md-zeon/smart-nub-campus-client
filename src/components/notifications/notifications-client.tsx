"use client";

import { useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useNotifications } from "@/hooks/use-notifications";
import { useUnreadCount } from "@/hooks/use-unread-count";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvent } from "@/hooks/use-socket";
import { NotificationItem } from "./notification-item";
import type { Notification as AppNotification } from "@/types/notification.types";

export function NotificationsClient() {
  const {
    notifications,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    prependNotification,
  } = useNotifications();

  const { count: unreadCount, decrement, refresh: refreshCount } = useUnreadCount();
  const { socket } = useSocket();

  // Listen for real-time notifications
  useSocketEvent(socket, "notification:new", (data) => {
    const notification = data as unknown as AppNotification;
    prependNotification(notification);
    // Refresh count after a short delay to avoid race conditions
    setTimeout(() => refreshCount(), 500);
  });

  const handleMarkAsRead = useCallback(
    (id: string) => {
      markAsRead(id);
      decrement(1);
    },
    [markAsRead, decrement],
  );

  const handleMarkAllAsRead = useCallback(() => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    markAllAsRead();
    decrement(unreadCount);
  }, [markAllAsRead, decrement, notifications]);

  // Refresh on mount to sync with any changes
  useEffect(() => {
    refresh();
    refreshCount();
  }, [refresh, refreshCount]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadNotifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="mt-6">
        {notifications.length === 0 && !isLoading ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="When you receive notifications, they will appear here."
          />
        ) : (
          <div className="space-y-2">
            {/* Unread section */}
            {unreadNotifications.length > 0 && (
              <>
                <p className="px-1 text-xs font-medium uppercase text-muted-foreground">
                  Unread
                </p>
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </>
            )}

            {/* Read section */}
            {readNotifications.length > 0 && (
              <>
                {unreadNotifications.length > 0 && (
                  <div className="my-4 h-px bg-border" />
                )}
                <p className="px-1 text-xs font-medium uppercase text-muted-foreground">
                  Earlier
                </p>
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
