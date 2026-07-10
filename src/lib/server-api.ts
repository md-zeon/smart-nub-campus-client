/**
 * Shared API Client
 * Centralized fetch wrapper with automatic Next.js cache invalidation
 */

import { env } from "@/env";
import { ApiError, ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { updateTag, revalidateTag } from "next/cache";

const API_URL =
  env.API_URL || env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type ApiResponsePromise<T> = Promise<ApiResponse<T>>;

interface CacheOptions {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
}

interface MutationOptions {
  invalidatesTags?: string[]; // Tags to clear upon a successful mutation
}

// Helper to safely clear tags depending on execution context
function triggerInvalidation(tags: string[]) {
  for (const tag of tags) {
    try {
      // 1. updateTag works inside Server Actions for immediate UI updates
      updateTag(tag);
    } catch {
      try {
        // 2. Fallback to revalidateTag if running inside Route Handlers / APIs
        revalidateTag(tag, "max");
      } catch (err) {
        console.error(`Failed to invalidate cache tag: ${tag}`, err);
      }
    }
  }
}

async function apiFetch<T = unknown>(
  endpoint: string,
  config: RequestInit = {},
  options: CacheOptions & MutationOptions = {},
): ApiResponsePromise<T> {
  const cookieStore = await cookies();
  const url = new URL(`${API_URL}${endpoint}`).toString();

  config.headers = {
    "Content-Type": "application/json",
    Cookie: cookieStore.toString(),
    ...config.headers,
  };

  const isGet = config.method === "GET" || config.method === undefined;

  // Handle caching and revalidation for GET requests
  if (isGet) {
    if (options.cache) config.cache = options.cache;
    if (options.revalidate !== undefined)
      config.next = { ...config.next, revalidate: options.revalidate };
    if (options.tags) config.next = { ...config.next, tags: options.tags };

    // Default to no-store if no caching is set up
    if (!options.cache && options.revalidate === undefined && !options.tags) {
      config.cache = "no-store";
    }
  } else {
    // Mutations (POST, PUT, PATCH, DELETE) should not be cached
    // Mutations should not be revalidated and should not have tags, so we enforce no-store caching to prevent stale data issues and ensure that the client always fetches fresh data after a mutation.
    config.cache = "no-store";
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new Error(error.message || error.error || "An error occurred");
  }

  // Trigger automatic invalidation if mutation succeeded and tags exist
  if (!isGet && options.invalidatesTags && options.invalidatesTags.length > 0) {
    // Trigger invalidation for each tag and clear the cache to ensure that the next request fetches fresh data. This is crucial for maintaining data consistency across the application, especially after performing mutations that change the underlying data.
    triggerInvalidation(options.invalidatesTags);
  }

  return data as ApiResponse<T>;
}

/**
 * API Client with typed methods and automatic invalidation options
 */
export const serverApi = {
  get: <T>(endpoint: string, options?: CacheOptions) =>
    apiFetch<T>(endpoint, { method: "GET" }, options),

  post: <T>(endpoint: string, body: unknown, options?: MutationOptions) =>
    apiFetch<T>(
      endpoint,
      { method: "POST", body: JSON.stringify(body) },
      options,
    ),

  patch: <T>(endpoint: string, body: unknown, options?: MutationOptions) =>
    apiFetch<T>(
      endpoint,
      { method: "PATCH", body: JSON.stringify(body) },
      options,
    ),

  put: <T>(endpoint: string, body: unknown, options?: MutationOptions) =>
    apiFetch<T>(
      endpoint,
      { method: "PUT", body: JSON.stringify(body) },
      options,
    ),

  del: <T>(endpoint: string, options?: MutationOptions) =>
    apiFetch<T>(endpoint, { method: "DELETE" }, options),
};

export default serverApi;
