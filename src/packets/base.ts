import { z } from "zod";

export const PacketType = z.enum([
  "MissionTemplate",
  "MissionPlan",
  "MissionReport",
  "Module",
  "Policy",
  "Initiative",
  "Program",
  "Campaign",
  "Element",
]);

export const ScopeLevel = z.enum(["Solo", "Team", "Node", "MultiScope"]);

export const Visibility = z.enum(["public", "nexus_internal", "unlisted", "sealed"]);

export const DependencyStrength = z.enum(["required", "recommended", "ancillary"]);

export const DependencySchema = z.object({
  strength: DependencyStrength,
  ref: z.string(),                 // packet id, e.g. nx:mod/safety@1.0.0
  reason: z.string().optional(),
});

export const DiscordRefSchema = z.object({
  guild_id: z.string().optional(),
  channel_id: z.string().optional(),
  thread_id: z.string().optional(),
  message_id: z.string().optional(),
  url: z.string().optional(),
});

export const PacketHeaderSchema = z.object({
  id: z.string(),
  type: PacketType,

  schema_version: z.string().default("1.0"),
  packet_version: z.string().default("1.0.0"),

  created_at: z.string(),
  updated_at: z.string(),

  status: z.enum(["draft", "published", "archived"]).default("published"),

  scope: z.object({
    level: ScopeLevel,
    element_id: z.string(), // who "owns" or is acting at this scope
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

  // Relationship graph (generic)
  relations: z.object({
    parent_id: z.string().nullable().default(null),     // generic parent
    template_id: z.string().nullable().default(null),   // for plans/reports
    initiative_id: z.string().nullable().default(null), // future: initiative
    program_id: z.string().nullable().default(null),    // future: program
    campaign_id: z.string().nullable().default(null),   // future: campaign
    related_ids: z.array(z.string()).default([]),       // arbitrary links
  }).default({
    parent_id: null,
    template_id: null,
    initiative_id: null,
    program_id: null,
    campaign_id: null,
    related_ids: [],
  }),

  // Dependencies (graph edges)
  deps: z.array(DependencySchema).default([]),

  // Search/display metadata
  labels: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }).default({ tags: [] }),

  // Mirrors / external refs
  refs: z.object({
    discord: DiscordRefSchema.optional(),
  }).default({}),
});

export const FieldType = z.enum(["string", "date", "int_range", "string_list", "boolean"]);

export const FieldSchema = z.object({
  label: z.string(),
  type: FieldType,
  required: z.boolean().default(false),
  help: z.string().optional(),
});