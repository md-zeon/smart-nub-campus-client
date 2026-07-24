"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification.types";
import {
  Bell,
  CheckCircle,
  MessageCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Users,
  Award,
  AlertCircle,
  Inbox,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<Notification["type"], LucideIcon> = {
  CONNECTION_REQUEST: Users,
  CONNECTION_ACCEPTED: CheckCircle,
  MESSAGE: MessageCircle,
  MESSAGE_REQUEST: MessageSquare,
  RESOURCE_UPVOTE: ThumbsUp,
  RESOURCE_DOWNVOTE: ThumbsDown,
  RESOURCE_COMMENT: MessageSquare,
  RESOURCE_REPORT_REVIEWED: AlertCircle,
  DISCUSSION_REPLY: MessageSquare,
  DISCUSSION_MENTION: MessageSquare,
  QUESTION_ANSWER: FileText,
  QUESTION_ACCEPTED: CheckCircle,
  TEAM_APPLICATION: Users,
  TEAM_APPLICATION_ACCEPTED: CheckCircle,
  TEAM_APPLICATION_REJECTED: AlertCircle,
  EVENT_REMINDER: Bell,
  BADGE_UNLOCKED: Award,
  SYSTEM: Bell,
};

const COLOR_MAP: Record<Notification["type"], string> = {
  CONNECTION_REQUEST: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  CONNECTION_ACCEPTED: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  MESSAGE: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  MESSAGE_REQUEST: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  RESOURCE_UPVOTE: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  RESOURCE_DOWNVOTE: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  RESOURCE_COMMENT: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  RESOURCE_REPORT_REVIEWED: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  DISCUSSION_REPLY: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  DISCUSSION_MENTION: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  QUESTION_ANSWER: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  QUESTION_ACCEPTED: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  TEAM_APPLICATION: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  TEAM_APPLICATION_ACCEPTED: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  TEAM_APPLICATION_REJECTED: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  EVENT_REMINDER: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  BADGE_UNLOCKED: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  SYSTEM: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const Icon = ICON_MAP[notification.type] || Inbox;
  const colorClass = COLOR_MAP[notification.type] || "bg-gray-100 text-gray-600";

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
        notification.isRead
          ? "border-transparent bg-background"
          : "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
        notification.link && "cursor-pointer hover:bg-muted/50",
      )}
      onClick={() => {
        if (!notification.isRead) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", colorClass)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", !notification.isRead && "font-medium")}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <span className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />
      )}
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link} className="block">{content}</Link>;
  }

  return content;
}
