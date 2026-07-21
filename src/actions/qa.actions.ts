"use server";

import { qaService } from "@/services/qa.service";
import type { ApiResponse } from "@/types";
import type { ListQuestionsParams } from "@/types/qa.types";

/** List questions with pagination and filtering. */
export async function listQuestions(
  params: ListQuestionsParams = {},
): Promise<ApiResponse> {
  try {
    const data = await qaService.listQuestions(params);
    return { success: true, message: "Questions fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch questions.";
    return { success: false, message };
  }
}

/** Get a single question by ID. */
export async function getQuestion(id: string): Promise<ApiResponse> {
  try {
    const data = await qaService.getQuestionById(id);
    return { success: true, message: "Question fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch question.";
    return { success: false, message };
  }
}

/** Upvote or downvote a question. */
export async function voteQuestion(
  questionId: string,
  type: "UP" | "DOWN",
): Promise<ApiResponse> {
  try {
    if (type === "UP") {
      await qaService.upvoteQuestion(questionId);
    } else {
      await qaService.downvoteQuestion(questionId);
    }
    return { success: true, message: "Vote recorded." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record vote.";
    return { success: false, message };
  }
}

/** Post an answer to a question. */
export async function postAnswer(
  questionId: string,
  data: { content: string },
): Promise<ApiResponse> {
  try {
    const answer = await qaService.postAnswer(questionId, data);
    return { success: true, message: "Answer posted.", data: answer };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to post answer.";
    return { success: false, message };
  }
}

/** Accept an answer. */
export async function acceptAnswer(
  questionId: string,
  answerId: string,
): Promise<ApiResponse> {
  try {
    await qaService.acceptAnswer(questionId, answerId);
    return { success: true, message: "Answer accepted." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to accept answer.";
    return { success: false, message };
  }
}
