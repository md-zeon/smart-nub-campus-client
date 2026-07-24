/* TODO(AI-PAGE): Known issues to revisit — Phase 18 AI Assistant page. See commit/notes: 1) New-chat URL uses /ai?chat=<id> via createNewSession; confirm this matches desired route (some wanted /ai/<uuid> path segment). 2) Chat history title updates from server on first message — verify it shows promptly. 3) Verify send retry-on-not-found and clean URL across refresh/back-forward. 4) Re-check right sidebar (AI Tools removed per request). */
"use client";


import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

/**
 * Compact tool card used in the quick-tools grid and the right panel.
 * Renders an icon, name, short description, and fires onClick when activated.
 */
export function ToolCard({
  name,
  description,
  icon: Icon,
  onClick,
  className,
}: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-xl border bg-card p-3 text-left ring-1 ring-foreground/5 transition-all hover:border-primary/40 hover:bg-primary/5 active:translate-y-px",
        className,
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <span className="text-xs font-semibold text-foreground">{name}</span>
      <span className="text-[10px] leading-tight text-muted-foreground">
        {description}
      </span>
    </button>
  );
}
