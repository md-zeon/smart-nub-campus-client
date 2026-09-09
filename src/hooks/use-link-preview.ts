"use client";

import { useState, useEffect, useCallback } from "react";
import type { LinkPreviewData } from "@/components/messages/link-preview-card";

// ── Cache Configuration ──────────────────────────────────────────────────────

const CACHE_KEY_PREFIX = "link-preview-";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: LinkPreviewData;
  expiresAt: number;
}

function getCachedPreview(url: string): LinkPreviewData | null {
  try {
    const key = CACHE_KEY_PREFIX + btoa(url);
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const entry: CacheEntry = JSON.parse(stored);
    if (entry.expiresAt < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCachedPreview(url: string, data: LinkPreviewData): void {
  try {
    const key = CACHE_KEY_PREFIX + btoa(url);
    const entry: CacheEntry = {
      data,
      expiresAt: Date.now() + CACHE_TTL,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage might be full, silently fail
  }
}

// ── API Fetch ────────────────────────────────────────────────────────────────

async function fetchLinkPreview(url: string): Promise<LinkPreviewData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(
      `${baseUrl}/messages/link-preview?url=${encodeURIComponent(url)}`,
      {
        credentials: "include",
      },
    );

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || null;
  } catch {
    return null;
  }
}

// ── Hook Types ───────────────────────────────────────────────────────────────

interface UseLinkPreviewOptions {
  /** Whether to automatically fetch the preview. Default true. */
  enabled?: boolean;
}

interface UseLinkPreviewReturn {
  preview: LinkPreviewData | null;
  isLoading: boolean;
  error: Error | null;
}

// ── Single URL Hook ──────────────────────────────────────────────────────────

/**
 * Hook to fetch and cache a link preview for a single URL.
 */
export function useLinkPreview(
  url: string | null | undefined,
  options: UseLinkPreviewOptions = {},
): UseLinkPreviewReturn {
  const { enabled = true } = options;
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url || !enabled) {
      setPreview(null);
      return;
    }

    let cancelled = false;

    // Check cache first
    const cached = getCachedPreview(url);
    if (cached) {
      setPreview(cached);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchLinkPreview(url)
      .then((data) => {
        if (!cancelled) {
          setPreview(data);
          if (data) {
            setCachedPreview(url, data);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch preview"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return { preview, isLoading, error };
}

// ── Multiple URLs Hook ───────────────────────────────────────────────────────

interface UseMultipleLinkPreviewsReturn {
  previews: Map<string, LinkPreviewData>;
  loadingUrls: Set<string>;
}

/**
 * Hook to fetch and cache link previews for multiple URLs.
 * Optimized to batch requests and avoid duplicate fetches.
 */
export function useMultipleLinkPreviews(
  urls: string[],
): UseMultipleLinkPreviewsReturn {
  const [previews, setPreviews] = useState<Map<string, LinkPreviewData>>(new Map());
  const [loadingUrls, setLoadingUrls] = useState<Set<string>>(new Set());

  const fetchPreview = useCallback(async (url: string) => {
    // Check cache first
    const cached = getCachedPreview(url);
    if (cached) {
      setPreviews((prev) => {
        const next = new Map(prev);
        next.set(url, cached);
        return next;
      });
      return;
    }

    setLoadingUrls((prev) => new Set(prev).add(url));

    try {
      const data = await fetchLinkPreview(url);
      if (data) {
        setCachedPreview(url, data);
        setPreviews((prev) => {
          const next = new Map(prev);
          next.set(url, data);
          return next;
        });
      }
    } catch {
      // Silently fail for individual URLs
    } finally {
      setLoadingUrls((prev) => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    // Fetch all URLs that aren't already cached or loading
    urls.forEach((url) => {
      const cached = getCachedPreview(url);
      if (cached) {
        setPreviews((prev) => {
          const next = new Map(prev);
          next.set(url, cached);
          return next;
        });
      } else {
        fetchPreview(url);
      }
    });
  }, [urls, fetchPreview]);

  return { previews, loadingUrls };
}
