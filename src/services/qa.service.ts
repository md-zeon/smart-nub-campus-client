/**
 * Q&A API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  Question,
  QuestionCategory,
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
  /** List questions with pagination, filtering, and sorting. */
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

  /** Get a single question by ID. */
  async getQuestionById(id: string): Promise<Question> {
    const response = await serverApi.get<Question>(`/qa/${id}`, {
      tags: ["question-detail"],
    });
    return response.data!;
  },

  /** List question categories. */
  async listCategories(): Promise<QuestionCategory[]> {
    const response = await serverApi.get<QuestionCategory[]>(
      "/qa/categories",
      { tags: ["question-categories"] },
    );
    return response.data!;
  },

  /** Upvote a question. */
  async upvoteQuestion(questionId: string): Promise<void> {
    await serverApi.post(`/qa/${questionId}/vote`, { type: "UP" });
  },

  /** Downvote a question. */
  async downvoteQuestion(questionId: string): Promise<void> {
    await serverApi.post(`/qa/${questionId}/vote`, { type: "DOWN" });
  },

  /** Toggle bookmark on a question. */
  async toggleBookmark(questionId: string): Promise<void> {
    await serverApi.post(`/qa/${questionId}/bookmark`, {});
  },

  /** Post an answer to a question. */
  async postAnswer(
    questionId: string,
    data: { content: string },
  ): Promise<Answer> {
    const response = await serverApi.post<Answer>(
      `/qa/${questionId}/answers`,
      data,
    );
    return response.data!;
  },

  /** Accept an answer. */
  async acceptAnswer(questionId: string, answerId: string): Promise<void> {
    await serverApi.patch(`/qa/${questionId}/answers/${answerId}/accept`, {});
  },

  /** Upvote an answer. */
  async upvoteAnswer(questionId: string, answerId: string): Promise<void> {
    await serverApi.post(`/qa/${questionId}/answers/${answerId}/vote`, {
      type: "UP",
    });
  },
};
