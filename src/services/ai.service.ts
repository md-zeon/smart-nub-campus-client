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
  async createSession(data: { title?: string }): Promise<AIChatSession> {
    const response = await serverApi.post<AIChatSession>(
      "/ai/sessions",
      data,
    );
    return response.data!;
  },

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

  async getSessionById(id: string): Promise<AIChatSession> {
    const response = await serverApi.get<AIChatSession>(
      `/ai/sessions/${id}`,
    );
    return response.data!;
  },

  async getMessages(sessionId: string): Promise<unknown> {
    const response = await serverApi.get<unknown>(
      `/ai/sessions/${sessionId}/messages`,
    );
    return response.data!;
  },

  async sendMessage(
    sessionId: string,
    payload: SendAIMessagePayload,
  ): Promise<SendAIMessageResponse> {
    const response = await serverApi.post<SendAIMessageResponse>(
      `/ai/sessions/${sessionId}/messages`,
      payload,
    );
    return response.data!;
  },

  async deleteSession(id: string): Promise<void> {
    await serverApi.del(`/ai/sessions/${id}`);
  },

  async markHelpful(messageId: string, isHelpful: boolean): Promise<void> {
    await serverApi.patch(`/ai/messages/${messageId}/helpful`, {
      isHelpful,
    });
  },

  async getStudyStats(): Promise<unknown> {
    const response = await serverApi.get<unknown>("/ai/stats");
    return response.data!;
  },

  async getStudyStatsHistory(): Promise<unknown> {
    const response = await serverApi.get<unknown>("/ai/stats/history");
    return response.data!;
  },

  async summarizePdf(data: { fileUrl: string }): Promise<unknown> {
    const response = await serverApi.post<unknown>(
      "/ai/tools/summarize-pdf",
      data,
    );
    return response.data!;
  },

  async generateQuiz(data: {
    topic: string;
    count?: number;
  }): Promise<unknown> {
    const response = await serverApi.post<unknown>(
      "/ai/tools/generate-quiz",
      data,
    );
    return response.data!;
  },

  async generateFlashcards(data: {
    topic: string;
    count?: number;
  }): Promise<unknown> {
    const response = await serverApi.post<unknown>(
      "/ai/tools/generate-flashcards",
      data,
    );
    return response.data!;
  },

  async explainCode(data: { code: string; language?: string }): Promise<unknown> {
    const response = await serverApi.post<unknown>(
      "/ai/tools/explain-code",
      data,
    );
    return response.data!;
  },
};
