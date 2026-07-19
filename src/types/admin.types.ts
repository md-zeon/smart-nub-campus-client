import type { UserRole, UserStatus, VerificationStatus } from "@/constants/enums";

// ── Dashboard Stats ──────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  totalResources: number;
  verifiedResources: number;
  unverifiedResources: number;
  totalDiscussions: number;
  totalQuestions: number;
  totalEvents: number;
  pendingVerifications: number;
}

// ── User Management ──────────────────────────────────────────────────────────

export interface AdminUserStudent {
  id: string;
  department: string;
  admissionYear: number;
  admissionSemester: string;
}

export interface AdminUserAdmin {
  id: string;
  designation: string | null;
  department: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  student: AdminUserStudent | null;
  admin: AdminUserAdmin | null;
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
  student: Record<string, unknown> | null;
  admin: Record<string, unknown> | null;
  profile: Record<string, unknown> | null;
  _count: {
    resources: number;
    discussions: number;
    questions: number;
    answers: number;
    teamMembers: number;
  };
}

export interface ListAdminUsersParams {
  search?: string;
  role?: string;
  status?: UserStatus;
  page: number;
  limit: number;
}

export interface ListAdminUsersResponse {
  data: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Verification Management ──────────────────────────────────────────────────

export interface AdminVerificationDetail {
  id: string;
  email: string;
  studentId: string;
  name: string;
  dateOfBirth: string;
  idCardImage: string;
  status: VerificationStatus;
  note: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminVerificationsParams {
  page: number;
  limit: number;
  status?: VerificationStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ListAdminVerificationsResponse {
  data: AdminVerificationDetail[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  adminUser: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ListAuditLogsParams {
  page: number;
  limit: number;
  adminUserId?: string;
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListAuditLogsResponse {
  data: AuditLogEntry[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
