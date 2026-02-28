import type { SelectMenuComponentOptionData } from "discord.js";
import { getObjectsByIds } from "../../../db/repo.js";
import { trunc } from "../parseCustomId.js"; // or local helper

type ObjRow = { id: string; type: string; content_json: string };
type Link = { rel: string; to_id?: string; from_id?: string };

function titleFromRow(row: ObjRow): string {
  try {
    const json = JSON.parse(row.content_json);
    return (json?.labels?.title ?? json?.labels?.name ?? json?.name ?? row.id).toString();
  } catch {
    return row.id;
  }
}

function safeType(row?: any) {
  return (row?.type ?? "Object").toString();
}

export function buildSelectOptionsByIds(ids: string[], limit = 25): SelectMenuComponentOptionData[] {
  const uniq = [...new Set(ids)].slice(0, limit);
  if (!uniq.length) return [];

  const rows = getObjectsByIds(uniq) as any[];
  const byId = new Map(rows.map((r) => [r.id, r]));

  // Build option models first (so we can sort them if we want)
  const models = uniq.map((id) => {
    const row = byId.get(id);
    const title = row ? titleFromRow(row) : id;
    const type = safeType(row);
    return { id, title, type };
  });

  // Optional: stable sort (comment out if you prefer link-order)
  models.sort((a, b) => {
    const t = a.type.localeCompare(b.type);
    if (t !== 0) return t;
    return a.title.localeCompare(b.title);
  });

  return models.map((m) => ({
    label: trunc(m.title, 100),
    description: trunc(`${m.type} • ${m.id}`, 100),
    value: m.id,
  }));
}

export function buildSelectOptionsFromLinks(
  links: Link[],
  dir: "incoming" | "outgoing",
  limit = 25
): SelectMenuComponentOptionData[] {
  const ids = links.map((l) => (dir === "incoming" ? l.from_id! : l.to_id!));
  const base = buildSelectOptionsByIds(ids, limit);

  // rels per id (deduped + stable)
  const relById = new Map<string, string[]>();
  for (const l of links) {
    const id = dir === "incoming" ? l.from_id! : l.to_id!;
    const existing = relById.get(id) ?? [];
    if (!existing.includes(l.rel)) existing.push(l.rel);
    relById.set(id, existing);
  }

  return base.map((opt) => {
    const rels = relById.get(opt.value) ?? [];
    const shown = rels.slice(0, 2);
    const more = rels.length > 2 ? ` +${rels.length - 2}` : "";
    const relPrefix = shown.length ? `${shown.join(", ")}${more}` : dir;

    // Make description: "relA, relB +N • Type • id"
    const desc = `${relPrefix} • ${opt.description}`;
    return { ...opt, description: trunc(desc, 100) };
  });
}