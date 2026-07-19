import { FileText, ImageIcon, Download } from "lucide-react";
import type { Message } from "@/types/message.types";
import { formatFileSize } from "./time";
import { cn } from "@/lib/utils";

interface SharedFilesProps {
  /** Messages that carry file or image attachments. */
  files: Message[];
  className?: string;
}

/**
 * Lists every file/image exchanged in the active conversation. Clicking an
 * item opens it in a new tab (download for files, preview for images).
 */
export function SharedFiles({ files, className }: SharedFilesProps) {
  if (files.length === 0) {
    return (
      <p className={cn("px-1 text-xs text-muted-foreground", className)}>
        No files shared yet.
      </p>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {files.map((file) => {
        const isImage = file.type === "IMAGE";
        return (
          <li key={file.id}>
            <a
              href={file.fileUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              download={!isImage && (file.fileName ?? true)}
              className="flex items-center gap-3 rounded-lg border bg-background p-2 transition-colors hover:bg-muted"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {isImage ? (
                  <ImageIcon className="size-4" />
                ) : (
                  <FileText className="size-4" />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {file.fileName ?? (isImage ? "Image" : "File")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {formatFileSize(file.fileSize)}
                </span>
              </span>
              <Download className="size-4 shrink-0 text-muted-foreground" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
