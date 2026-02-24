import { nowIso } from "../_helpers.js";

export function seedBaselineSafetyPolicy(authorUserId: string) {
  const now = nowIso();
  return {
    id: "nx:pol/baseline-safety@1.0.0",
    type: "Policy",
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
    labels: { title: "Baseline Safety v1.0", tags: ["policy", "safety"] },
    refs: {},
    policy: {
      name: "Baseline Safety",
      version: "1.0",
      summary: "General safety and legal compliance expectations.",
      rules: [
        "Stay legal. Respect private property and local regulations.",
        "Avoid confrontation. De-escalate and disengage if needed.",
        "Don’t take unnecessary risks. Safety beats speed.",
        "Use protective gear when appropriate (gloves, visibility, etc).",
      ],
      enforcement: { level: "recommended" },
    },
  };
}