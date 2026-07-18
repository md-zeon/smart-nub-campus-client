import { z } from "zod";

// ── Create Team Request ──────────────────────────────────────────────────────

export const createTeamRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description must be at most 2000 characters"),
    lookingForCount: z
      .number()
      .int()
      .min(1, "Must look for at least 1 member")
      .max(20, "Cannot look for more than 20 members"),
    projectName: z.string().trim().max(200).optional(),
    deadline: z.string().datetime().optional(),
    category: z.string().trim().optional(),
    skillTagIds: z.array(z.string().uuid("Invalid skill tag ID")).min(1, "At least one skill is required"),
  })
  .strict();

export type CreateTeamRequestInput = z.infer<typeof createTeamRequestSchema>;

// ── Update Team Request ──────────────────────────────────────────────────────

export const updateTeamRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(200, "Title must be at most 200 characters")
      .optional(),
    description: z.string().trim().optional(),
    lookingForCount: z.number().int().positive().optional(),
    projectName: z.string().trim().optional(),
    deadline: z.string().datetime().optional(),
    status: z.enum(["OPEN", "FILLED", "CLOSED"]).optional(),
    category: z.string().trim().optional(),
    skillTagIds: z.array(z.string().uuid("Invalid skill tag ID")).min(1).optional(),
  })
  .strict();

export type UpdateTeamRequestInput = z.infer<typeof updateTeamRequestSchema>;

// ── Create Application ───────────────────────────────────────────────────────

export const createApplicationSchema = z
  .object({
    message: z.string().trim().max(1000, "Message must be at most 1000 characters").optional(),
  })
  .strict();

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// ── Review Application ───────────────────────────────────────────────────────

export const reviewApplicationSchema = z
  .object({
    status: z.enum(["ACCEPTED", "REJECTED"]),
  })
  .strict();

export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>;
