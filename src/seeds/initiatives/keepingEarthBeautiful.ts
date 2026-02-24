import { nowIso } from "../_helpers.js";

export function seedKeepingEarthBeautifulInitiative(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:init/keeping-earth-beautiful",
    type: "Initiative",
    schema_version: "1.0",
    packet_version: "1.0.0",
    created_at: now,
    updated_at: now,
    status: "published",

    scope: { level: "MultiScope", element_id: "nx:el/uprising_underground" },
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
    labels: { title: "Keeping Earth Beautiful", tags: ["initiative", "environment"] },
    refs: {},

    initiative: {
      name: "Keeping Earth Beautiful",
      summary: "Local action to keep public spaces clean and cared for.",
      tags: ["cleanup", "environment"],
      steward_element_id: "nx:el/uprising_underground",
      status: "active",
    },
  };
}