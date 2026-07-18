"use server";

import { eventService } from "@/services/event.service";
import type { ApiResponse } from "@/types";
import type { ListEventsParams } from "@/types/event.types";

/** List events with pagination and filtering. */
export async function listEvents(
  params: ListEventsParams = {},
): Promise<ApiResponse> {
  try {
    const data = await eventService.listEvents(params);
    return { success: true, message: "Events fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch events.";
    return { success: false, message };
  }
}

/** Get a single event by ID. */
export async function getEvent(id: string): Promise<ApiResponse> {
  try {
    const data = await eventService.getEventById(id);
    return { success: true, message: "Event fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch event.";
    return { success: false, message };
  }
}

/** RSVP to an event. */
export async function rsvpEvent(eventId: string): Promise<ApiResponse> {
  try {
    await eventService.rsvp(eventId);
    return { success: true, message: "RSVP recorded." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to RSVP.";
    return { success: false, message };
  }
}

/** Cancel RSVP. */
export async function cancelRsvpEvent(eventId: string): Promise<ApiResponse> {
  try {
    await eventService.cancelRsvp(eventId);
    return { success: true, message: "RSVP cancelled." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to cancel RSVP.";
    return { success: false, message };
  }
}
