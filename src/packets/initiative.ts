import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const InitiativePacketSchema = PacketHeaderSchema.extend({
  type: z.literal("Initiative"),
}).extend({
  initiative: z.object({
    name: z.string(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // optional identity/ownership
    steward_element_id: z.string().optional(), // who maintains it

    // later: governance, signaling, etc.
    status: z.enum(["active", "paused", "archived"]).default("active"),
  }),
});