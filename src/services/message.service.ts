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
  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await serverApi.get<{ unreadCount: number }>(
      "/messages/unread",
    );
    return response.data!;
  },

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

  async getConversationById(id: string): Promise<Conversation> {
    const response = await serverApi.get<Conversation>(
      `/messages/conversations/${id}`,
    );
    return response.data!;
  },

  async createConversation(data: {
    participantIds: string[];
    type?: "DIRECT" | "GROUP";
    name?: string;
  }): Promise<Conversation> {
    const response = await serverApi.post<Conversation>(
      "/messages/conversations",
      data,
    );
    return response.data!;
  },

  async createGroup(data: {
    name: string;
    participantIds: string[];
  }): Promise<Conversation> {
    const response = await serverApi.post<Conversation>(
      "/messages/groups",
      data,
    );
    return response.data!;
  },

  async updateGroup(id: string, data: { name?: string }): Promise<Conversation> {
    const response = await serverApi.put<Conversation>(
      `/messages/groups/${id}`,
      data,
    );
    return response.data!;
  },

  async addGroupMember(
    groupId: string,
    userId: string,
  ): Promise<Conversation> {
    const response = await serverApi.post<Conversation>(
      `/messages/groups/${groupId}/members`,
      { userId },
    );
    return response.data!;
  },

  async removeGroupMember(
    groupId: string,
    memberId: string,
  ): Promise<void> {
    await serverApi.del(`/messages/groups/${groupId}/members/${memberId}`);
  },

  async leaveGroup(groupId: string): Promise<void> {
    await serverApi.post(`/messages/groups/${groupId}/leave`, {});
  },

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

  async markAsRead(conversationId: string): Promise<void> {
    await serverApi.put(
      `/messages/conversations/${conversationId}/read`,
      {},
    );
  },

  async getConversationUnread(
    conversationId: string,
  ): Promise<{ unreadCount: number }> {
    const response = await serverApi.get<{ unreadCount: number }>(
      `/messages/conversations/${conversationId}/unread`,
    );
    return response.data!;
  },
};
