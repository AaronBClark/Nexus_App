import { z } from "zod";
import { PacketHeaderSchema } from "./base.js";

export const ObjectiveOutcomeSchema = z.object({
  objective_id: z.string(),
  status: z.enum(["complete", "incomplete", "partial", "not_applicable"]),
  reason: z.string().optional(), // why incomplete/partial/NA
});

export const AttachmentSchema = z.object({
  label: z.string().optional(), // e.g. "Trash Collected"
  url: z.string(),              // discord CDN or external
  kind: z.enum(["image", "video", "file", "link"]).default("image"),
});

export const MissionReportSchema = PacketHeaderSchema.extend({
  type: z.literal("MissionReport"),
}).extend({
  mission_report: z.object({
    mission_id: z.string(), // references MissionPlan packet id
    template_id: z.string().optional(),

    // coordinator AAR vs participant report vs external element report
    report_type: z.enum(["coordinator_aar", "participant_report", "external_element_report"]).default("coordinator_aar"),

    author: z.object({
      persona_id: z.string(),
      display_name: z.string().optional(),
    }),

    // lightweight snapshot so report stands alone even if plan changes
    snapshot: z.object({
      initiative_label: z.string().optional(),
      name: z.string().optional(),
      version: z.string().optional(),
      scope_label: z.string().optional(),
      location: z.string().optional(),
      date: z.string().optional(),
      time: z.string().optional(),
      timezone: z.string().optional(),
      duration_minutes: z.number().int().nonnegative().optional(),
    }).default({}),

    participation: z.object({
      participant_count: z.number().int().nonnegative().optional(),
      participant_labels: z.array(z.string()).default([]), // optional display names or anonymous tags
    }).default({ participant_labels: [] }),

    // objective completion with reasons
    objectives: z.array(ObjectiveOutcomeSchema).default([]),

    // module sections
    modules: z.object({
      safety_protocols: z.array(z.string()).default([]),
      communications: z.array(z.string()).default([]),
      supply_checklist: z.array(z.string()).default([]),
    }).default({
      safety_protocols: [],
      communications: [],
      supply_checklist: [],
    }),

    // notes per section
    notes: z.object({
      general: z.string().optional(),
      safety: z.string().optional(),
      communications: z.string().optional(),
      supply: z.string().optional(),
    }).default({}),

    // what changed / what to do better
    improvement_opportunities: z.array(z.string()).default([]),

    // attachments
    attachments: z.array(AttachmentSchema).default([]),
  }),
});