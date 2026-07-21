/**
 * Discussion module types mirroring server-side Prisma models.
 * Keep in sync with server schema: prisma/schema/discussion.prisma
 */

import type { Tag } from "./resource.types";

// ── Shared references ────────────────────────────────────────────────────────

export interface DiscussionAuthor {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

// ── Core models ──────────────────────────────────────────────────────────────

export interface DiscussionCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category?: DiscussionCategory;
  authorId: string;
  author?: DiscussionAuthor;
  courseId?: string | null;
  replyCount: number;
  viewCount: number;
  upvoteCount: number;
  visibility: DiscussionVisibility;
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
  discussionTags?: DiscussionTag[];
  discussionReplies?: DiscussionReply[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  content: string;
  discussionId: string;
  authorId: string;
  author?: DiscussionAuthor;
  parentId?: string | null;
  replies?: DiscussionReply[];
  upvoteCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionVote {
  id: string;
  discussionId: string;
  userId: string;
  type: import("./resource.types").VoteType;
  createdAt: string;
}

export interface DiscussionReplyVote {
  id: string;
  replyId: string;
  userId: string;
  type: import("./resource.types").VoteType;
  createdAt: string;
}

export interface DiscussionTag {
  id: string;
  discussionId: string;
  tagId: string;
  tag?: Tag;
  createdAt: string;
}

export interface DiscussionBookmark {
  id: string;
  discussionId: string;
  userId: string;
  createdAt: string;
}

// ── Enums ────────────────────────────────────────────────────────────────────

export type DiscussionVisibility = "PUBLIC" | "DEPARTMENT" | "BATCH";

// ── API query / list types ───────────────────────────────────────────────────

export interface ListDiscussionsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  courseId?: string;
  search?: string;
  visibility?: DiscussionVisibility;
  sortBy?: "createdAt" | "upvoteCount" | "replyCount" | "viewCount";
  sortOrder?: "asc" | "desc";
  tag?: string;
}

export interface DiscussionListResponse {
  discussions: Discussion[];
  meta: import("./resource.types").PaginationMeta;
}
