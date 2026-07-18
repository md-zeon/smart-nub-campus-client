/**
 * Q&A module types mirroring server-side Prisma models.
 * Keep in sync with server schema: prisma/schema/qa.prisma
 */

import type { Tag } from "./resource.types";

// ── Shared references ────────────────────────────────────────────────────────

export interface QuestionAuthor {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

// ── Core models ──────────────────────────────────────────────────────────────

export interface QuestionCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category?: QuestionCategory;
  authorId: string;
  author?: QuestionAuthor;
  courseId?: string | null;
  upvoteCount: number;
  answerCount: number;
  viewCount: number;
  isAnswered: boolean;
  isClosed: boolean;
  questionTags?: QuestionTag[];
  answers?: Answer[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  author?: QuestionAuthor;
  upvoteCount: number;
  isAccepted: boolean;
  answerVotes?: AnswerVote[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionVote {
  id: string;
  questionId: string;
  userId: string;
  type: import("./resource.types").VoteType;
  createdAt: string;
}

export interface AnswerVote {
  id: string;
  answerId: string;
  userId: string;
  type: import("./resource.types").VoteType;
  createdAt: string;
}

export interface QuestionTag {
  id: string;
  questionId: string;
  tagId: string;
  tag?: Tag;
  createdAt: string;
}

export interface QuestionBookmark {
  id: string;
  questionId: string;
  userId: string;
  createdAt: string;
}

// ── API query / list types ───────────────────────────────────────────────────

export interface ListQuestionsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  courseId?: string;
  search?: string;
  isAnswered?: boolean;
  sortBy?: "createdAt" | "upvoteCount" | "answerCount" | "viewCount";
  sortOrder?: "asc" | "desc";
  tag?: string;
}

export interface QuestionListResponse {
  questions: Question[];
  meta: import("./resource.types").PaginationMeta;
}
