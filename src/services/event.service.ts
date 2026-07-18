/**
 * Event API service module.
 * Uses serverApi for server-side calls (proxied through Next.js).
 */

import serverApi from "@/lib/server-api";
import type {
  Event,
  ListEventsParams,
  EventListResponse,
} from "@/types/event.types";

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const eventService = {
  /** List events with pagination and filtering. */
  async listEvents(
    params: ListEventsParams = {},
  ): Promise<EventListResponse> {
    const query = buildQueryString(params);
    const response = await serverApi.get<EventListResponse>(
      `/events${query}`,
      { tags: ["events-list"] },
    );
    return response.data!;
  },

  /** Get a single event by ID. */
  async getEventById(id: string): Promise<Event> {
    const response = await serverApi.get<Event>(`/events/${id}`, {
      tags: ["event-detail"],
    });
    return response.data!;
  },

  /** RSVP to an event. */
  async rsvp(eventId: string): Promise<void> {
    await serverApi.post(`/events/${eventId}/rsvp`, {});
  },

  /** Cancel RSVP. */
  async cancelRsvp(eventId: string): Promise<void> {
    await serverApi.del(`/events/${eventId}/rsvp`);
  },
};
