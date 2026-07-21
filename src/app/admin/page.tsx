"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/admin/stats-card";
import { AdminChart } from "@/components/admin/admin-chart";
import { RecentActivity } from "@/components/admin/recent-activity";
import { adminService } from "@/services/admin.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Activity,
  UserPlus,
  BookOpen,
  Download,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import type { AdminDashboardStats } from "@/types/admin.types";
import { toast } from "sonner";

// ── Mock chart data (will be replaced with real API data when available) ─────

const mockRegistrationData = [
  { name: "Mon", users: 12 },
  { name: "Tue", users: 19 },
  { name: "Wed", users: 15 },
  { name: "Thu", users: 22 },
  { name: "Fri", users: 18 },
  { name: "Sat", users: 8 },
  { name: "Sun", users: 5 },
];

const mockResourceUploadData = [
  { name: "Mon", uploads: 5 },
  { name: "Tue", uploads: 8 },
  { name: "Wed", uploads: 12 },
  { name: "Thu", uploads: 7 },
  { name: "Fri", uploads: 15 },
  { name: "Sat", uploads: 3 },
  { name: "Sun", uploads: 2 },
];

const mockDepartmentData = [
  { name: "CSE", count: 450 },
  { name: "BBA", count: 320 },
  { name: "EEE", count: 180 },
  { name: "ENGLISH", count: 150 },
  { name: "LLB", count: 90 },
];

const mockVerificationTrendData = [
  { name: "Week 1", pending: 8, approved: 12, rejected: 2 },
  { name: "Week 2", pending: 5, approved: 15, rejected: 3 },
  { name: "Week 3", pending: 12, approved: 10, rejected: 1 },
  { name: "Week 4", pending: 3, approved: 18, rejected: 4 },
];

const mockRecentActivity = [
  { id: "1", userName: "Rahim Uddin", action: "USER_SIGNED_UP" as const, details: "New student registration", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", userName: "Nusrat Jahan", action: "RESOURCE_UPLOADED" as const, details: "CSE201 - Data Structures Notes", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", userName: "Kamal Hossain", action: "VERIFICATION_SUBMITTED" as const, details: "Student ID: 2024-1-60-001", timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: "4", userName: "Farhana Akter", action: "DISCUSSION_CREATED" as const, details: "Best resources for CSE301?", timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: "5", userName: "Tanvir Ahmed", action: "QUESTION_ASKED" as const, details: "How to implement AVL tree?", timestamp: new Date(Date.now() - 18000000).toISOString() },
  { id: "6", userName: "Sara Rahman", action: "USER_SIGNED_UP" as const, details: "New student registration", timestamp: new Date(Date.now() - 21600000).toISOString() },
  { id: "7", userName: "Imran Khan", action: "RESOURCE_UPLOADED" as const, details: "BBA201 - Marketing Final Notes", timestamp: new Date(Date.now() - 25200000).toISOString() },
  { id: "8", userName: "Fatima Begum", action: "VERIFICATION_SUBMITTED" as const, details: "Student ID: 2024-1-60-002", timestamp: new Date(Date.now() - 28800000).toISOString() },
];

// ── Page Component ───────────────────────────────────────────────────────────

/**
 * Admin dashboard page — the main overview page.
 * Shows platform stats cards, charts, and recent activity.
 */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[350px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and statistics
        </p>
      </div>

      {/* ── Stats Cards Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Users"
          value={stats?.totalUsers?.toLocaleString() ?? "0"}
          icon={Users}
        />
        <StatsCard
          label="Total Resources"
          value={stats?.totalResources?.toLocaleString() ?? "0"}
          icon={BookOpen}
        />
        <StatsCard
          label="Total Discussions"
          value={stats?.totalDiscussions?.toLocaleString() ?? "0"}
          icon={MessageSquare}
        />
        <StatsCard
          label="Total Questions"
          value={stats?.totalQuestions?.toLocaleString() ?? "0"}
          icon={HelpCircle}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Verified Resources"
          value={stats?.verifiedResources?.toLocaleString() ?? "0"}
          icon={Activity}
        />
        <StatsCard
          label="Unverified Resources"
          value={stats?.unverifiedResources?.toLocaleString() ?? "0"}
          icon={Download}
        />
        <StatsCard
          label="Total Events"
          value={stats?.totalEvents?.toLocaleString() ?? "0"}
          icon={UserPlus}
        />
        <StatsCard
          label="Pending Verifications"
          value={stats?.pendingVerifications?.toLocaleString() ?? "0"}
          icon={ShieldCheck}
          isWarning={(stats?.pendingVerifications ?? 0) > 0}
        />
      </div>

      {/* ── Charts Grid (2x2) ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="User Registrations"
          description="New user sign-ups over the last 7 days"
          type="line"
          data={mockRegistrationData}
          series={[{ dataKey: "users", name: "Users", color: "#6366f1" }]}
        />

        <AdminChart
          title="Resource Uploads"
          description="Resources uploaded over the last 7 days"
          type="bar"
          data={mockResourceUploadData}
          series={[{ dataKey: "uploads", name: "Uploads", color: "#22c55e" }]}
        />

        <AdminChart
          title="Popular Departments"
          description="Users by department"
          type="bar"
          data={mockDepartmentData}
          series={[{ dataKey: "count", name: "Students", color: "#f59e0b" }]}
        />

        <AdminChart
          title="Verification Trends"
          description="Verification request status over the last 4 weeks"
          type="area"
          data={mockVerificationTrendData}
          series={[
            { dataKey: "pending", name: "Pending", color: "#f59e0b" },
            { dataKey: "approved", name: "Approved", color: "#22c55e" },
            { dataKey: "rejected", name: "Rejected", color: "#ef4444" },
          ]}
        />
      </div>

      {/* ── Recent Activity Table ──────────────────────────────────────── */}
      <RecentActivity activities={mockRecentActivity} />
    </div>
  );
}
