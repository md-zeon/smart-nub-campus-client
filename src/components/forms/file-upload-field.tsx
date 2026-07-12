import {
  type FieldValues,
  type FieldPath,
  useController,
  type UseControllerProps,
} from "react-hook-form";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
} from "@/components/forms/file-upload";
import { type UploadContext } from "@/lib/upload/types";
import { useUpload } from "@/hooks/use-upload";
import { uploadService } from "@/services/upload.service";
import * as React from "react";
import { UploadCloud, XIcon } from "lucide-react";
import { toast } from "sonner";

/**
 * Build a stable composite key from a File object.
 * This avoids relying on the File object reference as a Map key,
 * which can be unreliable across renders.
 */
function getFileKey(file: File): string {
  return `${file.name}|${file.size}|${file.lastModified}`;
}

interface FileUploadFieldOwnProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
}

type FileUploadFieldProps<TFieldValues extends FieldValues> =
  FileUploadFieldOwnProps &
    Pick<UseControllerProps<TFieldValues>, "control" | "name" | "rules"> & {
      context: UploadContext;
      type?: "image" | "video" | "raw";
    };

export function FileUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  containerClassName,
  accept = "image/*",
  maxFiles = 1,
  maxSize,
  context,
  type = "image",
}: FileUploadFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: name as FieldPath<TFieldValues>,
    rules,
  });

  const [files, setFiles] = React.useState<File[]>([]);

  const { upload } = useUpload({ context, type });

  // Track uploaded publicIds keyed by stable file identifier.
  // Using a Record instead of a Map<File, string> avoids issues with
  // File object identity changing across renders.
  const publicIdsRef = React.useRef<Record<string, string>>({});

  // Keep a ref to the previous files array so we can detect which file was removed.
  const prevFilesRef = React.useRef<File[]>([]);

  const handleUpload = async (
    uploadedFiles: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    if (uploadedFiles.length === 0) return;

    try {
      const result = await upload(uploadedFiles[0]);
      // Store the publicId keyed by a stable file identifier
      for (const file of uploadedFiles) {
        publicIdsRef.current[getFileKey(file)] = result.publicId;
      }
      // Set the uploaded URL as the form field value
      field.onChange(result.url);
      for (const file of uploadedFiles) {
        options.onSuccess(file);
      }
    } catch (err) {
      const uploadError =
        err instanceof Error ? err : new Error("Upload failed");
      console.error(`[FileUploadField] Upload error:`, err);
      options.onError(uploadedFiles[0], uploadError);
      // Clear the field on error so the user must re-upload
      field.onChange("");
      throw err;
    }
  };

  // Handle file removal and trigger Cloudinary deletion
  const handleValueChange = React.useCallback(
    (updatedFiles: File[]) => {
      // Detect which file was removed (present in prevFiles but not in updatedFiles)
      const prevFiles = prevFilesRef.current;
      for (const prevFile of prevFiles) {
        const stillPresent = updatedFiles.some(
          (f) =>
            f.name === prevFile.name &&
            f.size === prevFile.size &&
            f.lastModified === prevFile.lastModified,
        );

        if (!stillPresent) {
          // This file was removed — attempt to delete from Cloudinary
          const fileKey = getFileKey(prevFile);
          const publicId = publicIdsRef.current[fileKey];

          if (publicId) {
            uploadService
              .delete(publicId)
              .then(() => {
                // Clean up the stored publicId
                delete publicIdsRef.current[fileKey];
              })
              .catch((err) => {
                console.error(
                  `[FileUploadField] Failed to delete ${publicId} from Cloudinary:`,
                  err,
                );
                toast.error(
                  "Failed to delete uploaded image. It may remain on the server.",
                );
              });
          }
        }
      }

      // Update refs and state
      prevFilesRef.current = updatedFiles;
      setFiles(updatedFiles);

      // When the user removes all files, clear the form field value
      if (updatedFiles.length === 0) {
        field.onChange("");
      }
    },
    [field],
  );

  const hasFile = files.length > 0;

  return (
    <Field className={containerClassName}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <FileUpload
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        onUpload={handleUpload}
        onValueChange={handleValueChange}
      >
        {/* Hide dropzone once a file has been selected / uploaded */}
        {!hasFile && (
          <FileUploadDropzone className="cursor-pointer">
            <div className="space-y-2 text-center">
              <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-foreground">
                Drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                {accept} • Up to {maxFiles} file
                {maxFiles > 1 ? "s" : ""}
                {maxSize
                  ? ` • Max ${(maxSize / 1024 / 1024).toFixed(0)}MB each`
                  : ""}
              </p>
              <p className="text-xs text-muted-foreground/80">
                Tip: Use clear, high-quality files for better results.
              </p>
            </div>
          </FileUploadDropzone>
        )}

        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={file.name} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemProgress />
              <FileUploadItemDelete className="ml-auto rounded p-1 opacity-70 hover:opacity-100">
                <XIcon className="size-4" />
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && (
        <span className="text-xs text-destructive">{error.message}</span>
      )}
    </Field>
  );
}
