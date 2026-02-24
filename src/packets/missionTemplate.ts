import { z } from "zod";
import { PacketHeaderSchema, ScopeLevel } from "./base.js";

export const MissionTemplateSchema = PacketHeaderSchema.extend({
  type: z.literal("MissionTemplate"),
}).extend({
  mission_template: z.object({
    name: z.string(),
    summary: z.string().optional(),

    tags: z.array(z.string()).default([]),

    supported_scopes: z.array(ScopeLevel),

    objectives: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),

    // 🔥 THIS drives your UI later
    fields: z.record(
        z.string(),
        z.object({
            label: z.string(),
            type: z.enum(["string", "date", "int_range", "string_list"]),
            required: z.boolean().default(false),
     })
    ),
  }),
});