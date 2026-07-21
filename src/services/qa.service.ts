import serverApi from "@/lib/server-api";
import type {
  Question,
  Answer,
  ListQuestionsParams,
  QuestionListResponse,
} from "@/types/qa.types";

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

export const qaService = {
  async createQuestion(data: {
    title: string;
    content: string;
    tags?: string[];
  }): Promise<Question> {
    const response = await serverApi.post<Question>("/qa", data);
    return response.data!;
  },

  async listQuestions(
    params: ListQuestionsParams = {},
  ): Promise<QuestionListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<QuestionListResponse>(
      `/qa${query}`,
      { tags: ["questions-list"] },
    );
    return response.data!;
  },

  async getQuestionById(id: string): Promise<Question> {
    const response = await serverApi.get<Question>(`/qa/${id}`, {
      tags: ["question-detail"],
    });
    return response.data!;
  },

  async updateQuestion(
    id: string,
    data: { title?: string; content?: string; tags?: string[] },
  ): Promise<Question> {
    const response = await serverApi.put<Question>(`/qa/${id}`, data);
    return response.data!;
  },

  async deleteQuestion(id: string): Promise<void> {
    await serverApi.del(`/qa/${id}`);
  },

  async voteQuestion(
    questionId: string,
    type: "UP" | "DOWN",
  ): Promise<{ action: string; upvoteCount: number; downvoteCount: number }> {
    const response = await serverApi.post<{ action: string; upvoteCount: number; downvoteCount: number }>(
      `/qa/${questionId}/vote`,
      { type },
    );
    return response.data!;
  },

  async toggleBookmark(questionId: string): Promise<{ action: string }> {
    const response = await serverApi.post<{ action: string }>(
      `/qa/${questionId}/bookmark`,
      {},
    );
    return response.data!;
  },

  async listBookmarks(): Promise<Question[]> {
    const response = await serverApi.get<Question[]>("/qa/bookmarks");
    return response.data!;
  },

  async postAnswer(
    questionId: string,
    data: { content: string; isDraft?: boolean },
  ): Promise<Answer> {
    const response = await serverApi.post<Answer>(
      `/qa/${questionId}/answers`,
      data,
    );
    return response.data!;
  },

  async deleteAnswer(questionId: string, answerId: string): Promise<void> {
    await serverApi.del(`/qa/${questionId}/answers/${answerId}`);
  },

  async acceptAnswer(questionId: string, answerId: string): Promise<Answer> {
    const response = await serverApi.put<Answer>(
      `/qa/${questionId}/answers/${answerId}/accept`,
      {},
    );
    return response.data!;
  },

  async voteAnswer(
    answerId: string,
    type: "UP" | "DOWN",
  ): Promise<{ action: string; upvoteCount: number; downvoteCount: number }> {
    const response = await serverApi.post<{ action: string; upvoteCount: number; downvoteCount: number }>(
      `/qa/answers/${answerId}/vote`,
      { type },
    );
    return response.data!;
  },
};
