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

    scope: { level: "Team", element_id: "nx:el/aaron" },
    publish: { visibility: "public", allow_mirroring: true },
    authorship: { platform: "discord", user_id: authorUserId, attributed_element_id: "nx:el/aaron" },
    integrity: { content_hash: null, sig: null },

    relations: {
      parent_id: "nx:el/uprising_underground", // simple link for now
      template_id: null,
      initiative_id: null,
      program_id: null,
      campaign_id: null,
      related_ids: [],
    },

    deps: [],
    labels: { title: "Aaron", tags: ["element", "person"] },
    refs: {},

    element: {
      name: "Aaron",
      handle: "the_uprising",
      element_type: "person",
      summary: "Builder/maintainer (prototype stage).",
      tags: ["maintainer"],
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