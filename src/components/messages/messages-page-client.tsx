"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSocket, useSocketEvent } from "@/hooks/use-socket";
import { messageClientService as messageService } from "@/services/message.client.service";
import type { Conversation, Message, ConversationType } from "@/types/message.types";
import type { Message as SocketMessage } from "@/lib/types/socket-events";
import { MessagesLayout } from "./messages-layout";
import { MessagesSidebar, type SidebarTab } from "./messages-sidebar";
import { ConversationList } from "./conversation-list";
import { ChatArea } from "./chat-area";
import { UserProfilePanel } from "./user-profile-panel";
import { NewMessageModal } from "./new-message-modal";
import { CreateGroupModal } from "./create-group-modal";

interface MessagesPageClientProps {
  /** Currently authenticated user id. */
  currentUserId: string;
  /** Initial conversation list from the server (prefetched). */
  initialConversations: Conversation[];
  /** Map of online connection ids (for the Stay Connected indicator). */
  initialOnlineUserIds?: string[];
}

const PAGE_SIZE = 30;

/**
 * Phase 20 Messages page client. Owns all conversation/message state,
 * realtime Socket.IO wiring (messaging + typing + presence), optimistic
 * sends, and the 4-column layout via MessagesLayout.
 */
export function MessagesPageClient({
  currentUserId,
  initialConversations,
  initialOnlineUserIds = [],
}: MessagesPageClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeTab, setActiveTab] = useState<SidebarTab>("inbox");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [messagesPage, setMessagesPage] = useState(1);
  const [profileOpen, setProfileOpen] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(
    () => new Set(initialOnlineUserIds),
  );
  const [typingByConversation, setTypingByConversation] = useState<
    Record<string, { active: boolean; names?: string[]; ts?: number }>
  >({});

  const router = useRouter();
  const searchParams = useSearchParams();

  // Connect to the backend origin (not /api/v1) so Socket.IO uses the default
  // "/" namespace; the server mounts the handler at path /socket.io.
  const socketUrl =
    (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000").replace(
      /\/+$/,
      "",
    );
  const { socket, isConnected, status } = useSocket({ url: socketUrl });

  // ── Typing indicator debounce bookkeeping ──────────────────────────────────
  const typingStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingActiveRef = useRef(false);

  // ── Presence ────────────────────────────────────────────────────────────────
  useSocketEvent(socket, "presence:update", (data) => {
    setOnlineUsers((prev) => {
      const next = new Set(prev);
      if (data.status === "online") next.add(data.userId);
      else next.delete(data.userId);
      return next;
    });
  });

  // ── Incoming messages ────────────────────────────────────────────────────────
  useSocketEvent(socket, "messaging:new", (msg: SocketMessage) => {
    // Only handle messages for the active conversation in the thread;
    // conversation list previews update for all conversations.
    const incoming: Message = {
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      content: msg.content,
      type: (msg.type === "image"
        ? "IMAGE"
        : msg.type === "file"
          ? "FILE"
          : "TEXT") as Message["type"],
      isRead: msg.senderId === currentUserId,
      isDeleted: false,
      createdAt: msg.createdAt,
      updatedAt: msg.createdAt,
    };

    const isOwn = msg.senderId === currentUserId;
    const isActive = msg.conversationId === activeConversationId;

    setConversations((prev) =>
      prev
        .map((c) =>
          c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: incoming,
                lastMessageAt: msg.createdAt,
                // Don't bump unread if it's our own message or we're viewing it.
                unreadCount:
                  isOwn || isActive
                    ? 0
                    : (c.unreadCount ?? 0) + 1,
              }
            : c,
        )
        .sort(
          (a, b) =>
            new Date(b.lastMessageAt ?? 0).getTime() -
            new Date(a.lastMessageAt ?? 0).getTime(),
        ),
    );

    if (isActive) {
      setMessages((prev) => {
        if (isOwn) {
          // Replace the optimistic temp (matched by content) with the real one.
          const idx = prev.findIndex(
            (m) => m.id.startsWith("temp-") && m.content === msg.content,
          );
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = incoming;
            return dedupe(next);
          }
          return dedupe(prev.concat(incoming));
        }
        return dedupe(prev.concat(incoming));
      });
    }
  });

  // ── Read receipts ─────────────────────────────────────────────────────────────
  useSocketEvent(socket, "messaging:read-receipt", (receipt) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === receipt.messageId ? { ...m, isRead: true, readAt: receipt.readAt } : m,
      ),
    );
  });

  // ── Typing updates ────────────────────────────────────────────────────────────
  useSocketEvent(socket, "typing:update", (data) => {
    if (data.userId === currentUserId) return;
    setTypingByConversation((prev) => {
      const cur = prev[data.conversationId] ?? { active: false };
      return {
        ...prev,
        [data.conversationId]: {
          active: data.isTyping,
          names: data.isTyping ? [data.userId] : undefined,
          ts: data.isTyping ? Date.now() : cur.ts,
        },
      };
    });
    // Auto-expire a stuck typing indicator after 5s.
    if (data.isTyping) {
      setTimeout(() => {
        setTypingByConversation((prev) => {
          const cur = prev[data.conversationId];
          if (cur && cur.active && Date.now() - (cur.ts ?? 0) >= 4500) {
            return { ...prev, [data.conversationId]: { active: false } };
          }
          return prev;
        });
      }, 5000);
    }
  });

  // ── Reconnection: re-join active room + refresh data ──────────────────────────
  const refreshConversations = useCallback(async () => {
    setLoadingConvos(true);
    try {
      const res = await messageService.listConversations({ limit: 50 });
      setConversations(res.conversations ?? []);
    } catch {
      /* keep current */
    } finally {
      setLoadingConvos(false);
    }
  }, []);

  useEffect(() => {
    if (status === "connected") {
      void refreshConversations();
      if (activeConversationId) {
        socket?.emit("conversation:join", { conversationId: activeConversationId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // ── Load conversation for active id ────────────────────────────────────────────
  // Server returns messages DESC (newest first) using page/limit pagination.
  // We reverse to ASC for display and prepend older pages on scroll-up.
  const loadMessages = useCallback(
    async (conversationId: string, page = 1) => {
      setLoadingMessages(true);
      try {
        const res = await messageService.listMessages({
          conversationId,
          limit: PAGE_SIZE,
          page,
        });
        const fetched = [...(res.messages ?? [])].reverse(); // DESC → ASC
        setMessages((prev) => {
          if (page === 1) return dedupe(fetched);
          // Older page: prepend to the top (already-ascending prev).
          return dedupe(fetched.concat(prev));
        });
        setMessagesPage(page);
        setHasMore(page < (res.meta?.totalPages ?? 1));
        if (page === 1) {
          // Mark as read locally + on server.
          void messageService.markAsRead(conversationId).catch(() => {});
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId ? { ...c, unreadCount: 0 } : c,
            ),
          );
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    },
    [],
  );

  const selectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      setMessages([]);
      setHasMore(false);
      setMessagesPage(1);
      // Reflect the active conversation in the URL (?c=...).
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("c", id);
      router.replace(`?${params.toString()}`, { scroll: false });
      void loadMessages(id);
    },
    [loadMessages, router, searchParams],
  );

  // Open the conversation referenced by ?c= on first mount (deep link / reload).
  useEffect(() => {
    const c = searchParams.get("c");
    if (c && conversations.some((x) => x.id === c)) {
      setActiveConversationId(c);
      setMessagesPage(1);
      void loadMessages(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Join/leave room when the active conversation changes.
  useEffect(() => {
    if (!socket || !activeConversationId) return;
      socket.emit("conversation:join", { conversationId: activeConversationId });
      return () => {
        socket.emit("conversation:leave", { conversationId: activeConversationId });
    };
  }, [socket, activeConversationId]);

  // ── Sending (optimistic) ────────────────────────────────────────────────────
  const sendText = useCallback(
    async (text: string) => {
      if (!activeConversationId) return;
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const optimistic: Message = {
        id: tempId,
        conversationId: activeConversationId,
        senderId: currentUserId,
        content: text,
        type: "TEXT",
        isRead: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages((prev) => dedupe(prev.concat(optimistic)));

      // The socket handler persists + broadcasts; do NOT also call REST
      // (that would create a second copy). The `messaging:new` echo
      // reconciles the optimistic temp with the real record.
      socket?.emit("messaging:send", {
        conversationId: activeConversationId,
        content: text,
        type: "text",
      });
    },
    [activeConversationId, currentUserId, socket],
  );

  const sendFile = useCallback(
    async (file: File) => {
      if (!activeConversationId) return;
      const isImage = file.type.startsWith("image/");
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const optimistic: Message = {
        id: tempId,
        conversationId: activeConversationId,
        senderId: currentUserId,
        content: file.name,
        type: isImage ? "IMAGE" : "FILE",
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: file.size,
        isRead: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages((prev) => dedupe(prev.concat(optimistic)));

      try {
        const { uploadService } = await import("@/services/upload.service");
        const uploaded = await uploadService.upload(
          file,
          "message",
          isImage ? "image" : "raw",
        );
        const saved = await messageService.sendMessage(activeConversationId, {
          content: file.name,
          type: isImage ? "IMAGE" : "FILE",
        });
        // Reflect the real server id; file url comes from upload.
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...saved, id: saved.id, fileUrl: uploaded.url, filePublicId: uploaded.publicId }
              : m,
          ),
        );
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        toast.error(err instanceof Error ? err.message : "Failed to send file.");
      }
    },
    [activeConversationId, currentUserId],
  );

  // ── Typing emit (debounced) ───────────────────────────────────────────────────
  const emitTypingStart = useCallback(() => {
    if (!activeConversationId || !socket) return;
    if (!typingActiveRef.current) {
      typingActiveRef.current = true;
      socket.emit("typing:start", { conversationId: activeConversationId });
    }
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    typingStopTimer.current = setTimeout(() => {
      typingActiveRef.current = false;
      socket.emit("typing:stop", { conversationId: activeConversationId });
    }, 3000);
  }, [activeConversationId, socket]);

  const emitTypingStop = useCallback(() => {
    if (!activeConversationId || !socket || !typingActiveRef.current) return;
    typingActiveRef.current = false;
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    socket.emit("typing:stop", { conversationId: activeConversationId });
  }, [activeConversationId, socket]);

  const loadOlder = useCallback(() => {
    if (!activeConversationId || loadingMessages || !hasMore) return;
    void loadMessages(activeConversationId, messagesPage + 1);
  }, [activeConversationId, loadingMessages, hasMore, messagesPage, loadMessages]);

  // ── Derived lists per tab ──────────────────────────────────────────────────────
  const filteredConversations = useMemo(() => {
    switch (activeTab) {
      case "groups":
        return conversations.filter((c) => c.type === ("GROUP" as ConversationType));
      case "starred":
        // Starred conversations are not modeled server-side; treat as empty set
        // for now (kept as a distinct tab per design).
        return [];
      case "archive":
        // Archive not modeled server-side yet; empty.
        return [];
      case "inbox":
      default:
        return conversations;
    }
  }, [conversations, activeTab]);

  const groupsList = useMemo(
    () => conversations.filter((c) => c.type === ("GROUP" as ConversationType)),
    [conversations],
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const sharedFiles = useMemo(
    () =>
      messages.filter(
        (m) => m.type === "FILE" || m.type === "IMAGE",
      ),
    [messages],
  );

  const activeTyping = activeConversationId
    ? typingByConversation[activeConversationId] ?? { active: false }
    : { active: false };

  const onlineConnectionsCount = onlineUsers.size;

  return (
    <>
      {status !== "connected" && (
        <div className="sticky top-0 z-20 flex items-center justify-center gap-2 bg-amber-500/10 py-1 text-xs text-amber-700">
          <Loader2 className="size-3 animate-spin" />
          {status === "connecting" ? "Connecting…" : "Reconnecting…"}
        </div>
      )}

      <MessagesLayout
        profileOpen={profileOpen}
        sidebar={
          <MessagesSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            groups={groupsList}
            currentUserId={currentUserId}
            onlineUsers={onlineUsers}
            onNewMessage={() => setNewOpen(true)}
            onNewGroup={() => setCreateGroupOpen(true)}
            onSelectGroup={selectConversation}
            activeConversationId={activeConversationId}
            onlineConnectionsCount={onlineConnectionsCount}
          />
        }
        conversationList={
          <ConversationList
            conversations={filteredConversations}
            currentUserId={currentUserId}
            activeConversationId={activeConversationId}
            onlineUsers={onlineUsers}
            typingByConversation={typingByConversation}
            onSelect={selectConversation}
          />
        }
        chat={
          <ChatArea
            conversation={activeConversation}
            currentUserId={currentUserId}
            messages={messages}
            loadingMessages={loadingMessages}
            hasMore={hasMore}
            onlineUsers={onlineUsers}
            typing={activeTyping}
            profileOpen={profileOpen}
            onToggleProfile={() => setProfileOpen((v) => !v)}
            onSend={sendText}
            onSendFile={sendFile}
            onTypingStart={emitTypingStart}
            onTypingStop={emitTypingStop}
            onLoadOlder={loadOlder}
          />
        }
        profile={
          <UserProfilePanel
            conversation={activeConversation}
            currentUserId={currentUserId}
            onlineUsers={onlineUsers}
            sharedFiles={sharedFiles}
            onClose={() => setProfileOpen(false)}
          />
        }
      />

      <NewMessageModal
        open={newOpen}
        onOpenChange={setNewOpen}
        currentUserId={currentUserId}
        onStart={(c) => {
          setConversations((prev) =>
            prev.some((x) => x.id === c.id) ? prev : [c, ...prev],
          );
          selectConversation(c.id);
        }}
      />

      <CreateGroupModal
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
        currentUserId={currentUserId}
        createGroup={(data) => messageService.createGroup(data)}
        onCreated={(c) => {
          const conv = c as Conversation;
          setActiveTab("groups");
          setConversations((prev) =>
            prev.some((x) => x.id === conv.id) ? prev : [conv, ...prev],
          );
          selectConversation(conv.id);
        }}
      />
    </>
  );
}

/** Remove duplicate messages by id (guards against socket + REST race). */
function dedupe(list: Message[]): Message[] {
  const seen = new Set<string>();
  const out: Message[] = [];
  for (const m of list) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
  }
  return out.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
