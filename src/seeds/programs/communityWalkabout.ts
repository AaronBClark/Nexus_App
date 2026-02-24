import { nowIso } from "../_helpers.js";

export function seedCommunityWalkaboutProgram(authorUserId: string) {
  const now = nowIso();

  return {
    id: "nx:prog/community-walkabout",
    type: "Program",
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
      parent_id: "nx:init/keeping-earth-beautiful",
      template_id: null,
      initiative_id: "nx:init/keeping-earth-beautiful",
      program_id: null,
      campaign_id: null,
      related_ids: [],
    },

    deps: [],
    labels: { title: "Community Walkabout", tags: ["program", "walk", "cleanup"] },
    refs: {},

    program: {
      name: "Community Walkabout",
      summary: "A simple walk with optional cleanup and friendly community interaction.",
      tags: ["walk", "cleanup"],
      initiative_id: "nx:init/keeping-earth-beautiful",
      cadence: "ad-hoc",
      status: "active",
    },
  };
}