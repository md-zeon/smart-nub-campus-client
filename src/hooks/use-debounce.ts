"use client";

import { useState, useEffect } from "react";

/**
 * Debounces a value by the specified delay.
 * Useful for search inputs and filter controls to avoid firing on every keystroke.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds. Defaults to 300ms.
 * @returns The debounced value that updates after the delay.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
