import { nowIso } from "../_helpers.js";

export function seedGenericMissionTemplate(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:mtpl/generic-mission-v1",
    type: "MissionTemplate",
    schema_version: "1.0",
    packet_version: "1.0.0",
    created_at: now,
    updated_at: now,
    status: "published",

    scope: { level: "MultiScope", element_id: "nx:el/uprising_underground" },
    publish: { visibility: "public", allow_mirroring: true },
    authorship: {
      platform: "discord",
      user_id: authorUserId,
      attributed_element_id: "nx:el/uprising_underground",
    },
    integrity: { content_hash: null, sig: null },

    relations: {
      parent_id: null,
      template_id: null,
      initiative_id: null,
      program_id: null,
      campaign_id: null,
      related_ids: [],
    },

    deps: [],
    labels: { title: "Generic Mission Template v1.0", tags: ["template", "generic"] },
    refs: {},

    mission_template: {
      name: "Generic Mission",
      version: "1.0",
      summary: "An adaptable and extensible template for new mission plans.",

      initiative_id: null,
      program_id: null,
      campaign_id: null,

      tags: ["generic"],

      supported_scopes: ["Solo", "Team", "Node", "MultiScope"],

      objectives: [
        { id: "obj_01", text: "Define a clear mission objective" },
        { id: "obj_02", text: "Coordinate time, place, and roles" },
        { id: "obj_03", text: "Complete the mission safely and lawfully" },
        { id: "obj_04", text: "Produce a simple Mission Report" },
      ],

      // Defaults: keep empty for now until you seed modules/policies
      default_module_refs: [],
      default_policy_refs: [],

      fields: {
        location: { label: "Location", type: "string", required: true },
        date: { label: "Date", type: "date", required: true },
        time: { label: "Time", type: "string", required: false },
        duration: { label: "Duration (minutes)", type: "int_range", required: false },
        notes: { label: "Notes", type: "string", required: false },
      },
    },
  };
}