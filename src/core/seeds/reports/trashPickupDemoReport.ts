import { nowIso } from "../_helpers.js";

export function seedTrashPickupDemoReport(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:mrpt/trash-pickup-demo-2026-02-24",
    type: "MissionReport",
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
      parent_id: "nx:mpl/trash-pickup-demo-2026-02-24",
      template_id: "nx:mtpl/trash-pickup-v1",
      initiative_id: "nx:init/keeping-earth-beautiful",
      program_id: "nx:prog/community-walkabout",
      campaign_id: null,
      related_ids: [],
    },

    deps: [],
    labels: { title: "Trash Pickup Demo Report (2026-02-24)", tags: ["demo", "cleanup", "report"] },
    refs: {},

    mission_report: {
      mission_id: "nx:mpl/trash-pickup-demo-2026-02-24",
      template_id: "nx:mtpl/trash-pickup-v1",

      report_type: "coordinator_aar",

      author: {
        persona_id: "nx:el/aaron",
        display_name: "the_uprising",
      },

      snapshot: {
        initiative_label: "Keeping Earth Beautiful",
        name: "Trash Pickup (Demo)",
        version: "1.0",
        scope_label: "MultiScope",
        location: "TBD (set location)",
        date: "2026-02-24",
        time: "Afternoon",
        timezone: "America/Los_Angeles",
        duration_minutes: 45,
      },

      participation: {
        participant_count: 1,
        participant_labels: [],
      },

      // Objective outcomes (complete/incomplete + reason)
      objectives: [
        { objective_id: "obj_01", status: "complete" },
        { objective_id: "obj_02", status: "complete" },
        { objective_id: "obj_03", status: "partial", reason: "Minimal interaction this run." },
        { objective_id: "obj_04", status: "partial", reason: "No clear opportunities surfaced." },
        { objective_id: "obj_05", status: "complete" },
        { objective_id: "obj_06", status: "complete" },
        { objective_id: "obj_07", status: "complete" },
      ],

      modules: {
        safety_protocols: ["None"],
        communications: ["Discord"],
        supply_checklist: ["Trash bag"],
      },

      notes: {
        general:
          "Prototype demo report. In the real flow, attach photos + include what was collected + where it was disposed.",
        communications:
          "Comms worked. Next time, post a quick live update mid-mission for visibility.",
        safety:
          "No issues. Stayed in safe public areas.",
        supply:
          "Trash bag was enough for this run. Gloves would help for sharp/dirty items.",
      },

      improvement_opportunities: [
        "Add a standard photo set: before/after + bag(s) collected.",
        "Record approximate time spent and distance walked.",
        "Add a simple disposal confirmation note (where/when).",
      ],

      attachments: [
        // Add Discord CDN links later (or leave empty)
        // { label: "Before", url: "https://...", kind: "image" },
      ],
    },
  };
}