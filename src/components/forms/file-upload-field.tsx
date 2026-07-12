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
import * as React from "react";
import { XIcon } from "lucide-react";

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

  const handleUpload = async (
    uploadedFiles: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    console.log(
      `[FileUploadField] handleUpload called with`,
      uploadedFiles.length,
      "files",
    );
    if (uploadedFiles.length === 0) return;

    try {
      const result = await upload(uploadedFiles[0]);
      console.log(`[FileUploadField] Upload result:`, result);
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

  const hasFile = files.length > 0;

  return (
    <Field className={containerClassName}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <FileUpload
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        onUpload={handleUpload}
        onValueChange={(updatedFiles) => {
          setFiles(updatedFiles);
          // When the user removes all files, clear the form field value
          if (updatedFiles.length === 0) {
            field.onChange("");
          }
        }}
      >
        {/* Hide dropzone once a file has been selected / uploaded */}
        {!hasFile && (
          <FileUploadDropzone>
            <span className="text-sm text-muted-foreground">
              Click or drag to upload image (max 1 file, 5MB)
            </span>
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

