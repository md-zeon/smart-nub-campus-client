/**
 * Client-side API module for binary uploads
 * Does NOT use Next.js server-only APIs - runs in browser
 */

import { env } from "@/env";
import { ApiResponse } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiResponsePromise<T> {
  data: T | undefined;
  error?: string;
}

async function apiFetch<T = unknown>(
  endpoint: string,
  config: RequestInit = {},
): Promise<ApiResponsePromise<T>> {
  const url = new URL(`${API_URL}${endpoint}`).toString();
  console.log(`[apiClient] Fetching: ${url}`, config.body instanceof FormData ? "(FormData)" : "");

  // For FormData, let browser set Content-Type with boundary
  const isFormData = config.body instanceof FormData;

  config.headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...config.headers,
  };

  config.credentials = "include"; // Send cookies for auth

  const response = await fetch(url, config);
  console.log(`[apiClient] Response status: ${response.status}`);

  let data: unknown;
  const text = await response.text();
  console.log(`[apiClient] Response text:`, text.substring(0, 200));
  
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Invalid JSON response from server: ${response.status} ${response.statusText}`,
    );
  }

  if (!response.ok) {
    const error = data as { message?: string; error?: string };
    const errorMsg = error?.message || error?.error || "Upload failed";
    console.error(`[apiClient] Error response:`, errorMsg);
    throw new Error(errorMsg);
  }

  console.log(`[apiClient] Success, data:`, data);
  return { data: data as T };
}

export const apiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  postForm: <T>(endpoint: string, formData: FormData) =>
    apiFetch<T>(endpoint, { method: "POST", body: formData }),
};

export default apiClient;
