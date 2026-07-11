# Server API - Smart NUB Campus Client

This document provides comprehensive documentation for the `serverApi` module, a centralized fetch wrapper for making API requests to the backend with automatic Next.js cache invalidation.

## Overview

The `serverApi` module provides a type-safe, centralized interface for communicating with the Smart NUB Campus backend API. It seamlessly integrates with Next.js's caching and revalidation mechanisms, ensuring data consistency across the application.

## Features

- **Centralized fetch wrapper** - Single point of configuration for all API requests
- **Automatic cache invalidation** - Mutations automatically invalidate specified cache tags
- **Type-safe responses** - Full TypeScript support for request and response types
- **Cookie handling** - Automatic cookie forwarding for session management
- **Flexible caching options** - Support for cache, revalidate, and tags configuration

## Installation & Setup

### Environment Configuration

The module requires the following environment variables to be configured:

```env
# Server-side API URL (preferred)
API_URL=http://localhost:5000/api/v1

# Client-side fallback (if server variable not set)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

> **Note:** The module prioritizes `API_URL` over `NEXT_PUBLIC_API_URL` for security reasons.

## API Reference

### Import

```typescript
import { serverApi } from "@/lib/server-api";
// or
import serverApi from "@/lib/server-api";
```

### Types

```typescript
// API Response wrapper
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// API Error
interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Cache options for GET requests
interface CacheOptions {
  cache?: RequestCache; // "default" | "no-store" | "reload" | "force-cache" | "only-if-cached"
  revalidate?: number; // Seconds until cache revalidation
  tags?: string[]; // Cache tags for invalidation
}

// Mutation options for POST/PUT/PATCH/DELETE
interface MutationOptions {
  invalidatesTags?: string[]; // Tags to clear upon successful mutation
}
```

### Methods

#### GET

Fetch data from the API with caching support.

```typescript
serverApi.get<T>(endpoint: string, options?: CacheOptions): Promise<ApiResponse<T>>
```

**Parameters:**

| Parameter            | Type         | Required | Description                                                 |
| -------------------- | ------------ | -------- | ----------------------------------------------------------- |
| `endpoint`           | string       | Yes      | API endpoint path (e.g., `/users` or `/onboarding/current`) |
| `options.cache`      | RequestCache | No       | Cache strategy                                              |
| `options.revalidate` | number       | No       | Seconds until cache revalidation                            |
| `options.tags`       | string[]     | No       | Cache tags for invalidation                                 |

**Examples:**

```typescript
// Basic GET request (no caching)
const users = await serverApi.get<User[]>("/users");

// GET with caching and revalidation
const courses = await serverApi.get<Course[]>("/courses", {
  cache: "force-cache",
  revalidate: 60, // Revalidate after 60 seconds
});

// GET with cache tags
const profile = await serverApi.get<User>("/profile", {
  tags: ["user-profile", "student-data"],
});
```

#### POST

Create new resources with automatic cache invalidation.

```typescript
serverApi.post<T>(endpoint: string, body: unknown, options?: MutationOptions): Promise<ApiResponse<T>>
```

**Parameters:**

| Parameter                 | Type     | Required | Description                             |
| ------------------------- | -------- | -------- | --------------------------------------- |
| `endpoint`                | string   | Yes      | API endpoint path                       |
| `body`                    | unknown  | Yes      | Request body (will be JSON-stringified) |
| `options.invalidatesTags` | string[] | No       | Cache tags to invalidate after success  |

**Examples:**

```typescript
// Basic POST request
const result = await serverApi.post<CreateUserResponse>("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// POST with cache invalidation
const verification = await serverApi.post<VerificationResponse>(
  "/verification/request",
  {
    name: "John Doe",
    email: "john@example.com",
    studentId: "41213012345",
  },
  { invalidatesTags: ["onboarding-status"] },
);
```

#### PUT

Update resources completely with cache invalidation.

```typescript
serverApi.put<T>(endpoint: string, body: unknown, options?: MutationOptions): Promise<ApiResponse<T>>
```

**Examples:**

```typescript
const updated = await serverApi.put<User>("/users/123", userData, {
  invalidatesTags: ["user-profile", "users-list"],
});
```

#### PATCH

Partially update resources with cache invalidation.

```typescript
serverApi.patch<T>(endpoint: string, body: unknown, options?: MutationOptions): Promise<ApiResponse<T>>
```

**Examples:**

```typescript
const updated = await serverApi.patch<User>(
  "/users/123",
  {
    name: "Jane Doe",
  },
  {
    invalidatesTags: ["user-profile"],
  },
);
```

#### DELETE

Remove resources with cache invalidation.

```typescript
serverApi.del<T>(endpoint: string, options?: MutationOptions): Promise<ApiResponse<T>>
```

**Examples:**

```typescript
await serverApi.del("/users/123", {
  invalidatesTags: ["users-list"],
});
```

## Cache Invalidation

### How It Works

The module automatically handles cache invalidation through Next.js's cache tagging system:

```typescript
// When a mutation succeeds, specified tags are invalidated
async function createCourse() {
  const result = await serverApi.post("/courses", courseData, {
    invalidatesTags: ["courses-list", "dashboard-stats"],
  });

  // The tags "courses-list" and "dashboard-stats" are now invalidated
  // Any cached data with these tags will be revalidated on next access
}
```

### Tag Invalidation Flow

```
Mutation Request
      ↓
POST/PUT/PATCH/DELETE
      ↓
Success Response ←──┐
      ↓             │
Invalidates Tags    │
      ↓             │
Cache Cleared       │
      ↓             │
Next Fetch          │
      ↓             │
Fresh Data          │
(revalidates) ──────┘
```

### Best Practices for Tags

| Resource     | Recommended Tags                    |
| ------------ | ----------------------------------- |
| User profile | `["user-profile", "auth-status"]`   |
| Users list   | `["users-list", "admin-dashboard"]` |
| Courses      | `["courses-list", "course-${id}"]`  |
| Onboarding   | `["onboarding-status"]`             |
| Student data | `["student-data", "student-${id}"]` |

## Error Handling

The module throws errors for non-OK responses:

```typescript
try {
  const result = await serverApi.post("/users", userData);
} catch (error) {
  // Error message from API or generic message
  console.error(error.message); // "Email already exists", "Invalid OTP", etc.
}
```

### Error Response Format

```typescript
interface ApiError {
  success: false;
  message: string; // User-friendly error message
  error?: string; // Optional additional error details
}
```

## Usage in Server Actions

The `serverApi` module works seamlessly with Next.js Server Actions:

```typescript
"use server";

import { serverApi } from "@/lib/server-api";
import { revalidatePath } from "next/cache";

export async function createVerification(formData: FormData) {
  try {
    const result = await serverApi.post(
      "/verification/request",
      {
        name: formData.get("name"),
        email: formData.get("email"),
        studentId: formData.get("studentId"),
      },
      {
        invalidatesTags: ["onboarding-status"],
      },
    );

    // Revalidate the onboarding page to show updated status
    revalidatePath("/onboarding");

    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Usage in Route Handlers

When used in API routes or middleware, `revalidateTag` is used instead of `updateTag`:

```typescript
// app/api/users/route.ts
import { serverApi } from "@/lib/server-api";

export async function POST(request: Request) {
  // The serverApi automatically handles tag invalidation
  // using revalidateTag when running outside Server Actions
  const result = await serverApi.post("/users", userData, {
    invalidatesTags: ["users-list"],
  });

  return Response.json(result);
}
```

## Common Patterns

### Fetching with Loading States

```typescript
async function useUserProfile() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await serverApi.get<User>("/profile", {
          tags: ["user-profile"],
        });
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { data, loading, error };
}
```

### Mutation with Optimistic Updates

```typescript
async function updateProfile(updates: Partial<User>) {
  const previousData = currentData;

  // Optimistic update
  setData({ ...currentData, ...updates });

  try {
    await serverApi.patch("/profile", updates, {
      invalidatesTags: ["user-profile"],
    });
  } catch (err) {
    // Rollback on error
    setData(previousData);
    console.error("Failed to update profile:", err);
  }
}
```

### Combining with SWR or React Query

```typescript
// Using with SWR
const { data, error, mutate } = useSWR("/courses", () =>
  serverApi
    .get<Course[]>("/courses", {
      tags: ["courses-list"],
    })
    .then((res) => res.data),
);

// After mutation, revalidate
await serverApi.post("/courses", newCourse, {
  invalidatesTags: ["courses-list"],
});
await mutate(); // SWR will re-fetch
```

## Integration with Backend APIs

The `serverApi` module is designed to work with the Smart NUB Campus backend API. Here are some common endpoint patterns:

### Authentication Endpoints

| Endpoint              | Method | Tags to Invalidate                |
| --------------------- | ------ | --------------------------------- |
| `/auth/login`         | POST   | `["auth-status", "user-profile"]` |
| `/auth/logout`        | POST   | `["auth-status"]`                 |
| `/auth/me`            | GET    | `["user-profile"]`                |
| `/auth/sign-up/email` | POST   | `["onboarding-status"]`           |

### Onboarding Endpoints

| Endpoint                | Method | Tags to Invalidate      |
| ----------------------- | ------ | ----------------------- |
| `/onboarding/current`   | GET    | `["onboarding-status"]` |
| `/verification/request` | POST   | `["onboarding-status"]` |
| `/account/create`       | POST   | `["onboarding-status"]` |

## Troubleshooting

### Common Issues

| Issue                                    | Solution                                                  |
| ---------------------------------------- | --------------------------------------------------------- |
| "Failed to invalidate cache tag" warning | Check if running in correct execution context             |
| Cookies not being sent                   | Ensure using in Server Component or Server Action context |
| TypeScript errors on generic types       | Ensure proper type imports from `@/types`                 |

### Debug Mode

For debugging cache behavior, you can check the server console for invalidation logs:

```typescript
// The module logs when tag invalidation fails
console.error(`Failed to invalidate cache tag: ${tag}`, err);
```

## Related Documentation

- [Authentication API](./AUTHENTICATION.md) - Backend authentication documentation
- [Onboarding API](./onboarding-api.md) - Onboarding workflow documentation
- [Next.js Data Fetching Docs](https://nextjs.org/docs/app/building-your-application/data-fetching) - Official Next.js caching guide
