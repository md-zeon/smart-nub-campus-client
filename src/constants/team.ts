/**
 * Team module constants for the client.
 * Categories mirror the free-form `category` string on TeamRequest.
 */

export const TEAM_CATEGORIES = [
  "Academic Project",
  "Personal Project",
  "Startup",
  "Research",
  "Competition",
  "Other",
] as const;

export type TeamCategory = (typeof TEAM_CATEGORIES)[number];

/** Popular skills shown in the left sidebar (used for quick filtering). */
export const POPULAR_SKILLS = [
  "React",
  "Node.js",
  "Python",
  "Java",
  "TypeScript",
  "Figma",
  "CSS",
  "UI/UX",
  "Machine Learning",
  "Data Analysis",
] as const;

/** Status badge color classes. OPEN=green, FILLED=yellow, CLOSED=gray. */
export const TEAM_STATUS_BADGE: Record<
  "OPEN" | "FILLED" | "CLOSED",
  { label: string; className: string }
> = {
  OPEN: {
    label: "OPEN",
    className: "bg-success/10 text-success ring-1 ring-success/30",
  },
  FILLED: {
    label: "FILLED",
    className: "bg-warning/10 text-warning ring-1 ring-warning/30",
  },
  CLOSED: {
    label: "CLOSED",
    className: "bg-muted text-muted-foreground ring-1 ring-foreground/10",
  },
};

/** Application status badge color classes. */
export const APPLICATION_STATUS_BADGE: Record<
  "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN",
  { label: string; className: string }
> = {
  PENDING: {
    label: "PENDING",
    className: "bg-warning/10 text-warning ring-1 ring-warning/30",
  },
  ACCEPTED: {
    label: "ACCEPTED",
    className: "bg-success/10 text-success ring-1 ring-success/30",
  },
  REJECTED: {
    label: "REJECTED",
    className: "bg-destructive/10 text-destructive ring-1 ring-destructive/30",
  },
  WITHDRAWN: {
    label: "WITHDRAWN",
    className: "bg-muted text-muted-foreground ring-1 ring-foreground/10",
  },
};
