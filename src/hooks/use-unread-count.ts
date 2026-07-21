"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { UnreadCountResponse } from "@/types/notification.types";

interface UseUnreadCountOptions {
  /** Whether to automatically fetch the count on mount. Defaults to true. */
  autoFetch?: boolean;
}

interface UseUnreadCountReturn {
  /** Current unread notification count. */
  count: number;
  /** Whether the count is being loaded for the first time. */
  isLoading: boolean;
  /** Manually refresh the count. */
  refresh: () => Promise<void>;
  /** Decrement the count by a given amount (used when marking as read). */
  decrement: (amount?: number) => void;
  /** Reset the count to zero. */
  reset: () => void;
}

/**
 * Tracks the global unread notification count.
 * Uses the browser-side apiClient to avoid pulling server-only modules
 * (serverApi / next/headers) into the client bundle.
 */
export function useUnreadCount({
  autoFetch = true,
}: UseUnreadCountOptions = {}): UseUnreadCountReturn {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(autoFetch);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await apiClient.get<UnreadCountResponse>(
        "/notifications/unread-count",
      );
      setCount(result.data?.count ?? 0);
    } catch {
      // Swallow — callers can handle errors externally
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount when enabled
  useEffect(() => {
    if (!autoFetch) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await apiClient.get<UnreadCountResponse>(
          "/notifications/unread-count",
        );
        if (!cancelled) {
          setCount(result.data?.count ?? 0);
        }
      } catch {
        // Swallow — callers can handle errors externally
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [autoFetch]);

  const decrement = useCallback((amount = 1) => {
    setCount((prev) => Math.max(0, prev - amount));
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return { count, isLoading, refresh, decrement, reset };
}
