import { apiClient } from "@/lib/api-client";
import type {
  AdminDashboardStats,
  ListAdminUsersParams,
  ListAdminUsersResponse,
  AdminUserDetail,
  ListAdminVerificationsParams,
  ListAdminVerificationsResponse,
  AdminVerificationDetail,
  ListAuditLogsParams,
  ListAuditLogsResponse,
} from "@/types/admin.types";

/**
 * Admin service — client-side API calls for admin dashboard.
 * Uses apiClient (browser-direct fetch with credentials) since admin pages
 * are interactive client components.
 */
export const adminService = {
  // ── Dashboard ────────────────────────────────────────────────────────────

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: AdminDashboardStats;
    }>("/admin/stats");
    return response.data!.data;
  },

  // ── User Management ─────────────────────────────────────────────────────

  async listUsers(params: ListAdminUsersParams): Promise<ListAdminUsersResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page));
    searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.role) searchParams.set("role", params.role);
    if (params.status) searchParams.set("status", params.status);

    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ListAdminUsersResponse;
    }>(`/admin/users?${searchParams.toString()}`);
    return response.data!.data;
  },

  async getUserById(id: string): Promise<AdminUserDetail> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: AdminUserDetail;
    }>(`/admin/users/${id}`);
    return response.data!.data;
  },

  async updateUserStatus(
    id: string,
    status: "ACTIVE" | "SUSPENDED" | "BANNED",
  ): Promise<{ id: string; name: string; email: string; role: string; status: string }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      data: { id: string; name: string; email: string; role: string; status: string };
    }>(`/admin/users/${id}/status`, { status });
    return response.data!.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.del(`/admin/users/${id}`);
  },

  // ── Verification Management ──────────────────────────────────────────────

  async listVerifications(
    params: ListAdminVerificationsParams,
  ): Promise<ListAdminVerificationsResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page));
    searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ListAdminVerificationsResponse;
    }>(`/verification?${searchParams.toString()}`);
    return response.data!.data;
  },

  async getVerificationById(id: string): Promise<AdminVerificationDetail> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: AdminVerificationDetail;
    }>(`/verification/${id}`);
    return response.data!.data;
  },

  async approveVerification(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/verification/${id}/approve`, {});
    return { success: res.data!.success, message: res.data!.message };
  },

  async rejectVerification(
    id: string,
    note: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/verification/${id}/reject`, { note });
    return { success: res.data!.success, message: res.data!.message };
  },

  // ── Audit Logs ───────────────────────────────────────────────────────────

  async listAuditLogs(
    params: ListAuditLogsParams,
  ): Promise<ListAuditLogsResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page));
    searchParams.set("limit", String(params.limit));
    if (params.adminUserId) searchParams.set("adminUserId", params.adminUserId);
    if (params.action) searchParams.set("action", params.action);
    if (params.targetType) searchParams.set("targetType", params.targetType);
    if (params.startDate) searchParams.set("startDate", params.startDate);
    if (params.endDate) searchParams.set("endDate", params.endDate);

    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ListAuditLogsResponse;
    }>(`/admin/audit-log?${searchParams.toString()}`);
    return response.data!.data;
  },
};
