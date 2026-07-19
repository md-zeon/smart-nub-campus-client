import { apiClient } from "@/lib/api-client";
import type {
  Conversation,
  Message,
  ListConversationsParams,
  ListMessagesParams,
  ConversationListResponse,
  MessageListResponse,
} from "@/types/message.types";

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

function unwrap<T>(data: unknown): T {
  return ((data as { data?: T })?.data ?? (data as T)) as T;
}

/**
 * Browser-side wrapper around the Messages endpoints. Uses `apiClient`
 * (cookie-forwarding fetch) instead of the server-only `serverApi`, so it is
 * safe to import from client components.
 */
export const messageClientService = {
  async listConversations(
    params: ListConversationsParams = {},
  ): Promise<ConversationListResponse> {
    const query = buildQueryString(params);
    const res = await apiClient.get<ConversationListResponse>(
      `/messages/conversations${query}`,
    );
    const payload = unwrap<{ data?: Conversation[]; conversations?: Conversation[]; meta?: ConversationListResponse["meta"] }>(res.data);
    // Server returns { data, meta }; normalize to the client { conversations, meta } shape.
    return {
      conversations: payload.conversations ?? payload.data ?? [],
      meta: payload.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  },

  async getConversationById(id: string): Promise<Conversation> {
    const res = await apiClient.get<Conversation>(`/messages/conversations/${id}`);
    return unwrap<Conversation>(res.data);
  },

  async createConversation(data: {
    participantId: string;
  }): Promise<Conversation> {
    const res = await apiClient.post<Conversation>("/messages/conversations", data);
    // Server returns a ConversationWithDetails shape (otherUser / lastMessage /
    // unreadCount) without `conversationParticipants`. Normalize it into the
    // client `Conversation` shape so the UI can render it consistently.
    const raw = unwrap<Record<string, unknown>>(res.data);
    const otherUser = raw.otherUser as
      | { id: string; name: string; image?: string | null }
      | null
      | undefined;
    const normalized: Conversation = {
      id: raw.id as string,
      type: (raw.type as Conversation["type"]) ?? "DIRECT",
      name: (raw.name as string | null) ?? null,
      description: (raw.description as string | null) ?? null,
      groupImage: (raw.groupImage as string | null) ?? null,
      creatorId: (raw.creatorId as string | null) ?? null,
      lastMessageAt: (raw.lastMessageAt as string | null) ?? null,
      createdAt: raw.createdAt as string,
      updatedAt: raw.updatedAt as string,
      conversationParticipants: otherUser
        ? [
            {
              id: `p-${otherUser.id}`,
              conversationId: raw.id as string,
              userId: otherUser.id,
              user: { id: otherUser.id, name: otherUser.name, image: otherUser.image },
              isAdmin: false,
              isMuted: false,
              joinedAt: raw.createdAt as string,
            },
          ]
        : [],
      lastMessage: (raw.lastMessage as Conversation["lastMessage"]) ?? null,
      unreadCount: (raw.unreadCount as number) ?? 0,
    };
    return normalized;
  },

  async listMessages(params: ListMessagesParams): Promise<MessageListResponse> {
    const { conversationId, ...rest } = params;
    const query = buildQueryString(rest);
    const res = await apiClient.get<MessageListResponse>(
      `/messages/conversations/${conversationId}/messages${query}`,
    );
    const payload = unwrap<{ data?: Message[]; messages?: Message[]; meta?: MessageListResponse["meta"] }>(res.data);
    // Server returns { data, meta }; normalize to the client { messages, meta } shape.
    return {
      messages: payload.messages ?? payload.data ?? [],
      meta: payload.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  },

  async sendMessage(
    conversationId: string,
    data: { content: string; type?: string; replyToId?: string },
  ): Promise<Message> {
    const res = await apiClient.post<Message>(
      `/messages/conversations/${conversationId}/messages`,
      data,
    );
    return unwrap<Message>(res.data);
  },

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.post(`/messages/conversations/${conversationId}/read`, {});
  },
};
