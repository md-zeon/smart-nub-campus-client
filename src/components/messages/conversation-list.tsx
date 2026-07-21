"use client";

import { useState, useMemo } from "react";
import { Search, MessageSquare } from "lucide-react";
import type { Conversation } from "@/types/message.types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ConversationItem } from "./conversation-item";

type FilterTab = "all" | "unread";

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  activeConversationId: string | null;
  onlineUsers: Set<string>;
  /** Map of conversationId -> whether someone (other than current user) is typing. */
  typingByConversation: Record<string, { active: boolean; names?: string[] }>;
  onSelect: (id: string) => void;
  className?: string;
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

/**
 * Column 2: search input + All/Unread filter tabs + the scrollable list of
 * conversations for the active sidebar tab.
 */
export function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  onlineUsers,
  typingByConversation,
  onSelect,
  className,
}: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversations.filter((c) => {
      if (filter === "unread" && (c.unreadCount ?? 0) <= 0) return false;
      if (!q) return true;
      const display = c.type === "GROUP"
        ? c.name ?? ""
        : (c.conversationParticipants
            ?.find((p) => p.userId !== currentUserId)
            ?.user?.name ?? "");
      const preview = c.lastMessage?.content ?? "";
      return (
        display.toLowerCase().includes(q) || preview.toLowerCase().includes(q)
      );
    });
  }, [conversations, filter, search, currentUserId]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Search */}
      <div className="relative p-3">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="pl-9"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-3 pb-2">
        {FILTER_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              filter === t.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <MessageSquare className="size-7 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              {search ? "No conversations found." : "No conversations here."}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                currentUserId={currentUserId}
                active={c.id === activeConversationId}
                onlineUsers={onlineUsers}
                typing={typingByConversation[c.id]?.active ?? false}
                typingNames={typingByConversation[c.id]?.names}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
