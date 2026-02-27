/*import { getObjectsByIds } from "../../../db/repo.js";

export function toStringIds(ids: any[], max = 25): string[] {
  return [...new Set(ids.map((x) => String(x)))].slice(0, max);
}

export function buildSelectOptionsFromObjectRows(ids: string[], rows: any[]) {
  const byId = new Map(rows.map((o: any) => [o.id, o]));

  return ids.map((id) => {
    const o: any = byId.get(id);

    let title: string = id;
    try {
      const json = o?.content_json ? JSON.parse(o.content_json) : null;
      title = String(json?.labels?.title ?? json?.title ?? id);
    } catch {}

    return {
      label: title.slice(0, 100),
      description: String(o?.type ?? "Object").slice(0, 100),
      value: id,
    };
  });
}

export function buildSelectOptionsByIds(ids: string[]) {
  const objs = getObjectsByIds(ids);
  return buildSelectOptionsFromObjectRows(ids, objs);
}*/