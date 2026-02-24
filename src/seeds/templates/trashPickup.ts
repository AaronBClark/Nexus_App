import { nowIso } from "../_helpers.js";

export function seedTrashPickupTemplate(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:mtpl/trash-pickup-v1",
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
      initiative_id: "nx:init/keeping-earth-beautiful",
      program_id: "nx:prog/community-walkabout",
      campaign_id: null,
      related_ids: [],
    },

    deps: [],
    labels: { title: "Trash Pickup Template v1.0", tags: ["cleanup", "environment"] },
    refs: {},

    mission_template: {
      name: "Trash Pickup",
      version: "1.0",
      summary: "Pick up litter in a defined area and document results.",

      initiative_id: "nx:init/keeping-earth-beautiful",
      program_id: "nx:prog/community-walkabout",
      campaign_id: null,

      tags: ["cleanup", "environment"],

      supported_scopes: ["Solo", "Team", "Node", "MultiScope"],

      objectives: [
        { id: "obj_01", text: "Remove litter from a defined outdoor area" },
        { id: "obj_02", text: "Leave the space visibly and measurably cleaner" },
        { id: "obj_03", text: "Interact with the community in positive ways" },
        { id: "obj_04", text: "Look for opportunities to be of help to others" },
        { id: "obj_05", text: "Document progress along the way" },
        { id: "obj_06", text: "Safely and legally dispose of collected litter" },
        { id: "obj_07", text: "Produce a simple Mission Report" },
      ],

      // Fill these once modules/policies are seeded
      default_module_refs: [
        "nx:mod/safety-protocol@1.0.0",
        "nx:mod/communications@1.0.0",
        "nx:mod/supply-checklist@1.0.0",
      ],
      default_policy_refs: ["nx:pol/baseline-safety@1.0.0"],

      fields: {
        location: { label: "Location", type: "string", required: true },
        date: { label: "Date", type: "date", required: true },
        time: { label: "Time", type: "string", required: false },
        duration: { label: "Duration (minutes)", type: "int_range", required: false },

        // Nice-to-have fields matching your embed style
        alignment: { label: "Alignment Label", type: "string", required: false, help: "e.g. Open (any may join)" },
        communications: { label: "Comms (initial)", type: "string_list", required: false },
        supply: { label: "Supply (initial)", type: "string_list", required: false },
        safety: { label: "Safety Protocols (initial)", type: "string_list", required: false },
      },
    },
  };
}