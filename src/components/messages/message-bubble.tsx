import { FileText, Download } from "lucide-react";
import type { Message } from "@/types/message.types";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatClockTime, formatFileSize } from "./time";

interface MessageBubbleProps {
  /** The message to render. */
  message: Message;
  /** Whether the message was sent by the current user (right-aligned). */
  isOwn: boolean;
  /** Whether to show the sender avatar + name (only for first in a group). */
  showSender: boolean;
  /** All participants of the conversation (for group sender names). */
  participants?: { id: string; name: string; image?: string | null }[];
  /** Called when a file/image attachment is clicked. */
  onAttachmentClick?: (message: Message) => void;
}

/**
 * A single message in the chat thread. Renders text, file, and image
 * variants. Own messages are right-aligned with a primary bubble; others are
 * left-aligned. Read receipts (checkmarks) are shown on own messages.
 */
export function MessageBubble({
  message,
  isOwn,
  showSender,
  participants = [],
  onAttachmentClick,
}: MessageBubbleProps) {
  const sender = participants.find((p) => p.id === message.senderId);
  const isImage = message.type === "IMAGE";
  const isFile = message.type === "FILE";

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isOwn ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar column (only for group chats, first of a group) */}
      <div className="w-8 shrink-0">
        {!isOwn && showSender && sender && (
          <Avatar id={sender.id} name={sender.name} src={sender.image} className="size-8" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[78%] flex-col gap-1",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {!isOwn && showSender && sender && (
          <span className="px-1 text-xs font-medium text-muted-foreground">
            {sender.name}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm shadow-sm ring-1 ring-foreground/5",
            isOwn
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted text-foreground",
          )}
        >
          {message.replyTo && (
            <div className="mb-1 border-l-2 border-foreground/20 pl-2 text-xs opacity-80">
              <span className="font-medium">
                {message.replyTo.sender?.name ?? "Someone"}
              </span>
              : {message.replyTo.content}
            </div>
          )}

          {isImage && message.fileUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={message.fileUrl}
              alt={message.fileName ?? "image"}
              onClick={() => onAttachmentClick?.(message)}
              className="max-h-64 cursor-zoom-in rounded-lg object-cover"
              loading="lazy"
            />
          ) : isFile && message.fileUrl ? (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={message.fileName ?? true}
              className={cn(
                "flex items-center gap-2 rounded-lg px-1 py-0.5",
                isOwn ? "hover:bg-primary-foreground/10" : "hover:bg-foreground/5",
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  isOwn ? "bg-primary-foreground/15" : "bg-background",
                )}
              >
                <FileText className="size-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{message.fileName}</span>
                <span className="text-[11px] opacity-70">
                  {formatFileSize(message.fileSize)}
                </span>
              </span>
              <Download className="size-4 shrink-0 opacity-70" />
            </a>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>

        <div
          className={cn(
            "flex items-center gap-1 px-1 text-[11px] text-muted-foreground",
            isOwn ? "flex-row-reverse" : "flex-row",
          )}
        >
          <span>{formatClockTime(message.createdAt)}</span>
          {isOwn && (
            <span aria-label={message.isRead ? "Read" : "Sent"}>
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
