"use client";

import { Plus, Inbox, Star, Users, Archive } from "lucide-react";
import type { Conversation } from "@/types/message.types";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { UnreadBadge } from "./unread-badge";
import { OnlineStatus } from "./online-status";
import { getConversationDisplay } from "./conversation-utils";
import { formatRelativeShort } from "./time";
import { cn } from "@/lib/utils";

export type SidebarTab = "inbox" | "starred" | "groups" | "archive";

interface MessagesSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  /** Group conversations (for the Groups list section). */
  groups: Conversation[];
  currentUserId: string;
  onlineUsers: Set<string>;
  onNewMessage: () => void;
  onSelectGroup: (id: string) => void;
  activeConversationId: string | null;
  /** Count of online connections (for the Stay Connected indicator). */
  onlineConnectionsCount: number;
}

const TABS: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
  { id: "inbox", label: "Inbox", icon: <Inbox className="size-4" /> },
  { id: "starred", label: "Starred", icon: <Star className="size-4" /> },
  { id: "groups", label: "Groups", icon: <Users className="size-4" /> },
  { id: "archive", label: "Archive", icon: <Archive className="size-4" /> },
];

/**
 * Column 1: New button, Inbox/Starred/Groups/Archive tabs, the groups list,
 * and the "Stay Connected" online-presence indicator.
 */
export function MessagesSidebar({
  activeTab,
  onTabChange,
  groups,
  currentUserId,
  onlineUsers,
  onNewMessage,
  onSelectGroup,
  activeConversationId,
  onlineConnectionsCount,
}: MessagesSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <Button onClick={onNewMessage} className="w-full justify-start gap-2">
        <Plus className="size-4" />
        New
      </Button>

      {/* Tabs */}
      <nav className="flex flex-col gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>

      <div className="h-px bg-border" />

      {/* Groups list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Groups
        </p>
        {groups.length === 0 ? (
          <p className="px-1 text-xs text-muted-foreground">No groups yet.</p>
        ) : (
          <ul className="space-y-1">
            {groups.map((g) => {
              const { name, image } = getConversationDisplay(g, currentUserId);
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => onSelectGroup(g.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted",
                      g.id === activeConversationId && "bg-muted",
                    )}
                  >
                    <Avatar id={g.id} name={name} src={image} className="size-8" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {g.lastMessage?.content
                          ? `${g.lastMessage.sender?.name ?? ""}: ${g.lastMessage.content}`
                          : "No messages"}
                      </p>
                    </div>
                    <UnreadBadge count={g.unreadCount ?? 0} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Stay Connected */}
      <div className="rounded-xl border bg-card p-3 ring-1 ring-foreground/5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Stay Connected
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <OnlineStatus online={onlineConnectionsCount > 0} showLabel />
          <span className="text-xs text-muted-foreground">
            {onlineConnectionsCount} online
          </span>
        </div>
      </div>
    </div>
  );
}
