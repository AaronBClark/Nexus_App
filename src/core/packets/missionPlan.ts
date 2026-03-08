import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const MissionPlanSchema = PacketHeaderSchema.extend({
  type: z.literal("MissionPlan"),
}).extend({
  mission: z.object({
    template_id: z.string(),

    // snapshot metadata for stability, but keep template_id for provenance
    template_name: z.string().optional(),
    template_version: z.string().optional(),

    initiative_id: z.string().optional(),
    program_id: z.string().optional(),
    campaign_id: z.string().optional(),

    name: z.string(),
    version: z.string().default("1.0"),

    status: z.enum(["draft", "planned", "active", "completed", "archived"]).default("draft"),

    coordinators: z.array(z.object({
      persona_id: z.string(),
      display_name: z.string().optional(),
    })).default([]),

    participation: z.object({
      mode: z.enum(["integrated", "independent", "hybrid"]).default("hybrid"),
      alignment_label: z.string().optional(), // e.g. "Open (any may join)"
    }).default({ mode: "hybrid" }),

    logistics: z.object({
      location: z.string(),
      date: z.string(),              // YYYY-MM-DD
      time: z.string().optional(),   // freeform for now: "Afternoon", "4:00pm"
      timezone: z.string().optional(), // "America/Los_Angeles"
      duration_minutes: z.object({
        min: z.number().int().nonnegative(),
        max: z.number().int().nonnegative(),
      }).optional(),
    }),

    // what capabilities/rules are attached
    module_refs: z.array(z.string()).default([]),
    policy_refs: z.array(z.string()).default([]),

    // answers to template+module fields (UI-driven later)
    inputs: z.record(z.string(), z.any()).default({}),

    // planning notes and expectations (helps prevent report issues)
    notes: z.object({
      general: z.string().optional(),
      safety: z.string().optional(),
      communications: z.string().optional(),
      supply: z.string().optional(),
    }).default({}),
  }),
});