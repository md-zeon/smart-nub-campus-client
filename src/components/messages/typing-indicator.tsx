import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  /** Names of the users currently typing (excluding the current user). */
  names?: string[];
  className?: string;
}

/**
 * Three animated dots shown in the chat thread (and optionally in a
 * conversation preview) to indicate that someone is composing a message.
 */
export function TypingIndicator({ names, className }: TypingIndicatorProps) {
  const label = names && names.length > 0
    ? `${names.join(", ")} ${names.length === 1 ? "is" : "are"} typing`
    : "typing";

  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={label}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
