import serverApi from "@/lib/server-api";
import type {
  ListNotificationsParams,
  NotificationListResponse,
  UnreadCountResponse,
} from "@/types/notification.types";

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const notificationService = {
  async listNotifications(
    params: ListNotificationsParams = {},
  ): Promise<NotificationListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<NotificationListResponse>(
      `/notifications${query}`,
      { tags: ["notifications-list"] },
    );
    return response.data!;
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await serverApi.get<UnreadCountResponse>(
      "/notifications/unread-count",
      { tags: ["unread-count"] },
    );
    return response.data!;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await serverApi.patch(`/notifications/${notificationId}/read`, {});
  },

  async markAllAsRead(): Promise<void> {
    await serverApi.patch("/notifications/read-all", {});
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await serverApi.del(`/notifications/${notificationId}`);
  },
};
