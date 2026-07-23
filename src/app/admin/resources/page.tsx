"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { adminService } from "@/services/admin.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight, ExternalLink, Trash2, Check, X, Loader2 } from "lucide-react";
import type {
  ListAdminResourcesResponse,
} from "@/types/admin.types";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

// ── Page Component ───────────────────────────────────────────────────────────

/**
 * Resource management page for admins.
 * Shows searchable, filterable resource table with verify/unverify and delete actions.
 */
export default function ResourcesPage() {
  const [data, setData] = useState<ListAdminResourcesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const limit = 10;

  /** Fetch resources from the API. */
  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminService.listResources({
        page,
        limit,
        search: search || undefined,
        isVerified:
          verifiedFilter === "all"
            ? undefined
            : verifiedFilter === "verified",
      });
      setData(result);
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, verifiedFilter]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  /** Handle verify/unverify toggle. */
  const handleVerifyToggle = async (id: string, currentVerified: boolean) => {
    setVerifyingId(id);
    try {
      await adminService.verifyResource(id, !currentVerified);
      toast.success(
        currentVerified
          ? "Resource unverified"
          : "Resource verified",
      );
      fetchResources();
    } catch {
      toast.error("Failed to update resource");
    } finally {
      setVerifyingId(null);
    }
  };

  /** Handle resource deletion. */
  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteResource(id);
      toast.success("Resource deleted");
      fetchResources();
    } catch {
      toast.error("Failed to delete resource");
    } finally {
      setDeleteTarget(null);
    }
  };

  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">Resources</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform resources and verification status
        </p>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or uploader..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8"
          />
        </div>
        <Select
          value={verifiedFilter}
          onValueChange={(val) => {
            setVerifiedFilter(val ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-gray-800">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No resources found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-700/50 text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Uploader</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Downloads</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((resource) => (
                  <tr
                    key={resource.id}
                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium max-w-[200px] truncate">
                        {resource.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{resource.uploader.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">
                        {resource.course.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {resource.fileType.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{resource.downloadCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      {resource.isVerified ? (
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-300 text-amber-700">
                          Unverified
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(resource.createdAt), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() =>
                            window.open(resource.fileUrl, "_blank")
                          }
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          disabled={verifyingId === resource.id}
                          onClick={() =>
                            handleVerifyToggle(
                              resource.id,
                              resource.isVerified,
                            )
                          }
                        >
                          {verifyingId === resource.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : resource.isVerified ? (
                            <X className="size-4 text-amber-600" />
                          ) : (
                            <Check className="size-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => setDeleteTarget(resource.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {data && totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, data.meta.total)} of {data.meta.total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Resource"
        description="Are you sure you want to delete this resource? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
      />
    </div>
  );
}
