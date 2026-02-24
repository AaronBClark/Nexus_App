import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const CampaignPacketSchema = PacketHeaderSchema.extend({
  type: z.literal("Campaign"),
}).extend({
  campaign: z.object({
    name: z.string(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),

    initiative_id: z.string().optional(),
    program_id: z.string().optional(),

    // timeboxing (optional but useful)
    start_date: z.string().optional(), // YYYY-MM-DD
    end_date: z.string().optional(),   // YYYY-MM-DD

    status: z.enum(["planned", "active", "completed", "archived"]).default("planned"),
  }),
});