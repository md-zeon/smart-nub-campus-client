/**
 * Message API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
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

export const messageService = {
  /** List conversations with pagination. */
  async listConversations(
    params: ListConversationsParams = {},
  ): Promise<ConversationListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<ConversationListResponse>(
      `/messages/conversations${query}`,
      { tags: ["conversations-list"] },
    );
    return response.data!;
  },

  /** Get a conversation by ID. */
  async getConversationById(id: string): Promise<Conversation> {
    const response = await serverApi.get<Conversation>(
      `/messages/conversations/${id}`,
    );
    return response.data!;
  },

  /** Create a new conversation. */
  async createConversation(data: {
    type?: "DIRECT" | "GROUP";
    name?: string;
    participantIds: string[];
  }): Promise<Conversation> {
    const response = await serverApi.post<Conversation>(
      "/messages/conversations",
      data,
    );
    return response.data!;
  },

  /** List messages in a conversation. */
  async listMessages(
    params: ListMessagesParams,
  ): Promise<MessageListResponse> {
    const { conversationId, ...rest } = params;
    const query = buildQueryString(rest);
    const response = await serverApi.get<MessageListResponse>(
      `/messages/conversations/${conversationId}/messages${query}`,
    );
    return response.data!;
  },

  /** Send a message in a conversation. */
  async sendMessage(
    conversationId: string,
    data: { content: string; type?: string; replyToId?: string },
  ): Promise<Message> {
    const response = await serverApi.post<Message>(
      `/messages/conversations/${conversationId}/messages`,
      data,
    );
    return response.data!;
  },

  /** Mark messages as read in a conversation. */
  async markAsRead(conversationId: string): Promise<void> {
    await serverApi.post(
      `/messages/conversations/${conversationId}/read`,
      {},
    );
  },
};
