import { nowIso } from "../_helpers.js";

export function seedTrashPickupDemoPlan(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:mpl/trash-pickup-demo-2026-02-24",
    type: "MissionPlan",
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
      template_id: "nx:mtpl/trash-pickup-v1",
      initiative_id: "nx:init/keeping-earth-beautiful",
      program_id: "nx:prog/community-walkabout",
      campaign_id: null,
      related_ids: [],
    },

    deps: [],
    labels: { title: "Trash Pickup Demo Plan (2026-02-24)", tags: ["demo", "cleanup"] },
    refs: {},

    mission: {
      template_id: "nx:mtpl/trash-pickup-v1",
      template_name: "Trash Pickup",
      template_version: "1.0",

      initiative_id: "nx:init/keeping-earth-beautiful",
      program_id: "nx:prog/community-walkabout",
      campaign_id: null,

      name: "Trash Pickup (Demo)",
      version: "1.0",

      status: "planned",

      coordinators: [
        {
          persona_id: "nx:el/aaron",
          display_name: "the_uprising",
        },
      ],

      participation: {
        mode: "hybrid",
        alignment_label: "Open (any may join)",
      },

      logistics: {
        location: "TBD (set location)",
        date: "2026-02-24",
        time: "Afternoon",
        timezone: "America/Los_Angeles",
        duration_minutes: { min: 30, max: 60 },
      },

      module_refs: [
        "nx:mod/safety-protocol@1.0.0",
        "nx:mod/communications@1.0.0",
        "nx:mod/supply-checklist@1.0.0",
      ],
      policy_refs: ["nx:pol/baseline-safety@1.0.0"],

      // UI answers bag (what you’d normally collect from forms)
      inputs: {
        alignment: "Open (any may join)",
        communications: ["Discord"],
        supply: ["Trash bag"],
        safety: ["None"],
      },

      notes: {
        general: "Demo plan created from prototype. Replace TBD fields when ready.",
        communications: "Coordinate in Discord. Post a quick report after completion.",
        safety: "Use common sense. Stay legal. Don’t take unnecessary risks.",
        supply: "Bring at least one trash bag; gloves optional.",
      },
    },
  };
}