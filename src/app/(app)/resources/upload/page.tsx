"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResourceUploadForm } from "@/components/resources/resource-upload-form";
import { listResources } from "@/actions/resource.actions";
import type { ResourceCourse, ResourceCategory } from "@/types/resource.types";

/**
 * Resource upload page — full-width layout with upload form.
 * Fetches courses and categories for form dropdowns.
 */
export default function ResourceUploadPage() {
  const [courses, setCourses] = useState<ResourceCourse[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);

  /** Fetch courses and categories for form dropdowns. */
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const result = await listResources({ limit: 1 });
        if (!cancelled && result.success && result.data) {
          const data = result.data as {
            courses?: ResourceCourse[];
            categories?: ResourceCategory[];
          };
          if (data.courses) setCourses(data.courses);
          if (data.categories) setCategories(data.categories);
        }
      } catch {
        // Dropdowns will be empty — user can still fill other fields
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        {/* ── Back link ────────────────────────────────────────────── */}
        <Link
          href="/resources"
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Resources
        </Link>

        {/* ── Page header ──────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Upload Resource</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share study materials with the NSU community.
          </p>
        </div>

        {/* ── Upload form ──────────────────────────────────────────── */}
        <ResourceUploadForm courses={courses} categories={categories} />
      </div>
    </div>
  );
}
