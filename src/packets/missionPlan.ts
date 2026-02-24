import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const MissionPlanSchema = PacketHeaderSchema.extend({
  type: z.literal("MissionPlan"),
}).extend({
  mission: z.object({
    template_id: z.string(),

    name: z.string(),

    status: z.enum([
      "planned",
      "active",
      "completed",
      "archived",
    ]),

    logistics: z.object({
      location: z.string(),
      date: z.string(),
      duration: z.string().optional(),
    }),

    comms: z.object({
      mode: z.enum(["none", "thread", "channel"]),
      auto_create: z.boolean().default(true),
      auto_archive_on_close: z.boolean().default(true),
      discord_ref: z.string().nullable().default(null),
    }),

    participation: z.object({
      mode: z.enum([
        "integrated",
        "independent",
        "hybrid",
      ]),
    }),

    metrics: z.object({
      report_count: z.number().default(0),
      participant_count: z.number().default(0),
    }),
  }),
});