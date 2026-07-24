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
 * A single WhatsApp-style message bubble. Own messages are right-aligned in a
 * green bubble with a bottom-right tail; others are left-aligned in a white
 * bubble with a bottom-left tail. The timestamp (and read tick for own
 * messages) sits inside the bubble, bottom-right.
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
          "flex max-w-[80%] flex-col gap-0.5",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {!isOwn && showSender && sender && (
          <span className="px-1 text-xs font-semibold text-emerald-600">
            {sender.name}
          </span>
        )}

        <div
          className={cn(
            "relative px-2.5 py-1.5 text-sm shadow-sm",
            isOwn
              ? "rounded-2xl rounded-br-md bg-[#d9fdd3] text-[#111b21]"
              : "rounded-2xl rounded-bl-md bg-white text-[#111b21]",
            isImage && "overflow-hidden p-1",
            isFile && "min-w-64",
          )}
        >
          {message.replyTo && (
            <div className="mb-1 border-l-2 border-emerald-500/60 pl-2 text-xs text-[#54656f]">
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
              className="max-h-64 w-full cursor-zoom-in rounded-lg object-cover"
              loading="lazy"
            />
          ) : isFile && message.fileUrl ? (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={message.fileName ?? true}
              className="flex items-center gap-2 py-1"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                <FileText className="size-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-[#111b21]">
                  {message.fileName}
                </span>
                <span className="text-[11px] text-[#667781]">
                  {formatFileSize(message.fileSize)}
                </span>
              </span>
              <Download className="size-4 shrink-0 text-[#667781]" />
            </a>
          ) : (
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          )}

          {/* Timestamp + read receipt, pinned bottom-right of the bubble. */}
          <div
            className={cn(
              "mt-0.5 flex items-center justify-end gap-1 text-[10px] text-[#667781]",
              (isImage || isFile) && "absolute bottom-1 right-1.5 rounded bg-black/30 px-1 text-white/90",
            )}
          >
            <span>{formatClockTime(message.createdAt)}</span>
            {isOwn && (
              <span aria-label={message.isRead ? "Read" : "Sent"}>
                {message.isRead ? (
                  <span className="text-[#53bdeb]">✓✓</span>
                ) : (
                  "✓"
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
