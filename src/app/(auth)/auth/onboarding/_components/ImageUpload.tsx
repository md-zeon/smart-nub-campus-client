"use client";

import { UploadIcon } from "@/components/ui/icons/upload";
import { XCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(
    value || undefined,
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // For now, just store a dummy URL since cloudinary isn't set up
      onChange(
        "https://res.cloudinary.com/demo/image/upload/dummy_id_card.jpg",
      );
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file ?? null);
    },
    [handleFile],
  );

  const handleRemove = useCallback(() => {
    setPreview(undefined);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
          "hover:border-brand/50 hover:bg-brand/5",
          isDragOver && "border-brand bg-brand/10",
          preview
            ? "border-success/50 bg-success/5"
            : "border-muted-foreground/25",
          error && "border-destructive bg-destructive/5",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {preview ? (
          <div className="relative w-full max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element -- blob URL from URL.createObjectURL can't use next/image */}
            <img
              src={preview}
              alt="ID Card Preview"
              className="mx-auto max-h-48 rounded-lg object-contain shadow-sm"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm transition-transform hover:scale-110"
            >
              <XCircleIcon className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex size-12 items-center justify-center rounded-full bg-brand/10">
              <UploadIcon className="text-brand" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                <span className="text-brand">Click to upload</span> or drag and
                drop
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG or JPEG (Max 5MB)
              </p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
