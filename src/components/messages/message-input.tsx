"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  /** Whether a send is currently in-flight. */
  disabled?: boolean;
  /** Called with the trimmed text when the user sends a message. */
  onSend: (text: string) => void;
  /** Called with the uploaded file + its remote URL when an attachment is sent. */
  onSendFile?: (file: File) => void;
  /** Emitted (debounced) when the user starts typing. */
  onTypingStart?: () => void;
  /** Emitted when the user stops typing (blur / empty / send). */
  onTypingStop?: () => void;
  className?: string;
}

/**
 * The composer at the bottom of the chat thread (Column 3). Supports an
 * auto-expanding textarea, file attachment, and an emoji picker button.
 * Enter sends; Shift+Enter inserts a newline.
 */
export function MessageInput({
  disabled,
  onSend,
  onSendFile,
  onTypingStart,
  onTypingStop,
  className,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const typingFiredRef = useRef(false);

  const resize = useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setValue(next);
    resize();
    if (next.trim().length > 0) {
      if (!typingFiredRef.current) {
        typingFiredRef.current = true;
        onTypingStart?.();
      }
    } else if (typingFiredRef.current) {
      typingFiredRef.current = false;
      onTypingStop?.();
    }
  };

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    typingFiredRef.current = false;
    onTypingStop?.();
    requestAnimationFrame(resize);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      onSendFile?.(file);
    } finally {
      setUploading(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    setValue((v) => v + emoji);
    taRef.current?.focus();
    requestAnimationFrame(resize);
  };

  const EMOJIS = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "🙏", "😎"];

  return (
    <div className={cn("border-t bg-background p-3", className)}>
      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled || uploading}
          onClick={() => fileRef.current?.click()}
          aria-label="Attach file"
        >
          <Paperclip className="size-4" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            ref={taRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (typingFiredRef.current) {
                typingFiredRef.current = false;
                onTypingStop?.();
              }
            }}
            rows={1}
            placeholder="Type a message..."
            className="max-h-40 min-h-10 resize-none py-2 pr-10"
          />
          <button
            type="button"
            onClick={() =>
              insertEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)])
            }
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Add emoji"
          >
            <Smile className="size-4" />
          </button>
        </div>

        <Button
          type="button"
          size="icon"
          disabled={disabled || uploading || !value.trim()}
          onClick={submit}
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
