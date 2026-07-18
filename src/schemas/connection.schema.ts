import { z } from "zod";

// ── Send Connection Request ──────────────────────────────────────────────────

export const sendConnectionRequestSchema = z
  .object({
    receiverId: z.string().uuid("Invalid user ID"),
  })
  .strict();

export type SendConnectionRequestInput = z.infer<
  typeof sendConnectionRequestSchema
>;
