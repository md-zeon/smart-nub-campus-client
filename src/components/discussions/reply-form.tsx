"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  parentId?: string;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
}

/**
 * Form to post a reply (or nested reply) to a discussion.
 * Triggers the parent's submit handler and resets on success.
 */
export function ReplyForm({
  parentId,
  placeholder = "Add a reply...",
  autoFocus,
  compact,
  onSubmit,
  onCancel,
}: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={compact ? "mt-2" : "mt-4"}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        autoFocus={autoFocus}
        maxLength={3000}
        disabled={submitting}
        className="w-full resize-none"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button size="sm" onClick={handleSubmit} disabled={submitting || !content.trim()}>
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {parentId ? "Reply" : "Submit Reply"}
        </Button>
      </div>
    </div>
  );
}
