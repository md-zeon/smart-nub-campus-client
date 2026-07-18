/**
 * AI Assistant API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  AIChatSession,
  SendAIMessagePayload,
  SendAIMessageResponse,
  ListAISessionsParams,
  AISessionListResponse,
} from "@/types/ai.types";

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

export const aiService = {
  /** List AI chat sessions. */
  async listSessions(
    params: ListAISessionsParams = {},
  ): Promise<AISessionListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<AISessionListResponse>(
      `/ai/sessions${query}`,
      { tags: ["ai-sessions"] },
    );
    return response.data!;
  },

  /** Get a single AI session by ID with messages. */
  async getSessionById(id: string): Promise<AIChatSession> {
    const response = await serverApi.get<AIChatSession>(`/ai/sessions/${id}`);
    return response.data!;
  },

  /** Send a message to the AI assistant. */
  async sendMessage(
    payload: SendAIMessagePayload,
  ): Promise<SendAIMessageResponse> {
    const response = await serverApi.post<SendAIMessageResponse>(
      "/ai/chat",
      payload,
    );
    return response.data!;
  },

  /** Delete an AI session. */
  async deleteSession(id: string): Promise<void> {
    await serverApi.del(`/ai/sessions/${id}`);
  },

  /** Mark a message as helpful or not helpful. */
  async markHelpful(messageId: string, isHelpful: boolean): Promise<void> {
    await serverApi.patch(`/ai/messages/${messageId}/helpful`, {
      isHelpful,
    });
  },
};
