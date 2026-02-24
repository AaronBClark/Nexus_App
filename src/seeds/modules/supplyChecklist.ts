import { nowIso } from "../_helpers.js";

export function seedSupplyChecklistModule(authorUserId: string) {
  const now = nowIso();
  return {
    id: "nx:mod/supply-checklist@1.0.0",
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
    labels: { title: "Supply Checklist v1.0", tags: ["module", "supplies"] },
    refs: {},
    module: {
      name: "Supply Checklist",
      version: "1.0",
      summary: "What to bring.",
      fields: {
        items: { label: "Items", type: "string_list", required: false },
        notes: { label: "Supply Notes", type: "string", required: false },
      },
    },
  };
}