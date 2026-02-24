import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const PolicyPacketSchema = PacketHeaderSchema.extend({
  type: z.literal("Policy"),
}).extend({
  policy: z.object({
    name: z.string(),
    version: z.string().default("1.0"),
    summary: z.string().optional(),

    // Display-first; later can add machine validators
    statement: z.string(),

    validators: z.array(z.string()).default([]),
  }),
});