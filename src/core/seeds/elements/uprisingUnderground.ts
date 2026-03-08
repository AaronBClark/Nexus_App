import { nowIso } from "../_helpers.js";

export function seedUprisingUndergroundElement(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:el/uprising_underground",
    type: "Element",
    schema_version: "1.0",
    packet_version: "1.0.0",
    created_at: now,
    updated_at: now,
    status: "published",

    // A node element owns itself at Node scope
    scope: { level: "Node", element_id: "nx:el/uprising_underground" },
    publish: { visibility: "public", allow_mirroring: true },
    authorship: {
      platform: "discord",
      user_id: authorUserId,
      attributed_element_id: "nx:el/aaron", // who created/seeded it
    },
    integrity: { content_hash: null, sig: null },

    relations: {
      parent_id: null,                 // keep as "primary parent" (rarely used for nodes)
      member_of_ids: [],               // nodes can be part of constellations later
      template_id: null,

      // Ownership (optional)
      initiative_id: null,
      program_id: null,
      campaign_id: null,

      // Subscriptions / participation (non-identity)
      subscribed_initiative_ids: [],
      subscribed_program_ids: [],
      subscribed_campaign_ids: [],

      related_ids: [],
    },

    deps: [],
    labels: { title: "Uprising Underground", tags: ["element", "node"] },
    refs: {},

    element: {
      handle: "uprising_underground",
      name: null,
      display_name: "Uprising Underground",
      element_type: "node",
      summary: "A coordination node for Nexus prototypes and action architecture.",
      tags: ["nexus", "coordination"],
      links: [],
      trust_index: {
        created_at: now,
        discord: {},
      },
    },
  };
}