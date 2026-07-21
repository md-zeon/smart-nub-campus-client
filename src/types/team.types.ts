/**
 * Team module types mirroring server-side Prisma models.
 * Keep in sync with server schema: prisma/schema/team.prisma
 */

import type { Tag } from "./resource.types";

// ── Shared references ────────────────────────────────────────────────────────

export interface TeamCreator {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface TeamApplicant {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

// ── Core models ──────────────────────────────────────────────────────────────

export interface TeamRequest {
  id: string;
  title: string;
  description: string;
  lookingForCount: number;
  currentMemberCount: number;
  projectName?: string | null;
  deadline?: string | null;
  status: TeamRequestStatus;
  creatorId: string;
  creator?: TeamCreator;
  category?: string | null;
  teamRequestSkills?: TeamRequestSkill[];
  teamApplications?: TeamApplication[];
  teamMembers?: TeamMember[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamRequestSkill {
  id: string;
  teamRequestId: string;
  tagId: string;
  tag?: Tag;
  createdAt: string;
}

export interface TeamApplication {
  id: string;
  teamRequestId: string;
  applicantId: string;
  applicant?: TeamApplicant;
  message?: string | null;
  status: ApplicationStatus;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamRequestId: string;
  userId: string;
  user?: TeamCreator;
  role: TeamMemberRole;
  joinedAt: string;
}

// ── Enums ────────────────────────────────────────────────────────────────────

export type TeamRequestStatus = "OPEN" | "FILLED" | "CLOSED";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export type TeamMemberRole = "LEADER" | "MEMBER";

// ── API query / list types ───────────────────────────────────────────────────

export interface ListTeamRequestsParams {
  page?: number;
  limit?: number;
  status?: TeamRequestStatus;
  search?: string;
  category?: string;
  sortBy?: "createdAt" | "lookingForCount";
  sortOrder?: "asc" | "desc";
}

export interface TeamRequestListResponse {
  teamRequests: TeamRequest[];
  meta: import("./resource.types").PaginationMeta;
}
