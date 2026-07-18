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
    const data = await qaService.voteQuestion(questionId, type);
    return { success: true, message: "Vote recorded.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record vote.";
    return { success: false, message };
  }
}

/** Toggle bookmark on a question. */
export async function bookmarkQuestion(questionId: string): Promise<ApiResponse> {
  try {
    const data = await qaService.toggleBookmark(questionId);
    return { success: true, message: "Bookmark toggled.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle bookmark.";
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

/** Delete an answer. */
export async function deleteAnswer(questionId: string, answerId: string): Promise<ApiResponse> {
  try {
    await qaService.deleteAnswer(questionId, answerId);
    return { success: true, message: "Answer deleted." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete answer.";
    return { success: false, message };
  }
}

/** Accept an answer. */
export async function acceptAnswer(
  questionId: string,
  answerId: string,
): Promise<ApiResponse> {
  try {
    const data = await qaService.acceptAnswer(questionId, answerId);
    return { success: true, message: "Answer accepted.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to accept answer.";
    return { success: false, message };
  }
}

/** Upvote or downvote an answer. */
export async function voteAnswer(
  answerId: string,
  type: "UP" | "DOWN",
): Promise<ApiResponse> {
  try {
    const data = await qaService.voteAnswer(answerId, type);
    return { success: true, message: "Vote recorded.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record vote.";
    return { success: false, message };
  }
}
