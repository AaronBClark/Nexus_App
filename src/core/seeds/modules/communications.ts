import { nowIso } from "../_helpers.js";

export function seedCommunicationsModule(authorUserId: string) {
  const now = nowIso();
  return {
    id: "nx:mod/communications@1.0.0",
    type: "Module",
    schema_version: "1.0",
    packet_version: "1.0.0",
    created_at: now,
    updated_at: now,
    status: "published",
    scope: { level: "MultiScope", element_id: "nx:el/uprising_underground" },
    publish: { visibility: "public", allow_mirroring: true },
    authorship: { platform: "discord", user_id: authorUserId, attributed_element_id: "nx:el/uprising_underground" },
    integrity: { content_hash: null, sig: null },
    relations: { parent_id: null, template_id: null, initiative_id: null, program_id: null, campaign_id: null, related_ids: [] },
    deps: [],
    labels: { title: "Communications v1.0", tags: ["module", "comms"] },
    refs: {},
    module: {
      name: "Communications",
      version: "1.0",
      summary: "How participants coordinate (channels, calls, signals).",
      fields: {
        channels: { label: "Channels", type: "string_list", required: false },
        notes: { label: "Comms Notes", type: "string", required: false },
      },
    },
  };
}