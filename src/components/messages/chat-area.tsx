"use client";

import { useEffect, useRef, useMemo } from "react";
import { PanelRight, Users, MessageSquare } from "lucide-react";
import type { Conversation, Message } from "@/types/message.types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { OnlineStatus } from "./online-status";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { GroupChatHeader } from "./group-chat-header";
import { TypingIndicator } from "./typing-indicator";
import { getConversationDisplay } from "./conversation-utils";
import { formatDayLabel, isSameDay } from "./time";

interface ChatAreaProps {
  conversation: Conversation | null;
  currentUserId: string;
  messages: Message[];
  loadingMessages: boolean;
  hasMore: boolean;
  onlineUsers: Set<string>;
  /** Whether the other participant(s) in THIS conversation are typing. */
  typing: { active: boolean; names?: string[] };
  profileOpen: boolean;
  onToggleProfile: () => void;
  onSend: (text: string) => void;
  onSendFile: (file: File) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  onLoadOlder: () => void;
}

/**
 * Column 3: chat header, scrollable date-grouped message thread, and the
 * composer. Handles scroll-to-bottom on new messages and load-older on
 * scroll-to-top (infinite scroll upward).
 */
export function ChatArea({
  conversation,
  currentUserId,
  messages,
  loadingMessages,
  hasMore,
  onlineUsers,
  typing,
  profileOpen,
  onToggleProfile,
  onSend,
  onSendFile,
  onTypingStart,
  onTypingStop,
  onLoadOlder,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(0);

  const { name, image, isGroup } = conversation
    ? getConversationDisplay(conversation, currentUserId)
    : { name: "", image: undefined, isGroup: false };

  const otherId = !isGroup && conversation
    ? conversation.conversationParticipants?.find((p) => p.userId !== currentUserId)
        ?.userId
    : undefined;
  const isOnline = otherId ? onlineUsers.has(otherId) : false;

  // Group messages into day buckets in chronological order.
  const groups = useMemo(() => {
    const buckets: { label: string; items: Message[] }[] = [];
    for (const m of messages) {
      const label = formatDayLabel(m.createdAt);
      const last = buckets[buckets.length - 1];
      if (last && last.label === label) last.items.push(m);
      else buckets.push({ label, items: [m] });
    }
    return buckets;
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive (only if already near bottom
  // or on first load), preserving position when prepending older messages.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const grew = messages.length > prevLenRef.current;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (grew && (nearBottom || prevLenRef.current === 0)) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLenRef.current = messages.length;
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loadingMessages || !hasMore) return;
    if (el.scrollTop < 60) onLoadOlder();
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <MessageSquare className="size-10 opacity-40" />
        <p className="text-sm">Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3">
        {isGroup ? (
          <GroupChatHeader
            conversation={conversation}
            onlineUsers={onlineUsers}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="flex items-center gap-3">
            <Avatar id={conversation.id} name={name} src={image} className="size-10" />
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              <OnlineStatus online={isOnline} showLabel />
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleProfile}
          aria-label="Toggle profile panel"
          className={cn(profileOpen && "bg-muted")}
        >
          {isGroup ? <Users className="size-4" /> : <PanelRight className="size-4" />}
        </Button>
      </div>

      {/* Thread */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/40 px-4 py-4"
      >
        {loadingMessages && messages.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-14 w-2/3 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {hasMore && (
              <p className="py-2 text-center text-xs text-[#8696a0]">
                Load older messages…
              </p>
            )}
            {groups.map((bucket) => (
              <div key={bucket.label} className="space-y-2.5">
                <div className="sticky top-0 z-10 flex justify-center py-1">
                  <span className="rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-foreground/10 backdrop-blur">
                    {bucket.label}
                  </span>
                </div>
                {bucket.items.map((m, idx) => {
                  const prev = bucket.items[idx - 1];
                  const showSender =
                    !prev || prev.senderId !== m.senderId || !isSameDay(prev.createdAt, m.createdAt);
                  return (
                    <MessageBubble
                      key={m.id}
                      message={m}
                      isOwn={m.senderId === currentUserId}
                      showSender={showSender}
                      participants={
                        conversation.conversationParticipants?.map((p) => ({
                          id: p.userId,
                          name: p.user?.name ?? "User",
                          image: p.user?.image,
                        })) ?? []
                      }
                    />
                  );
                })}
              </div>
            ))}

            {typing.active && (
              <div className="flex items-center gap-2 pl-10 text-xs text-muted-foreground">
                <TypingIndicator names={typing.names} />
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <MessageInput
        onSend={onSend}
        onSendFile={onSendFile}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </div>
  );
}
