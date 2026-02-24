import { nowIso } from "../_helpers.js";

export function seedSafetyProtocolModule(authorUserId: string) {
  const now = nowIso();
  return {
    id: "nx:mod/safety-protocol@1.0.0",
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
    labels: { title: "Safety Protocols v1.0", tags: ["module", "safety"] },
    refs: {},
    module: {
      name: "Safety Protocols",
      version: "1.0",
      summary: "Optional safety checklist and notes for mission execution.",
      fields: {
        protocols: { label: "Safety Protocol(s)", type: "string_list", required: false },
        notes: { label: "Safety Notes", type: "string", required: false },
      },
    },
  };
}