// src/db/linker.ts
export type ObjectLink = { rel: string; to_id: string };

function add(out: Map<string, ObjectLink>, rel: string, to_id: unknown) {
  if (!to_id || typeof to_id !== "string") return;
  const key = `${rel}|${to_id}`;
  if (!out.has(key)) out.set(key, { rel, to_id });
}

function addMany(out: Map<string, ObjectLink>, rel: string, ids: unknown) {
  if (!Array.isArray(ids)) return;
  for (const id of ids) add(out, rel, id);
}

function getPrimarySection(packet: any): Record<string, any> | null {
  const keys = Object.keys(packet).filter(
    (k) => !["id", "type", "created_at", "updated_at"].includes(k)
  );
  for (const key of keys) {
    const val = packet[key];
    if (val && typeof val === "object" && !Array.isArray(val)) return val;
  }
  return null;
}

/**
 * Derive all "outgoing" edges from a packet.
 * This is your single source of truth for populating object_links.
 */
export function extractOutgoingLinks(packet: any): ObjectLink[] {
  const out = new Map<string, ObjectLink>();

  // Scope / submitter (useful for "submitted by element")
  add(out, "scope_element", packet?.scope?.element_id);

  // Authorship attribution (optional, but useful)
  add(out, "attributed_element", packet?.authorship?.attributed_element_id);

  const r = packet?.relations ?? {};

  // Core explicit relations
  add(out, "parent", r.parent_id);
  add(out, "template", r.template_id);

  // single membership fields (current)
  add(out, "initiative", r.initiative_id);
  add(out, "program", r.program_id);
  add(out, "campaign", r.campaign_id);

  // many-to-many membership fields (future-safe; harmless if absent)
  addMany(out, "initiative", r.initiative_ids);
  addMany(out, "program", r.program_ids);
  addMany(out, "campaign", r.campaign_ids);

  // arbitrary links
  addMany(out, "related", r.related_ids);

  // dependencies with strength encoded
  for (const d of packet?.deps ?? []) {
    if (!d?.ref) continue;
    const strength = d?.strength ?? "required";
    add(out, `dep_${strength}`, d.ref);
  }

  // Optional: legacy scan for *_id / arrays in primary section
  const section = getPrimarySection(packet);
  if (section) {
    for (const [k, v] of Object.entries(section)) {
      if (typeof v === "string" && k.endsWith("_id")) add(out, "field_ref", v);
      if (Array.isArray(v)) for (const x of v) add(out, "field_ref", x);
    }
  }

  // Never self-link
  out.forEach((v, k) => {
    if (v.to_id === packet.id) out.delete(k);
  });

  return [...out.values()];
}