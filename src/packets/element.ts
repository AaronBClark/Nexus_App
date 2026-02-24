import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const ElementType = z.enum(["person", "org", "node", "service", "unknown"]);

export const TrustIndexSchema = z.object({
  // Simple and non-gameable-ish v1 fields (no deep scoring logic yet)
  created_at: z.string().optional(),

  // Discord identity linkage for now
  discord: z.object({
    user_id: z.string().optional(),
    guild_id: z.string().optional(),
  }).optional(),

  // reputation-ish indicators (computed later, stored now if you want)
  activity: z.object({
    reports_authored: z.number().int().nonnegative().default(0),
    missions_coordinated: z.number().int().nonnegative().default(0),
    missions_participated: z.number().int().nonnegative().default(0),
    last_active_at: z.string().optional(),
  }).default({
    reports_authored: 0,
    missions_coordinated: 0,
    missions_participated: 0,
  }),

  // trust “state” (manual or computed later)
  trust: z.object({
    tier: z.enum(["unknown", "new", "established", "trusted"]).default("unknown"),
    notes: z.string().optional(),
  }).default({ tier: "unknown" }),
});

export const ElementPacketSchema = PacketHeaderSchema.extend({
  type: z.literal("Element"),
}).extend({
  element: z.object({
    name: z.string(),
    handle: z.string().optional(),     // e.g. "the_uprising"
    element_type: ElementType.default("unknown"),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // Optional contact / identity hints (keep light)
    links: z.array(z.object({
      label: z.string().optional(),
      url: z.string(),
    })).default([]),

    trust_index: TrustIndexSchema.optional(),
  }),
});