# API Client - Smart NUB Campus Client

This document provides documentation for the `apiClient` module, a client-side API client for making requests from the browser, including binary file uploads.

## Overview

The `apiClient` module provides a lightweight, client-side API client that runs in the browser. Unlike `serverApi`, it does NOT use Next.js server-only APIs (`next/headers`, `next/cache`), making it suitable for direct use in browser contexts, hooks, and client-side components.

## Features

- **Client-side only** - Runs in the browser without Next.js server dependencies
- **FormData support** - Automatic handling of multipart/form-data for file uploads
- **Cookie authentication** - Sends credentials with requests for auth handling
- **Type-safe responses** - Full TypeScript support for request and response types
- **Error handling** - Automatic error parsing and throwing

## Installation & Setup

### Environment Configuration

```env
# Client-side API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## API Reference

### Import

```typescript
import { apiClient } from "@/lib/api-client";
// or
import apiClient from "@/lib/api-client";
```

### Types

```typescript
interface ApiResponsePromise<T> {
  data: T | undefined;
  error?: string;
}
```

### Methods

#### GET

Fetch data from the API.

```typescript
apiClient.get<T>(endpoint: string): Promise<ApiResponsePromise<T>>
```

**Parameters:**

| Parameter  | Type   | Required | Description       |
| ---------- | ------ | -------- | ----------------- |
| `endpoint` | string | Yes      | API endpoint path |

**Examples:**

```typescript
// Basic GET request
const response = await apiClient.get<User[]>("/users");
```

#### POST

Create new resources.

```typescript
apiClient.post<T>(endpoint: string, body: unknown): Promise<ApiResponsePromise<T>>
```

**Parameters:**

| Parameter  | Type    | Required | Description         |
| ---------- | ------- | -------- | ------------------- |
| `endpoint` | string  | Yes      | API endpoint path   |
| `body`     | unknown | Yes      | Request body (JSON) |

**Examples:**

```typescript
// Basic POST request
const result = await apiClient.post<CreateUserResponse>("/users", {
  name: "John Doe",
  email: "john@example.com",
});
```

#### POST Form (FormData)

Upload files using multipart/form-data.

```typescript
apiClient.postForm<T>(endpoint: string, formData: FormData): Promise<ApiResponsePromise<T>>
```

**Parameters:**

| Parameter  | Type     | Required | Description         |
| ---------- | -------- | -------- | ------------------- |
| `endpoint` | string   | Yes      | API endpoint path   |
| `formData` | FormData | Yes      | Form data to upload |

**Important:** The browser automatically sets the `Content-Type` header with the multipart boundary when using this method. Do NOT manually set `Content-Type`.

**Examples:**

```typescript
// File upload
const formData = new FormData();
formData.append("file", selectedFile);
formData.append("context", "verification");

const result = await apiClient.postForm<UploadResult>("/upload", formData);
```

## Usage in File Uploads

The `apiClient` is used by the upload service for file uploads:

```typescript
// src/services/upload.service.ts
import { apiClient } from "@/lib/api-client";

const uploadService = {
  async upload(file: File, context: string, type?: "image" | "video" | "raw") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("context", context);
    if (type) formData.append("type", type);

    const response = await apiClient.postForm<UploadResult>(
      "/upload",
      formData,
    );
    return response.data;
  },
};
```

## Error Handling

The module throws errors for non-OK responses:

```typescript
try {
  const result = await apiClient.postForm("/upload", formData);
} catch (error) {
  // Handle error
  console.error(error.message);
}
```

## Integration with Upload Flow

```
Browser
  → FileUploadField
  → useUpload (hook)
  → uploadService
  → apiClient.postForm()
  → Express /upload
  → Cloudinary
```

## Related Documentation

- [Server API](./SERVER-API.md) - Server-side API client with cache invalidation
- [Upload Service](./../src/services/upload.service.ts) - Service implementation
- [useUpload Hook](./../src/hooks/use-upload.ts) - React hook for uploads
