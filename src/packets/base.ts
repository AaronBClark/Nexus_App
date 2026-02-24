import { z } from "zod";

export const PacketType = z.enum([
  "MissionTemplate",
  "MissionPlan",
  "MissionReport",
]);

export const ScopeLevel = z.enum([
  "Solo",
  "Team",
  "Node",
  "MultiScope",
]);

export const Visibility = z.enum([
  "public",
  "nexus_internal",
  "unlisted",
  "sealed",
]);

export const PacketHeaderSchema = z.object({
  id: z.string(),

  type: PacketType,

  schema_version: z.string().default("1.0"),
  packet_version: z.string().default("1.0.0"),

  created_at: z.string(),
  updated_at: z.string(),

  scope: z.object({
    level: ScopeLevel,
    element_id: z.string(),
  }),

  publish: z.object({
    visibility: Visibility,
    allow_mirroring: z.boolean().default(true),
  }),

  authorship: z.object({
    platform: z.literal("discord"),
    user_id: z.string(),
    attributed_element_id: z.string(),
  }),

  integrity: z.object({
    content_hash: z.string().nullable().default(null),
    sig: z.string().nullable().default(null),
  }),

  // 🔗 future-proof linking layer
  relations: z.object({
    parent_id: z.string().nullable().default(null),
    template_id: z.string().nullable().default(null),
    related_ids: z.array(z.string()).default([]),
  }),
});