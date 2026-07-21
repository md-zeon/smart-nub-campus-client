/**
 * Event module types mirroring server-side Prisma models.
 * Keep in sync with server schema: prisma/schema/event.prisma
 */

// ── Shared references ────────────────────────────────────────────────────────

export interface EventOrganizer {
  id: string;
  name: string;
  image?: string | null;
}

// ── Core models ──────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  eventDate: string;
  location?: string | null;
  imageUrl?: string | null;
  organizerId?: string | null;
  organizer?: EventOrganizer;
  status: EventStatus;
  isFeatured: boolean;
  rsvpCount?: number;
  isRsvped?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

// ── Enums ────────────────────────────────────────────────────────────────────

export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

// ── API query / list types ───────────────────────────────────────────────────

export interface ListEventsParams {
  page?: number;
  limit?: number;
  status?: EventStatus;
  search?: string;
  upcoming?: boolean;
}

export interface EventListResponse {
  data: Event[];
  meta: import("./resource.types").PaginationMeta;
}
