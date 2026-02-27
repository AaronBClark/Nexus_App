import type { SelectMenuComponentOptionData } from "discord.js";
import { getObjectsByIds } from "../../../db/repo.js";

type ObjRow = { id: string; type: string; content_json: string };

function titleFromRow(row: ObjRow): string {
  try {
    const json = JSON.parse(row.content_json);
    return (json?.labels?.title ?? json?.labels?.name ?? json?.name ?? row.id).toString();
  } catch {
    return row.id;
  }
}

export function buildSelectOptionsByIds(ids: string[], limit = 25): SelectMenuComponentOptionData[] {
  const uniq = [...new Set(ids)].slice(0, limit);
  if (!uniq.length) return [];

  const rows = getObjectsByIds(uniq) as any[];
  const byId = new Map(rows.map((r) => [r.id, r]));

  return uniq.map((id) => {
    const row = byId.get(id);
    const title = row ? titleFromRow(row) : id;
    const type = row?.type ?? "Object";

    return {
      label: `${title}`.slice(0, 100),
      description: `${type} • ${id}`.slice(0, 100),
      value: id,
    };
  });
}

type Link = { rel: string; to_id?: string; from_id?: string };

export function buildSelectOptionsFromLinks(
  links: Link[],
  dir: "incoming" | "outgoing",
  limit = 25
): SelectMenuComponentOptionData[] {
  const ids = links.map((l) => (dir === "incoming" ? l.from_id! : l.to_id!));
  const base = buildSelectOptionsByIds(ids, limit);

  // Add rel context (same order as ids)
  const relById = new Map<string, string[]>();
  for (const l of links) {
    const id = dir === "incoming" ? l.from_id! : l.to_id!;
    const arr = relById.get(id) ?? [];
    arr.push(l.rel);
    relById.set(id, arr);
  }

  return base.map((opt) => ({
    ...opt,
    description: `${(relById.get(opt.value) ?? []).slice(0, 2).join(", ") || dir} • ${opt.description}`.slice(0, 100),
  }));
}