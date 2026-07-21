import { cn } from "@/lib/utils";

interface OnlineStatusProps {
  /** Whether the user is currently online. */
  online: boolean;
  /** Tailwind size classes for the dot. */
  className?: string;
  /** Show the text label next to the dot. */
  showLabel?: boolean;
}

/**
 * Small colored dot (green = online, gray = offline) used on avatars and
 * in conversation headers to convey presence.
 */
export function OnlineStatus({ online, className, showLabel }: OnlineStatusProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "inline-block size-2.5 rounded-full ring-2 ring-background",
          online ? "bg-emerald-500" : "bg-muted-foreground/40",
          className,
        )}
        aria-label={online ? "Online" : "Offline"}
      />
      {showLabel && (
        <span
          className={cn(
            "text-xs font-medium",
            online ? "text-emerald-600" : "text-muted-foreground",
          )}
        >
          {online ? "Online" : "Offline"}
        </span>
      )}
    </span>
  );
}
