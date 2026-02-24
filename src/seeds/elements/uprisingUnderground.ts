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

    scope: { level: "Node", element_id: "nx:el/uprising_underground" },
    publish: { visibility: "public", allow_mirroring: true },
    authorship: { platform: "discord", user_id: authorUserId, attributed_element_id: "nx:el/uprising_underground" },
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
    labels: { title: "Uprising Underground", tags: ["element", "node"] },
    refs: {},

    element: {
      name: "Uprising Underground",
      handle: "uprising_underground",
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