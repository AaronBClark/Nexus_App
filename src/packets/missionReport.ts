import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const MissionReportSchema = PacketHeaderSchema.extend({
  type: z.literal("MissionReport"),
}).extend({
  mission_report: z.object({
    mission_id: z.string(),

    report_type: z.enum([
      "coordinator_aar",
      "participant_report",
      "external_element_report",
    ]),

    summary: z.string(),

    objectives_completed: z.array(z.string()),

    notes: z.string().optional(),

    attachments: z.array(z.string()).default([]),
  }),
});