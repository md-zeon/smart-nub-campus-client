"use server";

import { teamService } from "@/services/team.service";
import type { ApiResponse } from "@/types";
import type { ListTeamRequestsParams, TeamRequestStatus } from "@/types/team.types";

/** List team requests with pagination and filtering. */
export async function listTeamRequests(
  params: ListTeamRequestsParams = {},
): Promise<ApiResponse> {
  try {
    const data = await teamService.listTeamRequests(params);
    return { success: true, message: "Team requests fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch team requests.";
    return { success: false, message };
  }
}

/** Get a single team request by ID. */
export async function getTeamRequest(id: string): Promise<ApiResponse> {
  try {
    const data = await teamService.getTeamRequestById(id);
    return { success: true, message: "Team request fetched.", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch team request.";
    return { success: false, message };
  }
}

/** Apply to a team request. */
export async function applyToTeam(
  teamRequestId: string,
  data: { message?: string },
): Promise<ApiResponse> {
  try {
    const application = await teamService.applyToTeam(teamRequestId, data);
    return { success: true, message: "Application submitted.", data: application };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit application.";
    return { success: false, message };
  }
}

/** Review (accept/reject) a team application. */
export async function reviewTeamApplication(
  teamRequestId: string,
  applicationId: string,
  status: "ACCEPTED" | "REJECTED",
): Promise<ApiResponse> {
  try {
    const application = await teamService.reviewApplication(
      teamRequestId,
      applicationId,
      { status },
    );
    return { success: true, message: "Application reviewed.", data: application };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to review application.";
    return { success: false, message };
  }
}

/** Withdraw a team application. */
export async function withdrawTeamApplication(
  teamRequestId: string,
  applicationId: string,
): Promise<ApiResponse> {
  try {
    await teamService.withdrawApplication(teamRequestId, applicationId);
    return { success: true, message: "Application withdrawn." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to withdraw application.";
    return { success: false, message };
  }
}

/** Update team request status. */
export async function updateTeamStatus(
  teamRequestId: string,
  status: TeamRequestStatus,
): Promise<ApiResponse> {
  try {
    await teamService.updateTeamStatus(teamRequestId, status);
    return { success: true, message: "Team status updated." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update team status.";
    return { success: false, message };
  }
}
