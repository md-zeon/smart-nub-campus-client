"use server";

import { connectionService } from "@/services/connection.service";
import type { ApiResponse } from "@/types";
import type { ListConnectionsParams } from "@/types/connection.types";

/** List connections with pagination and filtering. */
export async function listConnections(
  params: ListConnectionsParams = {},
): Promise<ApiResponse> {
  try {
    const data = await connectionService.listConnections(params);
    return { success: true, message: "Connections fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch connections.";
    return { success: false, message };
  }
}

/** Send a connection request. */
export async function sendConnectionRequest(
  receiverId: string,
): Promise<ApiResponse> {
  try {
    const connection = await connectionService.sendRequest(receiverId);
    return {
      success: true,
      message: "Connection request sent.",
      data: connection,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send request.";
    return { success: false, message };
  }
}

/** Accept a connection request. */
export async function acceptConnection(
  connectionId: string,
): Promise<ApiResponse> {
  try {
    await connectionService.acceptRequest(connectionId);
    return { success: true, message: "Connection accepted." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to accept connection.";
    return { success: false, message };
  }
}

/** Reject a connection request. */
export async function rejectConnection(
  connectionId: string,
): Promise<ApiResponse> {
  try {
    await connectionService.rejectRequest(connectionId);
    return { success: true, message: "Connection rejected." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reject connection.";
    return { success: false, message };
  }
}

/** Remove a connection. */
export async function removeConnection(
  connectionId: string,
): Promise<ApiResponse> {
  try {
    await connectionService.removeConnection(connectionId);
    return { success: true, message: "Connection removed." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove connection.";
    return { success: false, message };
  }
}

/** Toggle favorite on a connection. */
export async function toggleFavorite(
  connectionId: string,
): Promise<ApiResponse> {
  try {
    await connectionService.toggleFavorite(connectionId);
    return { success: true, message: "Favorite toggled." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle favorite.";
    return { success: false, message };
  }
}
