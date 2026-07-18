"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { listEvents } from "@/actions/event.actions";
import type { Event } from "@/types/event.types";

/** Loading skeleton for a single event card. */
function EventCardSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      <div className="size-8 rounded bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}

/** Upcoming events section — fetches next 3 upcoming events. */
export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const result = await listEvents({
          status: "UPCOMING",
          limit: 3,
        });
        console.log("Events List:", result);
        /*
        Events List: {
    "success": true,
    "message": "Events fetched.",
    "data": {
        "data": [
            {
                "id": "a847efc7-d6a5-45f5-a219-00cbccd1af78",
                "title": "Annual Career Fair",
                "description": "Connect with top employers looking to hire NUB graduates. Bring your resume and dress to impress.",
                "eventDate": "2026-09-01T10:00:00.000Z",
                "location": "Student Center, Hall A",
                "imageUrl": "https://res.cloudinary.com/example/image/upload/career-fair.jpg",
                "organizerId": "YmURNdS2K4869bY5XX2SA8EhCNVzUycx",
                "status": "UPCOMING",
                "isFeatured": true,
                "createdAt": "2026-07-18T02:09:14.884Z",
                "updatedAt": "2026-07-18T02:09:14.884Z",
                "organizer": {
                    "id": "YmURNdS2K4869bY5XX2SA8EhCNVzUycx",
                    "name": "System Administrator",
                    "image": null
                },
                "_count": {
                    "rsvps": 0
                },
                "isRsvpd": false
            },
            {
                "id": "8e4b56c8-8dd4-4f8a-8286-1469f2d280af",
                "title": "Tech Talk: AI in 2026",
                "description": "Join industry experts as they discuss the latest advancements in artificial intelligence and how they impact the tech landscape.",
                "eventDate": "2026-08-25T14:00:00.000Z",
                "location": "CSE Building, Room 301",
                "imageUrl": "https://res.cloudinary.com/example/image/upload/ai-tech-talk.jpg",
                "organizerId": "YmURNdS2K4869bY5XX2SA8EhCNVzUycx",
                "status": "UPCOMING",
                "isFeatured": false,
                "createdAt": "2026-07-18T02:09:14.822Z",
                "updatedAt": "2026-07-18T02:09:14.822Z",
                "organizer": {
                    "id": "YmURNdS2K4869bY5XX2SA8EhCNVzUycx",
                    "name": "System Administrator",
                    "image": null
                },
                "_count": {
                    "rsvps": 0
                },
                "isRsvpd": false
            },
            {
                "id": "051a7cdc-8022-4e66-be2b-9e696a340a0b",
                "title": "Campus Welcome Week 2026",
                "description": "Kick off the new semester with a week of fun activities, club fairs, and networking events. Meet fellow students and discover what NUB has to offer.",
                "eventDate": "2026-08-15T09:00:00.000Z",
                "location": "NUB Main Campus, Auditorium",
                "imageUrl": "https://res.cloudinary.com/example/image/upload/welcome-week.jpg",
                "organizerId": "YmURNdS2K4869bY5XX2SA8EhCNVzUycx",
                "status": "UPCOMING",
                "isFeatured": true,
                "createdAt": "2026-07-18T02:09:14.763Z",
                "updatedAt": "2026-07-18T02:09:14.763Z",
                "organizer": {
                    "id": "YmURNdS2K4869bY5XX2SA8EhCNVzUycx",
                    "name": "System Administrator",
                    "image": null
                },
                "_count": {
                    "rsvps": 0
                },
                "isRsvpd": false
            }
        ],
        "meta": {
            "page": 1,
            "limit": 3,
            "total": 3,
            "totalPages": 1
        }
    }
}
        */
        if (!cancelled && result.success && result.data) {
          const data = result.data as { data: Event[] };
          setEvents(data.data ?? []);
        }
      } catch {
        // Empty state handled by checking events.length
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Format a date string to a readable short format. */
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Upcoming Events
        </h2>
        <Link
          href="/events"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      {/* ── Loading skeletons ─────────────────────────────────────── */}
      {loading && (
        <div className="space-y-2">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {!loading && events.length === 0 && (
        <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
          No upcoming events.
        </p>
      )}

      {/* ── Event cards ───────────────────────────────────────────── */}
      {!loading && events.length > 0 && (
        <div className="space-y-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 ring-1 ring-foreground/10 transition-all hover:shadow-md"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="size-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-foreground">
                  {event.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatDate(event.eventDate)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
