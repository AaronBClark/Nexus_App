import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const ProgramPacketSchema = PacketHeaderSchema.extend({
  type: z.literal("Program"),
}).extend({
  program: z.object({
    name: z.string(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // Programs usually belong to an initiative
    initiative_id: z.string().optional(),

    // repeatability hints (optional)
    cadence: z.string().optional(), // e.g. "weekly", "monthly", "ad-hoc"

    status: z.enum(["active", "paused", "archived"]).default("active"),
  }),
});