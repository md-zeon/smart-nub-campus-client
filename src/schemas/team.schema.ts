import { z } from "zod";

// ── Create Team Request ──────────────────────────────────────────────────────

export const createTeamRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters"),
    description: z.string().trim().min(1, "Description is required"),
    lookingForCount: z
      .number()
      .int()
      .positive("Must look for at least 1 member"),
    projectName: z.string().trim().optional(),
    deadline: z.string().datetime().optional(),
    category: z.string().trim().optional(),
    tags: z.array(z.string().trim().min(1)).min(1).optional(),
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
    tags: z.array(z.string().trim().min(1)).min(1).optional(),
  })
  .strict();

export type UpdateTeamRequestInput = z.infer<typeof updateTeamRequestSchema>;

// ── Create Application ───────────────────────────────────────────────────────

export const createApplicationSchema = z
  .object({
    message: z.string().trim().optional(),
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
