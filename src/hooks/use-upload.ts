import { useState, useCallback } from "react";
import { uploadService } from "@/services/upload.service";
import { type UploadResult, type UseUploadOptions } from "@/lib/upload/types";

export function useUpload(options: UseUploadOptions): {
  upload: (file: File) => Promise<UploadResult>;
  isUploading: boolean;
  error: string | null;
} {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      console.log(`[useUpload] Starting upload for:`, file.name, options.context);
      setIsUploading(true);
      setError(null);

      try {
        const result = await uploadService.upload(
          file,
          options.context,
          options.type,
        );
        console.log(`[useUpload] Upload result:`, result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        console.error(`[useUpload] Upload error:`, err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [options.context, options.type],
  );

  return { upload, isUploading, error };
}
