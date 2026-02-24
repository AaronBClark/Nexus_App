import { z } from "zod";
import { PacketHeaderSchema, ScopeLevel, FieldSchema } from "./base.js";

export const MissionTemplateSchema = PacketHeaderSchema.extend({
  type: z.literal("MissionTemplate"),
}).extend({
  mission_template: z.object({
    name: z.string(),
    version: z.string().default("1.0"),
    summary: z.string().optional(),

    // future: tie into Initiative/Program/Campaign packets later
    initiative_id: z.string().optional(),
    program_id: z.string().optional(),
    campaign_id: z.string().optional(),

    tags: z.array(z.string()).default([]),

    supported_scopes: z.array(ScopeLevel),

    objectives: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ).default([]),

    // defaults applied when creating a MissionPlan from this template
    default_module_refs: z.array(z.string()).default([]),
    default_policy_refs: z.array(z.string()).default([]),

    // drives UI later (template-level fields)
    fields: z.record(z.string(), FieldSchema).default({}),
  }),
});