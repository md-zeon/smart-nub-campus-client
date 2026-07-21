/**
 * Connection module types mirroring server-side Prisma models.
 * Keep in sync with server schema: prisma/schema/connection.prisma
 */

// ── Shared references ────────────────────────────────────────────────────────

export interface ConnectionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  student?: {
    department: string;
    admissionYear: number;
  } | null;
}

// ── Core models ──────────────────────────────────────────────────────────────

export interface Connection {
  id: string;
  requesterId: string;
  requester?: ConnectionUser;
  receiverId: string;
  receiver?: ConnectionUser;
  status: ConnectionStatus;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionRequest {
  id: string;
  requesterId: string;
  requester?: ConnectionUser;
  receiverId: string;
  receiver?: ConnectionUser;
  status: ConnectionStatus;
  createdAt: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  tagId: string;
  tag?: import("./resource.types").Tag;
  createdAt: string;
}

export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

// ── Enums ────────────────────────────────────────────────────────────────────

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";

// ── API query / list types ───────────────────────────────────────────────────

export interface ListConnectionsParams {
  page?: number;
  limit?: number;
  status?: ConnectionStatus;
  search?: string;
}

export interface ConnectionListResponse {
  connections: Connection[];
  meta: import("./resource.types").PaginationMeta;
}
