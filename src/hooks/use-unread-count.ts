"use client";

import { useState, useCallback } from "react";
import { notificationService } from "@/services/notification.service";

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
 * Call `refresh()` from a useEffect with appropriate deps in the consuming component.
 */
export function useUnreadCount({
  autoFetch = true,
}: UseUnreadCountOptions = {}): UseUnreadCountReturn {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(autoFetch);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await notificationService.getUnreadCount();
      setCount(result.count);
    } catch {
      // Swallow — callers can handle errors externally
    } finally {
      setIsLoading(false);
    }
  }, []);

  const decrement = useCallback((amount = 1) => {
    setCount((prev) => Math.max(0, prev - amount));
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return { count, isLoading, refresh, decrement, reset };
}
