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
    return unwrap<ConversationListResponse>(res.data);
  },

  async getConversationById(id: string): Promise<Conversation> {
    const res = await apiClient.get<Conversation>(`/messages/conversations/${id}`);
    return unwrap<Conversation>(res.data);
  },

  async createConversation(data: {
    participantIds: string[];
    type?: "DIRECT" | "GROUP";
    name?: string;
  }): Promise<Conversation> {
    const res = await apiClient.post<Conversation>("/messages/conversations", data);
    return unwrap<Conversation>(res.data);
  },

  async listMessages(params: ListMessagesParams): Promise<MessageListResponse> {
    const { conversationId, ...rest } = params;
    const query = buildQueryString(rest);
    const res = await apiClient.get<MessageListResponse>(
      `/messages/conversations/${conversationId}/messages${query}`,
    );
    return unwrap<MessageListResponse>(res.data);
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
