import { nowIso } from "../_helpers.js";

export function seedAaronElement(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:el/aaron",
    type: "Element",
    schema_version: "1.0",
    packet_version: "1.0.0",
    created_at: now,
    updated_at: now,
    status: "published",

    scope: { level: "Solo", element_id: "nx:el/aaron" },
    publish: { visibility: "public", allow_mirroring: true },
    authorship: {
      platform: "discord",
      user_id: authorUserId,
      attributed_element_id: "nx:el/aaron",
    },
    integrity: { content_hash: null, sig: null },

    relations: {
      parent_id: null, // optional “primary home”
      member_of_ids: [
        "nx:el/uprising_underground",   // membership in node (multi)
      ],

      template_id: null,

      // Optional ownership
      initiative_id: null,
      program_id: null,
      campaign_id: null,

      // Subscriptions: “I participate in / follow these”
      subscribed_initiative_ids: [
        "nx:init/keeping-earth-beautiful",
      ],
      subscribed_program_ids: [],
      subscribed_campaign_ids: [],

      related_ids: [],
    },

    deps: [],
    labels: { title: "Aaron Clark", tags: ["element", "person"] },
    refs: {},

    element: {
      handle: "armalitus",             // stable alias / handle
      name: "Aaron Clark",             // optional real/legal
      display_name: "Armalitus",       // preferred public display
      element_type: "person",
      summary: "Coordinator/maintainer (prototype stage).",
      tags: ["maintainer", "coordinator"],
      links: [],
      trust_index: {
        created_at: now,
        discord: { user_id: authorUserId },
        activity: { reports_authored: 0, missions_coordinated: 0, missions_participated: 0 },
        trust: { tier: "new", notes: "Seeded by maintainer." },
      },
    },
  };
}