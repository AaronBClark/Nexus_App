import { z } from "zod";
import { PacketHeaderSchema, FieldSchema } from "./base.js";

export const ModuleCategory = z.enum([
  "safety",
  "communications",
  "supply",
  "reporting",
  "coordination",
  "other",
]);

export const ModulePacketSchema = PacketHeaderSchema.extend({
  type: z.literal("Module"),
}).extend({
  module: z.object({
    name: z.string(),
    version: z.string().default("1.0"),
    summary: z.string().optional(),

    category: ModuleCategory.default("other"),

    // UI-driver: module-specific fields
    fields: z.record(z.string(), FieldSchema).default({}),

    // Optional: embed/layout hints later
    render_hints: z.object({
      section_title: z.string().optional(),
      order: z.number().int().optional(),
    }).optional(),
  }),
});